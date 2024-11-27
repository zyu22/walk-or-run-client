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
        path: 'challenge', // challenge 경로 명시적 추가
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
router.beforeEach(async (to, from, next) => {
  const accessToken = localStorage.getItem('accessToken')
  const userStore = useUserStore()

  if (accessToken) {
    // 토큰이 있지만 userStore가 비어있는 경우
    if (!userStore.userId) {
      await userStore.updateUserInfo(accessToken)
    }

    // auth 페이지 접근 시도할 경우 리다이렉트
    if (to.matched.some((record) => record.name === 'auth')) {
      return next(
        userStore.userRole === 'ADMIN' ? { name: 'adminChallenge' } : { name: 'userDashboard' },
      )
    }
  }

  // 보호된 라우트 체크
  if (to.path.startsWith('/admin') || to.path.startsWith('/user')) {
    if (!accessToken) {
      return next({ name: 'login' })
    }
    // admin 라우트 권한 체크
    if (to.path.startsWith('/admin') && userStore.userRole !== 'ADMIN') {
      return next({ name: 'login' })
    }
  }

  next()
})
export default router
