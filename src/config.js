const wsProtocol = location.protocol === 'http:' ? 'ws:' : 'wss:'
let base_url = location.origin, ws_url = `${wsProtocol}//${location.host}/taxi/`

if (process.env.NODE_ENV === 'development') {	// when 'yarn serve', it's 'development'
  base_url = 'http://localhost:8080'
  ws_url = 'ws://localhost:8080/taxi/'
}

export default {
  base_url,
  ws_url
}

