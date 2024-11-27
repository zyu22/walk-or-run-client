<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black bg-opacity-50"
    @click.self="handleClose"
  >
    <div class="modal-container w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-8">
      <!-- 헤더 -->
      <div class="mb-6 flex items-start justify-between">
        <div>
          <h2 class="font-paperlogy text-4xl font-bold text-gray-900">반복 챌린지 추가</h2>
        </div>
        <button @click="handleClose" type="button" class="text-gray-500 hover:text-gray-700">
          <span class="sr-only">Close</span>
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- 폼 -->
      <div class="space-y-6">
        <!-- 카테고리 선택 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">챌린지 카테고리</label>
          <select
            v-model="challengeForm.challengeCategoryCode"
            class="w-full rounded-lg border border-gray-300 p-3 focus:border-[#ff6f3b] focus:outline-none focus:ring-1"
          >
            <option value="">카테고리 선택</option>
            <option value="1">뛰거나</option>
            <option value="2">걷거나</option>
          </select>
        </div>

        <!-- 제목 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">챌린지 제목</label>
          <input
            type="text"
            v-model="challengeForm.challengeTitle"
            class="w-full rounded-lg border border-gray-300 p-3 focus:border-[#ff6f3b] focus:outline-none focus:ring-1"
            placeholder="챌린지 제목을 입력하세요"
          />
        </div>

        <!-- 내용 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">챌린지 내용</label>
          <textarea
            v-model="challengeForm.challengeDescription"
            rows="4"
            class="w-full rounded-lg border border-gray-300 p-3 focus:border-[#ff6f3b] focus:outline-none focus:ring-1"
            placeholder="챌린지 내용을 입력하세요"
          ></textarea>
        </div>

        <!-- 목표 인원 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">목표 인원</label>
          <input
            type="number"
            v-model="challengeForm.challengeTargetCnt"
            class="w-full rounded-lg border border-gray-300 p-3 focus:border-[#ff6f3b] focus:outline-none focus:ring-1"
            placeholder="목표 인원을 입력하세요"
            min="1"
          />
        </div>

        <!-- 반복 주기 선택 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">반복 주기</label>
          <select
            v-model="challengeForm.challengeSchedulerCycle"
            class="w-full rounded-lg border border-gray-300 p-3 focus:border-[#ff6f3b] focus:outline-none focus:ring-1"
          >
            <option value="">반복 주기 선택</option>
            <option value="1">일일</option>
            <option value="2">주간</option>
            <option value="3">월간</option>
          </select>
        </div>

        <!-- 날짜 선택 -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">시작일</label>
            <Calender
              v-model="challengeForm.challengeCreateDate"
              :end-date="challengeForm.challengeDeleteDate"
              :is-start-date="true"
              :is-end-date="false"
              placeholder="시작일 선택"
              :is-in-modal="true"
              :modalOpen="isOpen"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">종료일</label>
            <Calender
              v-model="challengeForm.challengeDeleteDate"
              :start-date="challengeForm.challengeCreateDate"
              :is-start-date="false"
              :is-end-date="true"
              placeholder="종료일 선택"
              :is-in-modal="true"
              :modalOpen="isOpen"
            />
          </div>
        </div>

        <!-- 버튼 -->
        <div class="flex justify-end space-x-3 pt-4">
          <button
            @click="createScheduleChallenge"
            type="button"
            class="rounded-lg bg-[#ff6f3b] px-4 py-2 text-white hover:bg-[#ff5722]"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? '등록 중...' : '등록하기' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { useUserStore } from '@/stores/user'
import Calender from '@/components/common/Calender.vue'
import api from '@/api/axios'
import { useAlertStore } from '@/stores/alert'

// Props 정의
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
})

// Emits 정의
const emit = defineEmits(['close', 'refresh'])
const alertStore = useAlertStore()
const userStore = useUserStore()
const isSubmitting = ref(false)

// 폼 데이터 초기화
const initializeForm = () => ({
  challengeCategoryCode: '',
  challengeTitle: '',
  challengeDescription: '',
  challengeTargetCnt: null,
  challengeCreateDate: '',
  challengeDeleteDate: '',
  challengeAuthorId: userStore.userId,
  challengeSchedulerCycle: '', // 추가된 필드
})

const challengeForm = ref(initializeForm())

// 모달 닫기
const handleClose = () => {
  challengeForm.value = initializeForm()
  emit('close')
}

// 챌린지 생성
const createScheduleChallenge = async () => {
  // 필수 필드 검증
  const validations = [
    { field: 'challengeCategoryCode', message: '카테고리를 선택해주세요.' },
    { field: 'challengeTitle', message: '챌린지 제목을 입력해주세요.' },
    { field: 'challengeDescription', message: '챌린지 내용을 입력해주세요.' },
    { field: 'challengeTargetCnt', message: '목표 인원을 입력해주세요.' },
    { field: 'challengeSchedulerCycle', message: '반복 주기를 선택해주세요.' },
  ]

  for (const validation of validations) {
    if (!challengeForm.value[validation.field]) {
      alertStore.showNotify({
        title: '알림',
        message: validation.message,
        type: 'error',
        position: 'center',
      })
      return
    }
  }

  try {
    isSubmitting.value = true

    // 날짜 포맷팅
    const requestData = {
      ...challengeForm.value,
      challengeCreateDate: challengeForm.value.challengeCreateDate
        ? `${challengeForm.value.challengeCreateDate} 00:00:00`
        : undefined,
      challengeDeleteDate: challengeForm.value.challengeDeleteDate
        ? `${challengeForm.value.challengeDeleteDate} 23:59:59`
        : undefined,
    }

    const response = await api.post('/admin/challenge/schedule', requestData)

    console.log(response)
    if (response.status === 201) {
      alertStore.showNotify({
        title: '알림',
        message: '반복 챌린지가 성공적으로 등록되었습니다.',
        type: 'success',
        position: 'center',
      })
      handleClose()
      emit('refresh')
    }
  } catch (error) {
    console.error('챌린지 등록 실패:', error)
    alertStore.showNotify({
      title: '알림',
      message: '챌린지 등록에 실패했습니다. 다시 시도해주세요.',
      type: 'error',
      position: 'center',
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.modal-container {
  max-height: 90vh;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.modal-container::-webkit-scrollbar {
  width: 6px;
}

.modal-container::-webkit-scrollbar-track {
  background: transparent;
  margin: 4px;
}

.modal-container::-webkit-scrollbar-thumb {
  background: rgba(203, 213, 225, 0.5);
  border-radius: 100px;
  transition: all 0.2s ease-in-out;
}

.modal-container::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.8);
}

.modal-container::-webkit-scrollbar-thumb:active {
  background: rgba(255, 111, 59, 1);
}

.modal-container::-webkit-scrollbar-corner {
  background: transparent;
}

.modal-container {
  scrollbar-gutter: stable;
  scroll-behavior: smooth;
}
</style>
