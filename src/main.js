import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import router from './router'
import store from '@/store'
import './registerServiceWorker'

import App from './App.vue'
import AlertComponent from './components/Alert.vue'

Vue.use(Vuetify)

Vue.component('app-alert', AlertComponent)

Vue.config.productionTip = !(process.env.NODE_ENV === 'production')

// work with Vue-Router history==true
if ('-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style) {
  window.addEventListener('hashchange', (event) => {
    const currentPath = window.location.hash.slice(1)
    if (router.path !== currentPath) {
      router.push(currentPath)
    }
  }, false)
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
