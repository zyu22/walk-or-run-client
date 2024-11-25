<!-- components/user/MyGoals.vue -->
<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-800">내 목표 관리</h2>
      <button
        @click="openModal"
        class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
      >
        목표 추가
      </button>
    </div>

    <!-- 목표 목록 -->
    <div class="space-y-4">
      <div v-if="goals.length > 0">
        <div
          v-for="goal in goals"
          :key="goal.userGoalId"
          class="p-4 my-5 border rounded-lg hover:border-orange-500 transition-all"
        >
          <div class="flex justify-between items-center">
            <h3 class="font-medium text-gray-800">
              {{ goal.challengeCategoryName }}
            </h3>
            <button 
              @click="showDetail(goal)"
              class="flex items-center justify-center w-8 h-8 rounded-full hover:bg-orange-50 text-gray-400 hover:text-orange-500 transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fill-rule="evenodd" 
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                  clip-rule="evenodd" 
                />
              </svg>
            </button>
          </div>
          <div class="mt-2 space-y-2">
            <div class="flex justify-between text-sm">
              <span>진행도: {{ calculateTimeProgress(goal.startDate, goal.endDate) }}%</span>
              <span class="text-sm text-gray-500">하루 목표량 : {{ goal.targetAmount }} {{ printType(goal.challengeCategoryUnitName) }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-orange-500 h-2 rounded-full transition-all"
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
      <div v-else class="text-center py-8 text-gray-500">
        <p>설정된 목표가 없습니다</p>
      </div>
    </div>

    <!-- 목표 추가 모달 -->
    <GoalFormModal 
      :is-open="isModalOpen"
      @close="closeModal"
      @goal-added="handleGoalAdded"
    />

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
import GoalFormModal from '@/components/user/mygoal/GoalFormModal.vue'
import myGoalDetail from '@/components/user/mygoal/myGoalDetail.vue'

const userStore = useUserStore()
const goals = ref([])
const isModalOpen = ref(false)
const selectedGoal = ref(null)  // 추가: 선택된 목표 상태

const fetchGoals = async () => {
  try {
    const response = await api.get(`/user/${userStore.userId}/goal`, {
      headers: {
        'Authorization': `Bearer ${userStore.accessToken}`
      }
    })
    goals.value = response.data
    console.log(goals.value)
  } catch (error) {
    console.error('Error fetching goals:', error)
  }
}

// 추가: 상세보기 모달 열기
const showDetail = (goal) => {
  console.log('Showing detail for goal:', goal)
  selectedGoal.value = goal
}

// 추가: 상세보기 모달 닫기
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
  console.log(challengeCategoryUnitName.split('(')[1])
  return challengeCategoryUnitName.split('(')[1].split(')')[0]
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
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
  await fetchGoals()  // 목표 목록 새로고침
  selectedGoal.value = null  // 모달 닫기
}

onMounted(() => {
  fetchGoals()
})
</script>