<template>
  <v-container>
    Votes: {{ user.votes || "0" }} <br>
    Correct: {{ user.correct || "0" }} <br>
    Percentage: {{ user.correct / user.votes || "0" }}
  </v-container>
</template>

<script>
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
      headers: { 'Content-Type': 'application/json' }
    };

    fetch(`http://localhost:5001/api/user/userById?name=${this.$route.params.id}`, requestOptions)
        .then(async (resp) => {
          this.user = await resp.json();
        });
  }
}

</script>

<style scoped>

</style>