import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ChallengeView from '../views/ChallengeView.vue';
import UserView from '../views/UserView.vue';
import AdminView from '../views/AdminView.vue';
import SettingChallenge from '@/components/admin/SettingChallenge.vue';
import SettingScheduleChallenge from '@/components/admin/SettingChallenge.vue';
import login from '@/components/user/login.vue';
import myInfo from '@/components/user/myInfo.vue';
import myGoal from '@/components/user/myGoal.vue';
import myPassword from '@/components/user/myPassword.vue';
import myGoalForm from '@/components/user/myGoalForm.vue';

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
        path: 'adminChallenge',
        name: 'adminChallenge',
        component: SettingChallenge
      },
      {
        path: 'scheduleChallenge',
        name: 'adminScheduleChallenge',
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
          component: login
        },
        {
          path: 'info',  // /user/info로 접근
          name: 'myInfo',
          component: myInfo
        },
        {
          path: 'password',  // /user/password로 접근
          name: 'myPassword',
          component: myPassword
        },
        {
          path: 'goal',  // /user/goal로 접근
          name: 'myGoal',
          component: myGoal
        },
        {
          path: 'goal/form',
          name: 'mygoalForm',
          component: myGoalForm
        },
      ]
    },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;