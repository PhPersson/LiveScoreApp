<template>
  <modal :show="showModal" :errorMessage="this.errorMessage" @close="showModal = false"> </modal>
  <div class="live">

    <div class="topMenu">
      <v-icon id="dateIcon" v-if="state !== 'Yesterday'" @click="fetchApiData(state, 'back')" icon right>{{ iconLeft }}</v-icon>
      {{ getTodaysDate(state) }}
      <v-icon id="dateIcon" v-if="state !== 'Tomorrow'" @click="fetchApiData(state, 'forward')" icon right>{{ iconRight }}</v-icon>
    </div>

    <h1>{{ state }}'s matches:</h1>

    <div class="todaysMatches">
      <loading-spinner v-if="isLoading"></loading-spinner>

      <ul v-if="matchesToday.length > 0">
        <li class="match" v-for="match in matchesToday" :key="match.id">

          <p class="competition">{{ match.competition.name }}</p>

          <p class="time" v-if="match.status === 'FINISHED'"> {{ getTime(match) + ' CEST' }} - FULL TIME </p>
          <div class="time" v-else-if="match.status === 'IN_PLAY' && match.score.halfTime.home === null"> {{getTime(match) + ' CEST' }} - 
            <p class="timeLive" id="inplay">LIVE</p> first half 
          </div>
          <div class="time" v-else-if="match.status === 'IN_PLAY' && match.score.halfTime.home !== null"> {{getTime(match) + ' CEST' }} - 
            <p class="timeLive" id="inplay">LIVE</p> second half 
          </div>
          <p class="time" v-else-if="match.status === 'PAUSED'"> {{ getTime(match) + ' CEST' }} - HT </p>
          <p class="time" v-else-if="match.status === 'TIMED'"> {{ getTime(match) + ' CEST' }} </p>

          <p class="time" id="postponed" v-else-if="match.status === 'POSTPONED'"> POSTPONED</p>

          <div class="homeTeam">
            <v-btn variant="plain" @click="saveTeam(match.homeTeam)">
              <v-icon icon right>{{ getFavoriteIcon(match.homeTeam) }}</v-icon>
            </v-btn>
            <img v-bind:src="match.homeTeam.crest" class="crest" />
            {{ match.homeTeam.name + " " }}
          </div>
          <div class="score">
            {{ match.score.fullTime.home }} - {{ match.score.fullTime.away }}
          </div>
          <div class="awayTeam">
            {{" " + match.awayTeam.name }}
            <img v-bind:src="match.awayTeam.crest" class="crest" />
            <v-btn variant="plain" @click="saveTeam(match.awayTeam)">
              <v-icon icon right>{{ getFavoriteIcon(match.awayTeam) }}</v-icon>
            </v-btn>
          </div>

        </li>
      </ul>
      <p class="loading" v-else-if="isLoading">Loading...</p> <!-- Show loading message while data is being fetched from the API-->

      <p class="noMatches" v-else>No matches today</p> <!-- If matchesToday is empty, show an errortext-->
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import Modal from '@/components/Modal.vue'
import VIcon from 'vuetify';
import LoadingSpinner from './Loading-Spinner.vue';

var State = {
  Yesterday: "Yesterday",
  Today: "Today",
  Tomorrow: "Tomorrow"
}

export default {
  name: 'LiveScoreApp',
  components: {
    Modal,
    VIcon,
    LoadingSpinner
  },

  data() {
    return {
      state: State.Today,
      apiUrl: 'https://corsproxy.io/?' + encodeURIComponent('https://api.football-data.org/v4/matches?competitions=2001,2002,2019,2014,2015,2021'),
      apiUrlYesterday: 'https://corsproxy.io/?' + encodeURIComponent('https://api.football-data.org/v4/matches?competitions=2001,2002,2019,2014,2015,2021&date=YESTERDAY'),
      apiUrlTomorrow: 'https://corsproxy.io/?' + encodeURIComponent('https://api.football-data.org/v4/matches?competitions=2001,2002,2019,2014,2015,2021&date=TOMORROW'),
      matchesToday: [],
      errorMessage: "",
      showModal: false,
      favoriteTeams: [],
      iconLeft: 'mdi-chevron-left',
      iconRight: 'mdi-chevron-right',
      isLoading: false,
    }
  },

  async mounted() {
    await this.fetchApiData(this.apiUrl);
    this.favoriteTeams = this.getFavoriteTeams();
  },

  methods: {

    getFavoriteTeams() {
      return JSON.parse(localStorage.getItem("teamList"));
    },

    getTodaysDate(state) {
      var date;
      if (state == State.Today) {
        date = new Date().toLocaleDateString("en-UK").replace(/\//g, '-');
      } else if (state == State.Yesterday) {
        date = new Date();
        date.setDate(date.getDate() - 1);
        date = date.toLocaleDateString("en-UK").replace(/\//g, '-');
      } else {
        date = new Date();
        date.setDate(date.getDate() + 1);
        date = date.toLocaleDateString("en-UK").replace(/\//g, '-');
      }
      return date;
    },

    getTime(match) {
      var time = match.utcDate.substring(11, 13)
      time = parseInt(time) + 2
      return time + match.utcDate.substring(13, 16);
    },

    async fetchApiData(state, dir) {
      this.isLoading = true;

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
        }
      };

      try {    
        var response = await axios.get(url, options);
        this.matchesToday = response.data.matches;

      } catch (error) {
        if (error.response && error.response.status === 429) {
          this.errorMessage = "Too many API calls. Please try again in a short while.";
          this.showModal = true;
          setTimeout(() => {
            this.showModal = false;
          }, 4000);
        }
        console.error(error);
        this.errorMessage = error.message + ' See the log for more information';
        this.showModal = true;
      }
      finally {
        // Set the loading state to false after the API call is complete
        this.isLoading = false;
      }
    },


    saveTeam(team) {
      var teamList = JSON.parse(localStorage.getItem('teamList')) || [];

      // Check if there is room to add the team
      if (teamList.length >= 9) {
        this.errorMessage = "Max 9 teams allowed as favorites";
        this.showModal = true;
        setTimeout(() => {
          this.showModal = false;
        }, 4000);
      }
      var teamExists = false;
      var teamId = 0;
      teamList.forEach(teamInList => {
        if (teamInList.id === team.id) {
          teamExists = true;
          teamId = teamInList.id;
          return;
        }
      });
      // Check if the team already exists in the list
      // if the team exits, remove it
      if (teamExists) {
        var teamIndex = teamList.findIndex((item) => item.id === team.id);
        teamList.splice(teamIndex, 1);
        localStorage.setItem('teamList', JSON.stringify(teamList));
        this.errorMessage = `Removed ${team.name} as favorite`;
        this.showModal = true;
        setTimeout(() => {
          this.showModal = false;
        }, 2500);
      }

      // Add the team to the list of favorites
      else {
        teamList.push(team);
        localStorage.setItem('teamList', JSON.stringify(teamList));
        this.errorMessage = `Added ${team.name} to favorites`;
        this.showModal = true;
        setTimeout(() => {
          this.showModal = false;
        }, 2500);
      }
      this.favoriteTeams = teamList;
    },

    getFavoriteIcon(team) {
      // Check if the team is already marked as a favorite
      let isFavorite = null;
      if(this.favoriteTeams != null){
        isFavorite = this.favoriteTeams.some(favorite => favorite.id === team.id);
      }
      // Return the appropriate icon based on whether it is a favorite or not
      return isFavorite ? 'mdi-star' : 'mdi-star-outline';
    }, 
  }
}

</script>

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
  display: inline-block;
  margin: 10px 10px;
  list-style: none;
  display: block;
}

li.match {
    font-size: 1.5vw;
}


.live{
  background-color: white;
  min-height: 90vh;
}

.topMenu {
  font-size: 25px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  text-align: center;
  padding-top: 5%;
}

.todaysMatches {
  text-align: center;
}

.match {
  background-color: rgb(68 145 111);
  color: aliceblue;
  margin-left: 15%;
  margin-right: 15%;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1rem;
  padding-bottom: 2rem;
  border-radius: 10px;
  text-align: center;
  transition: transform 0.5s ease;
  animation: fade-in 1s ease;
}

.match:hover {
  transform: translateY(-5px);
}

.time{
  color: white;
  text-align: center;
}

.homeTeam ,.awayTeam {
  display: inline;
  text-align: center;
}

.score {
  color: red;
  font-size: 2.4vw;
  display: inline-block;
  text-align: center;
  margin-right: auto;
  margin-left: auto;
}
  
.loading, .noMatches
{
    color: red;
    text-align: center;
}

#postponed {
  font-style: italic;
  color: red;
}

.timeLive {
    text-align: center;
    display: inline-block;
    animation: pulsate 2s ease-in-out infinite;
}
@keyframes pulsate {
    0% {
      background-color: green;
    }
    50% {
      background-color: transparent;
    }
    100% {
      background-color: green;
    }
  }


.crest{
    vertical-align: super;
    margin-left: auto;
    margin-right: auto;
    width: 7%;
    margin-bottom: -20px;
    padding:1%;
    background-color: whitesmoke;
    border-radius: 25px;
}

#dateIcon:hover {
  color: grey;
  cursor: pointer;
}

i.mdi-star.mdi.v-icon.notranslate.v-theme--light.v-icon--size-default {
    color: yellow;
}


@media only screen and (max-width: 600px) {

li.match {
  margin-left: 1%;
  margin-right: 1%;
      font-size: 2.8vw;

}
.score {
  font-size: 3vw;
}

img.crest {
  display: none;
}


li.match {
  padding: 0 !important;
  padding-bottom: 10px !important;
  padding-top: 10px !important;
}
}

</style>

