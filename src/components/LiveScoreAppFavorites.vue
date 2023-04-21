<template>
    <div class="fav-live">
    

        <ul v-if="this.favTeams != 0">
          <h2 id="usersFav">Your favorites</h2>
          <div class="favoritesTeams">
            <li class="favTeams" v-for="fav in favTeams" :key="fav.id">
              <p class="favTeamsName"> <img v-bind:src="fav.team.crest" class="teamLogo" /> {{ fav.team.name }}</p>
                <Icon class="deleteIcon" icon="iwwa:delete" @click="this.deleteFavoriteTeam(fav.team)" />
            </li>
          </div>
        </ul>
        <h2 class="no-fav" v-else>U dont have any favorites yet!</h2>





      <div class="favoritesfavTeamsMatchesToday">
        <ul v-if="favTeams.length != 0">
          <li class="match" v-for="match in favTeamsMatchesToday" :key="match.id">
  
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
      </div>
  
    </div>
</template>
  
  <script>
  
  import axios from 'axios';
  import { Icon } from '@iconify/vue';
  
  
  export default {
    name: 'LiveScoreAppFavorites',
    components: {
      Icon,
    },
  
    data() {
      return {
        apiUrlFav1: `https://api.football-data.org/v4/teams/`,
        apiUrlFav2: `/matches?dateFrom=2023-04-21&dateTo=2023-04-24`,
        favTeams: [],
        favTeamsMatchesToday: [],
        todaysDate: ''
      }
    },
  
    async mounted() {
      this.getFavoriteTeams();

      this.getFavMatches()
      // this.fetchApiDataFav(this.apiUrlFav1, this.apiUrlFav2, this.favTeams[0].team.id)
    },
  
  
    methods: {
      getTodaysDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        this.todaysDate = `${year}-${month}-${day}`;
      },
  
    getFavoriteTeams() {
        this.favTeams = JSON.parse(localStorage.getItem("teamList"));
    },

      getFavMatches() {
      this.favTeams.forEach(element => {
        console.log(element.team.id);
         this.fetchApiDataFav(this.apiUrlFav1, this.apiUrlFav2, element.team.id)
      });
      
    },

    deleteFavoriteTeam(teamToRemove) {
      const index = this.favTeams.findIndex((item) => item.team === teamToRemove);

      // Ta bort laget om det hittades
      if (index !== -1) {
        this.favTeams.splice(index, 1);

        // Uppdatera localStorage med den nya arrayen
        localStorage.setItem('teamList', JSON.stringify(this.favTeams));
        this.getFavoriteTeams();
      }
    },
  
    getTime(match) {
      var time = match.utcDate.substring(11, 13)
      time = parseInt(time) + 2
      return time + match.utcDate.substring(13, 16);
    },
  



 async fetchApiDataFav(url, url2, fav) { //Hantera om favoriter är null


  var options = {
      headers: {
          'X-Auth-Token': `${process.env.VUE_APP_API_KEY}`
        },
      params: {

        }
      };
        url = url + fav + url2;
      
    try {
      var response = await axios.get(url, options);
      this.favTeamsMatchesToday.push(response.data.matches[0])
      console.log(this.favTeamsMatchesToday);
    } catch (error) {
      console.error(error.message);
    }



  },

}
  }
  

</script>