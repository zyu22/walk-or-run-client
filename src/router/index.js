import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ChallengeView from '../views/ChallengeView.vue';
import UserView from '../views/UserView.vue';
import AdminView from '../views/AdminView.vue';
import { ContainerWithChildren } from 'postcss/lib/container';
import ChallengeBoardView from '@/components/admin/ChallengeBoard.vue';
import Login from '@/components/user/login.vue';

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
    path: '/admin',
    name: 'admin',
    component: AdminView,
    children: [
      {
        path: '/admin/challenge',
        component: ChallengeBoardView
      }
      
    ]
  },
  {
      path: '/user',
      name: 'user',
      component: UserView,
      children: [
        {
          path: 'login',  // /user/info로 접근
          name: 'login',
          component: () => import('@/components/user/login.vue')
        },
        {
          path: 'info',  // /user/info로 접근
          name: 'myInfo',
          component: () => import('@/components/user/myInfo.vue')
        },
        {
          path: 'password',  // /user/password로 접근
          name: 'myPassword',
          component: () => import('@/components/user/myPassword.vue')
        },
        {
          path: 'goal',  // /user/goal로 접근
          name: 'myGoal',
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