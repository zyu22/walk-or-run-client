// components/admin/Sidebar.vue
<template>
  <div class="flex">
    <!-- Sidebar -->
    <div class="w-64 min-h-screen bg-white shadow-lg p-6">
      <div class="flex items-center mb-8">
        <h1 @click="router.push('/admin')" class="text-xl font-bold cursor-pointer">
          <span class="text-[#ff6f3b]">Walk</span>
          <span class="text-black">Or</span>
          <span class="text-[#32cd32]">Run</span>
        </h1>
      </div>
      
      <nav class="space-y-4">
        <router-link 
          to="/admin" 
          class="flex items-center p-3 rounded-lg hover:bg-orange-50 transition-colors"
          :class="{ 'bg-orange-50 text-orange-500': isCurrentRoute('admin') }"
        >
          <span class="mr-3">📊</span>
          Dashboard
        </router-link>

        <router-link 
          to="/admin/members" 
          class="flex items-center p-3 rounded-lg hover:bg-orange-50 transition-colors"
          :class="{ 'bg-orange-50 text-orange-500': isCurrentRoute('members') }"
        >
          <span class="mr-3">👥</span>
          멤버십 관리
        </router-link>

        <router-link 
          to="/admin/schedules" 
          class="flex items-center p-3 rounded-lg hover:bg-orange-50 transition-colors"
          :class="{ 'bg-orange-50 text-orange-500': isCurrentRoute('schedules') }"
        >
          <span class="mr-3">📅</span>
          일정 관리
        </router-link>

        <!-- Settings with submenu -->
        <div class="space-y-2">
          <button 
            @click="toggleSettings" 
            class="flex items-center justify-between w-full p-3 rounded-lg hover:bg-orange-50 transition-colors"
            :class="{ 'bg-orange-50 text-orange-500': isSettingsActive }"
          >
            <div class="flex items-center">
              <span class="mr-3">⚙️</span>
              시스템 관리
            </div>
            <span :class="{ 'transform rotate-180': isSettingsOpen }">▼</span>
          </button>
          
          <!-- Submenu -->
          <div v-show="isSettingsOpen" class="pl-6 space-y-2">
            <router-link 
              to="/admin/settings/users" 
              class="flex items-center p-2 rounded-lg hover:bg-orange-50 transition-colors"
              :class="{ 'bg-orange-50 text-orange-500': isCurrentRoute('users') }"
            >
              <span class="mr-3">👤</span>
              사용자 관리
            </router-link>
            
            <router-link 
              to="/admin/settings/challenges" 
              class="flex items-center p-2 rounded-lg hover:bg-orange-50 transition-colors"
              :class="{ 'bg-orange-50 text-orange-500': isCurrentRoute('challenges') }"
            >
              <span class="mr-3">🎯</span>
              챌린지 관리
            </router-link>
          </div>
        </div>
      </nav>

      <div class="mt-auto pt-6">
        <div class="flex items-center p-3 mb-4 bg-gray-50 rounded-lg">
          <span class="mr-3">👨‍💼</span>
          <div>
            <div class="text-sm font-semibold">관리자</div>
            <div class="text-xs text-gray-500">admin@walkrun.com</div>
          </div>
        </div>

        <button 
          @click="handleLogout" 
          class="flex items-center p-3 rounded-lg hover:bg-orange-50 transition-colors w-full"
        >
          <span class="mr-3">🚪</span>
          Log out
        </button>
      </div>
    </div>

    <!-- Main Content Area with Slot -->
    <main class="flex-1 bg-gray-50 min-h-screen">
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const isSettingsOpen = ref(false);

const isSettingsActive = computed(() => {
  return route.path.includes('/admin/settings');
});

const isCurrentRoute = (path) => {
  return route.path.includes(path);
};

const toggleSettings = () => {
  isSettingsOpen.value = !isSettingsOpen.value;
};

const handleLogout = () => {
  router.push('/login');
};
</script>