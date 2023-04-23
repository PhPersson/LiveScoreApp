<template>
  <div class="live">
    
    <div class="topMenu">
      <Icon class="dateIcon" v-if="state !== 'Yesterday'" icon="material-symbols:arrow-back-ios-new-rounded"
        @click="fetchApiData(state, 'back')" />
      {{ getTodaysDate2(state) }}
      <Icon class="dateIcon" v-if="state !== 'Tomorrow'" icon="material-symbols:arrow-forward-ios-rounded"
        @click="fetchApiData(state, 'forward')" />
    </div>

    <h1>{{ state }}'s matches:</h1>

    <div class="todaysMatches">

      <ul v-if="matchesToday.length > 0">
        <li class="match" v-for="match in matchesToday" :key="match.id">

          <p class="competition">{{ match.competition.name }}</p>

          <p class="time" v-if="match.status === 'FINISHED'"> {{ getTime(match) + ' CEST' }} - FULL TIME </p>
          <div class="time"  v-else-if="match.status === 'IN_PLAY' && match.score.halfTime.home === null"> {{
            getTime(match)
            + ' CEST' }} - <p class="timeLive" id="inplay" >LIVE</p> first half </div>
          <div class="time"  v-else-if="match.status === 'IN_PLAY' && match.score.halfTime.home !== null"> {{
            getTime(match)
            + ' CEST' }} - <p class="timeLive" id="inplay">LIVE</p> second half </div>
          <p class="time" v-else-if="match.status === 'PAUSED'"> {{ getTime(match) + ' CEST' }} - HT </p>
          <p class="time" v-else-if="match.status === 'TIMED'"> {{ getTime(match) + ' CEST' }} </p>

          <p class="time" id="postponed" v-else-if="match.status === 'POSTPONED'"> POSTPONED</p>

          <div class="homeTeam">
            <Icon class="faicon" icon="ic:outline-star-border"
              @click="saveTeam(match.homeTeam)" />
            <img v-bind:src="match.homeTeam.crest" class="crest" />
            {{ match.homeTeam.name }}
          </div>
          <div class="score">
            {{ match.score.fullTime.home }} - {{ match.score.fullTime.away }}
          </div>
          <div class="awayTeam">
            {{ match.awayTeam.name }}
            <img v-bind:src="match.awayTeam.crest" class="crest" />
            <Icon class="faicon" icon="ic:outline-star-border"
              @click="saveTeam(match.awayTeam)" />
          </div>

        </li>
      </ul>
      <p v-else>No matches today</p>
    </div>

  </div>

</template>

<script>

import axios from 'axios';
import { Icon } from '@iconify/vue';


var State = {
  Yesterday: "Yesterday",
  Today: "Today",
  Tomorrow: "Tomorrow"
}

export default {
  name: 'LiveScoreApp',
  components: {
    Icon,
  },

  data() {
    return {
      state: State.Today,
      apiUrl: `https://api.football-data.org/v4/matches?competitions=2001,2002,2019,2014,2015,2021`,
      apiUrlYesterday: `https://api.football-data.org/v4/matches?competitions=2001,2002,2019,2014,2015,2021&date=YESTERDAY`,
      apiUrlTomorrow: `https://api.football-data.org/v4/matches?competitions=2001,2002,2019,2014,2015,2021&date=TOMORROW`,
      apiUrlFav1: `https://api.football-data.org/v4/teams/`,
      apiUrlFav2: `/matches?dateFrom=2023-04-16&dateTo=2023-04-30`,


      //Gårdagens resultat https://api.football-data.org/v4/matches?competitions=2002,2019,2014,2015,2021&date=YESTERDAY
      //morgondagens matcher https://api.football-data.org/v4/matches?competitions=2002,2019,2014,2015,2021&date=TOMORRROW

      //Specifikt team matcher https://api.football-data.org/v4/teams/99/matches?dateFrom=2023-04-16&dateTo=2023-04-30

      // Kommande matcher https://api.football-data.org/v4/teams/5890/matches?dateFrom=2023-04-16&dateTo=2023-04-30
      teams: [],
      matchesToday: [],
      todaysDate: '',
      errorMessage: "",
    }
  },

  async mounted() {
    await this.fetchApiData(this.apiUrl);
  },


  methods: {
    getTodaysDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      this.todaysDate = `${year}-${month}-${day}`;
    },

    async getTeam() {

      return Promise.resolve().then(function () {
        return JSON.parse(localStorage.getItem("teamList"));
      });
    },

    getTodaysDate2(state) {
      var d;
      if (state == State.Today) {
        d = new Date().toLocaleDateString("en-UK").replace(/\//g, '-');
      } else if (state == State.Yesterday) {
        d = new Date();
        d.setDate(d.getDate() - 1);
        d = d.toLocaleDateString("en-UK").replace(/\//g, '-');
      } else {
        d = new Date();
        d.setDate(d.getDate() + 1);
        d = d.toLocaleDateString("en-UK").replace(/\//g, '-');
      }
      return d;
    },

    getTime(match) {
      var time = match.utcDate.substring(11, 13)
      time = parseInt(time) + 2
      return time + match.utcDate.substring(13, 16);
    },

    async fetchApiData(state, dir) {

      var url;

      if (state == State.Today && dir == 'back') {
        url = this.apiUrlYesterday;
        this.state = State.Yesterday;
      } else if (state == State.Today && dir == 'forward') {
        url = this.apiUrlTomorrow;
        this.state = State.Tomorrow;
      } else {
        url = this.apiUrl;
        this.state = State.Today;
      }
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
        const response = await axios.get(url, options);
        this.matchesToday = response.data.matches;
        console.log(response.data);

      } catch (error) {
        console.error(error.message);
      }
    },


    saveTeam(team) {
      var teamList = JSON.parse(localStorage.getItem('teamList')) || [];

      // Check if the team already exists in the list
      var teamExists = false;
      for (var i = 0; i < teamList.length; i++) {
        if (teamList[i].id === team.id) {
          teamExists = true;
          break;
        }
      }

      // Check if there is room to add the team
      if (teamList.length >= 9) {
        this.errorMessage = "Max " + 9 + " teams allowed as favorites";
        alert(this.errorMessage);
      }
      // Check if the team already exists in the list
      else if (teamExists) {
        this.errorMessage = "Team already exists in favorites";
        alert(this.errorMessage);
      } 
      // Add the team to the list
      else {
        teamList.push(team);
        localStorage.setItem('teamList', JSON.stringify(teamList));
      }
    },

  }
}
</script>

<style src="..\css\LiveScoreApp.css"></style>
