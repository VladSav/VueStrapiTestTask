import SpinnerComponent from '../componentSpinner.vue'
import SliderComponent from '../componentSwiper.vue'
import RecipesSelector from '../componentRecipesSelector.vue'

export default {
    name: 'pageMain',
    components: { SpinnerComponent, RecipesSelector, SliderComponent },
    props: {},
    data() {
        return {
            recipes: [],
            slides: [],

            gettedInfo: {
                slides: false,
                recipes: false,
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
            return !(this.gettedInfo.slides && this.gettedInfo.recipes)
        }
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
                url: process.env.VUE_APP_LOCALE_STRAPI + '/Recipes',
            }).then(response => {
                this.recipes = response.data
                this.gettedInfo.recipes = true
            })
        }
    },
    beforeDestroy() {
    }
}