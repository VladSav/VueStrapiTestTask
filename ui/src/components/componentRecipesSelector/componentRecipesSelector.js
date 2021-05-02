import { BIcon, BIconChevronUp } from 'bootstrap-vue'

export default {
    name: 'RecipesSelector',
    components: {
        BIcon,
        BIconChevronUp,
    },
    props: {
        recipes: {
            type: Array,
            default: [],
        }
    },
    data() {
        return {
            currentPage: 1,
            recipesPerPage: 12,

            filters: {
                categories: [],
                difficult: null,
                searchText: '',
                timeToPrepare: {
                    min: 0,
                    max: 10,
                    value: 0,
                },
                ingredients: {
                    selected: [],
                    searchText: '',
                },
            },

            filtersCollapse: {
                search: true,
                categories: true,
                difficult: false,
                timeToPrepare: false,
                ingredients: false,
            },

            allSelected: false,
            indeterminate: false,


        }
    },
    created() {
        let arrayOfRecipesTime = this.recipes.map(recipe => recipe.time_to_prepare)
        this.filters.timeToPrepare = Object.assign(this.filters.timeToPrepare, {
            min: Math.min(...arrayOfRecipesTime),
            max: Math.max(...arrayOfRecipesTime),
            value: Math.max(...arrayOfRecipesTime),
        })

        if (Object.keys(this.$route.query)) {
            this.filters.searchText = this.$route.query.searchText || ''
            this.filters.timeToPrepare.value = this.$route.query.timeToPrepare || this.filters.timeToPrepare.max
            this.filters.difficult = +this.$route.query.difficult || null
            this.filters.ingredients.selected = this.$route.query?.ingredients?.length ? this.$route.query.ingredients : []

            // Liitle bit difficult, but I need to check empty array and convert values in rout into numbers
            this.filters.categories = this.$route.query?.categories?.length ? 
                this.$route.query.categories == 'none' 
                    ? [] 
                    : Array.isArray(this.$route.query.categories)
                        ? this.$route.query.categories.map(category => +category)
                        : [+this.$route.query.categories]
                : this.categoriesList.map(category => category.id)
        }
    },
    mounted() {
    },
    watch: {
        'filters.categories': function(newValue) {
            if (newValue.length === 0) {
                this.indeterminate = false
                this.allSelected = false
            } else if (newValue.length === this.categoriesList.length) {
                this.indeterminate = false
                this.allSelected = true
            } else {
                this.indeterminate = true
                this.allSelected = false
            }
        }
    },
    computed: {
        showRecipes() {
            let recipes = this.recipes || []

            if (recipes.length) {
                const positionStart = (this.currentPage - 1) * this.recipesPerPage,
                    positionEnd = ((this.currentPage - 1) * this.recipesPerPage) + this.recipesPerPage

                if (this.filters.searchText) {
                    recipes = recipes.filter(
                        recipe => recipe.title.toLowerCase().indexOf(this.filters.searchText.toLowerCase()) > -1
                    )
                }

                if (this.filters.difficult) {
                    recipes = recipes.filter(
                        recipe => recipe.difficult === this.filters.difficult
                    )
                }

                if (this.filters.ingredients.selected.length) {
                    recipes = recipes.filter(
                        recipe => recipe.ingredients.some(
                            ingredient => this.filters.ingredients.selected.includes(ingredient.key.toLowerCase())
                        )
                    )
                }

                recipes = recipes.filter(recipe => recipe.time_to_prepare <= this.filters.timeToPrepare.value)

                recipes = recipes.filter(
                    recipe => recipe.categories.some(
                        category =>  this.filters.categories.includes(category.id)
                    )
                )

                return {
                    totalLength: recipes.length,
                    recipes: recipes.slice(positionStart, positionEnd)
                }
            }
            return []
        },

        categoriesList() {
            /**
             * I don't want use request. 
             * That's I will check is recipes is getted and then I filter uniq array of categories (id, title)
             */
            if (this.recipes.length) {
                let categories = []

                this.recipes.forEach(recipe => {
                    let curCat = recipe?.categories.map(category => {
                        return {
                            id: category.id,
                            title: category.title,
                        }
                    })
                    categories = categories.concat(curCat)
                })
                
                return Array.from(new Set(categories.map(cat => cat.id))).map(id => {
                    return {
                        id: id,
                        title: categories.find(cat => cat.id === id).title,
                    }
                }).sort((a, b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))
            }
            return  []
        },

        ingredientsList() {
            if (this.recipes.length) {
                let ingredients = []

                this.recipes.forEach(recipe => {
                    let curCat = recipe?.ingredients.map(ingredient => {
                        return {
                            key: ingredient.key.toLowerCase(),
                        }
                    })
                    ingredients = ingredients.concat(curCat)
                })
                
                return Array.from(new Set(ingredients.map(cat => cat.key.trim())))
                    .filter(item => this.filters.ingredients.searchText 
                        ? (item.indexOf(this.filters.ingredients.searchText) > -1) 
                        : item)
                    .sort((a, b) => (a > b) ? 1 : ((b > a) ? -1 : 0))
            }
            return  []
        },
    },
    methods: {
        getFirstImage(images, format = 'thumbnail') {
            return images[0] ? process.env.VUE_APP_LOCALE_STRAPI + images[0]?.formats[format].url : '@/assets/logo.png'
        },
        openRecipePage(id) {
            this.$router.push({ name: 'Recipe', params: { id: id } })
        },
        removeTagByIndex(index) {
            this.delete ? this.delete(index, this.deleteKey) : this.$root.$emit(this.deleteEmit, { index:index, key:this.deleteKey})
            this.$refs.formSelectTags.showMenu()
        },
        toggleAllCategories(checked) {
            this.filters.categories = checked ? this.categoriesList.map(category => category.id) : []
            this.setQueries()
        },
        setQueries() {
            let query = {}
            if (this.filters.searchText) {
                query.searchText = this.filters.searchText
            } 
            if (this.filters.categories.length !== this.categoriesList.length) {
                query.categories = this.filters.categories.length ? this.filters.categories.sort((a,b) => a - b) : 'none'
            }
            if (this.filters.timeToPrepare.value != this.filters.timeToPrepare.max) {
                query.timeToPrepare = this.filters.timeToPrepare.value
            }
            if (this.filters.difficult) {
                query.difficult = this.filters.difficult
            }
            if (this.filters.ingredients.selected.length) {
                query.ingredients = this.filters.ingredients.selected
            }
            this.$router.push({path: "/", query: query});
        },
        scrollToTop() {
            document.querySelector(".card-deck").scrollIntoView()
        },
    },
    beforeDestroy() {
    }
}