<template>
<h1> League Table {{ league }}</h1>

  </template>
  
  
  <script>
  import LiveScoreApp from '@/components/LiveScoreApp.vue'
  
  export default {
    name: 'App',
    components: {
      LiveScoreApp
    },

    data() {
      return {    
        league: this.$route.params.league    
      }

    },
    methods: {
      reloadPage() {
        location.reload();
      }
    }
  }
  
  </script>