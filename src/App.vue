<template>
  <NavBar/>
  
  <router-view />


</template>

<script>
import NavBar from './components/NavBar.vue';

export default {
  name: 'App',
  components: {
    NavBar
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
