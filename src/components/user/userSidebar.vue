<template>
  <div class="pl-6 pr-6">
    <!-- Sidebar with gray background and spacing -->
    <div class="h-full w-72 rounded-2xl bg-gray-50">
      <!-- Navigation Container -->
      <div class="flex h-full flex-col">
        <!-- Logo Section -->
        <div class="p-6 pb-8">
          <img
            src="@/assets/logo.png"
            alt="WalkOrRun"
            class="h-40 w-auto cursor-pointer"
            @click="router.push('/user/dashboard')"
          />
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4">
          <router-link
            :to="{ name: 'userDashboard' }"
            class="mb-2 flex items-center rounded-lg px-4 py-3 text-gray-600 transition-colors hover:bg-white"
            :class="{ 'bg-orange-50 font-medium text-orange-500': route.name === 'userDashboard' }"
          >
            <span class="mr-3">📊</span>
            Dashboard
          </router-link>

          <router-link
            :to="{ name: 'userChallenge' }"
            class="mb-2 flex items-center rounded-lg px-4 py-3 text-gray-600 transition-colors hover:bg-white"
            :class="{ 'bg-orange-50 font-medium text-orange-500': route.name === 'userChallenge' }"
          >
            <span class="mr-3">🎯</span>
            Challenge
          </router-link>

          <router-link
            :to="{ name: 'userFollow' }"
            class="mb-2 flex items-center rounded-lg px-4 py-3 text-gray-600 transition-colors hover:bg-white"
            :class="{ 'bg-orange-50 font-medium text-orange-500': route.name === 'userFollow' }"
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
                :to="{ name: 'myInfo' }"
                class="flex items-center rounded-lg px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-white"
                :class="{ 'bg-orange-50 font-medium text-orange-500': route.name === 'myInfo' }"
              >
                <span class="mr-3">👤</span>
                내 정보 관리
              </router-link>

              <router-link
                :to="{ name: 'myPassword' }"
                class="flex items-center rounded-lg px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-white"
                :class="{ 'bg-orange-50 font-medium text-orange-500': route.name === 'myPassword' }"
              >
                <span class="mr-3">🔒</span>
                내 비밀번호 관리
              </router-link>

              <router-link
                :to="{ name: 'myGoal' }"
                class="flex items-center rounded-lg px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-white"
                :class="{ 'bg-orange-50 font-medium text-orange-500': route.name === 'myGoal' }"
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
            :to="{ name: 'uploadDefault' }"
            class="mb-2 flex items-center rounded-lg px-4 py-3 text-gray-600 transition-colors hover:bg-white"
            :class="{ 'bg-orange-50 font-medium text-orange-500': route.name === 'uploadDefault' }"
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
  return (
    route.path === '/user/info' || route.path === '/user/password' || route.path === '/user/goal'
  )
})

const toggleMyPage = () => {
  isMyPageOpen.value = !isMyPageOpen.value
}

const handleLogout = () => {
  emit('logout')
}
</script>
