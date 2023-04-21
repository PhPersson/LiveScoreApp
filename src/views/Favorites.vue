

<template>
    <LiveScoreAppFavorites/>
</template>


  
  
<script>
import LiveScoreAppFavorites from '@/components/LiveScoreAppFavorites.vue';
  
  export default {
    name: 'App',
    components: {
    LiveScoreAppFavorites
},
    methods: {
      reloadPage() {
        location.reload();
      }
    }
  }
  
  </script>