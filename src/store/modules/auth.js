import authService from '../../services/authService'

const state = {
  login: false,
  isLock: false,
  user: {},
  sessionid: null,
  globals: {
    pending_download_data: [],
    send_download_signal: false,
    pending_upload_data: [],
    send_upload_signal: 0,
    press_back_key: false,
    share_refresh: false,
    pending_download: [],
    downloading: [],
    downloaded: [],
    pending_upload: [],
    uploading: [],
    uploaded: []
  },
  websocket: {
    ws: null,
    status: 'DISCONNECTED',
    content: {},
    code: null
  }
}

const getters = {
  user: state => {
    return state.user
  },
  sessionid: state => {
    let s = localStorage.getItem('sessionid')
    if (s) return s
    else return state.sessionid
  }
}

const mutations = {
  setUserInfo (state, payload) {
    state.login = payload.login
    state.user = payload.user
  },
  setIsLock (state, isLock) {
    state.isLock = isLock
  },
  initWS (state, ws) {
    state.websocket.status = 'CONNECTING'
    state.websocket.ws = ws
  },
  wsOnOpen (state) {
    state.websocket.status = 'CONNECTED'
  },
  wsOnError (state, e) {
    state.websocket.status = 'ERROR'
    state.websocket.code = JSON.stringify(e)
  },
  wsOnClose (state, e) {
    state.websocket.status = 'CLOSED'
    state.websocket.code = JSON.stringify(e)
  },
  wsOnMessage (state, data) {
    // state.websocket.status = 'MESSAGE'
    state.websocket.content = data
  },
  login (state, response) {
    state.user = response
    state.sessionid = response.sessionid
    localStorage.setItem('sessionid', state.sessionid)
  }
}

const actions = {
  async initWS ({ dispatch, commit }) {
    const ws = await authService.initWS()
    ws.onopen = () => dispatch('wsOnOpen')
    ws.onerror = (e) => dispatch('wsOnError', e)
    ws.onclose = (e) => dispatch('wsOnClose', e)
    ws.onmessage = (e) => dispatch('wsOnMessage', e)
    commit('initWS', ws)
  },
  async wsOnOpen ({ commit }) {
    commit('wsOnOpen')
    await console.log('Websocket CONNECTED!')
  },
  async wsOnError ({ commit }, e) {
    commit('wsOnError', e)
    await console.log(`Websocket ERROR: ${e}`)
  },
  async wsOnClose ({ commit }, e) {
    commit('wsOnClose', e)
    await console.log(`Websocket CLOSED! ${e}`)
  },
  async wsOnMessage ({ commit }, e) {
    const rdata = JSON.parse(e.data)
    authService.wsOnMessage(rdata)
    commit('wsOnMessage', rdata)
  },
  async login ({ commit }, payload) {
    // try {
    commit('login', await authService.login(payload))
    // } catch (error) {
    //   console.log(error.response)
    // if (error.response.status === 400) {
    //   // Bad Request
    //   commit('setError', error.response.data, { root: true })
    // } else if (error.response.status === 403) {
    //   // Forbidden
    //   commit('setError', error.response.data.detail, { root: true })
    // }
    // }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
