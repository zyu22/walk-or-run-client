<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black bg-opacity-50"
  >
    <div class="modal-container w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-8">
      <!-- 헤더 -->
      <div class="mb-6 flex items-start justify-between">
        <div>
          <h2 class="text-2xl font-bold">챌린지 추가</h2>
        </div>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
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
            v-model="formData.challengeCategoryCode"
            class="w-full rounded-lg border border-gray-300 p-3 focus:border-[#ff6f3b] focus:outline-none focus:ring-1"
          >
            <option value="">카테고리 선택</option>
            <option value="HEALTH">건강</option>
            <option value="STUDY">학습</option>
            <option value="HOBBY">취미</option>
            <option value="LIFE">생활</option>
          </select>
        </div>

        <!-- 제목 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">챌린지 제목</label>
          <input
            type="text"
            v-model="formData.challengeTitle"
            class="w-full rounded-lg border border-gray-300 p-3 focus:border-[#ff6f3b] focus:outline-none focus:ring-1"
            placeholder="챌린지 제목을 입력하세요"
          />
        </div>

        <!-- 내용 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">챌린지 내용</label>
          <textarea
            v-model="formData.challengeDescription"
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
            v-model="formData.challengeTargetCnt"
            class="w-full rounded-lg border border-gray-300 p-3 focus:border-[#ff6f3b] focus:outline-none focus:ring-1"
            placeholder="목표 인원을 입력하세요"
            min="1"
          />
        </div>

        <!-- 날짜 선택 -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">시작일 (선택)</label>
            <input
              type="datetime-local"
              v-model="formData.challengeCreateDate"
              class="w-full rounded-lg border border-gray-300 p-3 focus:border-[#ff6f3b] focus:outline-none focus:ring-1"
            />
            <p class="mt-1 text-xs text-gray-500">미입력 시 현재 시간으로 자동 설정됩니다</p>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">종료일 (선택)</label>
            <input
              type="datetime-local"
              v-model="formData.challengeDeleteDate"
              class="w-full rounded-lg border border-gray-300 p-3 focus:border-[#ff6f3b] focus:outline-none focus:ring-1"
            />
          </div>
        </div>

        <!-- 버튼 -->
        <div class="flex justify-end space-x-3 pt-4">
          <button
            @click="closeModal"
            class="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            @click="submitForm"
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

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close', 'refresh'])
const userStore = useUserStore()
const isSubmitting = ref(false)

const formData = ref({
  challengeCategoryCode: '',
  challengeTitle: '',
  challengeDescription: '',
  challengeTargetCnt: null,
  challengeCreateDate: '',
  challengeDeleteDate: '',
  challengeAuthorId: userStore.userId,
})

const submitForm = async () => {
  // 필수 필드 검증
  if (!formData.value.challengeCategoryCode) {
    alert('카테고리를 선택해주세요.')
    return
  }
  if (!formData.value.challengeTitle) {
    alert('챌린지 제목을 입력해주세요.')
    return
  }
  if (!formData.value.challengeDescription) {
    alert('챌린지 내용을 입력해주세요.')
    return
  }
  if (!formData.value.challengeTargetCnt) {
    alert('목표 인원을 입력해주세요.')
    return
  }

  isSubmitting.value = true

  try {
    const response = await api.post('/challenge', formData.value)
    if (response.status === 200) {
      alert('챌린지가 성공적으로 등록되었습니다.')
      emit('refresh') // 목록 새로고침
      closeModal()
    }
  } catch (error) {
    console.error('챌린지 등록 실패:', error)
    alert('챌린지 등록에 실패했습니다. 다시 시도해주세요.')
  } finally {
    isSubmitting.value = false
  }
}

const closeModal = () => {
  // 폼 초기화
  formData.value = {
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
