<template>
  <header class="mb-8 flex items-center justify-between">
    <div>
      <h1 class="font-paperlogy text-5xl font-bold text-gray-900">내 목표 관리</h1>
      <p class="mt-2 text-sm text-gray-600">나만의 목표를 추가하거나 수정해보세요!</p>
    </div>
    <div class="flex items-center gap-4">
      <button
        @click="openModal"
        class="rounded-lg bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600"
      >
        목표 추가
      </button>
    </div>
  </header>

  <div class="rounded-lg bg-white p-6 shadow-lg">
    <div class="mb-6 flex items-center justify-between"></div>

    <!-- 목표 목록 -->
    <div class="space-y-4">
      <div v-if="goals.length > 0">
        <div
          v-for="goal in goals"
          :key="goal.userGoalId"
          class="my-5 rounded-lg border p-4 transition-all hover:border-orange-500"
          @click="showDetail(goal)"
        >
          <div class="flex items-center justify-between">
            <h3 class="font-medium text-gray-800">
              {{ goal.challengeCategoryName }}
            </h3>

          </div>
          <div class="mt-2 space-y-2">
            <div class="flex justify-between text-sm">
              <span>진행도: {{ calculateTimeProgress(goal.startDate, goal.endDate) }}%</span>
              <span class="text-sm text-gray-500"
                >하루 목표량 : {{ goal.targetAmount }}
                {{ printType(goal.challengeCategoryUnitName) }}</span
              >
            </div>
            <div class="h-2 w-full rounded-full bg-gray-200">
              <div
                class="h-2 rounded-full bg-orange-500 transition-all"
                :style="{ width: `${calculateTimeProgress(goal.startDate, goal.endDate)}%` }"
              ></div>
            </div>
            <div class="flex justify-between text-xs text-gray-500">
              <span>시작: {{ formatDate(goal.startDate) }}</span>
              <span>종료: {{ formatDate(goal.endDate) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="py-8 text-center text-gray-500">
        <p>설정된 목표가 없습니다</p>
      </div>
    </div>

    <!-- 목표 추가 모달 -->
    <GoalFormModal :is-open="isModalOpen" @close="closeModal" @goal-added="handleGoalAdded" />

    <!-- 목표 상세 모달 -->
    <myGoalDetail
      v-if="selectedGoal"
      :goal="selectedGoal"
      @close="closeDetail"
      @update="handleGoalUpdated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import api from '@/api/axios'
import GoalFormModal from '@/components/user/mygoal/goalFormModal.vue'
import myGoalDetail from '@/components/user/mygoal/myGoalDetail.vue'

const userStore = useUserStore()
const goals = ref([])
const isModalOpen = ref(false)
const selectedGoal = ref(null)

const fetchGoals = async () => {
  try {
    const response = await api.get(`/user/${userStore.userId}/goal`, {
      headers: {
        Authorization: `Bearer ${userStore.accessToken}`,
      },
    })
    goals.value = response.data
  } catch (error) {
    console.error('Error fetching goals:', error)
  }
}

const showDetail = (goal) => {
  selectedGoal.value = goal
}


const closeDetail = () => {
  selectedGoal.value = null
}

// 시작 시간부터 현재까지 경과 시간 계산 (시간 단위)
const calculateTimeElapsed = (startDate) => {
  const start = new Date(startDate)
  const now = new Date()
  const elapsedHours = Math.max(0, Math.floor((now - start) / (1000 * 60 * 60)))
  return elapsedHours
}

// 전체 기간 계산 (시간 단위)
const calculateTotalDuration = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const totalHours = Math.floor((end - start) / (1000 * 60 * 60))
  return totalHours
}

// 시간 기준 진행률 계산
const calculateTimeProgress = (startDate, endDate) => {
  const elapsed = calculateTimeElapsed(startDate)
  const total = calculateTotalDuration(startDate, endDate)
  if (total === 0) return 0
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)))
}

// 출력 형식 계산
const printType = (challengeCategoryUnitName) => {
  return challengeCategoryUnitName.split('(')[1].split(')')[0]
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleGoalAdded = async () => {
  await fetchGoals()
}

const handleGoalUpdated = async () => {
  await fetchGoals() // 목표 목록 새로고침
  selectedGoal.value = null // 모달 닫기
}

onMounted(() => {
  fetchGoals()
})
</script>
