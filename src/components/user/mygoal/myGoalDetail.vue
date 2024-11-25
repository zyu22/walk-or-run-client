<!-- components/user/mygoal/myGoalDetail.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto">
      <!-- 모달 헤더 -->
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold text-gray-800">
          {{ isEditing ? '목표 수정' : '상세 정보' }}
        </h3>
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

      <!-- 목표 정보 폼 -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- 카테고리 선택 -->
        <div class="space-y-2" v-if="isEditing">
          <label class="block text-sm text-gray-600">카테고리</label>
          <select
            v-model="editedGoal.challengeCategoryCode"
            class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="1">달리기</option>
            <option value="2">걷기</option>
          </select>
        </div>
        <div v-else class="bg-orange-50 p-4 rounded-lg">
          <h4 class="font-medium text-lg text-gray-800 mb-2">
            {{ goal.challengeCategoryName }}
          </h4>
        </div>

        <!-- 단위 선택 -->
        <div class="space-y-2" v-if="isEditing">
          <label class="block text-sm text-gray-600">단위</label>
          <select
            v-model="editedGoal.challengeCategoryUnitCode"
            class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="1">시간(hour)</option>
            <option value="2">거리(km)</option>
          </select>
        </div>

        <!-- 목표량 -->
        <div class="space-y-2" v-if="isEditing">
          <label class="block text-sm text-gray-600">목표량</label>
          <input
            type="number"
            v-model="editedGoal.targetAmount"
            class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div v-else class="p-4 border border-gray-200 rounded-lg">
          <p class="text-sm text-gray-600">
            목표량: {{ goal.targetAmount }} {{ printType(goal.challengeCategoryUnitName) }}
          </p>
        </div>

        <!-- 기간 설정 -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="block text-sm text-gray-600">시작일</label>
            <input
              type="date"
              v-model="editedGoal.startDate"
              :disabled="!isEditing"
              class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div class="space-y-2">
            <label class="block text-sm text-gray-600">종료일</label>
            <input
              type="date"
              v-model="editedGoal.endDate"
              :disabled="!isEditing"
              class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <!-- 진행 상황 -->
        <div v-if="!isEditing" class="space-y-3">
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

        <!-- 현재 달성량 -->
        <div v-if="!isEditing" class="p-4 border border-gray-200 rounded-lg">
          <p class="text-sm text-gray-500 mb-1">현재 달성량</p>
          <p class="font-medium text-lg">
            {{ goal.currentAmount }} {{ printType(goal.challengeCategoryUnitName) }}
          </p>
        </div>

        <!-- 하단 버튼 -->
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="confirmDelete"
            class="px-6 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            삭제
          </button>
          <button
            type="button"
            v-if="!isEditing"
            @click="startEditing"
            class="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            수정
          </button>
          <button
            v-if="isEditing"
            type="button"
            @click="cancelEditing"
            class="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            v-if="isEditing"
            type="submit"
            class="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            저장
          </button>
          <button
            v-if="!isEditing"
            type="button"
            @click="$emit('close')"
            class="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            확인
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import api from '@/api/axios'

const userStore = useUserStore()
const props = defineProps({
  goal: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'update'])

const isEditing = ref(false)
const editedGoal = reactive({
  userGoalId: 0,
  userId: 0,
  challengeCategoryCode: '',
  challengeCategoryUnitCode: '',
  startDate: '',
  endDate: '',
  targetAmount: 0
})

const startEditing = () => {
  editedGoal.userGoalId = props.goal.userGoalId
  editedGoal.userId = props.goal.userId
  editedGoal.challengeCategoryCode = props.goal.challengeCategoryCode
  editedGoal.challengeCategoryUnitCode = props.goal.challengeCategoryUnitCode
  editedGoal.startDate = props.goal.startDate
  editedGoal.endDate = props.goal.endDate
  editedGoal.targetAmount = props.goal.targetAmount
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
}

// script 부분에 추가
const isSubmitting = ref(false)

// 삭제 확인 및 처리 함수
const confirmDelete = async () => {
  if (!confirm('목표를 삭제하시겠습니까?\n삭제된 목표는 복구할 수 없습니다.')) {
    return
  }

  try {
    isSubmitting.value = true
    const response = await api.delete(`/user/${userStore.userId}/goal/${props.goal.userGoalId}`, {
      headers: {
        'Authorization': `Bearer ${userStore.accessToken}`
      }
    })

    if (response.status === 200) {
      alert('목표가 성공적으로 삭제되었습니다.')
      emit('update')  // 목록 새로고침
      emit('close')   // 모달 닫기
    }
  } catch (error) {
    console.error('Error deleting goal:', error)
    alert('목표 삭제 중 오류가 발생했습니다.')
  } finally {
    isSubmitting.value = false
  }
}

// handleSubmit 함수도 isSubmitting을 사용하도록 수정
const handleSubmit = async () => {
  if (isSubmitting.value) return

  try {
    isSubmitting.value = true
    const response = await api.put(
      `/user/${userStore.userId}/goal/${props.goal.userGoalId}`,
      editedGoal,
      {
        headers: {
          'Authorization': `Bearer ${userStore.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    if (response.status === 200) {
      alert('목표가 성공적으로 수정되었습니다.')
      emit('update')
      emit('close')
    }
  } catch (error) {
    console.error('Error updating goal:', error)
    alert('목표 수정 중 오류가 발생했습니다.')
  } finally {
    isSubmitting.value = false
  }
}



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
