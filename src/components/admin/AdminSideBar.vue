// components/admin/Sidebar.vue
<template>
  <div class="flex h-screen bg-white">
    <!-- Left Padding for Sidebar -->
    <div class="pl-6">
      <!-- Sidebar with gray background and spacing -->
      <div class="w-72 bg-gray-50 h-[calc(100vh-3rem)] rounded-2xl">
        <!-- Navigation Container -->
        <div class="h-full flex flex-col">
          <!-- Logo Section -->
          <div class="p-6 pb-8">
            <img 
              src="@/assets/logo.png" 
              alt="WalkOrRun" 
              class="h-40 w-auto cursor-pointer" 
              @click="router.push('/admin')"
            />
          </div>
          
          <!-- Navigation -->
          <nav class="px-4 flex-1">
            <router-link 
              to="/admin" 
              class="flex items-center px-4 py-3 mb-2 rounded-lg text-gray-600 hover:bg-white transition-colors"
              :class="{ 'bg-orange-50 text-orange-500 font-medium': route.path === '/admin' }"
            >
              <span class="mr-3">📊</span>
              Dashboard
            </router-link>

            <router-link 
              to="/admin/user" 
              class="flex items-center px-4 py-3 mb-2 rounded-lg text-gray-600 hover:bg-white transition-colors"
              :class="{ 'bg-orange-50 text-orange-500 font-medium': route.path === '/admin/user' }"
            >
              <span class="mr-3">⚙️</span>
              사용자 관리
            </router-link>

            <!-- Challenge Management with submenu -->
            <div class="mb-2">
              <button 
                @click="toggleChallenge" 
                class="flex items-center justify-between w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-white transition-colors"
                :class="{ 'bg-orange-50 text-orange-500 font-medium': isChallengeMenuActive }"
              >
                <div class="flex items-center">
                  <span class="mr-3">🎯</span>
                  챌린지 관리
                </div>
                <span class="text-sm transition-transform duration-200"
                      :class="{ 'transform rotate-180': isChallengeOpen }">
                  ▼
                </span>
              </button>
              
              <!-- Submenu -->
              <div v-show="isChallengeOpen" 
                   class="mt-1 ml-4 space-y-1">
                <router-link 
                  :to="{ name: 'adminChallenge' }" 
                  class="flex items-center px-4 py-2 rounded-lg text-gray-600 hover:bg-white transition-colors text-sm"
                  :class="{ 'bg-orange-50 text-orange-500 font-medium': route.name === 'adminChallenge' }"
                >
                  <span class="mr-3">1️⃣</span>
                  챌린지 관리
                </router-link>
                
                <router-link 
                  :to="{ name: 'adminScheduleChallenge' }" 
                  class="flex items-center px-4 py-2 rounded-lg text-gray-600 hover:bg-white transition-colors text-sm"
                  :class="{ 'bg-orange-50 text-orange-500 font-medium': route.name === 'adminScheduleChallenge' }"
                >
                  <span class="mr-3">2️⃣</span>
                  반복 챌린지 관리
                </router-link>
              </div>
            </div>
          </nav>

          <!-- Bottom Items -->
          <div class="p-4">
            <router-link 
              to="/upload" 
              class="flex items-center px-4 py-3 mb-2 rounded-lg text-gray-600 hover:bg-white transition-colors"
              :class="{ 'bg-orange-50 text-orange-500 font-medium': route.path === '/upload' }"
            >
              <span class="mr-3">📤</span>
              Upload
            </router-link>

            <button 
              @click="handleLogout" 
              class="flex items-center w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-white transition-colors"
            >
              <span class="mr-3">🚪</span>
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area (White Background) -->
    <main class="flex-1 p-3 bg-white">
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const emit = defineEmits(['logout']) // emit 정의 추가

const router = useRouter()
const route = useRoute()
const isChallengeOpen = ref(false)

// Challenge 메뉴가 활성화되어야 하는지 확인
const isChallengeMenuActive = computed(() => {
  return route.name === 'adminChallenge' || route.name === 'adminScheduleChallenge'
})

// 챌린지 메뉴 토글
const toggleChallenge = () => {
  isChallengeOpen.value = !isChallengeOpen.value
}

const handleLogout = () => {
  emit('logout') // emit을 통해 부모 컴포넌트로 이벤트 전달
}
</script>