<template>
  <NavBar />
  <router-view />
  <footer class="bg-light text-center text-start ">
    <div class="text-center" style="background-color: rgba(0, 0, 0, 0.2);">
      <p class="text-dark"> LiveScoreApp
        <a class="btn" href="https://github.com/PhPersson/LiveScoreApp" target="_blank" role="button">
          <v-icon dark right>{{ icon }}</v-icon>
        </a>
      </p>
    </div>
  </footer>
</template>

<script>
import NavBar from './components/NavBar.vue';
import VIcon from 'vuetify';
export default {
  name: 'App',
  components: {
    NavBar,
    VIcon
  },
  data() {
    return {
      icon: 'mdi-github'
    }
  },
}
</script>
<style>

@media only screen and (max-width: 600px) {

li.match {
  margin-left: 1%;
  margin-right: 1%;
}


#LeagueTable {
 
 margin: 0 auto; 
overflow-wrap: anywhere;
max-width: 100%;

}

tr {
font-size: 2vw;
}
}


</style>