<template>
  <div>
    <!-- 로그인하지 않은 경우: 로그인 화면 -->
    <Login v-if="!isLoggedIn" @login-success="handleLoginSuccess" />
    
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Login from '@/components/user/Login.vue';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import SideBar from '@/components/SideBar.vue';

const router = useRouter();
const isLoggedIn = ref(false);
const isAdmin = ref(false);

// 로그인 성공 핸들러
const handleLoginSuccess = (userData) => {
  console.log('Login success:', userData); // 디버깅용
  
  // 로그인 상태 업데이트
  isLoggedIn.value = true;
  isAdmin.value = userData.role === 'ADMIN';
  
  // localStorage에 사용자 정보 저장
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('isLoggedIn', 'true');
  
  // 적절한 페이지로 라우팅
  if (isAdmin.value) {
    router.push('/admin');
  } else {
    router.push('/dashboard');
  }
};

// 로그아웃 핸들러
const handleLogout = () => {
  // localStorage 클리어
  localStorage.removeItem('user');
  localStorage.removeItem('isLoggedIn');
  
  console.log(localStorage.getItem('user'));
  // 상태 초기화
  isLoggedIn.value = false;
  isAdmin.value = false;
  
  // 로그인 페이지로 리다이렉션
  router.push('/user/login');
};

// 초기 로그인 상태 체크
const checkLoginStatus = () => {
  const userStr = localStorage.getItem('user');
  const isLoggedInStr = localStorage.getItem('isLoggedIn');
  
  if (userStr && isLoggedInStr === 'true') {
    const userData = JSON.parse(userStr);
    isLoggedIn.value = true;
    isAdmin.value = userData.role === 'ADMIN';
  } else {
    isLoggedIn.value = false;
    isAdmin.value = false;
    router.push('/user/login');
  }
};

// 컴포넌트 마운트 시 로그인 상태 체크
onMounted(() => {
  checkLoginStatus();
});
</script>