

export default {
    name: 'SwiperComponent',
    components: {
    },
    props: {},
    data() {
        return {
            slides: [],
            swiperOption: {
            },
        }
    },
    created() {
        this.getData()
    },
    mounted() {
        
        // console.log('Current Swiper instance object', this.mainPageSwiper)
        // this.mainPageSwiper.slideTo(3, 1000, false)
    },
    watch: {},
    computed: {
        // swiper() {
        //     return this.slides || []
        // }
    },
    methods: {
        getData() {
            this.$axios({
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                url: 'http://localhost:1337/Sliders/1',
            }).then(response => {
                this.slides = response.data.slides
                
            })
        },
        getImageFormats(slide) {
            this.mainPageSwiper.update()
            this.mainPageSwiper.updateSize()
            try {
                return Object.values(slide.image[0].formats).sort((a,b) => {
                    return b.width - a.width
                })
            } catch {
                return []
            }
        },
    },
    beforeDestroy() {
    }
}