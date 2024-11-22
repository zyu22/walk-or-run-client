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
    path: '/admin',
    name: 'admin',
    component: AdminView,
    children: [
      {
        path: 'settingChallenge',
        name: 'admin/setting/challenge',
        component: ChallengeBoardView
      },
      {
        path: 'settingScheduleChallenge',
        name: 'admin/setting/scheduleChallenge'
      }
      
    ]
  },
  {
      path: '/user',
      name: 'user',
      component: UserView,
      children: [
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