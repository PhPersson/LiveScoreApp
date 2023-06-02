<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">
        <img src="https://www.svgrepo.com/show/17072/football.svg" width="60" />
        LiveScoreApp
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="/">Home</a>
          </li>

           
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >Today's matches</a>
            <ul class="dropdown-menu">
              <li>
                <a
                  class="dropdown-item"
                  id="PL"
                  v-bind:href="'/live/' + this.link"
                  @click="select($event)"
                >Premier League</a>
              </li>
              <li>
                <a
                  class="dropdown-item"
                  id="PD"
                  v-bind:href="'/live/' + this.link"
                  @click="select($event)"
                >La Liga</a>
              </li>
              <li>
                <a
                  class="dropdown-item"
                  id="SA"
                  v-bind:href="'/live/' + this.link"
                  @click="select($event)"
                >Serie A</a>
              </li>
              <li>
                <a
                  class="dropdown-item"
                  id="BL1"
                  v-bind:href="'/live/' + this.link"
                  @click="select($event)"
                >BundesLiga</a>
              </li>
              <li>
                <a
                  class="dropdown-item"
                  id="FL1"
                  v-bind:href="'/live/' + this.link"
                  @click="select($event)"
                >League 1</a>
              </li>
              <li>
                <a
                  class="dropdown-item"
                  id="CL"
                  v-bind:href="'/live/' + this.link"
                  @click="select($event)"
                >Champions League</a>
              </li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >League tables</a>
            <ul class="dropdown-menu">
              <li>
                <a
                  class="dropdown-item"
                  id="PL"
                  v-bind:href="'/table/' + this.link"
                  @click="select($event)"
                >Premier League</a>
              </li>
              <li>
                <a
                  class="dropdown-item"
                  id="PD"
                  v-bind:href="'/table/' + this.link"
                  @click="select($event)"
                >La Liga</a>
              </li>
              <li>
                <a
                  class="dropdown-item"
                  id="SA"
                  v-bind:href="'/table/' + this.link"
                  @click="select($event)"
                >Serie A</a>
              </li>
              <li>
                <a
                  class="dropdown-item"
                  id="BL1"
                  v-bind:href="'/table/' + this.link"
                  @click="select($event)"
                >BundesLiga</a>
              </li>
              <li>
                <a
                  class="dropdown-item"
                  id="FL1"
                  v-bind:href="'/table/' + this.link"
                  @click="select($event)"
                >League 1</a>
              </li>
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/favorites" role="button" aria-expanded="false">Favorites</a>
          </li>
        </ul>
        <ul class="navbar-nav ml-auto">
          <li class="nav-item" id="Searchbar">
            <v-toolbar color="white">
              <v-autocomplete
                :items="teamList"
                color="white"
                item-title="name"
                item-value="id"
                label="Search teams"
                return-object
                v-model="selectedClub"
                @click="fetchTeamsData"
              >
                <template #no-data>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Loading...</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-autocomplete>
              <v-btn icon="mdi-magnify" @click="submit"></v-btn>
            </v-toolbar>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import axios from 'axios';
import router from '@/router';

export default {
  name: "NavBar",
  data() {
    return {
      link: "",
      url: `https://api.football-data.org/v4/teams/`,
      search: null,
      selectVal: null,
      teamList: [],
      selectedClub: { id: null, name: null }
    }
  },
  watch: {
    search(val) {
      val && val !== this.selectVal && this.querySelections(val)
    },
  },
  mounted() {
    this.selectedClub = { id: null, name: null };
  },
  methods: {
    select: function (event) {
      this.link = event.target.id;
    },
    submit() {
      if (this.selectedClub.id != null) {
        //router.push('/team/' + this.selectedClub.id)
        router.push({ path: '/team/' + this.selectedClub.id, replace: true })
      } else {
        console.log(this.selectedClub.id + " null")
      }
      this.selectedClub = null;
    },
    fetchTeamsData() {
      if (this.teamList.length === 0) {
        const options = {
          headers: {
            'X-Auth-Token': process.env.VUE_APP_API_KEY,
          },
          params: {
            limit: 200,
            plan: 'TIER_FOUR',
          },
        };
        axios
          .get(this.url, options)
          .then((response) => {
            const teams = response.data.teams;
            teams.forEach((team) => {
              this.teamList.push({
                id: team.id,
                name: team.name,
              });
            });
          })
          .catch((error) => {
            console.error('API request failed:', error.message);
          });
      }
    },
  },
}
</script>

<style scoped>
li.nav-item {
  display: flex;
  align-items: center;
}
button#Search {
  margin-left: 15px;
}
.v-input__details {
  min-height: 0px;
  padding: 0px;
}
.navbar-nav {
  justify-content: flex-start; /* Align menu items to the left */
}

/* Move the search bar to the right */
#Searchbar {
  margin-left: auto;
  width: 300px;
}
.teamInfo {
  text-align: center;
}
.teamInfo > p {
  color: black;
}

.v-input__details {
  min-height: 0px !important;
  padding: 0px !important;
}
div#input-0-messages {
  min-height: 0px;
}

@media only screen and (max-width: 1000px) {

#Searchbar {
    margin-left: 0;

}



}
</style>
