<template>
  <div class="live">
    <h1> {{ this.leagueTable.name }}</h1>
    <ul v-if="matchesToday.length > 0">
      <li class="match" v-for="match in matchesToday" :key="match.id">

        <p class="competition">{{ match.competition.name }}</p>

        <p class="time" v-if="match.status === 'FINISHED'"> {{ getTime(match) + ' CEST' }} - FULL TIME </p>
        <div class="time" v-else-if="match.status === 'IN_PLAY' && match.score.halfTime.home === null"> {{
          getTime(match)
          + ' CEST' }} - <p class="timeLive">LIVE</p> first half </div>
        <div class="time" v-else-if="match.status === 'IN_PLAY' && match.score.halfTime.home !== null"> {{
          getTime(match)
          + ' CEST' }} - <p class="timeLive">LIVE</p> second half </div>
        <p class="time" v-else-if="match.status === 'PAUSED'"> {{ getTime(match) + ' CEST' }} - HT </p>
        <p class="time" v-else-if="match.status === 'TIMED'"> {{ getTime(match) + ' CEST' }} </p>

        <div class="homeTeam">
          <v-icon icon right>{{ getFavoriteIcon(match.homeTeam) }}</v-icon>
          <img v-bind:src="match.homeTeam.crest" class="crest" />
          {{ match.homeTeam.name }}
        </div>
        <div class="score">
          {{ match.score.fullTime.home }} - {{ match.score.fullTime.away }}
        </div>
        <div class="awayTeam">
          {{ match.awayTeam.name }}
          <img v-bind:src="match.awayTeam.crest" class="crest" />
          <v-icon icon right>{{ getFavoriteIcon(match.awayTeam) }}</v-icon>
        </div>

      </li>
    </ul>
    <p id="no-live-today" v-else>No matches today</p>
  </div>
</template>
  
  
<script>
import LiveScoreApp from '@/components/LiveScoreApp.vue'
import axios from 'axios';
import VIcon from 'vuetify';
export default {
  name: 'App',
  components: {
    LiveScoreApp,
    VIcon
  },

  data() {
    return {
      league: this.$route.params.league,
      matchesToday: [],
      leagueTable: [],
      favoriteTeams: [],
    }
  },

  async mounted() {
    await this.fetchApiData();
    this.favoriteTeams = JSON.parse(localStorage.getItem("teamList"));
  },

  methods: {

    getTime(match) {
      var time = match.utcDate.substring(11, 13)
      time = parseInt(time) + 2
      return time + match.utcDate.substring(13, 16);
    },

    getTodaysDate() {
      var todaysDate = "";
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      todaysDate = `${year}-${month}-${day}`;
      return todaysDate;
    },

    async fetchApiData() {
      const options = {
        headers: {
          'X-Auth-Token': `${process.env.VUE_APP_API_KEY}`
        },
        params: {
          season: 2022,
          dateFrom: this.getTodaysDate(),
          dateTo: this.getTodaysDate()
        }
      };
      var url = `https://api.football-data.org/v4/competitions/${this.league}/matches`;
      try {
        const response = await axios.get(url, options);
        this.leagueTable = response.data.competition;
        this.matchesToday = response.data.matches;
      } catch (error) {
        if (error.response && error.response.status === 429) {
          this.errorMessage = "Too many API calls. Please try again in a short while.";
          this.showModal = true;
          setTimeout(() => {
            this.showModal = false;
          }, 4000);
        }
        console.error(error.message);
      }
    },
    getFavoriteIcon(team) {
      // Check if the team is already marked as a favorite
      const isFavorite = this.favoriteTeams.some(favorite => favorite.id === team.id);
      // Return the appropriate icon based on whether it is a favorite or not
      return isFavorite ? 'mdi-star' : 'mdi-star-outline';
    },
  }
}

</script>
