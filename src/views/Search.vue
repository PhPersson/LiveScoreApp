<template>
    <div>
      <form>
        <input type="text" v-model="searchTerm" />
      </form>
      <ul>
        <li v-for="team in filteredTeams" :key="team.id">
          {{ team.name }}
        </li>
      </ul>
    </div>
  </template>
  
<script>

import axios from 'axios';
  export default {
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
    }
  };
</script>
  