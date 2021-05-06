<template>
<div>
    <div class="d-flex justify-content-between align-items-center mb-3" 
        @click="isOpen = !isOpen">
        <span>Difficult</span>
        <b-icon-chevron-up :rotate="isOpen ? 180 : 0"></b-icon-chevron-up>
    </div>
    <b-collapse id="filters-collapse-difficult" :visible="isOpen">
        <b-form-group>
            <b-form-rating 
                v-model="difficult" 
                show-clear
                color="#e5861f">
            </b-form-rating>
        </b-form-group>
    </b-collapse>
    <hr/>
</div>
</template>

<script>
export default {
    name: 'filterByDifficulty',
    components: {
    },
    props: {
    },
    data() {
        return {
            difficult: null,
            isOpen: true,
        }
    },
    created() {
        this.difficult = +this.$route.query.difficult || null
    },
    mounted() {
    },
    watch: {
        difficult: function() {
            let query = Object.assign({}, this.$route.query)
            if (this.difficult) {
                query.difficult = this.difficult
            } else {
                delete query.difficult
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