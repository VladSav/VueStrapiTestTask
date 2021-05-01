export default {
    name: 'Recipe',
    components: {
    },
    props: {},
    data() {
        return {
            // @ is an alias to /src
            recipe: {}
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
                url: 'http://localhost:1337/Recipes/' + this.$route.params.id,
            }).then(response => {
                this.recipe = response.data
            });
        },
        getImage(imageObj, format) {
            return imageObj.photography[0] ? 'http://localhost:1337' + imageObj.photography[0]?.formats[format].url : '@/assets/logo.png'
        },
    },
    beforeDestroy() {
    }
}