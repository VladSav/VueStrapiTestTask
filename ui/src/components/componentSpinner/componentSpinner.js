import Spinner from 'vue-simple-spinner'

export default {
    name: 'SpinnerComponent',
    components: { Spinner },
    props: {
        showSpinner: {
            type: Boolean,
            default: true,
        }
    },
    data() {
        return {
            spinnerSize: 48,
        }
    },
}