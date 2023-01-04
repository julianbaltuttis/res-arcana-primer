import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import Home from '../views/Home.vue'
import i18n from "@/i18n";

Vue.use(VueRouter)

const Test = {
  props: ['id'],

}

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: `/${i18n.locale}`
  },
  {
    path: '/res-arcana-primer/:lang',
    component: {
      render(c) {
        return c('router-view')
      }
    },
    children: [
      {
        path: '/',
        name: 'home',
        component: Home
      },
      {
        path: '/res-arcana-primer/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: '/res-arcana-primer/',
  routes
})

export default router
