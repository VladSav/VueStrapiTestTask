<template>
<div>
    <div class="d-flex justify-content-between align-items-center mb-3" 
        @click="isOpen = !isOpen">
        <span>Categories</span>
        <b-icon-chevron-up :rotate="isOpen ? 180 : 0"></b-icon-chevron-up>
    </div>
    <b-collapse id="filters-collapse-categories" :visible="isOpen">
        <b-form-group>
            <b-form-checkbox
                v-model="allSelected"
                :indeterminate="indeterminate"
                @change="toggleAllCategories"
                class="d-flex justify-content-start mb-2">
                {{ allSelected ? 'Un-select All' : 'Select All' }}
            </b-form-checkbox>
            <b-form-checkbox
                v-for="category in categoriesList"
                v-model="categories"
                :key="'category-filter-' + category.id"
                :value="category.id"
                class="d-flex justify-content-start"
                @change="setQueries">
                {{ category.title }}
            </b-form-checkbox>
        </b-form-group>
    </b-collapse>
    <hr/>
</div>
</template>

<script>
export default {
    name: 'FilterByCategories',
    components: {
    },
    props: {
        categoriesList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            categories: [],
            isOpen: true,

            allSelected: false,
            indeterminate: false,
        }
    },
    created() {
        /**
         * Little bit difficult, but I need to check empty array and convert values into numbers
         **/ 
        this.categories = this.$route.query?.categories?.length ? 
            this.$route.query.categories == 'none' 
                ? [] 
                : Array.isArray(this.$route.query.categories)
                    ? this.$route.query.categories.map(category => +category)
                    : [+this.$route.query.categories]
            : this.categoriesList.map(category => category.id)
    },
    mounted() {
    },
    watch: {
        'categories': function(newValue) {
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
    },
    methods: {
        toggleAllCategories(checked) {
            this.categories = checked ? this.categoriesList.map(category => category.id) : []
            this.setQueries()
        },
        setQueries() {
            let query = Object.assign({}, this.$route.query)
            if (this.categories.length !== this.categoriesList.length) {
                query.categories = this.categories.length ? this.categories.sort((a,b) => a - b) : 'none'
            } else {
                delete query.categories
            }

            this.$router.push({
                name: "MainPage",
                path: "/",
                query: query
            })
        }
    },
    beforeDestroy() {
    }
}
</script>