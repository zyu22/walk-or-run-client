<template>
    <div class="w-64 min-h-screen bg-white shadow-lg p-6">
      <div class="flex items-center mb-8">
        <h1 @click="router.push('/dashboard')" class="text-xl font-bold cursor-pointer">
          <span class="text-[#ff6f3b]">Walk</span>
          <span class="text-black">Or</span>
          <span class="text-[#32cd32]">Run</span>
        </h1>
      </div>
      
      <nav class="space-y-4">
        <router-link 
          to="/" 
          class="flex items-center p-3 rounded-lg hover:bg-orange-50 transition-colors"
          :class="{ 'bg-orange-50 text-orange-500': isCurrentRoute('dashboard') }"
        >
          <span class="mr-3">📊</span>
          Dashboard
        </router-link>
        <router-link 
          to="/challenge" 
          class="flex items-center p-3 rounded-lg hover:bg-orange-50 transition-colors"
          :class="{ 'bg-orange-50 text-orange-500': isCurrentRoute('challenge') }"
        >
          <span class="mr-3">🎯</span>
          Challenge
        </router-link>
        <router-link 
          to="/follow" 
          class="flex items-center p-3 rounded-lg hover:bg-orange-50 transition-colors"
          :class="{ 'bg-orange-50 text-orange-500': isCurrentRoute('follow') }"
        >
          <span class="mr-3">👥</span>
          Follow
        </router-link>
        <!-- MyPage with submenu -->
      <div class="space-y-2">
        <button 
          @click="toggleMyPage" 
          class="flex items-center justify-between w-full p-3 rounded-lg hover:bg-orange-50 transition-colors"
          :class="{ 'bg-orange-50 text-orange-500': isMyPageActive }"
        >
          <div class="flex items-center">
            <span class="mr-3">⚙️</span>
            MyPage
          </div>
          <span :class="{ 'transform rotate-180': isMyPageOpen }">▼</span>
        </button>
        
        <!-- Submenu -->
        <div v-show="isMyPageOpen" class="pl-6 space-y-2">
          <router-link 
            to="/mypage/info" 
            class="flex items-center p-2 rounded-lg hover:bg-orange-50 transition-colors"
            :class="{ 'bg-orange-50 text-orange-500': isCurrentRoute('info') }"
          >
            <span class="mr-3">👤</span>
            내 정보 관리
          </router-link>
          
          <router-link 
            to="/mypage/password" 
            class="flex items-center p-2 rounded-lg hover:bg-orange-50 transition-colors"
            :class="{ 'bg-orange-50 text-orange-500': isCurrentRoute('password') }"
          >
            <span class="mr-3">🔒</span>
            내 비밀번호 관리
          </router-link>

          <router-link 
            to="/mypage/goal" 
            class="flex items-center p-2 rounded-lg hover:bg-orange-50 transition-colors"
            :class="{ 'bg-orange-50 text-orange-500': isCurrentRoute('goal') }"
          >
            <span class="mr-3">🎯</span>
            내 목표 관리
          </router-link>
        </div>
      </div>
      </nav>
  

      <div class="mt-auto pt-6">
        <router-link 
        to="/upload" 
        class="flex items-center p-3 rounded-lg hover:bg-orange-50 transition-colors"
        :class="{ 'bg-orange-50 text-orange-500': isCurrentRoute('upload') }"
      >
        <span class="mr-3">📤</span>
        Upload
      </router-link>
        <button 
          @click="handleLogout" 
          class="flex items-center p-3 rounded-lg hover:bg-orange-50 transition-colors w-full"
        >
          <span class="mr-3">🚪</span>
          Log out
        </button>
        
      </div>
    </div>
  </template>
  
  <script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const isMyPageOpen = ref(false);

const isMyPageActive = computed(() => {
  return route.path.includes('/mypage');
});

const isCurrentRoute = (path) => {
  if (path === '/') {
    return route.path === '/';
  }
  return route.path.includes(path);
};

const toggleMyPage = () => {
  isMyPageOpen.value = !isMyPageOpen.value;
};

const handleLogout = () => {
  router.push('/login');
};
</script>