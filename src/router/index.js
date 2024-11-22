import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import MainLayout from '../views/MainLayout.vue';
import ChallengeView from '../views/ChallengeView.vue';
import UserView from '../views/UserView.vue';
import AdminView from '../views/AdminView.vue';
import FollowView from '../views/FollowView.vue';
import UploadView from '../views/UploadView.vue';

import SettingChallenge from '@/components/admin/SettingChallenge.vue';
import SettingScheduleChallenge from '@/components/admin/SettingChallenge.vue';
import login from '@/components/user/login.vue';
import myInfo from '@/components/user/myInfo.vue';
import myGoal from '@/components/user/myGoal.vue';
import myPassword from '@/components/user/myPassword.vue';
import myGoalForm from '@/components/user/myGoalForm.vue';
import upload from '@/components/upload/upload.vue';

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
    path: '/follow',
    name: 'follow',
    component : FollowView
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
    {
      path: '/upload',
      name: 'upload',
      component : UploadView,
      children: [
        {
          path: '', // 기본 경로
          name: 'uploadDefault',
          component: upload
        },
      ]
    },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 네비게이션 가드 추가
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  // 로그인 페이지로 가는 경우
  if (to.path === '/login') {
    if (isLoggedIn) {
      // 이미 로그인된 경우 대시보드로
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      next(userData.role === 'ADMIN' ? '/admin' : '/dashboard');
    } else {
      // 로그인되지 않은 경우 로그인 페이지로
      next();
    }
    return;
  }
  
  // 로그인이 필요한 페이지에 접근하는 경우
  if (!isLoggedIn) {
    next('/login');
    return;
  }

  // 관리자 페이지 접근 제한
  if (to.path.startsWith('/admin')) {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData.role !== 'ADMIN') {
      next('/dashboard');
      return;
    }
  }
  
  next();
});

export default router;