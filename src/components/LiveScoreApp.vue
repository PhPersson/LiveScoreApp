<template>
  <div class="live">


    <h1>Today's matches:</h1>
    <ul>
    
      
      <li class="match" v-for="match in matchesToday" :key="match.id">
        <p class="time" v-if="match.status === 'FINISHED'"> {{ match.utcDate.substring(11,16) }} -  FULL TIME  </p>
        <p class="time" v-if="match.status === 'IN_PLAY'"> {{ match.utcDate.substring(11,16) }} -  LIVE  </p>
        <p class="time" v-else-if="match.status === 'PAUSED'"> {{ match.utcDate.substring(11,16) }} -  HT  </p>
        <p class="time" v-else-if="match.status === 'TIMED'"> {{ match.utcDate.substring(11,16) }}  </p>


      <div class="homeTeam">
        <img v-bind:src="match.homeTeam.crest" class="crest">
        {{ match.homeTeam.name }} <Icon icon="openmoji:soccer-ball" @click="saveTeam(match.homeTeam.id, match.homeTeam.name)"/>
      </div>
      
      <div class="score"> 
        {{ match.score.fullTime.home }} - {{ match.score.fullTime.away }} 
      </div>
      
      <div class="awayTeam">
        {{ match.awayTeam.name }}
        {{ match.awayTeam.name }} <Icon icon="openmoji:soccer-ball" @click="saveTeam(match.awayTeam.id, match.awayTeam.name)"/>
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
      testUrl: `https://api.football-data.org/v4/matches?competitions=2002,2019,2014,2015,2021`,


      //Gårdagens resultat https://api.football-data.org/v4/matches?competitions=2002,2019,2014,2015,2021&date=YESTERDAY
      //morgondagens matcher https://api.football-data.org/v4/matches?competitions=2002,2019,2014,2015,2021&date=TOMORRROW

      // awayTeams: [],
      // homeTeams: [],
      matchesToday: [],
      todaysDate: ''
    }
  },

  mounted() {
    this.getTodaysDate();
    this.fetchApiData();
  },


  methods: {
    getTodaysDate(){
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      this.todaysDate = `${year}-${month}-${day}`;
    },


    async fetchApiData() {
      const url = this.testUrl;

      const options = {
        headers: {
          'X-Auth-Token': `${process.env.VUE_APP_API_KEY}`,
        },
        params: {
          season: 2022,
          dateFrom: this.todaysDate,
          dateTo: this.todaysDate,
        },
      };

      try {
        const response = await axios.get(url, options);
        this.matchesToday = response.data.matches;
      }
      catch (error){
        console.error(error);
      }
  },

    // handleAwayTeams(matches) { //Tar in alla matcher som indata-parameter
    //   matches.forEach(match => {
    //     this.awayTeams.push(match.awayTeam)
    //   });

    //   // this.awayTeams.forEach(element => {
    //   //   console.log(element);
    //   // });
    // },

    // handleHomeTeams(matches) { //Tar in alla matcher som indata-parameter
    //   matches.forEach(match => {
    //     this.homeTeams.push(match.homeTeam);
    //   });

    // },
}


}
</script>


<style src="..\css\LiveScoreApp.css"></style>
