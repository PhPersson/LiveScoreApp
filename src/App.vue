<template>
  <img alt="Vue logo" src="./assets/logo.jpg">
  <FootballChartVue/>
</template>

<script>
import FootballChartVue from './components/Football-chart.vue'

export default {
  name: 'App',
  components: {
    FootballChartVue
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
