import Vue from 'vue'
import Router from 'vue-router'
import VueDemo from '@/views/VueDemo'
import Home from '@/views/Home'
import My404 from './views/My404.vue'
// import Signup from '@/views/Signup'
// import Signin from '@/views/Signin'

import store from '@/store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'signin',
      // component: Signin
      component: () => import(/* webpackChunkName: "signin" */ './views/Signin.vue')
    },
    {
      path: '/register',
      name: 'signup',
      // component: Signup
      component: () => import(/* webpackChunkName: "signup" */ './views/Signup.vue')
    },
    {
      path: '/messages',
      name: 'messages',
      component: () => import(/* webpackChunkName: "messages" */ './views/Messages.vue'),
      meta: { auth: true }
    },
    {
      path: '/vue',
      name: 'vue',
      component: VueDemo,
      meta: { auth: true }
    },
    { path: '*', name: 'my404', component: My404 }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.auth)) {
    // store.state not updated if load meta.auth page, so add check of localStorage
    if ((store.state.auth.user === null || store.state.auth.user === undefined) &&
      localStorage.getItem('user') === null) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  }
  next()
})

export default router
