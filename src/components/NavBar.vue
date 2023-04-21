<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
          <a class="navbar-brand" href="/"> <img src="https://www.svgrepo.com/show/17072/football.svg" width="60" >LiveScoreApp </a>


          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
              aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavDropdown">
              <ul class="navbar-nav">
                  <li class="nav-item">
                      <a class="nav-link active" aria-current="page" href="/"> Home </a>
                  </li>
                  <li class="nav-item dropdown">
                      <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"> Live games </a>
                      <ul class="dropdown-menu">
                          <li><a class="dropdown-item" id="PL" v-bind:href="'/live/'+ this.link" @click="select($event)">Premier League</a></li>
                          <li><a class="dropdown-item" id="PD" v-bind:href="'/live/'+ this.link" @click="select($event)">La Liga</a></li>
                          <li><a class="dropdown-item" id="SA" v-bind:href="'/live/'+ this.link" @click="select($event)">Serie A</a></li>
                          <li><a class="dropdown-item" id="BL1" v-bind:href="'/live/'+ this.link" @click="select($event)">BundesLiga</a></li>
                          <li><a class="dropdown-item" id="FL1" v-bind:href="'/live/'+ this.link" @click="select($event)">League 1</a></li>

                      </ul>
                  </li>
                  <li class="nav-item dropdown">
                      <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"> League Tables </a>
                      <ul class="dropdown-menu">
                          <li><a class="dropdown-item" id="PL" v-bind:href="'/table/'+ this.link" @click="select($event)">Premier League</a></li>
                          <li><a class="dropdown-item" id="PD" v-bind:href="'/table/'+ this.link" @click="select($event)">La Liga</a></li>
                          <li><a class="dropdown-item" id="SA" v-bind:href="'/table/'+ this.link" @click="select($event)">Serie A</a></li>
                          <li><a class="dropdown-item" id="BL1" v-bind:href="'/table/'+ this.link" @click="select($event)">BundesLiga</a></li>
                          <li><a class="dropdown-item" id="FL1" v-bind:href="'/table/'+ this.link" @click="select($event)">League 1</a></li>
                      </ul>
                  </li>
                  <li class="nav-item">
                      <a class="nav-link" href="/favorites" role="button" aria-expanded="false"> Favorites </a>
                  </li>
              </ul>
          </div>
      </div>
  </nav>
</template>


<script>

export default {
  name: "NavBar",

  data() {
      return {    
        link: ""    
      }
  },
 
  methods: {
    select: function(event){
      this.link = event.target.id;
      console.log(this.link);
    },
  }

}

</script>