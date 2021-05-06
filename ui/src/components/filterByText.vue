<template>
<div>
    <div class="d-flex justify-content-between align-items-center mb-3"
        @click="isOpen = !isOpen">
        <span>Recipe title</span>   
        <b-icon-chevron-up :rotate="isOpen ? 180 : 0"></b-icon-chevron-up>
    </div>
    <b-collapse id="filters-collapse-search" :visible="isOpen">
        <b-form-input v-model="searchText" 
            placeholder="Enter the title of recipe">
        </b-form-input>
    </b-collapse>
    <hr/>
</div>
</template>

<script>
export default {
    name: 'FilterByText',
    components: {
    },
    props: {
    },
    data() {
        return {
            searchText: '',
            isOpen: true,
        }
    },
    created() {
        this.searchText = this.$route.query.searchText || ''
    },
    mounted() {
    },
    watch: {
        searchText: function() {
            let query = Object.assign({}, this.$route.query)
            if (this.searchText) {
                query.searchText = this.searchText
            } else {
                delete query.searchText
            }
            this.$router.push({
                name: "MainPage",
                path: "/",
                query: query
            })
        }
    },
    computed: {
    },
    methods: {
    },
    beforeDestroy() {
    }
}
</script>