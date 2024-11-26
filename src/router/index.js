import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import UserView from '../views/UserView.vue'
import AdminView from '../views/AdminView.vue'
import UploadView from '../views/UploadView.vue'

import loginView from '@/components/authentication/login.vue'
import register from '@/components/authentication/register.vue'
import myInfo from '@/components/user/info/myInfo.vue'
import myPassword from '@/components/user/info/myPassword.vue'
import findEmail from '@/components/authentication/findEmail.vue'
import findPassword from '@/components/authentication/findPassword.vue'
import resetPassword from '@/components/authentication/resetPassword.vue'
import userFollow from '@/components/user/follow/follow.vue'

import userChallenge from '@/components/user/challenge/challenge.vue'
import userDetailChallenge from '@/components/user/challenge/challengeDetailModal.vue'

import myGoal from '@/components/user/mygoal/myGoal.vue'

import settingChallenge from '@/components/admin/challenge/settingChallenge.vue'
import settingScheduleChallenge from '@/components/admin/challenge/settingScheduleChallenge.vue'
import settingUserInfo from '@/components/admin/userInfo/settingUserInfo.vue'
import adminDashboard from '@/components/admin/dashboard/adminDashboard.vue'

import upload from '@/components/user/upload/upload.vue'
import AuthenticationView from '@/views/AuthenticationView.vue'
import userDashboard from '@/components/user/dashboard/userDashboard.vue'
import authenticationView from '@/components/authentication/Authentication.vue'

const routes = [
  {
    path: '/',
    name: 'auth',
    component: AuthenticationView,
    children: [
      {
        path: '',
        name: 'landing',
        component: authenticationView,
      },
      {
        path: 'login',
        name: 'login',
        component: loginView,
      },
      {
        path: 'register',
        name: 'register',
        component: register,
      },
      {
        path: 'findEmail',
        name: 'findEmail',
        component: findEmail,
      },
      {
        path: 'findPassword',
        name: 'findPassword',
        component: findPassword,
      },
      {
        path: 'resetPassword',
        name: 'resetPassword',
        component: resetPassword,
      },
    ],
  },
  {
    path: '/user',
    name: 'user',
    component: UserView,
    children: [
      {
        path: 'info',
        name: 'myInfo',
        component: myInfo,
      },
      {
        path: 'password',
        name: 'myPassword',
        component: myPassword,
      },
      {
        path: 'goal',
        name: 'myGoal',
        component: myGoal,
      },
      {
        path: 'challenge',
        name: 'userChallenge',
        component: userChallenge,
      },
      {
        path: 'detailChallenge',
        name: 'userDetailChallenge',
        component: userDetailChallenge,
      },
      {
        path: 'dashboard',
        name: 'userDashboard',
        component: userDashboard,
      },
      {
        path: 'follow',
        name: 'userFollow',
        component: userFollow,
      },
    ],
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    children: [
      {
        path: '',
        name: 'adminDashboard',
        component: adminDashboard,
      },
      {
        path: 'dashboard',
        name: 'adminDashboard',
        component: adminDashboard,
      },
      {
        path: 'challenge',
        name: 'adminChallenge',
        component: settingChallenge,
      },
      {
        path: 'scheduleChallenge',
        name: 'adminScheduleChallenge',
        component: settingScheduleChallenge,
      },
      {
        path: 'user',
        name: 'adminUser',
        component: settingUserInfo,
      },
    ],
  },
  {
    path: '/upload',
    name: 'upload',
    component: UploadView,
    children: [
      {
        path: '', // 기본 경로
        name: 'uploadDefault',
        component: upload,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const accessToken = localStorage.getItem('accessToken')
  const userStore = useUserStore()

  // 이미 로그인 한 사용자가 auth 페이지 접근 시도할 경우
  if (accessToken && to.matched.some((record) => record.name === 'auth')) {
    if (userStore.userRole === 'USER') {
      return next({ name: 'userDashboard' })
    } else if (userStore.userRole === 'ADMIN') {
      return next({ name: 'adminDashboard' })
    }
  }

  // 로그인이 필요한 페이지 접근 제어
  if (!accessToken && to.path.startsWith('/user')) {
    return next({ name: 'login' })
  }

  // admin 경로 접근 제어
  if (to.path.startsWith('/admin')) {
    if (userStore.userRole !== 'ADMIN') {
      return next({ name: 'userDashboard' })
    }
  }

  return next()
})

export default router
