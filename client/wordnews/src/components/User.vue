<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-1">
        <v-card
            elevation="2"
            class="mx-auto"
            max-width="600"

        >
          <v-card-title> Stats for {{ user.email }}</v-card-title>
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
                  {{ Math.round((user.correct * 100) / user.votes) || 0 }}%
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
                  {{ Math.round(((user.votes - user.correct) * 100) / user.votes) || 0 }}%
                </v-progress-circular>
                <span>Неверно голосов</span>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <v-card elevation="2"
                class="mx-auto mt-4"
                max-width="600" v-if="user.admin">

          Admin stuff
          <v-row>
            <v-col cols="12"
                   sm="6"
                   class="p-4"
            >
              <v-progress-linear
                  indeterminate
                  :active="loadingGen"
                  color="blue"
              ></v-progress-linear>
              Generate news
              <v-text-field type="number" label="Chars amount" v-model="generateChars"></v-text-field>
              <v-text-field label="First key words (optional)" v-model="generateNewsWords"></v-text-field>
              <v-btn color="primary"
                     elevation="2"
                     @click="generateNews"
                     :disabled="!(generateChars > 0) || loadingGen"
              >Generate
              </v-btn>
            </v-col>
            <v-col cols="12"
                   sm="6"
                   class="p-4"
            >
              <v-progress-linear
                  indeterminate
                  :active="loadingParse"
                  color="blue"
              ></v-progress-linear>
              Parse news
              <v-text-field type="number" v-model="parseNewsAmount" label="News amount"></v-text-field>
              <v-btn color="primary"
                     elevation="2"
                     @click="parseNews"
                     :disabled="!(parseNewsAmount > 0) || loadingParse"
              >Parse
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
        <v-snackbar
            v-model="notification"
            color="success"
            timeout="2000"
        >
          {{ notificationText }}
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>


</template>

<script>
export default {
  name: "User",

  data() {
    return {
      user: {},
      generateChars: 0,
      generateNewsWords: '',
      parseNewsAmount: 0,
      notificationText: '',
      notification: false,
      loadingParse: false,
      loadingGen: false,
    }
  },

  methods: {
    generateNews() {
      let xhr = new XMLHttpRequest();
      let data = new FormData();
      data.append('len', this.generateChars);
      data.append('words', this.generateNewsWords);
      this.loadingGen = true;


      xhr.open("POST", "http://localhost:5001/api/news/generate");
      xhr.send(data);
      xhr.onloadend = () => { // (3)
        this.notificationText = "News successfully generated";
        this.notification = true;
        this.loadingGen = false;
      }
    },

    parseNews() {
      let xhr = new XMLHttpRequest();
      let data = new FormData();
      data.append('len', this.parseNewsAmount);

      xhr.open("POST", "http://localhost:5001/api/news/parse");
      xhr.send(data);
      this.loadingParse = true;
      xhr.onloadend = () => { // (3)
        this.notificationText = "News successfully parsed";
        this.notification = true;
        this.loadingParse = false;
      }
    }
  },

  mounted() {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };

    fetch(`http://localhost:5001/api/user/userById?name=${ this.$route.params.id }`, requestOptions)
        .then(async (resp) => {
          this.user = await resp.json();
        });
  }
}

</script>

<style scoped>

</style>