<template>
  <div class="hello">
   <h1>Hej!</h1>
   <ol>
   <li v-for="team in awayTeams" v-bind:key="team.id">{{ team.name }}</li>
  </ol>
  </div>
</template>

<script>

import axios from 'axios';


export default {
  name: 'FootballChart',

  data() {
    return {
      PLurl: 'https://api.football-data.org/v4/competitions/PL/matches?season=2022&dateFrom=2023-04-16&dateTo=2023-04-16',
      awayTeams: [],
      homeTeams: [],
    }
  },

  mounted() {
    this.fetchApiData();
  },


  methods: {
    fetchApiData(){
      const url = this.PLurl;
      const options = {
        headers: {
          'X-Auth-Token': `${process.env.VUE_APP_API_KEY}`
        }
      };
      axios.get(url, options)
        .then(response => {
          this.handleAwayTeams(response.data.matches);
          this.handleHomeTeams(response.data.matches);
        })
        .catch(error => {
          console.error(error.message);
        });
  },

    handleAwayTeams(matches) { //Tar in alla matcher som indata-parameter
      matches.forEach(match => {
        this.awayTeams.push(match.awayTeam)
      });

      this.awayTeams.forEach(element => {
        console.log(element);
      });
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
