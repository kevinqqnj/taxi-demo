import authService from '../../services/authService'


const state = {
    login: false,
    isLock: false,
    user: {},
    sessionid: '',
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
  }
}

const mutations = {
    setUserInfo(state, payload) {
      state.login = payload.login
      state.user = payload.user
    },
    setIsLock(state, isLock) {
      state.isLock = isLock
    },
    initWS(state, ws) {
      state.websocket.status = 'CONNECTING'
      state.websocket.ws = ws
    },
    wsOnOpen(state) {
      state.websocket.status = 'CONNECTED'
    },
    wsOnError(state, e) {
      state.websocket.status = 'ERROR'
      state.websocket.code = JSON.stringify(e)
    },
    wsOnClose(state, e) {
      state.websocket.status = 'CLOSED'
      state.websocket.code = JSON.stringify(e)
    },
    wsOnMessage(state, data) {
      // state.websocket.status = 'MESSAGE'
      state.websocket.content = data
    },
    login(state, response) {
      state.user = response
      state.sessionid = response.sessionid
    },
  }
  
const actions = {
    async initWS({ dispatch, commit }) {
      let ws = authService.initWS()
      ws.onopen = () => dispatch('wsOnOpen')
      ws.onerror = (e) => dispatch('wsOnError', e)
      ws.onclose = (e) => dispatch('wsOnClose', e)
      ws.onmessage = (e) => dispatch('wsOnMessage', e)
      commit('initWS', ws)
    },
    async wsOnOpen({ commit }) {
      commit('wsOnOpen')
    },
    async wsOnError({ commit }, e) {
      commit('wsOnError', e)
    },
    async wsOnClose({ commit }, e) {
      commit('wsOnClose', e)
    },
    async wsOnMessage({ commit }, e) {
      const rdata = JSON.parse(e.data)
      authService.wsOnMessage(rdata)
      commit('wsOnMessage', rdata)
    },
    async login({ commit }, payload) {
      await authService.login(payload)
      .then(response => {
        commit('login', response)
      })
    },
  }

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}