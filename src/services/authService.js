import http from '@/services/http'
import config from '@/config'

const WSEndpoint = 'taxi' // taxi or guest

export default {
  initWS () {
    const websocket = new WebSocket(`${config.wsUrl}/${WSEndpoint}/`)
    return websocket
  },
  wsOnMessage (data) {
    // processing data here
    return data
  },
  login (payload) {
    return http.post(`log_in/`, payload)
      .then(response => response.data)
  }
}
