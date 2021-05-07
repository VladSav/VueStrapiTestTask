import InfiniteLoading from 'vue-infinite-loading';
import SpinnerComponent from '../componentSpinner.vue'
import SliderComponent from '../componentSwiper.vue'
import filterByText from '../filterByText.vue'
import filterByCategories from '../filterByCategories.vue'
import filterByTime from '../filterByTime.vue'
import filterByDifficulty from '../filterByDifficulty.vue'
import filterByIngredients from '../filterByIngredients.vue'
import recipeCard from '../componentRecipeCard.vue'

export default {
    name: 'pageMain',
    components: {
        InfiniteLoading,
        SpinnerComponent,
        SliderComponent,
        filterByText,
        filterByCategories,
        filterByTime,
        filterByDifficulty,
        filterByIngredients,
        recipeCard,
    },
    props: {},
    data() {
        return {
            recipes: [],
            slides: [],

            gettedInfo: {
                slides: false,
                recipes: false,
                filters: false,
            },

            currentPage: 0,
            recipesPerPage: 12,
            
            infiniteId: 0,

            filters: {
                time: {
                    min: 0,
                    max: 10,
                },
                categoriesList: [],
                ingredientsList: [],
            },
        }
    },
    created() {
        this.getSliderData()
        this.getFiltersData()
        this.getDataRecipes()
    },
    mounted() {  
    },
    watch: {
        '$route.query': function() {
            this.recipes = []
            this.currentPage = 0
            this.infiniteId += 1
        }
    },
    computed: {
        showSpinner: function() {
            return !(this.gettedInfo.slides && this.gettedInfo.recipes && this.gettedInfo.filters)
        },
    },
    methods: {
        getDataRecipes(state = null) {
            this.$axios({
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                url: `${process.env.VUE_APP_LOCALE_STRAPI}/Recipes/custom`
                    + `?_start=${this.currentPage * this.recipesPerPage}`
                    + `&_limit=${this.recipesPerPage}`
                    + (this.$route.query?.searchText ? `&title_contains=${this.$route.query.searchText}` : '')
                    + (this.$route.query?.timeToPrepare ? `&time_to_prepare_lte=${this.$route.query.timeToPrepare}` : '')
                    + (this.$route.query?.difficult ? `&difficult=${this.$route.query.difficult}` : '')
                    + (this.$route.query?.categories 
                        ? this.$route.query.categories == 'none'
                            ? `&categories_contains=none`
                            : '&categories=' + (Array.isArray(this.$route.query.categories)
                                ? this.$route.query.categories.join('&categories=')
                                : this.$route.query.categories)
                        : '')
            }).then(response => {
                if (response.data.length) {
                    this.currentPage += 1
                    this.recipes.push(...response.data)
                    this.gettedInfo.recipes = true

                    if (state) {
                        state.loaded()
                    }
                } else if (state) {
                    state.complete()
                }
            })
        },
        getSliderData() {
            this.$axios({
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                url: process.env.VUE_APP_LOCALE_STRAPI + '/Sliders/1',
            }).then(response => {
                this.slides = response.data.slides
                this.gettedInfo.slides = true
            })
        },
        getFiltersData() {
            this.$axios({
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                url: process.env.VUE_APP_LOCALE_STRAPI + '/Recipes/filters'
            }).then(response => {
                this.filters = Object.assign(this.filters, response.data)
                this.gettedInfo.filters = true
            })
        },
        infiniteHandler($state) {
            this.getDataRecipes($state)
        },
    },
    beforeDestroy() {
    }
}