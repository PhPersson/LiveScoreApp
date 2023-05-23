<template>

<div class="teamInfo" v-if="teamInfo.length > 0">
    <h1>{{ teamInfo[0].name }}</h1>
    <img :src="teamInfo[0].crest" :alt="teamInfo[0].name + ' Crest'" />
    <p>Stadium: {{ teamInfo[0].venue }}</p>
  </div>
</template>
  
  
<script>
import LiveScoreApp from '@/components/LiveScoreApp.vue'
import axios from 'axios';

export default {
    name: 'App',
    components: {

    },

    data() {
        return {
            team: this.$route.params.id,
            teamInfo: []
        }
    },

    async mounted() {

        await this.fetchApiData();

    },

    methods: {

        async fetchApiData() {
            const options = {
                headers: {
                    'X-Auth-Token': `${process.env.VUE_APP_API_KEY}`
                },
            };
            const url = `https://api.football-data.org/v4/teams/${this.team}`;

            try {
                const response = await axios.get(url, options);
                console.log(response.data);

                this.teamInfo.push(response.data);

                //this.teamInfo = response.data; 

            } catch (error) {
                console.error(error.message);
            }
        }
    },
}
</script>
<style src="..\css\LiveScoreApp.css"></style>
