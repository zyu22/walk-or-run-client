// components/admin/Sidebar.vue
<template>
  <div class="flex h-screen bg-white">
    <!-- Left Padding for Sidebar -->
    <div class="pl-6">
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
              @click="router.push('/admin')"
            />
          </div>

          <!-- Navigation -->
          <nav class="flex-1 px-4">
            <router-link
              to="/admin"
              class="mb-2 flex items-center rounded-lg px-4 py-3 text-gray-600 transition-colors hover:bg-white"
              :class="{ 'bg-orange-50 font-medium text-orange-500': route.path === '/admin' }"
            >
              <span class="mr-3">📊</span>
              Dashboard
            </router-link>

            <router-link
              to="/admin/user"
              class="mb-2 flex items-center rounded-lg px-4 py-3 text-gray-600 transition-colors hover:bg-white"
              :class="{ 'bg-orange-50 font-medium text-orange-500': route.path === '/admin/user' }"
            >
              <span class="mr-3">⚙️</span>
              사용자 관리
            </router-link>

            <!-- Challenge Management with submenu -->
            <div class="mb-2">
              <button
                @click="toggleChallenge"
                class="flex w-full items-center justify-between rounded-lg px-4 py-3 text-gray-600 transition-colors hover:bg-white"
                :class="{ 'bg-orange-50 font-medium text-orange-500': isChallengeMenuActive }"
              >
                <div class="flex items-center">
                  <span class="mr-3">🎯</span>
                  챌린지 관리
                </div>
                <span
                  class="text-sm transition-transform duration-200"
                  :class="{ 'rotate-180 transform': isChallengeOpen }"
                >
                  ▼
                </span>
              </button>

              <!-- Submenu -->
              <div v-show="isChallengeOpen" class="ml-4 mt-1 space-y-1">
                <router-link
                  :to="{ name: 'adminChallenge' }"
                  class="flex items-center rounded-lg px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-white"
                  :class="{
                    'bg-orange-50 font-medium text-orange-500': route.name === 'adminChallenge',
                  }"
                >
                  <span class="mr-3">1️⃣</span>
                  챌린지 관리
                </router-link>

                <router-link
                  :to="{ name: 'adminScheduleChallenge' }"
                  class="flex items-center rounded-lg px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-white"
                  :class="{
                    'bg-orange-50 font-medium text-orange-500':
                      route.name === 'adminScheduleChallenge',
                  }"
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
              class="mb-2 flex items-center rounded-lg px-4 py-3 text-gray-600 transition-colors hover:bg-white"
              :class="{ 'bg-orange-50 font-medium text-orange-500': route.path === '/upload' }"
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

    <!-- Main Content Area (White Background) -->
    <main class="flex-1 bg-white p-3">
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

// 부모한테 이벤트만 전달
const handleLogout = () => {
  emit('logout')
}
</script>
