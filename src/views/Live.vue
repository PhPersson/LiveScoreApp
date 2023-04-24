<template>

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
          <img v-bind:src="match.homeTeam.crest" class="crest" />
          {{ match.homeTeam.name }}
        </div>
        <div class="score">
          {{ match.score.fullTime.home }} - {{ match.score.fullTime.away }}
        </div>
        <div class="awayTeam">
          {{ match.awayTeam.name }}
          <img v-bind:src="match.awayTeam.crest" class="crest" />
        </div>

      </li>
    </ul>
    <p v-else>No matches today</p>

</template>
  
  
<script>
import LiveScoreApp from '@/components/LiveScoreApp.vue'
import axios from 'axios';

export default {
  name: 'App',
  components: {
    LiveScoreApp
  },

  data() {
    return {    
      league: this.$route.params.league,
      matchesToday: [],
      leagueTable: [],
    }
    },
    
    async mounted() {
        await this.fetchApiData();
    },

    methods: {
      reloadPage() {
        location.reload();
      },

    getTime(match) {
      var time = match.utcDate.substring(11, 13)
      time = parseInt(time) + 2
      return time + match.utcDate.substring(13, 16);
    },      

    async fetchApiData() {
      const options = {
          headers: {
              'X-Auth-Token': `${process.env.VUE_APP_API_KEY}`
          },
          params: {
              season: 2022,
              dateFrom: "2023-04-22",
              dateTo: "2023-04-22"
          }
      };
      var url = `https://api.football-data.org/v4/competitions/${this.league}/matches`;
      try {
          const response = await axios.get(url, options);
          this.leagueTable = response.data.competition;
          this.matchesToday = response.data.matches;
      } catch (error) {
          console.error(error.message);
      }
      },      

    }
  }
  
  </script>