<template>
  <div>
    <!-- 로그인하지 않은 경우: 로그인 화면 -->
    <Login v-if="!isLoggedIn" />

    <!-- 로그인한 경우: 메인 레이아웃 -->
    <div v-else class="mt-6 flex">
      <AdminSidebar v-if="isAdmin" @logout="handleLogout" />
      <Sidebar v-else @logout="handleLogout" />
      <div class="mr-6 h-[calc(100vh-3rem)] flex-1 rounded-2xl bg-gray-50 p-8">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import api from './api/axios'
import Login from './components/user/login.vue'
import Sidebar from './components/Sidebar.vue'
import AdminSidebar from './components/admin/AdminSidebar.vue'

const router = useRouter()
const userStore = useUserStore()

const isLoggedIn = computed(() => !!userStore.userId)
const isAdmin = computed(() => userStore.userRole === '1')

const handleLogout = async () => {
  try {
    const response = await api.post('/user/logout')
    console.log('요청 헤더:', response.config.headers)
    console.log('로그아웃 응답:', response) // 서버 응답 확인
    userStore.clearUserInfo()
    router.push('/user/login')
  } catch (error) {
    console.log('에러 상세:', error) // 에러 응답 데이터 확인
    console.log('요청 헤더:', error.config?.headers) // 에러 시에도 요청 헤더 확인
    console.error('로그아웃 실패:', error)
    userStore.clearUserInfo()
    router.push('/user/login')
  }
}

const checkLoginStatus = async () => {
  try {
    // login.vue에서 access_token을 accessToken으로 저장함
    const accessToken = localStorage.getItem('accessToken')

    if (accessToken) {
      console.log(accessToken)
      userStore.updateUserInfo(accessToken)
    } else {
      // 토큰이 없고 현재 로그인 페이지가 아니면 로그인으로 리다이렉트
      if (router.currentRoute.value.path !== '/user/login') {
        router.push('/user/login')
      }
    }
  } catch (error) {
    console.error('Error checking login status:', error)
    userStore.clearUserInfo()
    router.push('/user/login')
  }
}

onMounted(() => {
  checkLoginStatus()
})
</script>
