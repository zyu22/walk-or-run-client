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
      </nav>
  
      <div class="mt-auto pt-6">
        <router-link 
          to="/settings" 
          class="flex items-center p-3 rounded-lg hover:bg-orange-50 transition-colors"
          :class="{ 'bg-orange-50 text-orange-500': isCurrentRoute('settings') }"
        >
          <span class="mr-3">⚙️</span>
          Setting
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
  import { useRouter, useRoute } from 'vue-router';
  
  const router = useRouter();
  const route = useRoute();
  
  // 현재 라우트 확인 함수
  const isCurrentRoute = (path) => {
    if (path === '/') {
      return route.path === '/';
    }
    return route.path.includes(path);
  };
  
  const handleLogout = () => {
    // 로그아웃 로직 구현
    router.push('/login');
  };
  </script>