import { createWebHistory, createRouter } from 'vue-router';
import Home from '@/views/Home.vue';
import About from '@/views/About.vue';
import Table from '@/views/Table.vue';
import Live from '@/views/Live.vue';
import Favorites from '@/views/Favorites.vue';


const routes = [
  { path: '/', name: 'Home', component: Home},
  { path: '/about', name: 'About', component: About},
  { path: '/table/:league', name: 'Table', component: Table},
  { path: '/live/:league', name: 'Live', component: Live},
  { path: '/Favorites/', name: 'Favorites', component: Favorites}


];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;