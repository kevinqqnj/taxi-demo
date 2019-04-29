<template>
  <v-app>
    <v-navigation-drawer temporary v-model="drawerToggle" app>
      <v-list>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>supervisor_account</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            {{user ? user.username : 'Pls login'}}
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-list >
        <v-list-tile avatar @click="$router.push('/')">
          <v-list-tile-avatar>
            <img src="https://randomuser.me/api/portraits/men/85.jpg" />
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{user ? user.username : 'Guests'}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="logout()" v-if="userIsAuthenticated">
          <v-list-tile-action>
            <v-icon color="red">exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            Logout
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar class="light-blue darken-1" app>
      <v-toolbar-side-icon @click.native.stop="drawerToggle = !drawerToggle"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">Didi Taxi</router-link>
      </v-toolbar-title>

      <!-- <v-btn flat icon to="/"><v-icon to="/">home</v-icon></v-btn> -->
      <v-btn flat to="/vue">Vue</v-btn>
      <v-btn flat to="/messages">Django Rest</v-btn>
      <!-- <v-btn flat @click="login({ username: 'user1', password: 'aaa' })" >Login</v-btn> -->

      <v-spacer></v-spacer>
      <v-toolbar-items :key="item.id" v-for="item in menuItems">
        <v-btn flat :key="item.id" :to="item.route">
          <v-icon left>{{ item.icon }}</v-icon>
          <div class="hidden-xs-only">{{ item.title }}</div>
        </v-btn>
      </v-toolbar-items>
      <v-avatar :title="user.username" color="grey lighten-4" v-if="userIsAuthenticated">
          <img src="http://i.pravatar.cc/48" alt="avatar">
      </v-avatar>
    </v-toolbar>

    <router-view />

  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
  },
  data () {
    return {
      drawerToggle: false
    }
  },
  computed: {
    ...mapState(['error', 'loading']),
    ...mapState('auth', ['user', 'sessionid', 'globals', 'websocket']),
    menuItems () {
      let items = [
        { icon: 'face', title: 'Register', route: '/register' },
        { icon: 'lock_open', title: 'Login', route: '/login' }
      ]
      if (this.userIsAuthenticated) {
        items = [
          { icon: 'chat', title: 'Create a Chat', route: '/create' }
        ]
      }
      return items
    },
    userIsAuthenticated () {
      return this.user !== null && this.user !== undefined
    }
  },
  created () {
    this.$store.dispatch('auth/setUserInfo')
    // this.$store.dispatch('auth/login')
    // this.$store.dispatch('messages/getMessages')
    // this.$store.dispatch('auth/init')
  },
  watch: {
    // user (value) {
    //   if (value !== null && value !== undefined) {
    //     this.$router.push('/messages')
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
      'login',
      'logout'
    ])
  }
}
</script>

<style>
.bg-page {
  background: url("./assets/login-bg.jpg") center;
}
</style>
