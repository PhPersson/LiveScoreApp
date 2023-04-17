<template>
  <div class="live">

    <h2>Top 5 Leagues:</h2>
    <select v-model="selectedTop5League" @change="fetchteams">
      <option v-for="league in top5Leagues" :value="league" :key="league">{{ league }}</option>
    </select>

    <h2>Other Leagues:</h2>
    <select v-model="selectedOtherLeague" @change="fetchteams">
      <option v-for="league in otherLeagues" :value="league" :key="league">{{ league }}</option>
    </select>
    <h1>Your favorites:</h1>



    <h1>Today's matches:</h1>
    <h1 v-if="selectedTop5League !== '' || selectedOtherLeague !== ''" v-html="filteredMatches.shift()"></h1>
    <ul>
      <li class="match" v-for="match in filteredMatches" :key="match.id">

        <p class="time" v-if="match.status === 'FINISHED'"> {{ getTime(match) + ' CEST' }} - FULL TIME </p>
        <div class="time" v-else-if="match.status === 'IN_PLAY' && match.score.halfTime.home === null"> {{ getTime(match)
          + ' CEST' }} - <p class="timeLive">LIVE</p> first half </div>
        <div class="time" v-else-if="match.status === 'IN_PLAY' && match.score.halfTime.home !== null"> {{ getTime(match)
          + ' CEST' }} - <p class="timeLive">LIVE</p> second half </div>
        <p class="time" v-else-if="match.status === 'PAUSED'"> {{ getTime(match) + ' CEST' }} - HT </p>
        <p class="time" v-else-if="match.status === 'TIMED'"> {{ getTime(match) + ' CEST' }} </p>


        <div class="homeTeam">
          <Icon class="faicon" icon="ic:outline-star-border" @click="saveTeam(match.homeTeam.id, match.homeTeam.name)" />
          <img v-bind:src="match.homeTeam.crest" class="crest" />
          {{ match.homeTeam.name }}
        </div>
        <div class="score">
          {{ match.score.fullTime.home }} - {{ match.score.fullTime.away }}
        </div>
        <div class="awayTeam">
          {{ match.awayTeam.name }}
          <img v-bind:src="match.awayTeam.crest" class="crest" />
          <Icon class="faicon" icon="ic:outline-star-border" @click="saveTeam(match.awayTeam.id, match.awayTeam.name)" />
        </div>


      </li>
    </ul>
  </div>
</template>

<script>

import axios from 'axios';
import { Icon } from '@iconify/vue';
export default {
  name: 'LiveScoreApp',
  components: {
    Icon,
  },
  data() {
    return {
      // PLurl: 'https://api.football-data.org/v4/competitions/PL/matches',
      // SerieAUrl: `https://api.football-data.org/v4/competitions/SA/matches`,
      // BundesUrl: `https://api.football-data.org/v4/competitions/BL1/matches`,
      apiUrl: `https://api.football-data.org/v4/matches?competitions=2002,2019,2014,2015,2021`,


      //Gårdagens resultat https://api.football-data.org/v4/matches?competitions=2002,2019,2014,2015,2021&date=YESTERDAY
      //morgondagens matcher https://api.football-data.org/v4/matches?competitions=2002,2019,2014,2015,2021&date=TOMORRROW

      // Kommande matcher https://api.football-data.org/v4/teams/5890/matches?dateFrom=2023-04-16&dateTo=2023-04-30
      top5Leagues: ["Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue A"],
      otherLeagues: ["Allsvenskan"],
      selectedTop5League: '',
      selectedOtherLeague: '',
      teams: [],
      matchesToday: [],
      todaysDate: ''
    }
  },

  async mounted() {
    //this.getTodaysDate();
    await this.fetchApiData();
    await this.fetchTeams();
  },

  computed: {
  filteredMatches() {
    const selectedLeague = this.selectedTop5League || this.selectedOtherLeague;

    if (this.selectedTop5League === '' && this.selectedOtherLeague === '') {
      return this.matchesToday;
    } else {
      return [
        `<h1>${selectedLeague}</h1>`,
        ...this.matchesToday.filter(match => match.competition.name === selectedLeague),
      ];
    }
  }
},




  methods: {
    getTodaysDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      this.todaysDate = `${year}-${month}-${day}`;
    },

    getTime(match) {
      var time = match.utcDate.substring(11, 13);
      time = parseInt(time) + 2;
      return time + match.utcDate.substring(13, 16);
    },


    async fetchApiData() {
      const options = {
        headers: {
          'X-Auth-Token': `${process.env.VUE_APP_API_KEY}`
        },
        params: {
          season: 2022,
          dateFrom: this.todaysDate,
          dateTo: this.todaysDate
        }
      };

      try {
        const response = await axios.get(this.apiUrl, options);
        this.matchesToday = response.data.matches;
      } catch (error) {
        console.error(error.message);
      }
    },
    saveTeam(teamID, teamName) {
      const teamList = JSON.parse(localStorage.getItem('teamList')) || [];
      teamList.push({ teamID, teamName });
      localStorage.setItem('teamList', JSON.stringify(teamList));
    },

    async fetchTeams() {
      let leagueName;
      if (this.selectedTop5League !== '') {
        leagueName = this.selectedOtherLeague;
      } else {
        return;
      }

      const options = {
        headers: {
          'X-Auth-Token': `${process.env.VUE_APP_API_KEY}`
        },
        params: {
          areas: '2077',
          plan: 'TIER_ONE',
          name: leagueName
        }
      };
      try {
        const response = await axios.get(`https://api.football-data.org/v2/competitions/${leagueName}/teams`, options);
        console.log(response.data.teams);
      } catch (error) {
        console.error(error);
      }
    }
  


}


}
</script>


<style src="..\css\LiveScoreApp.css"></style>
