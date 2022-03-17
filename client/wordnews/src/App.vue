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
      <template v-if="user.status.loggedIn">
        <v-btn text :href="'/user/' + userName">{{ userName }}</v-btn>
            <v-btn text @click="signOut()">Log Out</v-btn>
          </template>
    </v-app-bar>

    <v-main>
      <div v-if="alert.message" :class="`alert ${alert.type}`">{{alert.message}}</div>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
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
    }
  }
};
</script>
