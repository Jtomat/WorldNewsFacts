<template>
  <v-container>
    <v-row class="fill-height overflow-auto" id="container">
      <v-col
        v-for="(item) in news"
        :key="item.article"
        :cols="(12/itemsPerRow)"
        class="py-2"
      > 
        <v-card class="card fill-height mx-auto" >
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
          >Read more</v-btn>
        </template>
        <template v-slot:default="dialog">
        <v-card
          :key="item.article" 
          elevation="2"
          outlined
          class="mx-auto"
          style="margin-top: 20px;">
              <v-img class="white--text align-end" height="200px" :src="item.preview">              
                <v-card-title class="text-overline">{{ getKeyWords(item.keyWords) }}</v-card-title>
              </v-img>
              <v-card-title class="text-h5 mb-1">
                {{ item.article }}
              </v-card-title>
              <v-card-text>{{ item.text }}</v-card-text>
              <v-divider></v-divider>
              <div style="text-align: center">
                <v-btn
                  text
                  style="margin: 15px;"
                  elevation="2"
                  color="success"
                  @click="dialog.value = false; vote(true, item.id)"
                >Its a Fact!</v-btn>
                <v-btn
                  text
                  elevation="2"
                  style="margin: 15px;"
                  color="error"
                  @click="dialog.value = false; vote(false, item.id)"
                >Its a Fake!</v-btn>
              </div>
              <v-divider></v-divider>

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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'HelloWorld',

  data() {
    return {
      amount: 3
    }
  },

  created() {
    this.$store.dispatch('news/getAll');
    // re-calc on screen resize
    window.addEventListener('resize', () => {
        this.calcRowsPerPage()
    })
  },

  methods: {
    vote(result, news) {
      const user = this.$store.state.authentication.user.name;
      this.$store.dispatch('votes/vote', {user, result, proof: "proofs r 4 fags", news});
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
