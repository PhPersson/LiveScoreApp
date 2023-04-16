<template>
  <div class="live">

    <p>{{getTodaysDate}}</p>
    <h1>Today's matches:</h1>
    <ul>
    
      
      <li class="match" v-for="match in matchesToday" :key="match.id">
        


        <p class="time" v-if="match.status === 'FINISHED'"> {{ match.utcDate.substring(11,16) }} -  FULL TIME  </p>
        <p class="time" v-if="match.status === 'IN_PLAY'"> {{ match.utcDate.substring(11,16) }} -  LIVE  </p>
        <p class="time" v-else-if="match.status === 'PAUSED'"> {{ match.utcDate.substring(11,16) }} -  HT  </p>
        <p class="time" v-else-if="match.status === 'TIMED'"> {{ match.utcDate.substring(11,16) }}  </p>




       <img v-bind:src="match.homeTeam.crest" class="crest">


        {{ match.homeTeam.name }} 

        <div class="score"> {{ match.score.fullTime.home }} - {{ match.score.fullTime.away }} </div>

        {{ match.awayTeam.name }}

        <img v-bind:src="match.awayTeam.crest" class="crest">


      </li>
    </ul>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'LiveScoreApp',
  data() {
    return {
      PLurl: 'https://api.football-data.org/v4/competitions/PL/matches',
      SerieAUrl: `https://api.football-data.org/v4/competitions/SA/matches`,
      BundesUrl: `https://api.football-data.org/v4/competitions/BL1/matches`,
      testUrl: `https://api.football-data.org/v4/matches?competitions=2002,2019,2014,2015,2021`,


      //Gårdagens resultat https://api.football-data.org/v4/matches?competitions=2002,2019,2014,2015,2021&date=YESTERDAY
      //morgondagens matcher https://api.football-data.org/v4/matches?competitions=2002,2019,2014,2015,2021&date=TOMORRROW


      awayTeams: [],
      homeTeams: [],
      matchesToday: [],
      todaysDate: ''
    }
  },

  mounted() {
    //this.getTodaysDate();

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


    fetchApiData(){
      const url = this.testUrl;

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

      axios.get(apiUrl, options)
        .then(response => {
          this.handleAwayTeams(response.data.matches);
          this.handleHomeTeams(response.data.matches);
          this.matchesToday = response.data.matches;
          console.log(response.data.matches);
        })
        .catch(error => {
          console.error(error.message);
        });
  },

    handleAwayTeams(matches) { //Tar in alla matcher som indata-parameter
      matches.forEach(match => {
        this.awayTeams.push(match.awayTeam)
      });

      // this.awayTeams.forEach(element => {
      //   console.log(element);
      // });
    },

    handleHomeTeams(matches) { //Tar in alla matcher som indata-parameter
      matches.forEach(match => {
        this.homeTeams.push(match.homeTeam);
      });

    },
}


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
  text-align: center;
}
a {
  color: #42b983;
}
.score {

  color: red;
  font-size: larger;
  display: inline-block;
  text-align: center;
  margin-right: auto;
  margin-left: auto;


}

.match{
  background-color: rgb(0, 0, 0);
  color: aliceblue;
  margin-left: 20%;
  margin-right: 20%;

  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1rem;
  padding-bottom: 2rem;
  border-radius: 8px;


}

.crest{

  display: inline;
  margin-left: auto;
  margin-right: auto;
  width: 7%;
  margin-bottom: -20px;

}

p{
  color: aliceblue;
}

.time{
  color: white;
  text-align: center;
  
}
</style>
