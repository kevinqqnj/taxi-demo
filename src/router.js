import Vue from 'vue'
import Router from 'vue-router'
import VueDemo from '@/views/VueDemo'
import Messages from '@/views/Messages'
import Home from '@/views/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/messages',
      name: 'messages',
      component: Messages
    },
    {
      path: '/vue',
      name: 'vue',
      component: VueDemo
    },
  ]
})
