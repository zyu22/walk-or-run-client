import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ChallengeView from '../views/challenge/ChallengeView.vue';
import UserView from '../views/UserView.vue';
import UserInfo from '../components/user/UserInfo.vue';
import UserGoal from '../components/user/UserGoal.vue';

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
    component: ChallengeView
  },
  {
    path: '/user',
    name: 'user',
    component: UserView,
    children: [
      {
        path: 'info',
        name: 'userInfo',
        component: UserInfo
      },
      {
        path: 'goal',
        name: 'userGoal',
        component: UserGoal
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;