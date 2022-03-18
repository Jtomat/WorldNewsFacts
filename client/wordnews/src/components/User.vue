<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-1">
        <v-card
          elevation="2"
          class="mx-auto"
          max-width="600"

        >    
          <v-card-title> Статистика пользователя {{ user.email }}</v-card-title>
          <v-row class="text-center">
            <v-col class="mb-1">

          <div>
            <v-progress-circular
              style="margin: 30px;"
              :rotate="360"
              :size="100"
              :width="15"
              :value="user.votes || 0"
              label="sus"
              color="teal"
            >
              {{ user.votes || 0 }} 
            </v-progress-circular>
            <span>Всего голосов</span>
          </div>
          <div>
            <v-progress-circular
              style="margin: 30px;"
              :rotate="360"
              :size="100"
              :width="15"
              :value="((user.correct*100)/user.votes) || 0"
              color="green"
            >
              {{ Math.round((user.correct*100)/user.votes) || 0 }}%
            </v-progress-circular>
            <span>Верно голосов</span>
          </div>
          <div>
            <v-progress-circular
              style="margin: 30px; margin-right: 7px;"
              :size="100"
              :width="15"
              :value="(((user.votes - user.correct)*100)/user.votes) || 0"
              color="red"
            >
              {{ Math.round(((user.votes - user.correct)*100)/user.votes) || 0 }}%
            </v-progress-circular>
            <span>Неверно голосов</span>
          </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
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
          console.log(this.user)
        });
  }
}

</script>

<style scoped>

</style>