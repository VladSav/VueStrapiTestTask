<template>
<div>
    <div class="d-flex justify-content-between align-items-center mb-3" 
        @click="isOpen = !isOpen">
        <span>Ingredients</span>
        <b-icon-chevron-up :rotate="isOpen ? 180 : 0"></b-icon-chevron-up>
    </div>
    <b-collapse id="filters-collapse-ingredients" :visible="isOpen">
        <b-form-input v-model="searchText" 
            placeholder="Enter the title of ingredient" 
            class="mb-10">
        </b-form-input>
        <div style="height: 400px; overflow-y: auto;">
            <b-form-group>
                <b-form-checkbox
                    v-for="(ingredient, index) of ingredientsList"
                    v-model="ingredients"
                    :key="'ingredient-filter-' + index"
                    :value="ingredient"
                    class="d-flex justify-content-start">
                    {{ingredient}}
                </b-form-checkbox>
            </b-form-group>
        </div>
    </b-collapse>
    <hr/>
</div>
</template>

<script>
export default {
    name: 'filterByIngredients',
    components: {
    },
    props: {
        ingredientsList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            ingredients: [],
            isOpen: true,
            searchText: '',
        }
    },
    created() {
        this.ingredients = this.$route.query?.ingredient?.length ? this.$route.query.ingredient : []
    },
    mounted() {
    },
    watch: {
    },
    computed: {
    },
    methods: {
    },
    beforeDestroy() {
    }
}
</script>