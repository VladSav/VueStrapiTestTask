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
            likeWasSended: false,
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
                this.likeWasSended = document.cookie.split(';').filter((item) => item.trim().startsWith(`liked-recipe-${this.recipe.id}=`)).length ? true : false
            })
        },
        getImage(imageObj, format) {
            return imageObj.photography[0] ? process.env.VUE_APP_LOCALE_STRAPI + imageObj.photography[0]?.formats[format].url : '@/assets/logo.png'
        },
        getBack() {
            this.$router.go(-1)
        },
        sendLike() {
            this.likeWasSended = true
            this.$axios({
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                url: `${process.env.VUE_APP_LOCALE_STRAPI}/recipes/${this.recipe.id}/likes`,
            }).then(response => {
                this.recipe.likes = response.data.likes
                document.cookie = `liked-recipe-${this.recipe.id}=true;max-age=86400`
            })
        },
    },
    beforeDestroy() {
    }
}