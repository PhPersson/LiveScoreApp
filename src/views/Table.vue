<template>
    <!-- <h1> {{ leagueTable.name }}</h1> -->
    <modal :show="showModal" :errorMessage="this.errorMessage" @close="showModal = false"> </modal>
    <div class="table">
        <table class="table table-bordered" id="LeagueTable">
            <thead>
                <tr>
                    <th scope="col">Position</th>
                    <th scope="col">Name</th>
                    <th scope="col">GP</th>
                    <th scope="col">Won</th>
                    <th scope="col">Draw</th>
                    <th scope="col">Loss</th>
                    <th scope="col">GF</th>
                    <th scope="col">GA</th>
                    <th scope="col">GD</th>
                    <th scope="col">Points</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="team in teams">
                    <td>{{ team.position }}</td>
                    <td><img v-bind:src="team.team.crest" alt="logo" width="40" height="40">{{ team.team.name }}</td>
                    <td>{{ team.playedGames }}</td>
                    <td>{{ team.won }}</td>
                    <td>{{ team.draw }}</td>
                    <td>{{ team.lost }}</td>
                    <td>{{ team.goalsFor }}</td>
                    <td>{{ team.goalsAgainst }}</td>
                    <td>{{ team.goalDifference }}</td>
                    <td>{{ team.points }}</td>
                    <td>
                        <v-btn outline @click="saveTeam(team.team)" color="white">
                            <v-icon icon right>{{ getFavoriteIcon(team.team) }}</v-icon>
                        </v-btn>

                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
  
  
<script>
import LiveScoreApp from '@/components/LiveScoreApp.vue'
import axios from 'axios';
import Modal from '@/components/Modal.vue'

export default {
    name: 'App',
    components: {
        LiveScoreApp,
        Modal,
    },

    data() {
        return {
            league: this.$route.params.league,
            teams: [],
            leagueTable: [],
            showModal: false,
            errorMessage: "",
            favoriteTeams: [],
        }
    },

    async mounted() {
        await this.fetchApiData();
        this.favoriteTeams = JSON.parse(localStorage.getItem("teamList"));
    },

    methods: {
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

        async fetchApiData() {
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
            var url = `https://api.football-data.org/v4/competitions/${this.league}/standings`;

            try {
                const response = await axios.get(url, options);
                this.leagueTable = response.data.competition.name;
                this.matchesToday = response.data.standings[0].table;
                this.teams = response.data.standings[0].table;
            }
            catch (error) {
                if (error.response && error.response.status === 429) {
                    this.errorMessage = "Too many API calls. Please try again in a short while.";
                    this.showModal = true;
                    setTimeout(() => {
                        this.showModal = false;
                    }, 4000);
                }
            }
        },


        getFavoriteIcon(team) {
            var favoriteTeams = JSON.parse(localStorage.getItem('teamList')) || [];
            // Check if the team is already marked as a favorite
            const isFavorite = favoriteTeams.some(favorite => favorite.id === team.id);
            // Return the appropriate icon based on whether it is a favorite or not
            return isFavorite ? 'mdi-star' : 'mdi-star-outline';
        },
    }
}
</script>
<style scoped>
.table {
  min-height: 90vh;
}

#LeagueTable{
  max-width: 50%;
  margin-left: auto;
  margin-right: auto;
  overflow-x: auto;
}

@media only screen and (max-width: 600px) {

    #LeagueTable {
        margin: 0 auto; 
        overflow-wrap: anywhere;
        max-width: 100%;
    }

    tr {
    font-size: 2vw;
    }

}


</style>
