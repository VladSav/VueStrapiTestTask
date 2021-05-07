<template>

<b-card v-if="recipe"
    @click="openRecipePage(recipe.id)"
    class="h-100 animated fadeInDown ml-0 mr-0"
    :title="recipe.title"
    title-tag="h4"
    img-top
    img-alt="recipe.title"
    :img-src="getImage(recipe.photography)"
    :style="`animation-delay: ${animationDelay}ms;`">
    <b-card-text text-tag="div">
        <div class="recipe__time-to-prepare">
            <img src="@/assets/clock-regular.svg" alt="clocs icon"/>
            <span>{{recipe.time_to_prepare}} minutes</span>
        </div>

        <div class="recipe__categories">
            <ul>
                <li v-for="category of recipe.categories" :key="'recipe-categories-' + category.id">
                    {{category.title}}
                </li>
            </ul>
        </div>
    </b-card-text>
    <template #footer>
        <small class="text-muted">
            <div class="recipe__difficult">
                <p>Difficult</p>
                <img v-for="diff of recipe.difficult"
                    :key="`recipe-difficult-solid-${recipe.id}-${diff}`"
                    src="@/assets/star-solid.svg" alt="star solid"/>
                <img v-for="diff of (5 - (recipe.difficult || 0))"
                    :key="`recipe-difficult-regular-${recipe.id}-${diff}`"
                    src="@/assets/star-regular.svg" alt="star solid"/>
            </div>
        </small>
    </template>
</b-card>
</template>

<script>
export default {
    name: 'RecipeCard',
    components: {
    },
    props: {
        recipe: {
            type: Object,
            default: () => null
        },
        animationDelay: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
        }
    },
    created() {
    },
    mounted() {
    },
    watch: {
    },
    computed: {
    },
    methods: {
        getImage(image) {
            return image?.url
                ? process.env.VUE_APP_LOCALE_STRAPI + image.url 
                : '@/assets/logo.png'
        },
        openRecipePage(id) {
            this.$router.push({ name: 'Recipe', params: { id: id } })
        },
    },
    beforeDestroy() {
    }
}
</script>