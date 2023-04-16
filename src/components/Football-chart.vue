<template>
  <div class="hello">
   <h1>Hej!</h1>
  </div>
</template>

<script>

import axios from 'axios';


export default {
  name: 'FootballChart',

  data() {
  },

  mounted() {
    this.fetchApiData();
  },


  methods: {
    fetchApiData(){
      const url = 'https://api.football-data.org/v4/competitions/PL/matches?season=2022&dateFrom=2023-04-16&dateTo=2023-04-16';
      const options = {
        headers: {
          'X-Auth-Token': `${process.env.VUE_APP_API_KEY}`
        }
      };
      axios.get(url, options)
        .then(response => {
          console.log(response.data.matches[1].awayTeam);
        })
        .catch(error => {
          console.error(error.message);
        });


  }
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
