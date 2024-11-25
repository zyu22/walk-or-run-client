<!-- components/user/mygoal/myGoalDetail.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto">
      <!-- 모달 헤더 -->
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold text-gray-800">상세 정보</h3>
        <button 
          @click="$emit('close')" 
          class="hover:bg-gray-100 p-2 rounded-full transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-6 w-6 text-gray-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 목표 정보 -->
      <div class="space-y-6">
        <!-- 카테고리 섹션 -->
        <div class="bg-orange-50 p-4 rounded-lg">
          <h4 class="font-medium text-lg text-gray-800 mb-2">
            {{ goal.challengeCategoryName }}
          </h4>
          <p class="text-sm text-gray-600">
            목표량: {{ goal.targetAmount }} {{ printType(goal.challengeCategoryUnitName) }}
          </p>
        </div>

        <!-- 진행 상황 -->
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">진행 상황</span>
            <span class="text-sm font-medium">{{ calculateTimeProgress(goal.startDate, goal.endDate) }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-orange-500 h-2.5 rounded-full transition-all"
              :style="{ width: `${calculateTimeProgress(goal.startDate, goal.endDate)}%` }"
            ></div>
          </div>
        </div>

        <!-- 기간 정보 -->
        <div class="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <p class="text-sm text-gray-500 mb-1">시작일</p>
            <p class="font-medium">{{ formatDate(goal.startDate) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">종료일</p>
            <p class="font-medium">{{ formatDate(goal.endDate) }}</p>
          </div>
        </div>

        <!-- 현재 달성량 -->
        <div class="p-4 border border-gray-200 rounded-lg">
          <p class="text-sm text-gray-500 mb-1">현재 달성량</p>
          <p class="font-medium text-lg">
            {{ goal.currentAmount }} {{ printType(goal.challengeCategoryUnitName) }}
          </p>
        </div>
      </div>

      <!-- 하단 버튼 -->
      <div class="mt-8 flex justify-end">
        <button
          @click="$emit('close')"
          class="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          확인
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  goal: {
    type: Object,
    required: true
  }
})

defineEmits(['close'])

// 단위 표시 형식
const printType = (challengeCategoryUnitName) => {
  return challengeCategoryUnitName.split('(')[1].split(')')[0]
}

// 날짜 포맷팅
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 진행률 계산
const calculateTimeProgress = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const now = new Date()
  
  const total = end - start
  const elapsed = now - start
  
  if (total === 0) return 0
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)))
}
</script>