export default {
    name: 'SwiperComponent',
    components: {
    },
    props: {
        slides: {
            type: Array,
            default: [],
        }
    },
    data() {
        return {
            swiperOption: {},
            imageHost: process.env.VUE_APP_LOCALE_STRAPI,
        }
    },
    created() {
    },
    mounted() {
    },
    watch: {},
    computed: {
    },
    methods: {
        getImageFormats(slide) {
            try {
                return Object.values(slide.image[0].formats).sort((a,b) => {
                    return b.width - a.width
                })
            } catch {
                return []
            }
        },
        openLink(slide) {
            if (slide.link) {
                window.open(slide.link)
            }
        }
    },
    beforeDestroy() {
    }
}