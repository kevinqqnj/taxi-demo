import config from '@/config'

const websocket = new WebSocket(config.ws_url)

export default {
  websocket
}