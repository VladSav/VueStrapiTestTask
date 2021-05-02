import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import { BootstrapVue } from 'bootstrap-vue'
import VueAwesomeSwiper from 'vue-awesome-swiper'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'swiper/swiper-bundle.css'

Vue.config.productionTip = false
Vue.prototype.$axios = axios;

Vue.use(BootstrapVue)
Vue.use(VueAwesomeSwiper)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
