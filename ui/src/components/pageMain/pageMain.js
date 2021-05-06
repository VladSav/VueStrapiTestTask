import SpinnerComponent from '../componentSpinner.vue'
import SliderComponent from '../componentSwiper.vue'
import filterByText from '../filterByText.vue'
import filterByCategories from '../filterByCategories.vue'
import filterByTime from '../filterByTime.vue'
import filterByDifficulty from '../filterByDifficulty.vue'
import filterByIngredients from '../filterByIngredients.vue'

export default {
    name: 'pageMain',
    components: {
        SpinnerComponent,
        SliderComponent,
        filterByText,
        filterByCategories,
        filterByTime,
        filterByDifficulty,
        filterByIngredients
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

            currentPage: 1,
            recipesPerPage: 12,
            totalCountRecipes: 0,

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
    },
    mounted() {
        this.getData()
    },
    watch: {},
    computed: {
        showSpinner: function() {
            return !(this.gettedInfo.slides && this.gettedInfo.recipes && this.gettedInfo.filters)
        },
    },
    methods: {
        getData() {
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

            this.$axios({
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                url: `${process.env.VUE_APP_LOCALE_STRAPI}/Recipes/custom`
                    + `?_start=${(this.currentPage - 1) * this.recipesPerPage}`
                    + `&_limit=${this.recipesPerPage}`
                    + (this.$route.query?.searchText ? `&title_contains=${this.$route.query.searchText}` : '')
                    + (this.$route.query?.timeToPrepare ? `&time_to_prepare_lte=${this.$route.query.timeToPrepare}` : '')
                    + (this.$route.query?.difficult ? `&difficult=${this.$route.query.difficult}` : '')
                    + (this.$route.query?.categories 
                        ? this.$route.query.categories == 'none'
                            ? `&categories_contains=none`
                            : '&categories=' + this.$route.query.categories.join('&categories=')
                        : '')
                    
            }).then(response => {
                this.recipes = response.data.recipes
                this.totalCountRecipes = response.data.count
                this.gettedInfo.recipes = true
            })

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
        getImage(image) {
            return image?.url
                ? process.env.VUE_APP_LOCALE_STRAPI + image.url 
                : '@/assets/logo.png'
        },
        openRecipePage(id) {
            this.$router.push({ name: 'Recipe', params: { id: id } })
        },
        scrollToTop() {
            document.querySelector(".card-deck").scrollIntoView()
        },
    },
    beforeDestroy() {
    }
}