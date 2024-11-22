import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ChallengeView from '../views/ChallengeView.vue';
import UserView from '../views/UserView.vue';

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
        {
          path: 'info',  // /user/info로 접근
          name: 'userInfo',
          component: () => import('@/components/user/myInfo.vue')
        },
        {
          path: 'password',  // /user/password로 접근
          name: 'userPassword',
          component: () => import('@/components/user/myPassword.vue')
        },
        {
          path: 'goal',  // /user/goal로 접근
          name: 'userGoal',
          component: () => import('@/components/user/myGoal.vue')
        }
      ]
    },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;