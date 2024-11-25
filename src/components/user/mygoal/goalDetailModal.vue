<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="max-h-[300vh] w-2/5 overflow-visible rounded-lg bg-white p-6">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-xl font-semibold">새 목표 추가</h3>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <span class="text-2xl">&times;</span>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- 챌린지 카테고리 선택 -->
        <div class="flex flex-col space-y-1">
          <label for="challengeCategory" class="block text-sm">챌린지 카테고리</label>
          <select
            id="challengeCategory"
            v-model="goalInfo.challengeCategoryCode"
            class="w-full rounded-md border border-gray-200 px-3 py-2"
          >
            <option value="1">뛰거나</option>
            <option value="2">걷거나</option>
          </select>
        </div>

        <!-- 챌린지 단위 선택 -->
        <div class="flex flex-col space-y-1">
          <label for="challengeUnit" class="block text-sm">챌린지 단위</label>
          <select
            id="challengeUnit"
            v-model="goalInfo.challengeCategoryUnitCode"
            class="w-full rounded-md border border-gray-200 px-3 py-2"
          >
            <option value="1">시간(hour)</option>
            <option value="2">거리(km)</option>
          </select>
        </div>

        <!-- 목표량 필드 -->
        <div class="flex flex-col space-y-1">
          <label for="amount" class="block text-sm">목표량</label>
          <input
            id="amount"
            v-model="goalInfo.targetAmount"
            type="number"
            placeholder="숫자를 입력하세요"
            class="w-full rounded-md border border-gray-200 px-3 py-2"
          />
        </div>

        <!-- 날짜 선택 -->
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col space-y-1">
            <label class="block text-sm">시작일</label>
            <Calendar
              v-model="goalInfo.startDate"
              :end-date="goalInfo.endDate"
              :is-start-date="true"
              placeholder="시작일 선택"
            />
            <p class="mt-1 text-xs text-gray-500">
              미입력 시 현재 날짜의 00:00으로 자동 설정됩니다
            </p>
          </div>

          <div class="flex flex-col space-y-1">
            <label class="block text-sm">종료일</label>
            <Calendar
              v-model="goalInfo.endDate"
              :start-date="goalInfo.startDate"
              :is-end-date="true"
              placeholder="종료일 선택"
            />
          </div>
        </div>

        <!-- 버튼 그룹 -->
        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="closeModal"
            class="rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            class="rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
          >
            추가
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import api from '@/api/axios'
import { useAlertStore } from '@/stores/alert'
import Calendar from '@/components/common/Calender.vue'
import { useValidation } from '@/components/common/Validation.js'

const { validateDates } = useValidation()
const alertStore = useAlertStore()
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close', 'goal-added'])

const userStore = useUserStore()

const goalInfo = reactive({
  userId: userStore.userId,
  challengeCategoryCode: '',
  challengeCategoryUnitCode: '',
  startDate: '',
  endDate: '',
  targetAmount: '',
})

const handleSubmit = async () => {
  const { isValid, message } = validateDates(goalInfo.startDate, goalInfo.endDate)
  // 필수 필드 검증
  if (!isValid) {
    alertStore.showNotify({
      title: '알림',
      message,
      type: 'error',
      position: 'center',
    })
    return
  }
  if (!goalInfo.challengeCategoryCode) {
    alertStore.showNotify({
      title: '알림',
      message: '카테고리를 선택해주세요.',
      type: 'error',
      position: 'center',
    })
    return
  }
  if (!goalInfo.challengeCategoryUnitCode) {
    alertStore.showNotify({
      title: '알림',
      message: '챌린지 단위를 선택해주세요.',
      type: 'error',
      position: 'center',
    })
    return
  }
  if (!goalInfo.targetAmount) {
    alertStore.showNotify({
      title: '알림',
      message: '목표량을 선택해주세요.',
      type: 'error',
      position: 'center',
    })
    return
  }

  console.log(goalInfo.startDate)
  console.log(goalInfo.endDate)

  try {
    const token = localStorage.getItem('accessToken')
    await api.post(`/user/${userStore.userId}/goal`, goalInfo, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    emit('goal-added')
    closeModal()
    resetForm()
  } catch (error) {
    console.error('Error adding goal:', error)
  }
}

const closeModal = () => {
  emit('close')
}

const resetForm = () => {
  Object.assign(goalInfo, {
    userId: userStore.userId,
    challengeCategoryCode: '',
    challengeCategoryUnitCode: '',
    startDate: '',
    endDate: '',
    targetAmount: '',
  })
}
</script>
