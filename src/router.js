import Vue from 'vue'
import Router from 'vue-router'
import VueDemo from '@/views/VueDemo'
import Home from '@/views/Home'
import My404 from './views/My404.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/messages',
      name: 'messages',
      component: () => import(/* webpackChunkName: "messages" */ './views/Messages.vue')
    },
    {
      path: '/vue',
      name: 'vue',
      component: VueDemo
    },
    { path: '*', name: 'my404', component: My404 }
  ]
})
