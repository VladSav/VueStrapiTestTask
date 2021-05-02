import SpinnerComponent from '../componentSpinner.vue'

export default {
    name: 'Recipe',
    components: {
        SpinnerComponent,
    },
    props: {},
    data() {
        return {
            // @ is an alias to /src
            recipe: null,
            showSpinner: true,
        }
    },
    created() {
        this.getRecipeData()
    },
    mounted() {
    },
    watch: {},
    computed: {
    },
    methods: {
        getRecipeData() {
            this.$axios({
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                url: process.env.VUE_APP_LOCALE_STRAPI + '/Recipes/' + this.$route.params.id,
            }).then(response => {
                this.recipe = response.data
                this.showSpinner = false
            })
        },
        getImage(imageObj, format) {
            return imageObj.photography[0] ? process.env.VUE_APP_LOCALE_STRAPI + imageObj.photography[0]?.formats[format].url : '@/assets/logo.png'
        },
    },
    beforeDestroy() {
    }
}