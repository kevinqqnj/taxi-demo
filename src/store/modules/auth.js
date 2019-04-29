import authService from '@/services/authService'
import router from '@/router'

const state = {
  login: false,
  isLock: false,
  user: null,
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
    return s || state.sessionid
  }
}

const mutations = {
  setUserInfo (state, payload) {
    state.user = payload
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
    // state.sessionid = response.sessionid
    // Vuex should NOT include localStorage actions
    // localStorage.setItem('user', JSON.stringify(state.user))
  },
  logout (state) {
    state.user = null
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
    let response = await authService.login(payload.user)
    commit('login', response)
    // if error, will not execute belows:
    console.log('>>> login success!')
    localStorage.setItem('user', JSON.stringify(state.user))
    commit('setError', 'login success!', { root: true })
    router.push(payload.redirect || '/')
  },
  async logout ({ commit }) {
    await authService.logout()
    commit('logout')
    // if error, will not execute belows:
    console.log('>>> you\'ve been logout!')
    localStorage.removeItem('user')
    commit('setError', 'logout success!', { root: true })
  },
  setUserInfo ({ commit }) {
    let u = localStorage.getItem('user')
    if (u) {
      u = JSON.parse(u)
    } else {
      console.log('>>> no user info found in localStorage')
    }
    commit('setUserInfo', u)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
