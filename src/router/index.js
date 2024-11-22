import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ChallengeView from '../views/ChallengeView.vue';
import UserView from '../views/UserView.vue';
import AdminView from '../views/AdminView.vue';
import { ContainerWithChildren } from 'postcss/lib/container';
import ChallengeBoardView from '@/components/admin/ChallengeBoard.vue';

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
  },
  {
    path: '/user',
    name: 'user',
    component: UserView,
    children: [

    ]
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    children: [
      {
        path: '/admin/challenge',
        component: ChallengeBoardView
      }
      
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;