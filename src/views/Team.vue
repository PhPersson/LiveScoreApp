<template>
     <h1> {{ team }}</h1>
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
        }
    },

    async mounted() {
        
    },

    methods: {
        
    }
}
</script>
<style src="..\css\LiveScoreApp.css"></style>
