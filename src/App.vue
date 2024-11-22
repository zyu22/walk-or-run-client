<template>
  <!-- 로그인하지 않은 경우: 전체 화면 로그인 -->
  <div v-if="!isLoggedIn" class="min-h-screen bg-gray-50">
    <RouterView />
  </div>

  <!-- 로그인한 경우: 사이드바가 있는 메인 레이아웃 -->
  <div v-else>
    <div class="flex mt-6">
      <AdminSidebar v-if="isAdmin" @logout="handleLogout" />
      <SideBar v-else @logout="handleLogout" />
      
      <div class="flex-1 p-8 mr-6 h-[calc(100vh-3rem)] bg-gray-50 rounded-2xl">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import SideBar from './components/SideBar.vue';
import AdminSidebar from './components/admin/AdminSidebar.vue';

const router = useRouter();
const isLoggedIn = ref(false);
const isAdmin = ref(false);

// 로그인 성공 시 호출되는 함수
const handleLoginSuccess = (userData) => {
  isLoggedIn.value = true;
  isAdmin.value = userData.role === 'ADMIN';
  
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('isLoggedIn', 'true');
  
  if (isAdmin.value) {
    router.push('/admin');
  } else {
    router.push('/dashboard');
  }
};

// 로그아웃 처리 함수
const handleLogout = async () => {
  try {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    
    isLoggedIn.value = false;
    isAdmin.value = false;
    
    await router.replace('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// 로그인 상태 체크
const checkLoginStatus = () => {
  const userStr = localStorage.getItem('user');
  const isLoggedInStr = localStorage.getItem('isLoggedIn');
  
  if (userStr && isLoggedInStr === 'true') {
    const userData = JSON.parse(userStr);
    isLoggedIn.value = true;
    isAdmin.value = userData.role === 'ADMIN';
    
    if (['/login', '/'].includes(router.currentRoute.value.path)) {
      router.push(isAdmin.value ? '/admin' : '/dashboard');
    }
  } else {
    isLoggedIn.value = false;
    isAdmin.value = false;
    localStorage.clear();
    
    if (router.currentRoute.value.path !== '/login') {
      router.push('/login');
    }
  }
};

onMounted(() => {
  checkLoginStatus();
});

// 라우트 변경 감지
watch(
  () => router.currentRoute.value.path,
  (newPath) => {
    if (!isLoggedIn.value && newPath !== '/login') {
      router.push('/login');
      return;
    }

    if (newPath.startsWith('/admin') && !isAdmin.value) {
      router.push('/dashboard');
    }
  }
);
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>
