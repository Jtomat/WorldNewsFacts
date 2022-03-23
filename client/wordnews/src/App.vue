<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <a href="/" style="color: white; text-decoration: none">
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          :src="require('./assets/logo.svg')"
          transition="scale-transition"
          width="40"
        />
      <v-toolbar-title>World News</v-toolbar-title>
      </div>
      </a>

      <v-spacer></v-spacer>
        <h5  v-if="user.status.loggedIn" style="margin-bottom: 0px; margin-right: 8px;">{{userStats.votes}}</h5>
        <span v-if="user.status.loggedIn">Total votes</span>
        <v-progress-circular
          v-if="user.status.loggedIn"
           style="margin: 30px; margin-right: 7px;"
           :value="((userStats.correct*100)/userStats.votes) || 0"
           color="green"
          >
          </v-progress-circular>
        <span v-if="user.status.loggedIn">Right</span>
        <v-progress-circular
           v-if="user.status.loggedIn"
           style="margin: 30px; margin-right: 7px;"
           :value="(((userStats.votes - userStats.correct)*100)/userStats.votes) || 0"
           color="red"
          >
          </v-progress-circular>
        <span v-if="user.status.loggedIn">Wrong</span>
      <v-spacer></v-spacer>

      <template v-if="user.status.loggedIn">
        <v-btn text :href="'/user/' + userName">{{ userName }}</v-btn>
            <v-btn text @click="signOut()">Log Out</v-btn>
          </template>
    </v-app-bar>

    <v-main>
      <div v-if="alert.message" :class="`alert ${alert.type}`">{{alert.message}}</div>
      <router-view v-on:voted="refreshUserStats"></router-view>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    userStats: {}
  }),
  computed: {
    alert () {
      return this.$store.state.alert
    },
    user () {
      return this.$store.state.authentication;
    },
    users () {
      return this.$store.state.users.all;
    },
    userName() {
      return JSON.parse(localStorage.getItem('user')).name;
    }
  },
  watch:{
    $route (){
      // clear alert on location change
      this.$store.dispatch('alert/clear');
    }
  },
  methods: {
    signOut () {
      this.$store.dispatch('authentication/logout');
      this.$router.push('/login');
    },
    refreshUserStats () {
      if(this.user.status.loggedIn) {
        const requestOptions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        };

        fetch(`http://localhost:5001/api/user/userById?name=${ this.user.user.name }`, requestOptions)
            .then(async (resp) => {
              this.userStats = await resp.json();
            });
      }
    }
  },  
  mounted() {
    if(this.user.status.loggedIn) {
      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      };

      fetch(`http://localhost:5001/api/user/userById?name=${ this.user.user.name }`, requestOptions)
          .then(async (resp) => {
            this.userStats = await resp.json();
          });
    }
  }

};
</script>
