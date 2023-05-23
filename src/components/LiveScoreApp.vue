<template>
  <modal :show="showModal" :errorMessage="this.errorMessage" @close="showModal = false"> </modal>
  <div class="live">

    <div class="topMenu">
      <Icon class="dateIcon" v-if="state !== 'Yesterday'" icon="material-symbols:arrow-back-ios-new-rounded"
        @click="fetchApiData(state, 'back')" />
      {{ getTodaysDate2(state) }}
      <Icon class="dateIcon" v-if="state !== 'Tomorrow'" icon="material-symbols:arrow-forward-ios-rounded"
        @click="fetchApiData(state, 'forward')" />
    </div>

    <h1>{{ state }}'s matches:</h1>

    <div class="todaysMatches">
      <ul v-if="matchesToday.length > 0">
        <li class="match" v-for="match in matchesToday" :key="match.id">

          <p class="competition">{{ match.competition.name }}</p>

          <p class="time" v-if="match.status === 'FINISHED'"> {{ getTime(match) + ' CEST' }} - FULL TIME </p>
          <div class="time" v-else-if="match.status === 'IN_PLAY' && match.score.halfTime.home === null"> {{
            getTime(match)
            + ' CEST' }} - <p class="timeLive" id="inplay">LIVE</p> first half </div>
          <div class="time" v-else-if="match.status === 'IN_PLAY' && match.score.halfTime.home !== null"> {{
            getTime(match)
            + ' CEST' }} - <p class="timeLive" id="inplay">LIVE</p> second half </div>
          <p class="time" v-else-if="match.status === 'PAUSED'"> {{ getTime(match) + ' CEST' }} - HT </p>
          <p class="time" v-else-if="match.status === 'TIMED'"> {{ getTime(match) + ' CEST' }} </p>

          <p class="time" id="postponed" v-else-if="match.status === 'POSTPONED'"> POSTPONED</p>

          <div class="homeTeam">
            <v-btn outline @click="saveTeam(match.homeTeam)" color="black">
              <v-icon icon right>{{ getFavoriteIcon(match.homeTeam) }}</v-icon>
            </v-btn>
            <img v-bind:src="match.homeTeam.crest" class="crest" />
            {{ match.homeTeam.name }}
          </div>
          <div class="score">
            {{ match.score.fullTime.home }} - {{ match.score.fullTime.away }}
          </div>
          <div class="awayTeam">
            {{ match.awayTeam.name }}
            <img v-bind:src="match.awayTeam.crest" class="crest" />
            <v-btn outline @click="saveTeam(match.awayTeam)" color="black">
              <v-icon icon right>{{ getFavoriteIcon(match.awayTeam) }}</v-icon>
            </v-btn>
          </div>

        </li>
      </ul>
      <p v-else>No matches today</p>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import Modal from '@/components/Modal.vue'
import VIcon from 'vuetify';

var State = {
  Yesterday: "Yesterday",
  Today: "Today",
  Tomorrow: "Tomorrow"
}



export default {
  name: 'LiveScoreApp',
  components: {
    Modal,
    VIcon
  },

  data() {
    return {
      state: State.Today,
      apiUrl: `https://api.football-data.org/v4/matches?competitions=2001,2002,2019,2014,2015,2021`,
      apiUrlYesterday: `https://api.football-data.org/v4/matches?competitions=2001,2002,2019,2014,2015,2021&date=YESTERDAY`,
      apiUrlTomorrow: `https://api.football-data.org/v4/matches?competitions=2001,2002,2019,2014,2015,2021&date=TOMORROW`,
      matchesToday: [],
      todaysDate: '',
      errorMessage: "",
      showModal: false,
      favoriteTeams: [],
    }
  },

  async mounted() {
    await this.fetchApiData(this.apiUrl);
    this.favoriteTeams = JSON.parse(localStorage.getItem("teamList"));
  },


  methods: {

    getTodaysDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      this.todaysDate = `${year}-${month}-${day}`;
    },

    async getTeam() {
      return Promise.resolve().then(function () {
        return JSON.parse(localStorage.getItem("teamList"));
      });
    },

    getTodaysDate2(state) {
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
          dateFrom: this.todaysDate,
          dateTo: this.todaysDate
        }
      };

      try {
        var response = await axios.get(url, options);
        this.matchesToday = response.data.matches;

      } catch (error) {
        this.errorMessage = "Could not fetch API-data. The error was " + error.message;
        this.showModal = true;
        console.error(error.message);
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
      const isFavorite = this.favoriteTeams.some(favorite => favorite.id === team.id);
      // Return the appropriate icon based on whether it is a favorite or not
      return isFavorite ? 'mdi-star' : 'mdi-star-outline';
    },
  }
}


</script>

<style scoped src="..\css\LiveScoreApp.css"></style>
