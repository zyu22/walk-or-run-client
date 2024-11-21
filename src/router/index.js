// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ChallengeView from '../views/challenge/ChallengeView.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: HomeView
  },
  {
    path: '/challenge',
    name: 'challenge',
    component : ChallengeView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;