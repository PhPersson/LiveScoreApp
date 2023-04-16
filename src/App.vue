<template>
  
  <img class="logo" alt="Vue logo" src="./assets/logo.jpg">
  <LiveScoreApp/>

</template>

<script>
import LiveScoreApp from './components/LiveScoreApp.vue'

export default {
  name: 'App',
  components: {
    LiveScoreApp
  }
}
</script>

<style>

.head{
  background-color: lightgray;
}
.logo{
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 10%;
}
</style>
