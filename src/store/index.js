import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import messages from './modules/messages'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    messages
  },
  state: {
    loading: false,
    error: null,
    onlineUsers: []
  },
  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    },
    setOnlineUsers (state, payload) {
      state.onlineUsers = payload
    }
  },
  actions: {
    clearError ({ commit }) {
      commit('clearError')
    }
  },
  getters: {
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    },
    onlineUsers (state) {
      return state.onlineUsers
    }
  }
})
