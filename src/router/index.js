import { createWebHistory, createRouter } from 'vue-router';
import Home from '@/views/Home.vue';
import Table from '@/views/Table.vue';
import Live from '@/views/Live.vue';
import Favorites from '@/views/Favorites.vue';


const routes = [
  { path: '/', name: 'Home', component: Home},
  { path: '/table/:league', name: 'Table', component: Table},
  { path: '/live/:league', name: 'Live', component: Live},
  { path: '/favorites', name: 'Favorites', component: Favorites}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;