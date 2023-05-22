<template>
  <modal :show="showModal"  :errorMessage="this.errorMessage" @close="showModal = false"> </modal>
    <div class="live">
      <ul v-if="favTeams.length > 0">
        <h2  class="usersFav">Your favorites</h2>
        <div class="favoritesTeams">
          <li class="favTeams" v-for="fav in favTeams" :key="fav.id">
            <p class="favTeamsName"> <img v-bind:src="fav.crest" class="teamLogo" /> {{ fav.name }}</p>
              <Icon class="deleteIcon" icon="iwwa:delete" @click="this.deleteFavoriteTeam(fav)" />
          </li>
        </div>
      </ul>
      <h2 class="usersFav" v-else>You dont have any favorites!</h2>

    <hr>
    <h3  class="usersFav">Your favorite team's matches</h3>

      
      <div class="favoritesfavTeamsMatchesToday">
        <ul v-if="favTeamsMatchesToday != 0">
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
            <p class="time" v-else-if="match.status === 'TIMED'"> {{ formatFavTime(match.utcDate) }} {{ getTime(match) }} CEST</p>
  
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
import Modal from '@/components/Modal.vue'
  
export default {
  name: 'LiveScoreAppFavorites',
  components: {
    Icon,
    Modal,
  },

  
  data() {
    return {
      apiUrlFav1: `https://api.football-data.org/v4/teams/`,
      favTeams: [],
      favTeamsMatchesToday: [],
      todaysDate: '',
      showModal: false,
      errorMessage: "",
    }
  },

  async mounted() {
    this.getFavoriteTeams();
    this.getTodaysDate();
    this.getFavMatches()
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
      if(this.favTeams != null) {         
        this.favTeams.forEach(element => {
            this.fetchApiDataFav(this.apiUrlFav1, element.id)
        });
      }
    },

    deleteFavoriteTeam(teamToRemove) {
      var teamIndex = this.favTeams.findIndex((item) => item.id === teamToRemove.id);
      var matchIdIndex = this.favTeamsMatchesToday.findIndex((matchIdIndex) => matchIdIndex.awayTeam.id === teamToRemove.id || matchIdIndex.homeTeam.id === teamToRemove.id );

      if (teamIndex !== -1 ) {
        this.favTeams.splice(teamIndex, 1);
        localStorage.setItem('teamList', JSON.stringify(this.favTeams));
        this.getFavoriteTeams();
      }
      if (matchIdIndex !== -1) {
        this.favTeamsMatchesToday.splice(matchIdIndex,1);
      }
    },

    formatFavTime(matchTime){
      return matchTime.substring(0, 10)
    },

    getTime(match) {
      var time = match.utcDate.substring(11, 13)
      time = parseInt(time) + 2
      return time + match.utcDate.substring(13, 16);
    },
    
    async fetchApiDataFav(url, fav) { //Hantera om favoriter är null

      var options = {
          headers: {
              'X-Auth-Token': `${process.env.VUE_APP_API_KEY}`
            },
          params: {
            dateFrom: this.todaysDate,
            dateTo: "2023-12-31"
          }
      };
          url = url + fav + "/matches";
        try {
          var response = await axios.get(url, options);
          if (response.status === 429) {
            this.errorMessage = "Too many API calls. Please try again in a short while.";
            this.showModal = true;
            setTimeout(() => {
                this.showModal = false;
            }, 4000);
            return;
          }
          this.favTeamsMatchesToday.push(response.data.matches[0])
        } catch (error) {
          this.errorMessage = error.message;
          this.showModal = true;
          setTimeout(() => {
                this.showModal = false;
          }, 4000);
          console.error(error.message);
        }
    },

  }
}

</script>