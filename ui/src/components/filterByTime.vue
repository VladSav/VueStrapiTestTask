<template>
<div>
    <div class="d-flex justify-content-between align-items-center mb-3" 
        @click="isOpen = !isOpen">
        <span>Time to prepare</span>
        <b-icon-chevron-up :rotate="isOpen ? 180 : 0"></b-icon-chevron-up>
    </div>
    <b-collapse id="filters-collapse-time-to-prepare" :visible="isOpen">
        <b-form-input type="range"
            v-model="timeToPrepare" 
            :min="minTime" 
            :max="maxTime"
            step="1"
            debounce="300">
        </b-form-input>
        <p><b>{{timeToPrepare}}</b> minutes</p>
    </b-collapse>
    <hr/>
</div>
</template>

<script>
export default {
    name: 'FilterByTime',
    components: {
    },
    props: {
        minTime: {
            type: Number,
            default: 0,
        },
        maxTime: {
            type: Number,
            default: 10,
        }
    },
    data() {
        return {
            timeToPrepare: this.$route.query.timeToPrepare || this.maxTime,
            isOpen: true,
        }
    },
    created() {
    },
    mounted() {
    },
    watch: {
        timeToPrepare: function() {
            let query = Object.assign({}, this.$route.query)
            if (this.timeToPrepare != this.maxTime) {
                query.timeToPrepare = this.timeToPrepare
            } else {
                delete query.timeToPrepare
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