<template>
  <modal :show="showModal" :errorMessage="this.errorMessage" @close="showModal = false"> </modal>
<div class="teamInfo" >
    <h1>{{ teamInfo.name }}</h1>
    <img :src="teamInfo.crest" :alt="teamInfo.name + ' Crest'" />
    <p>Add favorite</p>
     <v-btn outline @click="saveTeam(teamInfo)" color="white">
                            <v-icon icon right>{{ getFavoriteIcon(teamInfo) }}</v-icon>
                        </v-btn>
</div>


<h1> Last 3 games </h1>

  <div class="favoritesfavTeamsMatchesToday">
      <ul v-if="playedGames != 0">
        <li class="match" v-for="match in playedGames" :key="match.id">

          <p class="competition">{{ match.competition.name }}</p>

          <p class="time" v-if="match.status === 'FINISHED'"> {{ formatFavTime(match.utcDate) }} {{ getTime(match) + ' CEST' }} - FULL TIME </p>

          <div class="homeTeam">
            <img v-bind:src="match.homeTeam.crest" class="crest" />
            {{ match.homeTeam.name + " " }}
          </div>
          <div class="score">
            {{ match.score.fullTime.home }} - {{ match.score.fullTime.away }}
          </div>
          <div class="awayTeam">
            {{ " " +  match.awayTeam.name }}
            <img v-bind:src="match.awayTeam.crest" class="crest" />
          </div>

        </li>
      </ul>
      <p class="noMatches" v-else>No played games</p>
    </div>


    <h1> Upcoming games </h1>

    <div class="favoritesfavTeamsMatchesToday">
      <ul v-if="upcomingMatches != 0">
        <li class="match" v-for="match in upcomingMatches" :key="match.id">

          <p class="competition">{{ match.competition.name }}</p>

          <p class="time" v-if="match.status === 'FINISHED'"> {{ getTime(match) + ' CEST' }} - FULL TIME </p>
          <div class="time" v-else-if="match.status === 'IN_PLAY' && match.score.halfTime.home === null"> {{
            getTime(match)
            + ' CEST' }} - <p class="timeLive">LIVE</p> first half </div>
          <div class="time" v-else-if="match.status === 'IN_PLAY' && match.score.halfTime.home !== null"> {{
            getTime(match)
            + ' CEST' }} - <p class="timeLive">LIVE</p> second half </div>
          <p class="time" v-else-if="match.status === 'PAUSED'"> {{ getTime(match) + ' CEST' }} - HT </p>
          <p class="time" v-else-if="match.status === 'TIMED' || match.status === 'SCHEDULED'"> {{ formatFavTime(match.utcDate) }} {{ getTime(match) }}
            CEST</p>

          <div class="homeTeam">
            <img v-bind:src="match.homeTeam.crest" class="crest" />
            {{ match.homeTeam.name + " " }}
          </div>
          <div class="score">
            {{ match.score.fullTime.home }} - {{ match.score.fullTime.away }}
          </div>
          <div class="awayTeam">
            {{ " " +  match.awayTeam.name }}
            <img v-bind:src="match.awayTeam.crest" class="crest" />
          </div>

        </li>
      </ul>
      <p class="noMatches" v-else>No upcoming games</p>
    </div>

</template>
  
  
<script>
import axios from 'axios';
import Modal from '@/components/Modal.vue'
export default {
    name: 'App',
    components: {
      Modal,
    },
    data() {
        return {
            team: this.$route.params.id,
            teamInfo: [],
            upcomingMatches: [],
            playedGames: [],
            todaysDate: '',
            favoriteTeams: [],
            errorMessage: "",
            showModal: false,
        }
    },
    
    watch: {
    '$route.params.id': {
    immediate: true,
    handler(newTeam, oldTeam) {
        this.fetchApiData();
        this.getTodaysDate();
        this.fetchApiDataFav();
        this.fetchApiDataPlayed();
        this.favoriteTeams = JSON.parse(localStorage.getItem("teamList"));

    }
  }
},

    methods: {
      formatFavTime(matchTime) {
      return matchTime.substring(0, 10)
    },
      saveTeam(team) {
      var teamList = JSON.parse(localStorage.getItem('teamList')) || [];

      //   Check if the team already exists in the list
      var teamExists = false;

      teamList.forEach(teamToFind => {
          if (teamToFind.id === team.id) {
              teamExists = true;
          }
      });
      // Check if there is room to add the team
      if (teamList.length >= 9) {
          this.errorMessage = "Max " + 9 + " teams allowed as favorites";
          this.showModal = true;
          setTimeout(() => {
              this.showModal = false;
          }, 4000);
          return;
      }
      // Check if the team already exists in the list
      else if (teamExists) {
          var teamIndex = teamList.findIndex((item) => item.id === team.id);
          teamList.splice(teamIndex, 1);
          localStorage.setItem('teamList', JSON.stringify(teamList));
          this.errorMessage = `Removed ${team.name} as favorite`;
          this.showModal = true;
          setTimeout(() => {
              this.showModal = false;
          }, 2500);
      }
      // Add the team to the list
      else {
          teamList.push(team);
          localStorage.setItem('teamList', JSON.stringify(teamList));
          this.errorMessage = `Added ${team.name} as favorite`;
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

        formatFavTime(matchTime) {
      return matchTime.substring(0, 10)
    },

    getTime(match) {
      var time = match.utcDate.substring(11, 13)
      time = parseInt(time) + 2
      return time + match.utcDate.substring(13, 16);
    },

    



    getTodaysDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      this.todaysDate = `${year}-${month}-${day}`;
    },

    getPreviousDay() {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 1);
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    async fetchApiData() {
      this.teamInfo = [];
      const team = this.$route.params.id;
      const options = {
        headers: {
            'X-Auth-Token': `${process.env.VUE_APP_API_KEY}`
        },
      };
        const url = `https://api.football-data.org/v4/teams/${team}`;

        try {
            const response = await axios.get(url, options);
            const { crest, id, name, shortName, tla } = response.data;
        this.teamInfo = {
          id,
          name,
          shortName,
          tla,
          crest
        };
        } catch (error) {
            console.error(error.message);
        }
        },

    async fetchApiDataFav() {
      this.upcomingMatches = [];
      var options = {
      headers: {
        'X-Auth-Token': `${process.env.VUE_APP_API_KEY}`
      },
      params: {
        dateFrom: this.todaysDate,
        dateTo: "2023-12-31"
      }
    };
    const url = "https://api.football-data.org/v4/teams/" + this.$route.params.id + "/matches";
  try {
    var response = await axios.get(url, options);

    if (response.data.matches !== undefined && response.data.matches.length > 0) {
        this.upcomingMatches.push(...response.data.matches);
      
    }
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
  },

  async fetchApiDataPlayed() {
    this.playedGames = [];
    var options = {
      headers: {
        'X-Auth-Token': `${process.env.VUE_APP_API_KEY}`
      },
      params: {
        dateFrom: "2023-01-01",
        dateTo: this.getPreviousDay()
      }
    };
      const url = "https://api.football-data.org/v4/teams/" + this.$route.params.id + "/matches";
      try {
        var response = await axios.get(url, options);
        if (response.data.matches !== undefined && response.data.matches.length > 0) {

          console.log(response.data.matches)

          const lastThreeMatches = response.data.matches.slice(-3);
          this.playedGames.push(...lastThreeMatches);
      }
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
    },
    },
}
</script>

<style scoped>

/*
Team CSS
*/

img {
width: 100px;
}
.teamInfo {
  text-align: center;
}

.teamInfo > p {
  color: black;
}


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



@media only screen and (max-width: 600px) {

li.match {
  margin-left: 1%;
  margin-right: 1%;
}
}



</style>
