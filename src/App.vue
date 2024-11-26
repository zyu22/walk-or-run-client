<template>
  <ConfirmModal />
  <NotifyModal />
  <div>
    <!-- 로그인하지 않은 경우 -->
    <template v-if="!isLoggedIn">
      <RouterView />
    </template>

    <!-- 로그인한 경우: 역할에 따른 레이아웃 -->
    <div v-else class="mt-6 flex h-[calc(100vh-3rem)]">
      <!-- ADMIN인 경우 -->
      <template v-if="isAdmin">
        <AdminSidebar @logout="handleLogout" />
        <div class="mr-6 flex-1 overflow-y-auto rounded-2xl bg-gray-50 p-8">
          <RouterView />
        </div>
      </template>

      <!-- USER인 경우 -->
      <template v-else>
        <Sidebar @logout="handleLogout" />
        <div class="mr-6 flex-1 overflow-y-auto rounded-2xl bg-gray-50 p-8">
          <RouterView />
        </div>
      </template>
    </div>
    <Footer class="pb-8"></Footer>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import api from '@/api/axios'
import Login from '@/views/AuthenticationView.vue'
import Sidebar from '@/components/user/userSidebar.vue'
import AdminSidebar from '@/components/admin/AdminSideBar.vue'
import Footer from '@/components/footer.vue'
import NotifyModal from '@/components/common/NotifyModal.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import AuthenticationView from '@/components/authentication/Authentication.vue'
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 현재 경로가 auth인지 확인
const isAuthPath = computed(() => route.path === '/' || route.path === '/auth')
// 현재 경로가 login인지 확인
const isLoginPath = computed(() => route.path === '/login')
const isLoggedIn = computed(() => !!userStore.userId)
const isAdmin = computed(() => userStore.userRole === 'ADMIN')

const handleLogout = async () => {
  try {
    const response = await api.post('/user/logout')
    console.log('요청 헤더:', response.config.headers)
    console.log('로그아웃 응답:', response) // 서버 응답 확인
    userStore.clearUserInfo()
    router.push({ name: 'login' })
  } catch (error) {
    console.log('에러 상세:', error) // 에러 응답 데이터 확인
    console.log('요청 헤더:', error.config?.headers) // 에러 시에도 요청 헤더 확인
    console.error('로그아웃 실패:', error)
    userStore.clearUserInfo()
    router.push({ name: 'login' })
  }
}

// 브라우저 종료 시 처리할 함수
const handleBeforeUnload = (event) => {
  if (isLoggedIn.value) {
    // localStorage 클리어
    localStorage.removeItem('accessToken')
    // store 초기화
    userStore.clearUserInfo()

    // 서버에 로그아웃 요청 보내기 (선택사항)
    try {
      // 동기적으로 요청을 보내기 위해 sendBeacon 사용
      navigator.sendBeacon('/api/user/logout')
    } catch (error) {
      console.error('Logout on unload failed:', error)
    }
  }
}

const checkLoginStatus = async () => {
  try {
    // login.vue에서 access_token을 accessToken으로 저장함
    const accessToken = localStorage.getItem('accessToken')

    console.log('accessToken: ', accessToken)
    if (accessToken) {
      userStore.updateUserInfo(accessToken)

      // userRole에 따른 리다이렉트
      if (userStore.userRole === 'ADMIN') {
        // 관리자인데, 관리자페이지가 아닐 때 이동시키기
        if (!router.currentRoute.value.path.startsWith('/admin')) {
          router.push({ name: 'adminDashboard' }) // 관리자 대시보드로 리다이렉트
        }
      } else if (userStore.userRole === 'USER') {
        if (router.currentRoute.value.path.startsWith('/admin')) {
          router.push({ name: 'userDashboard' }) // 일반 사용자 대시보드로 리다이렉트
        }
      }
    } else {
      // accessToken이 없을 때
      const currentPath = router.currentRoute.value.path
      if (
        currentPath === '/' ||
        currentPath.startsWith('/user') ||
        currentPath.startsWith('/admin')
      ) {
        router.push({ name: 'login' })
      }
    }
  } catch (error) {
    console.error('Error checking login status:', error)
    userStore.clearUserInfo()
    router.push({ name: 'login' })
  }
}

onMounted(() => {
  checkLoginStatus()
})
</script>
