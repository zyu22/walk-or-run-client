<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black bg-opacity-50"
    v-if="challengeDetail"
    @click.self="$emit('close')"
  >
    <div class="modal-container w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-8">
      <!-- 헤더 -->
      <div class="mb-6 flex items-start justify-between">
        <div>
          <h2 class="font-paperlogy text-4xl font-bold text-gray-900">챌린지 상세 정보</h2>
        </div>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
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

      <!-- 상세 정보 -->
      <div class="space-y-6">
        <!-- 카테고리 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">챌린지 카테고리</label>

          <select
            v-model="challengeDetail.challengeCategoryCode"
            class="w-full rounded-lg border border-gray-300 p-3 focus:border-[#ff6f3b] focus:outline-none focus:ring-1"
          >
            <!-- 첫 번째 옵션: 현재 CategoryCode와 Name -->
            <option :value="challengeDetail.challengeCategoryCode">
              {{ challengeDetail.challengeCategoryName }}
            </option>

            <!-- 두 번째 옵션: 반대 CategoryCode와 해당 Name -->
            <option :value="challengeDetail.challengeCategoryCode === 1 ? 2 : 1">
              {{ challengeDetail.challengeCategoryCode === 1 ? '걷거나' : '뛰거나' }}
            </option>
          </select>
        </div>

        <!-- 제목 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">챌린지 제목</label>
          <input
            type="text"
            v-model="challengeDetail.challengeTitle"
            class="w-full rounded-lg border border-gray-300 p-3 focus:border-[#ff6f3b] focus:outline-none focus:ring-1"
          />
        </div>

        <!-- 내용 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">챌린지 내용</label>
          <textarea
            v-model="challengeDetail.challengeDescription"
            rows="4"
            class="w-full rounded-lg border border-gray-300 p-3 focus:border-[#ff6f3b] focus:outline-none focus:ring-1"
          ></textarea>
        </div>

        <!-- 목표 인원 및 참여자 수 -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">목표 인원</label>
            <input
              type="number"
              v-model="challengeDetail.challengeTargetCnt"
              class="w-full rounded-lg border border-gray-300 p-3 focus:border-[#ff6f3b] focus:outline-none focus:ring-1"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">참여자 수</label>
            <input
              type="number"
              v-model="challengeDetail.challengeParticipantCnt"
              class="w-full rounded-lg border border-gray-300 p-3 focus:border-[#ff6f3b] focus:outline-none focus:ring-1"
            />
          </div>
        </div>

        <!-- 상세 정보 섹션에 반복 주기 선택 추가 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">반복 주기</label>
          <select
            v-model="challengeDetail.challengeSchedulerCycle"
            class="w-full rounded-lg border border-gray-300 p-3 focus:border-[#ff6f3b] focus:outline-none focus:ring-1"
          >
            <option value="1">일일</option>
            <option value="2">일주일</option>
            <option value="3">한달</option>
          </select>
        </div>

        <!-- 날짜 -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">시작일</label>
            <Calender
              v-model="challengeDetail.challengeCreateDate"
              :end-date="challengeDetail.challengeDeleteDate"
              :is-start-date="true"
              :is-end-date="false"
              placeholder="시작일 선택"
              :is-in-modal="true"
              :modal-open="!!challengeDetail"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">종료일</label>
            <Calender
              v-model="challengeDetail.challengeDeleteDate"
              :start-date="challengeDetail.challengeCreateDate"
              :is-start-date="false"
              :is-end-date="true"
              placeholder="종료일 선택"
              :is-in-modal="true"
              :modal-open="!!challengeDetail"
            />
          </div>
        </div>
        <!-- 버튼 그룹 -->
        <div class="flex justify-center space-x-4 pt-4">
          <button
            @click="updateChallenge"
            type="submit"
            class="rounded-lg bg-orange-500 px-6 py-2 text-white transition-colors hover:bg-orange-600"
          >
            수정
          </button>
          <button
            v-if="props.challengeDetail.challengeIsEnded !== 1"
            @click="deleteChallenge"
            type="submit"
            class="rounded-lg bg-black px-6 py-2 text-white transition-colors hover:bg-gray-600"
          >
            종료
          </button>
          <button
            v-else
            disabled
            class="cursor-not-allowed rounded-lg bg-gray-400 px-6 py-2 text-white"
          >
            종료된 챌린지
          </button>
        </div>

        <hr />

        <!-- 댓글 목록 -->
        <div class="space-y-6">
          <h3 class="text-lg font-semibold">댓글</h3>

          <div v-if="isCommentsLoading" class="flex justify-center py-4">
            <div class="animate-spin text-[#ff6f3b]">댓글 로딩중...</div>
          </div>

          <div v-else class="space-y-4">
            <!-- 댓글이 없는 경우 -->
            <div v-if="!comments.length" class="py-4 text-center text-gray-500">
              첫 번째 댓글을 작성해보세요!
            </div>

            <!-- 댓글 목록 -->
            <div
              v-for="comment in comments"
              :key="comment.commentId"
              class="space-y-2 rounded-lg bg-gray-50 p-4"
            >
              <!-- 댓글 수정 모드가 아닐 때 -->

              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="font-medium">{{ comment.commentAuthorName }}</span>
                  <span class="text-sm text-gray-500">{{ comment.commentCreateDate }}</span>
                </div>
                <!-- 자신의 댓글인 경우에만 수정/삭제 버튼 표시 -->

                <button
                  @click="deleteComment(comment.commentId)"
                  class="text-sm text-gray-400 hover:text-red-500"
                >
                  삭제
                </button>
              </div>
              <p class="text-gray-700">{{ comment.commentContent }}</p>
            </div>

            <!-- 페이지네이션 -->
            <div v-if="commentPageInfo.totalPages > 1" class="mt-6 flex justify-center space-x-2">
              <button
                v-for="page in commentPageInfo.totalPages"
                :key="page"
                @click="loadComments(page)"
                class="rounded-lg px-4 py-2"
                :class="
                  currentPage === page
                    ? 'bg-[#ff6f3b] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                "
              >
                {{ page }}
              </button>
            </div>
          </div>
        </div>

        <!-- 댓글 입력창 -->
        <div class="mt-6" v-if="props.challengeDetail.challengeIsEnded !== 1">
          <textarea
            v-model="newComment"
            placeholder="응원의 한마디 부탁드려요!"
            class="h-32 w-full resize-none overflow-auto rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2"
            rows="3"
          ></textarea>
          <button
            @click="addComment"
            class="w-full rounded-lg bg-black px-4 py-2 text-white transition-colors hover:bg-gray-400"
            :disabled="newComment.trim() === ''"
          >
            댓글 작성
          </button>
        </div>
        <!-- 종료된 챌린지일 경우 메시지 표시 -->
        <div v-else class="mt-6 text-center text-gray-500">
          종료된 챌린지에는 댓글을 작성할 수 없습니다.
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Calender from '@/components/common/Calender.vue'
import { useUserStore } from '@/stores/user'
import { useAlertStore } from '@/stores/alert'
import api from '@/api/axios'

const alertStore = useAlertStore()

// 1. 먼저 props 정의
const props = defineProps({
  challenge: Object,
  challengeDetail: Object,
  isLoading: Boolean,
  challengeId: {
    type: [String, Number],
    required: true,
  },
  challengeType: {
    type: String,
    default: '일일',
  },
  initialComments: {
    type: Array,
    default: () => [],
  },
  initialCommentPageInfo: {
    type: Object,
    default: () => ({
      currentPage: 1,
      pageSize: 10,
      totalElements: 0,
      totalPages: 0,
    }),
  },
})

// 2. emit 정의
const emit = defineEmits(['close'])

// 3. store 초기화
const userStore = useUserStore()

// 4. ref들 정의
const newComment = ref('')
const comments = ref(props.initialComments || [])
const commentPageInfo = ref(
  props.initialCommentPageInfo || {
    currentPage: 1,
    pageSize: 5,
    totalElements: 0,
    totalPages: 0,
  },
)
const currentPage = ref(1)
const isCommentsLoading = ref(false)

// 5. 함수들 정의
const loadComments = async (page) => {
  isCommentsLoading.value = true
  try {
    const response = await api.get(`/challenge/${props.challengeId}/comment`, {
      params: {
        page: page,
        size: commentPageInfo.value.pageSize,
      },
    })

    if (response.data.content) {
      comments.value = response.data.content
      commentPageInfo.value = response.data.pageInfo || commentPageInfo.value
      currentPage.value = page
    } else if (response.data.content === undefined) {
      comments.value = ''
    }
  } catch (error) {
    console.error('댓글 로딩 실패:', error)
  } finally {
    isCommentsLoading.value = false
  }
}

// 상태 변수 추가
const isUpdating = ref(false)

// 챌린지 수정 함수 수정
const updateChallenge = async () => {
  // 필수 필드 검증
  if (!props.challengeDetail.challengeCategoryCode) {
    alertStore.showNotify({
      title: '알림',
      message: '카테고리를 선택해주세요.',
      type: 'error',
      position: 'center',
    })
    return
  }
  if (!props.challengeDetail.challengeTitle) {
    alertStore.showNotify({
      title: '알림',
      message: '챌린지 제목을 입력해주세요.',
      type: 'error',
      position: 'center',
    })
    return
  }
  if (!props.challengeDetail.challengeDescription) {
    alertStore.showNotify({
      title: '알림',
      message: '챌린지 내용을 입력해주세요.',
      type: 'error',
      position: 'center',
    })
    return
  }
  if (!props.challengeDetail.challengeTargetCnt) {
    alertStore.showNotify({
      title: '알림',
      message: '목표 인원을 입력해주세요.',
      type: 'error',
      position: 'center',
    })
    return
  }
  if (!props.challengeDetail.challengeSchedulerCycle) {
    alertStore.showNotify({
      title: '알림',
      message: '반복 주기를 선택해주세요.',
      type: 'error',
      position: 'center',
    })
    return
  }

  try {
    const response = await api.put(
      `/admin/challenge/schedule/${props.challengeDetail.challengeId}`,
      {
        challengeCategoryCode: props.challengeDetail.challengeCategoryCode,
        challengeTitle: props.challengeDetail.challengeTitle,
        challengeDescription: props.challengeDetail.challengeDescription,
        challengeTargetCnt: props.challengeDetail.challengeTargetCnt,
        challengeSchedulerCycle: props.challengeDetail.challengeSchedulerCycle,
        challengeCreateDate: `${props.challengeDetail.challengeCreateDate} 00:00:00`,
        challengeDeleteDate: `${props.challengeDetail.challengeDeleteDate} 23:59:59`,
      },
    )

    console.log(response)
    if (response.status === 200) {
      alertStore.showNotify({
        title: '알림',
        message: '챌린지 수정에 성공하였습니다.',
        type: 'success',
        position: 'top-right',
      })
    }
  } catch (error) {
    console.error('챌린지 수정 실패:', error)
    alertStore.showNotify({
      title: '알림',
      message: '챌린지 수정에 실패하였습니다.',
      type: 'success',
      position: 'center',
    })
  } finally {
    isUpdating.value = false
  }
}

// 챌린지 종료 함수
const deleteChallenge = async () => {
  if (props.challengeDetail.challengeIsEnded === 1) {
    alertStore.showNotify({
      title: '알림',
      message: '종료된 챌린지는 삭제할 수 없습니다.',
      type: 'error',
      position: 'center',
    })
    return
  }

  alertStore.showConfirm({
    title: '확인',
    message: '반복 챌린지를 종료하시겠습니까?',
    onConfirm: async () => {
      try {
        await api.delete(`/admin/challenge/schedule/${props.challengeDetail.challengeId}`)
        emit('close')

        // 성공 알림
        alertStore.showNotify({
          title: '알림',
          message: '반복 챌린지가 종료되었습니다.',
          type: 'success',
          position: 'top-right',
        })
      } catch (error) {
        console.error('반복 챌린지 종료 실패:', error)
        alertStore.showNotify({
          title: '알림',
          message: '반복 챌린지 종료 실패했습니다.',
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

// 댓글 삭제 (기존 함수 수정)
const deleteComment = async (commentId) => {
  if (!confirm('댓글을 삭제하시겠습니까?')) return

  try {
    await api.delete(`/challenge/${props.challengeId}/comment/${commentId}`)
    // 댓글 목록 새로고침
    await loadComments(currentPage.value)
  } catch (error) {
    console.error('댓글 삭제 실패:', error)
    alert('댓글 삭제에 실패했습니다.')
  }
}

// 댓글 추가
const addComment = async () => {
  if (newComment.value.trim() === '') return

  try {
    // API 호출 추가 (실제 엔드포인트에 맞게 수정 필요)
    await api.post(`/challenge/${props.challengeId}/comment`, {
      commentContent: newComment.value,
      commentAuthorId: userStore.userId,
    })

    // 댓글 목록 새로고침
    await loadComments(currentPage.value)
    newComment.value = ''
  } catch (error) {
    console.error('댓글 작성 실패:', error)
  }
}

const handleEscape = (e) => {
  if (e.key === 'Escape' && props.challengeDetail) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape)
})
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
