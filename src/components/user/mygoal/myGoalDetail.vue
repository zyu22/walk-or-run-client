<!-- components/user/mygoal/myGoalDetail.vue -->
<template>
  <div v-if="goal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-900">목표 상세 정보</h2>
        <button
          @click="$emit('close')"
          class="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <label class="text-sm font-medium text-gray-600">카테고리</label>
          <p class="mt-1 text-gray-900">{{ goal.challengeCategoryName }}</p>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-600">기간</label>
          <p class="mt-1 text-gray-900">
            {{ formatDate(goal.startDate) }} - {{ formatDate(goal.endDate) }}
          </p>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-600">하루 목표량</label>
          <p class="mt-1 text-gray-900">
            {{ goal.targetAmount }} {{ printType(goal.challengeCategoryUnitName) }}
          </p>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-600">진행률</label>
          <div class="mt-2">
            <div class="mb-1 flex justify-between text-sm">
              <span>{{ progress }}%</span>
            </div>
            <div class="h-2 w-full rounded-full bg-gray-200">
              <div
                class="h-2 rounded-full bg-orange-500 transition-all"
                :style="{ width: `${progress}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <button
          @click="handleDelete"
          class="rounded-lg border border-red-500 px-4 py-2 text-red-500 hover:bg-red-50"
        >
          삭제
        </button>
        <button
          @click="$emit('close')"
          class="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
        >
          닫기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import api from '@/api/axios'
import { useAlertStore } from '@/stores/alert'

const alertStore = useAlertStore()
const userStore = useUserStore()

const props = defineProps({
  goal: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'update'])

const progress = computed(() => {
  return calculateTimeProgress(props.goal.startDate, props.goal.endDate)
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const printType = (challengeCategoryUnitName) => {
  return challengeCategoryUnitName.split('(')[1].split(')')[0]
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

const handleDelete = async () => {
  alertStore.showConfirm({
    title: '알림',
    message: '목표를 삭제하시겠습니까?',
    onConfirm: async () => {

      try {
        await api.delete(`/user/${userStore.userId}/goal/${props.goal.userGoalId}`, {
      headers: {
        Authorization: `Bearer ${userStore.accessToken}`
      }
    })

    alertStore.showNotify({
          title: '알림',
          message: '목표가 삭제되었습니다.',
          type: 'success',
          position: 'top-right',
        })
        emit('update')
      } catch (error) {
        console.error('목표 삭제 실패:', error)
        alertStore.showNotify({
      title: '알림',
      message: '목표 삭제 중 오류가 발생했습니다.',
      type: 'error',
      position: 'center',
    })
      }
    },
    onCancel: () => {
      return
    },
  })
}
</script>
