<template>
  <div>
    <!-- 로그인하지 않은 경우: 로그인 화면 -->
    <Login v-if="!isLoggedIn" />

    <!-- 로그인한 경우: 메인 레이아웃 -->
    <div v-else class="flex mt-6">
      <AdminSidebar v-if="isAdmin" @logout="handleLogout" />
      <SideBar v-else @logout="handleLogout" />
      <div class="flex-1 p-8 mr-6 h-[calc(100vh-3rem)] bg-gray-50 rounded-2xl">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const isLoggedIn = computed(() => !!userStore.userId)
const isAdmin = computed(() => userStore.userRole === '1')

const handleLogout = async() => {
  userStore.clearUserInfo();
  router.push('/user/login');
}

const checkLoginStatus = async() => {
  try {
    const accessToken = localStorage.getItem('access_token')
    const userRole = localStorage.getItem('user_role')

    if (accessToken && userRole) {
      userStore.updateUserInfo(null, userRole, null)
    } else {
      router.push('/user/login')
    }
  } catch (error) {
    console.error('Error checking login status:', error);
    router.push('/user/login');
  }
}

onMounted(() => {
  try {
    checkLoginStatus()
  } catch (error) {
    console.error('Error in setup function:', error)
  }
});
</script>