<!-- App.vue -->
<template>
  <ConfirmModal />
  <NotifyModal />
  <div>
    <!-- 로그인하지 않은 경우: 로그인 화면 -->
    <RouterView v-if="!isLoggedIn" />

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
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import api from '@/api/axios'
import Sidebar from '@/components/user/userSidebar.vue'
import AdminSidebar from '@/components/admin/AdminSideBar.vue'
import Footer from '@/components/footer.vue'
import NotifyModal from '@/components/common/NotifyModal.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

const router = useRouter()
const userStore = useUserStore()

const isLoggedIn = computed(() => {
  console.log('isLoggedIn 체크:', !!userStore.userId)
  return !!userStore.userId
})

const isAdmin = computed(() => {
  console.log('isAdmin 체크:', userStore.userRole === 'ADMIN')
  return userStore.userRole === 'ADMIN'
})

const handleLogout = async () => {
  try {
    const response = await api.post('/user/logout')
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

const checkLoginStatus = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken && !userStore.userId) {
      await userStore.updateUserInfo(accessToken)
    }
  } catch (error) {
    console.error('Login status check failed:', error)
    userStore.clearUserInfo()
  }
}

onMounted(() => {
  console.log('App.vue가 마운트됨') // 이 로그가 출력되는지 확인
  checkLoginStatus()
})
</script>
