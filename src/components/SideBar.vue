<template>
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
            @click="router.push('/dashboard')"
          />
        </div>
        
        <!-- Navigation -->
        <nav class="px-4 flex-1">
          <router-link 
            to="/dashboard" 
            class="flex items-center px-4 py-3 mb-2 rounded-lg text-gray-600 hover:bg-white transition-colors"
            :class="{ 'bg-orange-50 text-orange-500 font-medium': isCurrentRoute('dashboard') }"
          >
            <span class="mr-3">📊</span>
            Dashboard
          </router-link>

          <router-link 
            to="/challenge" 
            class="flex items-center px-4 py-3 mb-2 rounded-lg text-gray-600 hover:bg-white transition-colors"
            :class="{ 'bg-orange-50 text-orange-500 font-medium': isCurrentRoute('challenge') }"
          >
            <span class="mr-3">🎯</span>
            Challenge
          </router-link>

          <router-link 
            to="/follow" 
            class="flex items-center px-4 py-3 mb-2 rounded-lg text-gray-600 hover:bg-white transition-colors"
            :class="{ 'bg-orange-50 text-orange-500 font-medium': isCurrentRoute('follow') }"
          >
            <span class="mr-3">👥</span>
            Follow
          </router-link>

          <!-- MyPage -->
          <div class="mb-2">
            <button 
              @click="toggleMyPage" 
              class="flex items-center justify-between w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-white transition-colors"
              :class="{ 'bg-orange-50 text-orange-500 font-medium': isMyPageActive }"
            >
              <div class="flex items-center">
                <span class="mr-3">⚙️</span>
                MyPage
              </div>
              <span class="text-sm transition-transform duration-200"
                    :class="{ 'transform rotate-180': isMyPageOpen }">
                ▼
              </span>
            </button>
            
            <!-- Submenu -->
            <div v-show="isMyPageOpen" 
                 class="mt-1 ml-4 space-y-1">
              <router-link 
                to="/user/info" 
                class="flex items-center px-4 py-2 rounded-lg text-gray-600 hover:bg-white transition-colors text-sm"
                :class="{ 'bg-orange-50 text-orange-500 font-medium': isCurrentRoute('info') }"
              >
                <span class="mr-3">👤</span>
                내 정보 관리
              </router-link>

              <router-link 
                to="/user/password" 
                class="flex items-center px-4 py-2 rounded-lg text-gray-600 hover:bg-white transition-colors text-sm"
                :class="{ 'bg-orange-50 text-orange-500': isCurrentRoute('password') }"
              >
                <span class="mr-3">🔒</span>
                내 비밀번호 관리
              </router-link>

              <router-link 
                to="/user/goal" 
                class="flex items-center px-4 py-2 rounded-lg text-gray-600 hover:bg-white transition-colors text-sm"
                :class="{ 'bg-orange-50 text-orange-500 font-medium': isCurrentRoute('goal') }"
              >
                <span class="mr-3">🎯</span>
                내 목표 관리
              </router-link>
            </div>
          </div>
        </nav>

        <!-- Bottom Items -->
        <div class="p-4">
          <router-link 
            to="/upload" 
            class="flex items-center px-4 py-3 mb-2 rounded-lg text-gray-600 hover:bg-white transition-colors"
            :class="{ 'bg-orange-50 text-orange-500 font-medium': isCurrentRoute('upload') }"
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
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const emit = defineEmits(['logout']) // emit 정의 추가

const router = useRouter()
const route = useRoute()
const isMyPageOpen = ref(false)

const isMyPageActive = computed(() => {
  return route.path.includes('/user')
})

const isCurrentRoute = (path) => {
  return route.path.includes(path)
}

const toggleMyPage = () => {
  isMyPageOpen.value = !isMyPageOpen.value
}

// 로그아웃 핸들러 수정
const handleLogout = () => {
  emit('logout') // emit을 통해 부모 컴포넌트로 이벤트 전달
}
</script>