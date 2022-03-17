<template>
  <v-container>
    {{ user }}
  </v-container>
</template>

<script>
const config = {
  apiUrl: 'http://localhost:5001/api'
}

export default {
  name: "User",

  data() {
    return {
      user: {}
    }
  },

  mounted() {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      params: JSON.stringify({ name: this.$route.params.id })
    };

    fetch(`http://localhost:5001/api/user/userById`, requestOptions)
        .then((resp) => {
          console.log(`${ config.apiUrl }/user/userById`);
          this.user = resp.json();
        });
  }
}

</script>

<style scoped>

</style>