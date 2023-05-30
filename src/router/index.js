import { createWebHistory, createRouter } from 'vue-router';
import Home from '@/views/Home.vue';
import Table from '@/views/Table.vue';
import Live from '@/views/Live.vue';
import Favorites from '@/views/Favorites.vue';
import Team from '@/views/Team.vue';

import Demo from '@/views/Demo.vue'

const routes = [
  { path: '/', name: 'Home', component: Home},
  { path: '/table/:league', name: 'Table', component: Table},
  { path: '/live/:league', name: 'Live', component: Live},
  { path: '/favorites', name: 'Favorites', component: Favorites},
  { path: '/team/:id', name: 'Team', component: Team},
  { path: '/demo', name: 'Demo', component: Demo}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;