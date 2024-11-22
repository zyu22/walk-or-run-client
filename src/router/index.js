import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ChallengeView from '../views/ChallengeView.vue';
import UserView from '../views/UserView.vue';
import AdminView from '../views/AdminView.vue';
import { ContainerWithChildren } from 'postcss/lib/container';
import SettingChallenge from '@/components/admin/ChallengeBoard.vue';
import SettingScheduleChallenge from '@/components/admin/ChallengeBoard.vue';
import Login from '@/components/user/login.vue';
import MyInfo from '@/components/user/myInfo.vue';
import MyGoal from '@/components/user/myGoal.vue';
import MyPassword from '@/components/user/myPassword.vue';

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
        component: SettingChallenge
      },
      {
        path: 'settingScheduleChallenge',
        name: 'admin/setting/scheduleChallenge',
        component: SettingScheduleChallenge
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
          component: Login
        },
        {
          path: 'info',  // /user/info로 접근
          name: 'myInfo',
          component: MyInfo
        },
        {
          path: 'password',  // /user/password로 접근
          name: 'myPassword',
          component: MyPassword
        },
        {
          path: 'goal',  // /user/goal로 접근
          name: 'myGoal',
          component: MyGoal
        }
      ]
    },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;