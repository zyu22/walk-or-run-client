<template>
  <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
    <div>
      <div class="flex items-center gap-2 mb-4">
        <h3 class="text-lg font-semibold text-gray-700">
          {{ title }}
        </h3>
      </div>
      
      <!-- 목표 목록 출력 -->
      <div v-if="goals.length > 0" class="space-y-3">
        <div v-for="(goal, index) in goals.slice(0, 3)" 
             :key="goal.userGoalId" 
             class="group flex items-center p-3 transition-all duration-300 hover:bg-orange-50 rounded-lg cursor-pointer">
          <!-- 목표 번호 -->
          <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 text-[#FF6F3B] font-semibold mr-3 group-hover:bg-[#FF6F3B] group-hover:text-white transition-colors duration-300">
            {{ index + 1 }}
          </div>
          
          <!-- 목표 정보 -->
          <div class="flex-grow">
            <p class="text-sm font-medium text-gray-700 group-hover:text-[#FF6F3B] transition-colors duration-300">
              {{ goal.challengeCategoryName }}
            </p>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-xs text-gray-500">
                {{ goal.targetAmount }} {{ printType(goal.challengeCategoryUnitName) }}
              </span>
              <span class="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-[#FF6F3B]">
                {{ calculateTimeElapsed(goal.endDate) }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 데이터가 없을 경우 표시 -->
      <div v-else class="flex flex-col items-center justify-center p-6 text-gray-500">
        <span class="text-4xl mb-2">🎯</span>
        <p class="text-sm">설정된 목표가 없습니다</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import api from '@/api/axios'

const props = defineProps({
  title: {
    type: String,
    required: true
  }
})

const userStore = useUserStore()
const goals = ref([])

// 현재 날짜와 종료일까지의 D-day 계산
const calculateTimeElapsed = (endDate) => {
  const end = new Date(endDate)
  const now = new Date()
  
  // 날짜 차이 계산 (밀리초 단위를 일 단위로 변환)
  const diffTime = end.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  // D-day 형식으로 반환
  if (diffDays > 0) {
    return `D-${diffDays}`
  } else if (diffDays === 0) {
    return 'D-Day'
  } else {
    return `D+${Math.abs(diffDays)}`
  }
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

const fetchGoals = async () => {
  try {
    const response = await api.get(`/user/${userStore.userId}/goal`, {
      headers: {
        'Authorization': `Bearer ${userStore.accessToken}`
      }
    })
    goals.value = response.data
    console.log("목표 데이터:", goals.value)
  } catch (error) {
    console.error('Error fetching goals:', error)
    goals.value = []
  }
}

onMounted(() => {
  fetchGoals()
})
</script>