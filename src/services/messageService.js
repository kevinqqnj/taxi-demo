import http from '@/services/http'


export default {
  fetchMessages() {
    return http.get(`trip/`)
              .then(response => response.data)
  },
  postMessage(payload) {
    return http.post(`messages/`, payload)
              .then(response => response.data)
  },
  deleteMessage(msgId) {
    return http.delete(`messages/${msgId}`)
              .then(response => response.data)
  }
}