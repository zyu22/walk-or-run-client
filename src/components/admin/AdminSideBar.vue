<template>
  <div class="pl-6 pr-6">
    <div class="h-full w-72 rounded-2xl bg-gray-50">
      <div class="flex h-full flex-col">
        <div class="p-6 pb-8">
          <img
            src="@/assets/logo.png"
            alt="WalkOrRun"
            class="h-40 w-auto cursor-pointer"
            @click="router.push({ name: 'adminDashboard' })"
          />
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4">
          <!-- <router-link
            :to="{ name: 'adminDashboard' }"
            class="mb-2 flex items-center rounded-lg px-4 py-3 text-gray-600 transition-colors hover:bg-white"
            :class="{
              'bg-orange-50 font-medium text-orange-500': route.name === 'adminDashboard',
            }"
          >
            <span class="mr-3">📊</span>
            Dashboard
          </router-link> -->

          <router-link
            :to="{ name: 'adminUser' }"
            class="mb-2 flex items-center rounded-lg px-4 py-3 text-gray-600 transition-colors hover:bg-white"
            :class="{ 'bg-orange-50 font-medium text-orange-500': route.name === 'adminUser' }"
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
          <!-- <router-link
            :to="{ name: 'uploadDefault' }"
            class="mb-2 flex items-center rounded-lg px-4 py-3 text-gray-600 transition-colors hover:bg-white"
            :class="{
              'bg-orange-50 font-medium text-orange-500': route.name === 'uploadDefault',
            }"
          >
            <span class="mr-3">📤</span>
            Upload
          </router-link> -->

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
import { useAlertStore } from '@/stores/alert'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const emit = defineEmits(['logout'])
const alertStore = useAlertStore()
const router = useRouter()
const route = useRoute()
const isChallengeOpen = ref(false)

const isChallengeMenuActive = computed(() => {
  return route.name === 'adminChallenge' || route.name === 'adminScheduleChallenge'
})

const toggleChallenge = () => {
  isChallengeOpen.value = !isChallengeOpen.value
}
const handleLogout = async () => {
  try {
    userStore.clearUserInfo()
    await router.push({ name: 'login' })
  } catch (error) {
    console.error('로그아웃 실패:', error)
    userStore.clearUserInfo()
    await router.push({ name: 'login' })
  }
}
</script>
