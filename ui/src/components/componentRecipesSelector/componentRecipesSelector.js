import { BIcon, BIconArrowUp, BIconArrowDown, BIconChevronUp } from 'bootstrap-vue'

export default {
    name: 'RecipesSelector',
    components: {
        BIcon,
        BIconArrowUp,
        BIconArrowDown,
        BIconChevronUp,
    },
    props: {},
    data() {
        return {
            recipes: [],
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
        this.getData()
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
                    
                // Filter by time_to_prepare
                recipes = recipes.filter(recipe => recipe.time_to_prepare <= this.filters.timeToPrepare.value)

                // Filter by categories
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
                
                const result = Array.from(new Set(categories.map(cat => cat.id))).map(id => {
                    return {
                        id: id,
                        title: categories.find(cat => cat.id === id).title,
                    }
                })

                this.filters.categories = result.map(category => category.id)
                return result
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
        getData() {
            this.$axios({
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                url: 'http://localhost:1337/Recipes',
            }).then(response => {
                this.recipes = response.data

                let arrayOfRecipesTime = response.data.map(recipe => recipe.time_to_prepare)
                this.filters.timeToPrepare = Object.assign(this.filters.timeToPrepare, {
                    min: Math.min(...arrayOfRecipesTime),
                    max: Math.max(...arrayOfRecipesTime),
                    value: Math.max(...arrayOfRecipesTime),
                })
            })
        },
        getFirstImage(images, format = 'thumbnail') {
            return images[0] ? 'http://localhost:1337' + images[0]?.formats[format].url : '@/assets/logo.png'
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
        }

    },
    beforeDestroy() {
    }
}