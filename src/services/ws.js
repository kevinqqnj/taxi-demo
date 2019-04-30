// import http from '@/services/http'
import config from '@/config'
import store from '@/store'

// WSENDPOINT = 'ws' // ws/taxi/ or ws/guest/

// function initWS (path) {
//   const websocket = new WebSocket(`${config.wsUrl}/${WSEndpoint}/${path}/`)
//   return websocket
// }

// function wsOnMessage (data) {
//   // processing data here
//   return data
// }

class Ws {
  constructor (path) {
    this.path = path
  }

  init () {
    this.websocket = new WebSocket(`${config.wsUrl}/ws/${this.path}/`)
    this.websocket.onopen = () => store.dispatch('auth/wsOnOpen')
    this.websocket.onerror = (e) => store.dispatch('auth/wsOnError', e)
    this.websocket.onclose = (e) => store.dispatch('auth/wsOnClose', e)
    return this.websocket
  }
}

export default Ws
