<template>
  <div class="pl-6 pr-6">
    <!-- Sidebar with gray background and spacing -->
    <div class="h-[calc(100vh-3rem)] w-72 rounded-2xl bg-gray-50">
      <!-- Navigation Container -->
      <div class="flex h-full flex-col">
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
        <nav class="flex-1 px-4">
          <router-link
            to="/dashboard"
            class="mb-2 flex items-center rounded-lg px-4 py-3 text-gray-600 transition-colors hover:bg-white"
            :class="{ 'bg-orange-50 font-medium text-orange-500': isCurrentRoute('dashboard') }"
          >
            <span class="mr-3">📊</span>
            Dashboard
          </router-link>

          <router-link
            to="/challenge"
            class="mb-2 flex items-center rounded-lg px-4 py-3 text-gray-600 transition-colors hover:bg-white"
            :class="{ 'bg-orange-50 font-medium text-orange-500': isCurrentRoute('challenge') }"
          >
            <span class="mr-3">🎯</span>
            Challenge
          </router-link>

          <router-link
            to="/follow"
            class="mb-2 flex items-center rounded-lg px-4 py-3 text-gray-600 transition-colors hover:bg-white"
            :class="{ 'bg-orange-50 font-medium text-orange-500': isCurrentRoute('follow') }"
          >
            <span class="mr-3">👥</span>
            Follow
          </router-link>

          <!-- MyPage -->
          <div class="mb-2">
            <button
              @click="toggleMyPage"
              class="flex w-full items-center justify-between rounded-lg px-4 py-3 text-gray-600 transition-colors hover:bg-white"
              :class="{ 'bg-orange-50 font-medium text-orange-500': isMyPageActive }"
            >
              <div class="flex items-center">
                <span class="mr-3">⚙️</span>
                MyPage
              </div>
              <span
                class="text-sm transition-transform duration-200"
                :class="{ 'rotate-180 transform': isMyPageOpen }"
              >
                ▼
              </span>
            </button>

            <!-- Submenu -->
            <div v-show="isMyPageOpen" class="ml-4 mt-1 space-y-1">
              <router-link
                to="/user/info"
                class="flex items-center rounded-lg px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-white"
                :class="{ 'bg-orange-50 font-medium text-orange-500': isCurrentRoute('info') }"
              >
                <span class="mr-3">👤</span>
                내 정보 관리
              </router-link>

              <router-link
                to="/user/password"
                class="flex items-center rounded-lg px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-white"
                :class="{ 'bg-orange-50 text-orange-500': isCurrentRoute('password') }"
              >
                <span class="mr-3">🔒</span>
                내 비밀번호 관리
              </router-link>

              <router-link
                to="/user/goal"
                class="flex items-center rounded-lg px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-white"
                :class="{ 'bg-orange-50 font-medium text-orange-500': isCurrentRoute('goal') }"
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
            class="mb-2 flex items-center rounded-lg px-4 py-3 text-gray-600 transition-colors hover:bg-white"
            :class="{ 'bg-orange-50 font-medium text-orange-500': isCurrentRoute('upload') }"
          >
            <span class="mr-3">📤</span>
            Upload
          </router-link>

          <button
            @click="handleLogout"
            class="flex w-full items-center rounded-lg px-4 py-3 text-gray-600 transition-colors hover:bg-white"
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

const router = useRouter()
const route = useRoute()
const isMyPageOpen = ref(false)
const emit = defineEmits(['logout'])

const isMyPageActive = computed(() => {
  return route.path.includes('/user')
})

const isCurrentRoute = (path) => {
  return route.path.includes(path)
}

const toggleMyPage = () => {
  isMyPageOpen.value = !isMyPageOpen.value
}

// 이벤트만 부모(App.vue)한테 전송
const handleLogout = () => {
  emit('logout')
}
</script>
