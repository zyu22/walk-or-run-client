<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black bg-opacity-50"
  >
    <div class="modal-container w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-8">
      <!-- 헤더 -->
      <div class="mb-6 flex items-start justify-between">
        <div>
          <h2 class="font-paperlogy text-4xl font-bold text-gray-900">챌린지 추가</h2>
        </div>
        <button @click="closeAddModal" class="text-gray-500 hover:text-gray-700">
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

        <!-- 날짜 선택 -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">시작일</label>
            <Calendar
              v-model="challengeForm.challengeCreateDate"
              :start-date="challengeForm.challengeCreateDate"
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
              :end-date="challengeForm.challengeDeleteDate"
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
            @click="createChallenge"
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
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import api from '@/api/axios'
import Calendar from '@/components/common/Calender.vue'
import { useAlertStore } from '@/stores/alert'
import Calender from '@/components/common/Calender.vue'

const alertStore = useAlertStore()
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close', 'refresh'])
const userStore = useUserStore()
const isSubmitting = ref(false)

const challengeForm = ref({
  challengeCategoryCode: '',
  challengeTitle: '',
  challengeDescription: '',
  challengeAuthorId: '',
  challengeTargetCnt: null,
  challengeCreateDate: '',
  challengeDeleteDate: '',
  challengeAuthorId: userStore.userId,
})

// API 호출 시
const createChallenge = async () => {
  // 필수 필드 검증
  if (!challengeForm.value.challengeCategoryCode) {
    alertStore.showNotify({
      title: '알림',
      message: '카테고리를 선택해주세요.',
      type: 'error',
      position: 'center',
    })
    return
  }
  if (!challengeForm.value.challengeTitle) {
    alertStore.showNotify({
      title: '알림',
      message: '챌린지 제목을 입력해주세요.',
      type: 'error',
      position: 'center',
    })
    return
  }
  if (!challengeForm.value.challengeDescription) {
    alertStore.showNotify({
      title: '알림',
      message: '챌린지 내용을 입력해주세요.',
      type: 'error',
      position: 'center',
    })
    return
  }
  if (!challengeForm.value.challengeTargetCnt) {
    alertStore.showNotify({
      title: '알림',
      message: '목표 인원을 입력해주세요.',
      type: 'error',
      position: 'center',
    })
    return
  }

  try {
    // API 요청을 위한 데이터 정제
    const requestData = {
      challengeCategoryCode: challengeForm.value.challengeCategoryCode,
      challengeTitle: challengeForm.value.challengeTitle,
      challengeAuthorId: userStore.userId,
      challengeDescription: challengeForm.value.challengeDescription,
      challengeTargetCnt: challengeForm.value.challengeTargetCnt,
      challengeCreateDate: `${challengeForm.value.challengeCreateDate} 00:00:00`,
      challengeDeleteDate: `${challengeForm.value.challengeDeleteDate} 23:59:59`,
    }

    console.log('카테고리 코드:', requestData.challengeCategoryCode)
    console.log('제목:', requestData.challengeTitle)
    console.log('작성자 ID:', requestData.challengeAuthorId)
    console.log('설명:', requestData.challengeDescription)
    console.log('목표 수:', requestData.challengeTargetCnt)
    console.log('생성일:', requestData.challengeCreateDate)
    console.log('삭제일:', requestData.challengeDeleteDate)

    const response = await api.post('/admin/challenge', {
      challengeCategoryCode: challengeForm.value.challengeCategoryCode,
      challengeTitle: challengeForm.value.challengeTitle,
      challengeAuthorId: userStore.userId,
      challengeDescription: challengeForm.value.challengeDescription,
      challengeTargetCnt: challengeForm.value.challengeTargetCnt,
      challengeCreateDate: `${challengeForm.value.challengeCreateDate} 00:00:00`,
      challengeDeleteDate: `${challengeForm.value.challengeDeleteDate} 23:59:59`,
    })
    if (response.status === 201) {
      alertStore.showNotify({
        title: '알림',
        message: '챌린지가 성공적으로 등록되었습니다.',
        type: 'success',
        position: 'top-right',
      })
      emit('refresh')
      closeAddModal()
    }
  } catch (error) {
    console.error('챌린지 등록 실패:', error)
    alertStore.showNotify({
      title: '알림',
      message: '챌린지 등록에 실패하였습니다.\n 다시 시도해주세요.',
      type: 'error',
      position: 'center',
    })
  }
}

const closeAddModal = () => {
  // 폼 초기화
  challengeForm.value = {
    challengeCategoryCode: '',
    challengeTitle: '',
    challengeDescription: '',
    challengeTargetCnt: null,
    challengeCreateDate: '',
    challengeDeleteDate: '',
    challengeAuthorId: userStore.userId,
  }
  emit('close')
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
