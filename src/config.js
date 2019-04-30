const wsProtocol = location.protocol === 'http:' ? 'ws:' : 'wss:'
let baseUrl = location.origin
let wsUrl = `${wsProtocol}//${location.host}`

if (process.env.NODE_ENV === 'development') {
  baseUrl = 'http://localhost:8080'
  wsUrl = 'ws://localhost:8080'
}

export default {
  baseUrl,
  wsUrl
}
