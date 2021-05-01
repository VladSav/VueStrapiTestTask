import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const MainPage = () => import(/* webpackChunkName: "MainPage" */  '../components/pageMain.vue')
const Recipe = () => import(/* webpackChunkName: "Recipe" */ '../components/pageRecipe.vue')

const routes = [
    {
        path: '/',
        name: 'MainPage',
        component: MainPage
    },
    {
        path: '/recipe/:id',
        name: 'Recipe',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: Recipe,
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
