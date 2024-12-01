<template>
  <div
    class="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8"
  >
    <transition name="slide-fade" mode="out-in">
      <div
        v-if="activeSection === 0"
        key="intro"
        class="mb-8 w-full max-w-4xl rounded-lg bg-white p-8 text-center shadow-lg"
      >
        <h1 class="mb-4 animate-pulse text-4xl font-bold text-blue-600">
          WalkOrRun에 오신 걸 환영합니다!
        </h1>
        <p class="mb-8 text-lg text-gray-700">
          운동을 기록하고, 챌린지에 참여하며, 운동 목표를 달성하세요. 모두 한 곳에서 가능합니다.
        </p>
        <button
          @click="activeSection = 1"
          class="transform rounded-full bg-blue-500 px-8 py-4 font-bold text-white shadow-lg transition duration-300 hover:scale-105 hover:bg-blue-600"
        >
          더 알아보기
        </button>
      </div>

      <div v-else-if="activeSection === 1" key="features" class="w-full max-w-4xl space-y-8">
        <WorkoutLog />
        <ChallengeParticipation />
        <GoalSetting />

        <div class="mt-8 flex justify-center">
          <button
            @click="activeSection = 2"
            class="transform rounded-full bg-blue-500 px-8 py-4 font-bold text-white shadow-lg transition duration-300 hover:scale-105 hover:bg-blue-600"
          >
            시작하기
          </button>
        </div>
      </div>

      <div v-else key="cta" class="text-center">
        <h2 class="mb-8 animate-pulse text-4xl font-bold text-gray-800">지금 바로 시작하세요!</h2>
        <p class="mb-8 text-xl text-gray-700">
          건강하고 활동적인 삶을 향한 여정의 시작, 운동 대시보드와 함께 하세요.
        </p>
        <button
          @click="navigateToLogin"
          class="mr-4 transform rounded-full bg-blue-500 px-8 py-4 font-bold text-white shadow-lg transition duration-300 hover:scale-105 hover:bg-blue-600"
        >
          로그인
        </button>
        <button
          @click="navigateToRegister"
          class="transform rounded-full bg-blue-500 px-8 py-4 font-bold text-white shadow-lg transition duration-300 hover:scale-105 hover:bg-blue-600"
        >
          회원가입
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import WorkoutLog from '@/components/authentication/WorkoutLog.vue'
import ChallengeParticipation from '@/components/authentication/ChallengeParticipation.vue'
import GoalSetting from '@/components/authentication/GoalSetting.vue'

export default {
  name: 'AuthenticationView',
  components: {
    WorkoutLog,
    ChallengeParticipation,
    GoalSetting,
  },
  setup() {
    const router = useRouter()
    const activeSection = ref(0)

    const navigateToLogin = () => {
      activeSection.value = 2 // 섹션 변경
      setTimeout(() => {
        router.push('/login')
      }, 500)
    }

    const navigateToRegister = () => {
      activeSection.value = 2 // 섹션 변경
      setTimeout(() => {
        router.push('/register')
      }, 500)
    }

    return {
      activeSection,
      navigateToLogin,
      navigateToRegister,
    }
  },
}
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
