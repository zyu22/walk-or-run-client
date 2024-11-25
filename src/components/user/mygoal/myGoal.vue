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
          class="p-4 border rounded-lg hover:border-orange-500 transition-all"
        >
          <div class="flex justify-between items-center">
            <h3 class="font-medium text-gray-800">
              {{ goal.challengeCategoryName }}
            </h3>
            <span class="text-sm text-gray-500">
              {{ goal.challengeCategoryUnitName }}
            </span>
          </div>
          <div class="mt-2 space-y-2">
            <div class="flex justify-between text-sm">
              <span>진행도: {{ goal.currentAmount }}/{{ goal.targetAmount }}</span>
              <span>{{ calculateProgress(goal.currentAmount, goal.targetAmount) }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-orange-500 h-2 rounded-full transition-all"
                :style="{ width: `${calculateProgress(goal.currentAmount, goal.targetAmount)}%` }"
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import api from '@/api/axios'
import GoalFormModal from './GoalFormModal.vue'

const userStore = useUserStore()
const goals = ref([])
const isModalOpen = ref(false)

const fetchGoals = async () => {
  try {
    const response = await api.get(`/api/user/${userStore.userId}/goal`, {
      headers: {
        'Authorization': `Bearer ${userStore.accessToken}`
      }
    })
    goals.value = response.data
  } catch (error) {
    console.error('Error fetching goals:', error)
  }
}

const calculateProgress = (current, target) => {
  return Math.round((current / target) * 100)
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

onMounted(() => {
  fetchGoals()
})
</script>