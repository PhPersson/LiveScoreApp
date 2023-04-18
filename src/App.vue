<template>
  <img class="logo" alt="logo" src="./assets/logo.jpg" @click="reloadPage">
  <LiveScoreApp/>

</template>

<script>
import LiveScoreApp from './components/LiveScoreApp.vue'

export default {
  name: 'App',
  components: {
    LiveScoreApp
  },
  methods: {
    reloadPage() {
      location.reload();
    }
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

.logo:hover {
  cursor: pointer;
}

</style>
