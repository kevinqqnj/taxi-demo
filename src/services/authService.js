import http from '@/services/http'
import config from '@/config'


export default {
  initWS() {
    const websocket = new WebSocket(config.ws_url)
    return websocket
  },
  wsOnMessage(data) {
    // processing data here
    return data
  },
  login(payload) {
    return http.post(`log_in/`, payload)
              .then(response => response.data)
  }
}