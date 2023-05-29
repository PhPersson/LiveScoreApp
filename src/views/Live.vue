<template>
  <div class="live">
    <h1> {{ this.leagueTable.name }}</h1>
    <loading-spinner v-if="isLoading"></loading-spinner>
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
      <p class="loadingMatch" v-else-if="isLoading">Loading...</p> <!-- Show loading message while data is being fetched from the API-->

    <p class="noMatch" v-else>No matches today</p> <!-- If matchesToday is empty, show an errortext-->
  </div>
</template>
  
  
<script>
import LiveScoreApp from '@/components/LiveScoreApp.vue'
import axios from 'axios';
import VIcon from 'vuetify';
import LoadingSpinner from '@/components/Loading-Spinner.vue';
export default {
  name: 'App',
  components: {
    LiveScoreApp,
    VIcon,
    LoadingSpinner
  },

  data() {
    return {
      league: this.$route.params.league,
      matchesToday: [],
      leagueTable: [],
      favoriteTeams: [],
      isLoading: false,

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
      this.isLoading = true;
      const options = {
        headers: {
          'X-Auth-Token': `${process.env.VUE_APP_API_KEY}`
        },
        params: {
          season: 2022,
          date: '2023-05-28',
          // dateFrom: this.getTodaysDate(),
          // dateTo: this.getTodaysDate()
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
        console.error(error);
        this.errorMessage = error.message + ' See the log for more information';
        this.showModal = true;
      } finally {
        // Set the loading state to false after the API call is complete
        this.isLoading = false;
      }
    },
    getFavoriteIcon(team) {
      // Check if the team is already marked as a favorite
      let isFavorite = null;
      if(this.favoriteTeams != null){
              isFavorite = this.favoriteTeams.some(favorite => favorite.id === team.id);
      }
      // Return the appropriate icon based on whether it is a favorite or not
      return isFavorite ? 'mdi-star' : 'mdi-star-outline';
    },
  }
}

</script>

<style scoped>

h3 {
    margin: 40px 0 0;
  }
h1 {
  text-align: center;  
}
ul {
  list-style-type: none;
  padding: 0;
}

li {
  font-size: large;
  display: inline-block;
  margin: 10px 10px;
  list-style: none;
  display: block;
}


.live{
  background-color: lightgray;
  min-height: 90vh;
}

.match {
  background-color: rgb(0, 0, 0);
  color: aliceblue;
  margin-left: 20%;
  margin-right: 20%;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1rem;
  padding-bottom: 2rem;
  border-radius: 10px;
  text-align: center;
  transition: transform 0.5s ease;
  animation: fade-in 1s ease;
}


.time{
  color: white;
  text-align: center;
}


.homeTeam ,.awayTeam {
  display: inline;
  text-align: center;
}

.score {
  color: red;
  font-size: 3vw;
  display: inline-block;
  text-align: center;
  margin-right: auto;
  margin-left: auto;
}
.crest{
    vertical-align: super;
    margin-left: auto;
    margin-right: auto;
    width: 7%;
    margin-bottom: -20px;
    padding:1%;
    background-color: whitesmoke;
    border-radius: 25px;
}

.noMatch, .loadingMatch {
  color: red;
  text-align: center;
}

</style>
