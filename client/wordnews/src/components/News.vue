<template>
  <v-container>
    <v-row class="fill-height overflow-auto" id="container">
      <v-col
        v-for="(item) in news"
        :key="item.article"
        :cols="(12/itemsPerRow)"
        class="py-2"
      > 
      <v-hover v-slot="{ hover }">
        <v-card class="card fill-height mx-auto"
          :elevation="hover ? 12 : 2"
          :class="{ 'on-hover': hover }">
          <v-img
            class="white--text align-end"
            height="200px"
            :src="item.preview"
          >
          </v-img>
          <v-card-title style="word-break: normal" >{{ item.article }}</v-card-title>
          <v-card-text>
            <span v-html="getKeyWords(item.keyWords)" class="text-overline mb-4"></span>
          </v-card-text>
          <v-card-actions>
      <v-dialog
        transition="dialog-bottom-transition"
        max-width="900"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            v-bind="attrs"
            v-on="on"
            @click="getStatsById(item.id)"
          >Read more</v-btn>
        </template>
        <template v-slot:default="dialog">
        <v-card
          :key="item.article" 
          elevation="2"
          outlined
          class="mx-auto"
          style="margin-top: 20px;">
              <v-img class="white--text align-end" height="100px" :src="item.preview">              
                <v-card-title class="text-overline">{{ getKeyWords(item.keyWords) }}</v-card-title>
              </v-img>
              <v-card-title class="text-h5 mb-1">
                {{ item.article }}
              </v-card-title>
              <v-card-text>{{ item.text }}</v-card-text>
              <div >
                <v-divider></v-divider>
                <div style="text-align: center">
                  <v-btn
                    text
                    style="margin: 15px;"
                    elevation="2"
                    color="success"
                    :disabled="checkIfAlreadyVoted(item.id)"
                    @click="vote(true, item.id)"
                  >Its a Fact!</v-btn>
                  <v-btn
                    text
                    elevation="2"
                    style="margin: 15px;"
                    color="error"
                    :disabled="checkIfAlreadyVoted(item.id)"
                    @click="vote(false, item.id)"
                  >Its a Fake!</v-btn>
                </div>
                <v-alert
                  dense
                  text
                  type="success"
                  v-if="checkIfAlreadyVoted(item.id) && checkIfvotedCorrectly(item.id)"
                                    style="text-align: center"
                >
                You are <strong>correct</strong>, this is <strong>{{getVoteById(item.id) ? 'legit': 'fake'}}</strong>!
                </v-alert>
               <v-alert
                  dense
                  text
                  type="error"
                  v-if="checkIfAlreadyVoted(item.id) && !checkIfvotedCorrectly(item.id)"
                  style="text-align: center"
                >
                You are <strong>wrong</strong>, this is <strong>{{getLegitById(item.id) ? 'legit': 'fake'}}</strong>!
                </v-alert>
              </div>
              <div class="mx-auto" style="display: flex; justify-content: space-evenly;">
                <div>
                  <v-progress-circular
                      style="margin: 30px;"
                      :rotate="360"
                      :size="100"
                      :width="15"
                      :value="((stats.neg*100)/(stats.pos+stats.neg)) || 0"
                      color="green"
                  >
                    {{ Math.round((stats.neg * 100) / (stats.pos+stats.neg)) || 0 }}%
                  </v-progress-circular>
                  <span>Верно голосов</span>
                </div>
                <div>
                  <v-progress-circular
                      style="margin: 30px; margin-right: 7px;"
                      :size="100"
                      :width="15"
                      :value="(((stats.pos)*100)/(stats.pos+stats.neg)) || 0"
                      color="red"
                  >
                    {{ Math.round(((stats.pos) * 100) / (stats.pos+stats.neg)) || 0 }}%
                  </v-progress-circular>
                  <span>Неверно голосов</span>
                </div>
              </div>
            <v-card-actions class="justify-end">
              <v-btn
                text
                @click="dialog.value = false"
              >Close</v-btn>
            </v-card-actions>
            
        </v-card>

        </template>
      </v-dialog>

          </v-card-actions>
        </v-card>
                </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'News',

  data() {
    return {
      amount: 3,
      stats: {}
    }
  },

  created() {
    const user = this.$store.state.authentication.user.name;
    this.$store.dispatch('news/getAll');
    this.$store.dispatch('votes/votesForUser', {user});
    // re-calc on screen resize
    window.addEventListener('resize', () => {
        this.calcRowsPerPage()
    })
  },

  methods: {
    vote(result, news) {
      const user = this.$store.state.authentication.user.name;
      this.$store.dispatch('votes/vote', {user, result, proof: "proofs r 4 fags", news});
      this.$store.dispatch('votes/votesForUser', {user});
      this.getStatsById(news);
      this.$emit('voted');
    },
    checkIfAlreadyVoted(newsId) {
      const currentVotes = this.$store.state.votes.all.votes;
      let outism = false;
      if (currentVotes && currentVotes.length) {
        currentVotes.forEach(element => {
          if (element.news_id == newsId) {
            outism = true;
          }
        })
      }
      return outism;
    },
    checkIfvotedCorrectly(newsId) {
      const currentVotes = this.$store.state.votes.all.votes;
      const currentNews = this.$store.state.news.all.news;
      let currentVote;
      let outism = false;
      if (currentVotes && currentVotes.length) {
        currentVotes.forEach(element => {
          if (element.news_id == newsId) {
          currentVote = element.result;
          }
        });
        currentNews.forEach( element => {
          if(element.id == newsId) {
            outism = currentVote == element.legit;
          }
        })
      }
      return outism;
    },
    getVoteById(newsId) {
      const currentVotes = this.$store.state.votes.all.votes;
      let outism = false;
      if (currentVotes && currentVotes.length) {
        currentVotes.forEach(element => {
          if (element.news_id == newsId) {
            outism = element.result;
          }
        })
      }
      return outism;
    },
    getLegitById(newsId) {
      const currentVotes = this.$store.state.votes.all.votes;
      const currentNews = this.$store.state.news.all.news;
      let outism = false;
      if (currentVotes && currentVotes.length) {
        currentNews.forEach( element => {
          if(element.id == newsId) {
            outism = element.legit;
          }
        })
      }
      return outism;
    },
    getStatsById(newsId) {
      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      };

      fetch(`http://localhost:5001/api/news/get/newsStats?id=${ newsId }`, requestOptions)
        .then(async (resp) => {
          this.stats = await resp.json();
        });
    },
    getKeyWords(word) {
      let outism = '';
      word.map((el) => {
        outism += el + ', ';
      })
      return outism.substring(0, outism.length - 2)
    },
    gotoNews() {
      this.$router.push('/news');
    },
    calcRowsPerPage() {
      let container = document.getElementById('container')
      let minItemHeight = 170
      if (container) {
        let containerHeight = parseInt(container.clientHeight, 0)
        this.rpp = Math.floor(containerHeight/minItemHeight)
      }
      else {
        this.rpp = 4
      }
    },
  },

  computed: {
    news() {
      return this.$store.state.news.all.news;
    },
    numberOfPages() {
      return Math.ceil(this.beers.length / this.ipp)
    },
    rowsPerPage() {
      return this.rpp
    },
    itemsPerRow() {
      let outism;
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': outism = 1; break
        case 'sm': outism = 1; break
        case 'md': outism = 2; break
        case 'lg': outism = 3; break
        case 'xl': outism = 3; break
      }
      return outism
    },
    ipp () {
      return Math.ceil(this.rowsPerPage * this.itemsPerRow)
    }
  }
}
</script>
