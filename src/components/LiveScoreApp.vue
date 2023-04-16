<template>
  <div>
    <h1>Dagens matcher: {{ this.todaysDate }}</h1>
    <ul>
      <li v-for="match in matchesToday" :key="match.id">
        {{ match.homeTeam.name }} mot {{ match.awayTeam.name }}
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
      serie: `PL`, //SA = Serie A, PD = LaLiga, PL=Pre
      awayTeams: [],
      homeTeams: [],
      matchesToday: [],
      todaysDate: ''
    }
  },

  mounted() {
    // resten av koden för att hämta data från API-tjänsten
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
      let apiUrl =  `https://api.football-data.org/v4/competitions/${this.serie}/matches`
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
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
