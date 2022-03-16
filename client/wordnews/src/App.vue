<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />
      <v-toolbar-title>Word News</v-toolbar-title>

      </div>

      <v-spacer></v-spacer>
      <template v-if="user.status.loggedIn">
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
    }
  }
};
</script>
