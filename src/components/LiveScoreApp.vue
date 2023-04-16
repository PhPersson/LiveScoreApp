<template>
  <div class="live">

    <p>{{getTodaysDate}}</p>
    <h1>Today's matches:</h1>
    <ul>
    
      
      <li class="match" v-for="match in matchesToday" :key="match.id">
      
        <p class="time" v-if="match.status === 'FINISHED'"> {{ getTime(match) + ' CEST' }} -  FULL TIME  </p>
        <p class="time" v-if="match.status === 'IN_PLAY' && match.score.halfTime.home === null"> {{ getTime(match) + ' CEST' }} -  LIVE first half  </p>
        <p class="time" v-if="match.status === 'IN_PLAY' && match.score.halfTime.home !== null"> {{ getTime(match) + ' CEST' }} -  LIVE second half  </p>
        <p class="time" v-else-if="match.status === 'PAUSED'"> {{ getTime(match) + ' CEST' }} -  HT  </p>
        <p class="time" v-else-if="match.status === 'TIMED'"> {{ getTime(match) + ' CEST' }}  </p>

        <img v-bind:src="match.homeTeam.crest" class="crest" />
        <div class="homeTeam">
          {{ match.homeTeam.name }} <Icon icon="bx:football" @click="saveTeam(match.homeTeam.id, match.homeTeam.name)"/>
        </div>
        <div class="score">
          {{ match.score.fullTime.home }} - {{ match.score.fullTime.away }}
        </div>
        <div class="awayTeam">
          {{ match.awayTeam.name }} <Icon icon="bx:football" @click="saveTeam(match.awayTeam.id, match.awayTeam.name)"/>
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

      matchesToday: [],
      todaysDate: ''
    }
  },

  async mounted() {
    //this.getTodaysDate();

    await this.fetchApiData();
  },


  methods: {
    getTodaysDate(){
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      this.todaysDate = `${year}-${month}-${day}`;
    },

    getTime(match){
      var time = match.utcDate.substring(11,13)
      time = parseInt(time) + 2
      return time + match.utcDate.substring(13,16) ;
    },


    async fetchApiData(){
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
        console.error(error.message)
      }
  },
  saveTeam(teamID, teamName) {
      const teamList = JSON.parse(localStorage.getItem('teamList')) || [];
      teamList.push({teamID, teamName});
      localStorage.setItem('teamList', JSON.stringify(teamList));
    }
}


}
</script>


<style src="..\css\LiveScoreApp.css"></style>
