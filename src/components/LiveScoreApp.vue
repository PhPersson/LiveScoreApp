<template>
  <div>
    <p>Today's matches:</p>
    <ul>
      <li v-for="match in matchesToday" :key="match.id">

        {{ match.homeTeam.name }} 
        <div class="score"> {{ match.score.fullTime.home }} - {{ match.score.fullTime.away }} </div>
       
        
        {{ match.awayTeam.name }}
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
      awayTeams: [],
      homeTeams: [],
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


    fetchApiData(){
      const url = this.PLurl;
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

      axios.get(url, options)
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
ul {
  list-style-type: none;
  padding: 0;
}
li {
  font-size: large;
  display: inline-block;
  margin: 0 10px;
  list-style: none;
  display: block;
}
a {
  color: #42b983;
}
.score {

  font-style: italic;
  display:inline-block;
}
</style>
