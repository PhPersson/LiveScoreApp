<template>
    <h1> {{ leagueTable.name }}</h1>

    <div>
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




            </tr>
        </tbody>
    </table>
  </div>
</template>
  
  
<script>
import LiveScoreApp from '@/components/LiveScoreApp.vue'
import axios from 'axios';


export default {
    name: 'App',
    components: {
        LiveScoreApp
    },

    data() {
        return {
            league: this.$route.params.league,
            apiUrl: `https://api.football-data.org/v4/matches?competitions=2002,2019,2014,2015,2021`,
            apiUrl1: `https://api.football-data.org/v4/competitions/`,
            apiUrl2: `/standings`,
            teams: [],
            leagueTable: [],
            


        }

    },

    async mounted() {

        await this.fetchApiData(this.apiUrl1,this.apiUrl2);

    },


    methods: {
        reloadPage() {
            location.reload();
        },
    
    async fetchApiData(url1, url2) {





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
            var url = url1 + this.league + url2;

            try {
                const response = await axios.get(url, options);
                console.log(response.data);
                this.leagueTable = response.data.competition;
                this.matchesToday = response.data.standings[0].table;
                this.teams = response.data.standings[0].table;
                console.log(this.matchesToday);
                console.log(this.leagueTable);



            } catch (error) {
                console.error(error.message);
            }
        },

    }
}








</script>
<style src="..\css\LiveScoreApp.css"></style>
