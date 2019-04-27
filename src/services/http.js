import axios from 'axios'
import Cookies from 'js-cookie'

import vueconfig from '@/config'
import store from '@/store'

axios.interceptors.request.use(
  config => {
    config.baseURL = `${vueconfig.baseUrl}/api/`
    config.withCredentials = true // 允许携带token ,这个是解决跨域产生的相关问题
    config.timeout = 5000

    config.headers = {
      'Content-Type': 'application/json',
      'X-CSRFToken': Cookies.get('csrftoken')
    }
    let token = sessionStorage.getItem('access_token')
    if (token) {
      config.headers = {
        'access-token': token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    if (config.url === 'refresh') {
      config.headers = {
        'refresh-token': sessionStorage.getItem('refresh_token'),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 在 response 拦截器实现
axios.interceptors.response.use(
  response => {
    console.log(response)
    // 定时刷新access-token
    if (!response.data.value && response.data.data === 'token invalid') {
      // 刷新token
      store.dispatch('refresh').then(response => {
        sessionStorage.setItem('access_token', response.data)
      }).catch(error => {
        throw new Error('token刷新' + error)
      })
    }
    return response
  },
  error => {
    console.log(error.response)
    if (error.response.status === 400) {
      // Bad Request. within module: { root: true } ??
      store.commit('setError', error.response.data)
    } else if (error.response.status === 403) {
      // Forbidden
      store.commit('setError', error.response.data.detail, { root: true })
    }
    return Promise.reject(error)
  }
)

export default axios
