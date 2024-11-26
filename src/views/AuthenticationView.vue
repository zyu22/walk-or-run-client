<template>
  <div>
    <!-- 기본 경로('/')일 때만 소개 페이지 표시 -->
    <div v-if="currentRoute.path === '/'">
      <div
        class="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8"
      >
        <transition name="slide-fade" mode="out-in">
          <!-- 여기에 기존의 소개 페이지 내용 -->
          <div v-if="activeSection === 0" key="intro">
            <!-- ... -->
          </div>
          <div v-else-if="activeSection === 1" key="features">
            <!-- ... -->
          </div>
          <div v-else key="cta">
            <!-- 로그인 버튼 수정 -->
            <button
              @click="router.push({ name: 'login' })"
              class="transform rounded-full bg-blue-500 px-8 py-4 font-bold text-white shadow-lg transition duration-300 hover:scale-105 hover:bg-blue-600"
            >
              로그인
            </button>
            <button
              @click="router.push({ name: 'register' })"
              class="transform rounded-full bg-blue-500 px-8 py-4 font-bold text-white shadow-lg transition duration-300 hover:scale-105 hover:bg-blue-600"
            >
              회원가입
            </button>
          </div>
        </transition>
      </div>
    </div>
    <!-- 다른 auth 관련 컴포넌트들(login, register 등) 표시 -->
    <RouterView v-else />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import WorkoutLog from '@/components/authentication/WorkoutLog.vue'
import ChallengeParticipation from '@/components/authentication/ChallengeParticipation.vue'
import GoalSetting from '@/components/authentication/GoalSetting.vue'

const router = useRouter()
const currentRoute = useRoute()
const activeSection = ref(0)
</script>

<style scoped></style>
