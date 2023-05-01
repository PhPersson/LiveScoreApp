<template>
    <div>
      <form>
        <input type="text" v-model="searchTerm" />
      </form>
      <ul v-if="filteredTeams.length > 0">

        <div >
          <li  v-for="team in filteredTeams" :key="team.id">
            <p style="color: black;"> <img v-bind:src="team.crest" class="teamLogo" /> {{ team.name }}</p>
            <Icon class="faicon" icon="ic:outline-star-border" @click="saveTeam(match.awayTeam)" />
          </li>
        </div>
      </ul>

    </div>
</template>
  
<script>

import axios from 'axios';
import { Icon } from '@iconify/vue';
export default {
    components: {
        Icon,
    },
    
    data() {
        return {
            allTeams: [],
            searchTerm: '',
        };
    },
    async mounted() {
        await this.fetchApiData();
    },
    computed: {
        filteredTeams() {
        return this.allTeams.filter(team =>
            team.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
        },
    },

    methods: {
        async fetchApiData() {
            const options = {
                headers: {
                    'X-Auth-Token': `${process.env.VUE_APP_API_KEY}`
                },
                params: {
                    limit: 500,
                }
            };
            var url = `https://api.football-data.org/v4/teams`;
            try {
                const response = await axios.get(url, options);
                console.log(response.data.teams);
                this.allTeams = response.data.teams
            } catch (error) {
                console.error(error.message);
            }
        },
        saveTeam(team) {
            var teamList = JSON.parse(localStorage.getItem('teamList')) || [];

            // Check if the team already exists in the list
            var teamExists = false;
            for (var i = 0; i < teamList.length; i++) {
                if (teamList[i].id === team.id) {
                teamExists = true;
                break;
                }
            }

            // Check if there is room to add the team
            if (teamList.length >= 9) {
                this.errorMessage = "Max " + 9 + " teams allowed as favorites";
                alert(this.errorMessage);
            }
            // Check if the team already exists in the list
            else if (teamExists) {
                this.errorMessage = "Team already exists in favorites";
                alert(this.errorMessage);
            } 
            // Add the team to the list
            else {
                teamList.push(team);
                localStorage.setItem('teamList', JSON.stringify(teamList));
            }
    },  
    }
};
</script>
  