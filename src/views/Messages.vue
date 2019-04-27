<template>
    <v-container>
      <v-layout row v-if="error">
        <v-flex xs12 sm8 offset-sm2>
          <app-alert @dismissed="onDismissed" :text="error"></app-alert>
        </v-flex>
      </v-layout>
    <v-layout
      text-xs-center
      wrap
    >
  <div class="hello">
    <img src='@/assets/logo-django.png' style="width: 250px" />
    <p>The data below is added/removed from the SQLite Database using Django's ORM and Rest Framework.</p>
    <br/>
        <p>Websocket Status: {{websocket.status}}</p>
    <input type="text" placeholder="WS message send" v-model="ws_send">
    <p>From Server: {{JSON.stringify(websocket.content)}}</p>
    <br> |
    <input
      type="submit"
      value="WS Send"
      @click="wsSend({ ws_send: ws_send })"
      :disabled="!ws_send || websocket.status!='CONNECTED'"> |
    <input
      type="submit"
      value="WS Connect"
      @click="wsConnect()"
      :disabled="websocket.status==='CONNECTED'"> |
      <input
      type="submit"
      value="login"
      @click="login({ username: 'user1', password: 'aaa' })"> |
      <input
      type="submit"
      value="trips"
      @click="getMessages()"> |
    <p>User: {{JSON.stringify(user)}}</p>
    <p>{{JSON.stringify(sessionid)}}</p>
    <hr/>
    <p>trip messages:</p>
    {{JSON.stringify(messages)}}
    <hr />

    <p>Subject</p>
    <input type="text" placeholder="Hello" v-model="subject">
    <p>Message</p>
    <input type="text" placeholder="From the other side" v-model="msgBody">
    <br><br>
    <input
      type="submit"
      value="Ajax Add"
      @click="addMessage({ subject: subject, body: msgBody })"
      :disabled="!subject || !msgBody">
    <hr/>

    <h3>Messages on Database</h3>
    <p v-if="messages.length === 0">No Messages</p>
    <div class="msg" v-for="(msg, index) in messages" :key="index">
        <p class="msg-index">[{{index}}]</p>
        <p class="msg-subject" v-html="msg.subject"></p>
        <p class="msg-body" v-html="msg.body"></p>
        <input type="submit" @click="deleteMessage(msg.pk)" value="Delete" />
    </div>
  </div>
</v-layout>
</v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Messages',
  data () {
    return {
      subject: '',
      msgBody: '',
      ws_send: ''
    }
  },
  computed: {
    ...mapState(['user', 'error', 'loading']),
    ...mapState('messages', ['messages']),
    ...mapState('auth', ['user', 'sessionid', 'globals', 'websocket'])
  },
  created () {
    // this.$store.dispatch('auth/login')
    this.$store.dispatch('messages/getMessages')
    // this.$store.dispatch('auth/init')
  },
  watch: {
    // user (value) {
    //   if (value !== null && value !== undefined) {
    //     this.$router.push('/chat/0')
    //   }
    // }
  },
  methods: {
    ...mapActions(['setError', 'clearError']),
    ...mapActions('messages', [
      'getMessages',
      'addMessage',
      'deleteMessage'
    ]),
    ...mapActions('auth', [
      'wsOnOpen',
      'wsOnError',
      'wsOnMessage',
      'login'
    ]),
    onDismissed () {
      this.$store.dispatch('clearError')
    },
    wsConnect () {
      this.$store.dispatch('auth/initWS')
    },
    wsSend () {
      let data = {
        'type': 'from Vue',
        'data': this.ws_send
      }
      this.websocket.ws.send(JSON.stringify(data))
    }
    // login() {
    //   let payload = {
    //     'username': 'user1',
    //     'password': 'aaa'
    //   }
    //   this.$store.dispatch('auth/login', payload)
    // },
  }
}
</script>
