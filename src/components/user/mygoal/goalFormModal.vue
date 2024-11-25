<!-- components/user/GoalFormModal.vue -->
<template>
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-2/5 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
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
              <option value="1">달리기</option>
              <option value="2">걷기</option>
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
              <label for="startDate" class="block text-sm">시작날짜</label>
              <input
                id="startDate"
                v-model="goalInfo.startDate"
                type="date"
                class="w-full rounded-md border border-gray-200 px-3 py-2"
              />
            </div>
  
            <div class="flex flex-col space-y-1">
              <label for="endDate" class="block text-sm">종료날짜</label>
              <input
                id="endDate"
                v-model="goalInfo.endDate"
                type="date"
                class="w-full rounded-md border border-gray-200 px-3 py-2"
              />
            </div>
          </div>
  
          <!-- 버튼 그룹 -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive } from 'vue'
  import { useUserStore } from '@/stores/user'
  import api from '@/api/axios'
  
  const props = defineProps({
    isOpen: {
      type: Boolean,
      required: true
    }
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
    try {
      const token = localStorage.getItem('accessToken')
      await api.post(`/user/${userStore.userId}/goal`, goalInfo, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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