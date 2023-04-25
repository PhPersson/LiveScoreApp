<template>
  <NavBar/>
  <router-view />
  <footer class="bg-light text-center text-lg-start">
  <!-- Copyright -->
  <div class="text-center p-1" style="background-color: rgba(0, 0, 0, 0.2);">
    <p class="text-dark" > LiveScoreApp <a class="btn" href="https://github.com/PhPersson/LiveScoreApp" role="button"> 
          <Icon icon="icon-park:github" /></a></p>
  </div>
  <!-- Copyright -->
</footer>
</template>

<script>
import NavBar from './components/NavBar.vue';
import { Icon } from '@iconify/vue';
export default {
  name: 'App',
  components: {
    NavBar,
    Icon
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
