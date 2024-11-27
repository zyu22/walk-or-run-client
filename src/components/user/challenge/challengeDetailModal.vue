<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black bg-opacity-50"
    v-if="props.challengeDetail"
    @click.self="$emit('close')"
  >
    <div class="modal-container w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-8">
      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="animate-spin text-[#ff6f3b]">Loading...</div>
      </div>

      <!-- 상세 정보 -->
      <div v-else>
        <!-- 헤더 -->
        <div class="mb-6 flex items-start justify-between">
          <div>
            <span
              class="mb-2 inline-block rounded-full px-3 py-1 text-sm"
              :class="getChallengeTypeColor(challengeType)"
            >
              {{ challengeType }}
            </span>
            <h2 class="text-2xl font-bold">{{ props.challengeDetail.challengeTitle }}</h2>
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

        <!-- 상세 내용 -->
        <div class="space-y-6">
          <div>
            <p class="text-gray-600">{{ props.challengeDetail.challengeDescription }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="rounded-lg bg-gray-50 p-4">
              <p class="text-sm text-gray-500">참여자 수</p>
              <p class="text-lg font-semibold">
                {{ props.challengeDetail.challengeParticipantCnt || 0 }}명
              </p>
            </div>
            <div class="rounded-lg bg-gray-50 p-4">
              <p class="text-sm text-gray-500">참여율</p>
              <p class="text-lg font-semibold">{{ participationRate }}%</p>
            </div>
          </div>

          <div v-if="props.challengeDetail">
            <div class="rounded-lg bg-gray-50 p-4">
              <div class="space-y-2">
                <p class="font-paperlogy text-xl">
                  {{ props.challengeDetail.challengeCategoryName }}
                </p>
                <p>
                  <span class="font-medium">시작일:</span>
                  {{ props.challengeDetail.challengeCreateDate }}
                </p>
                <p>
                  <span class="font-medium">종료일:</span>
                  {{ props.challengeDetail.challengeDeleteDate }}
                </p>
              </div>
            </div>
          </div>

          <!-- 참여 버튼 -->
          <div class="mt-6">
            <button
              @click="handleParticipation"
              class="w-full rounded-lg px-4 py-2 text-white transition-colors"
              :class="buttonClass"
              :disabled="isButtonDisabled"
            >
              {{ buttonText }}
            </button>
          </div>

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
                <div v-if="editingCommentId !== comment.commentId">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <span class="font-medium">{{ comment.commentAuthorName }}</span>
                      <span class="text-sm text-gray-500">{{ comment.commentCreateDate }}</span>
                    </div>
                    <!-- 자신의 댓글인 경우에만 수정/삭제 버튼 표시 -->
                    <div v-if="comment.commentAuthorId === userStore.userId" class="space-x-2">
                      <button
                        @click="startEdit(comment)"
                        class="text-sm text-gray-400 hover:text-[#ff6f3b]"
                      >
                        수정
                      </button>
                      <button
                        @click="deleteComment(comment.commentId)"
                        class="text-sm text-gray-400 hover:text-red-500"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  <p class="text-gray-700">{{ comment.commentContent }}</p>
                </div>

                <!-- 댓글 수정 모드일 때 -->
                <div v-else class="space-y-2">
                  <textarea
                    v-model="editingCommentContent"
                    class="w-full resize-none rounded-lg border border-gray-300 p-2 focus:border-[#ff6f3b] focus:outline-none focus:ring-1 focus:ring-[#ff6f3b]"
                    rows="3"
                  ></textarea>
                  <div class="flex justify-end space-x-2">
                    <button
                      @click="cancelEdit"
                      class="rounded-lg px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
                    >
                      취소
                    </button>
                    <button
                      @click="updateComment(comment.commentId)"
                      class="rounded-lg bg-[#ff6f3b] px-3 py-1 text-sm text-white hover:bg-[#ff5722]"
                    >
                      저장
                    </button>
                  </div>
                </div>
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
          <div class="mt-6">
            <textarea
              v-model="newComment"
              placeholder="응원의 한마디 부탁드려요!"
              class="h-32 w-full resize-none overflow-auto rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2"
              rows="3"
            ></textarea>
            <button
              @click="addComment"
              class="w-full rounded-lg bg-black px-4 py-2 text-white transition-colors hover:bg-gray-400"
              :disabled="isCommentDisabled"
            >
              {{ isEnded ? '종료된 챌린지입니다' : '댓글 작성' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import api from '@/api/axios'
import { useAlertStore } from '@/stores/alert'

const alertStore = useAlertStore()
const emit = defineEmits(['close'])
const userStore = useUserStore()

const props = defineProps({
  challenge: Object,
  challengeDetail: {
    type: Object,
    required: true,
  },
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

// 상태 변수
const isLoading = ref(false) // 로딩 상태 추적
const isJoined = ref(false) // 참여 여부 추적

// 수정 관련 상태 추가
const editingCommentId = ref(null)
const editingCommentContent = ref('')

// 수정 시작
const startEdit = (comment) => {
  editingCommentId.value = comment.commentId
  editingCommentContent.value = comment.commentContent
}

// 수정 취소
const cancelEdit = () => {
  editingCommentId.value = null
  editingCommentContent.value = ''
}

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
    alertStore.showNotify({
      title: '알림',
      message: '댓글 조회에 실패하였습니다.\n 다시 시도해주세요.',
      type: 'error',
      position: 'top-right',
    })
    console.error('댓글 로딩 실패:', error)
  } finally {
    isCommentsLoading.value = false
  }
}

// 댓글 삭제
const deleteComment = (commentId) => {
  alertStore.showConfirm({
    title: '확인',
    message: '댓글을 삭제하시겠습니까?',
    onConfirm: async () => {
      // async 추가
      try {
        await api.delete(`/challenge/${props.challengeId}/comment/${commentId}`)
        // 댓글 목록 새로고침
        await loadComments(currentPage.value)
        // 성공 알림
        alertStore.showNotify({
          title: '알림',
          message: '댓글이 삭제되었습니다.',
          type: 'success',
          position: 'top-right',
        })
      } catch (error) {
        console.error('댓글 삭제 실패:', error)
        alertStore.showNotify({
          title: '알림',
          message: '댓글 삭제에 실패했습니다.',
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

// 댓글 수정
const updateComment = async (commentId) => {
  if (editingCommentContent.value.trim() === '') {
    alert('댓글 내용을 입력해주세요.')
    return
  }

  try {
    await api.put(`/challenge/${props.challengeId}/comment/${commentId}`, {
      commentContent: editingCommentContent.value,
    })

    // 댓글 목록 새로고침
    await loadComments(currentPage.value)

    // 수정 모드 종료
    cancelEdit()
  } catch (error) {
    console.error('댓글 수정 실패:', error)
    alertStore.showNotify({
      title: '알림',
      message: '댓글 수정에 실패했습니다.',
      type: 'error',
      position: 'center',
    })
  }
}

// 댓글 추가
const addComment = async () => {
  if (isEnded.value || newComment.value.trim() === '') return

  try {
    await api.post(`/challenge/${props.challengeId}/comment`, {
      commentContent: newComment.value,
      commentAuthorId: userStore.userId,
    })

    await loadComments(currentPage.value)
    newComment.value = ''
  } catch (error) {
    console.error('댓글 작성 실패:', error)
    alertStore.showNotify({
      title: '알림',
      message: '댓글 작성에 실패했습니다.',
      type: 'error',
      position: 'center',
    })
  }
}

// 챌린지 참여
const joinChallenge = async () => {
  if (!userStore.userId || !props.challengeDetail?.challengeId) return

  isLoading.value = true
  try {
    const response = await api.post(`challenge/${props.challengeDetail.challengeId}`, {
      userId: userStore.userId,
    })

    if (response.status === 200) {
      isJoined.value = true
      if (props.challengeDetail) {
        // challengeParticipants 배열에 현재 사용자 추가
        props.challengeDetail.challengeParticipants = [
          ...(props.challengeDetail.challengeParticipants || []),
          { userId: userStore.userId },
        ]
        // 참여자 수 증가
        props.challengeDetail.challengeParticipantCnt =
          (props.challengeDetail.challengeParticipantCnt || 0) + 1
      }
      alertStore.showNotify({
        title: '알림',
        message: '챌린지 참여가 완료되었습니다.',
        type: 'success',
        position: 'top-right',
      })
    }
  } catch (error) {
    console.error('챌린지 참여 실패:', error)
    alertStore.showNotify({
      title: '알림',
      message: '챌린지 참여에 실패했습니다.',
      type: 'error',
      position: 'center',
    })
  } finally {
    isLoading.value = false
  }
}

// 챌린지 참여 취소
const cancelParticipation = () => {
  if (!userStore.userId || !props.challengeDetail?.challengeId) return

  alertStore.showConfirm({
    title: '확인',
    message: '챌린지 참여를 취소하시겠습니까?',
    onConfirm: async () => {
      try {
        const response = await api.delete(`challenge/${props.challengeDetail.challengeId}`, {
          data: {
            userId: userStore.userId,
          },
        })

        if (response.status === 200) {
          if (props.challengeDetail) {
            // challengeParticipants 배열에서 현재 사용자 제거
            props.challengeDetail.challengeParticipants =
              props.challengeDetail.challengeParticipants.filter(
                (participant) => participant.userId !== userStore.userId,
              )
            // 참여자 수 감소
            props.challengeDetail.challengeParticipantCnt = Math.max(
              (props.challengeDetail.challengeParticipantCnt || 1) - 1,
              0,
            )
          }
          alertStore.showNotify({
            title: '알림',
            message: '챌린지 참여가 취소되었습니다.',
            type: 'success',
            position: 'top-right',
          })
        }
      } catch (error) {
        console.error('참여 취소 실패:', error)
        alertStore.showNotify({
          title: '알림',
          message: '참여 취소에 실패했습니다.',
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

const participationRate = computed(() => {
  if (!props.challengeDetail.challengeTargetCnt || props.challengeDetail.challengeTargetCnt === 0)
    return 0
  return (
    (props.challengeDetail.challengeParticipantCnt / props.challengeDetail.challengeTargetCnt) *
    100
  ).toFixed(1)
})

// 챌린지가 종료되었는지 확인
const isEnded = computed(() => {
  return props.challengeDetail.challengeIsEnded === 1
})

// 참여 인원이 가득 찼는지 확인
const isParticipationFull = computed(() => {
  if (!props.challengeDetail) return false
  return props.challengeDetail.challengeParticipantCnt >= props.challengeDetail.challengeTargetCnt
})

// 현재 사용자가 참여중인지 확인
const isParticipating = computed(() => {
  return (
    props.challengeDetail.challengeParticipants?.some(
      (participant) => participant.userId === userStore.userId,
    ) ?? false
  )
})

// 버튼 비활성화 조건
const isButtonDisabled = computed(() => {
  if (isEnded.value) return true
  if (isParticipationFull.value) return true
  return false
})

// 버튼 클래스
const buttonClass = computed(() => {
  if (isEnded.value || isParticipationFull.value) {
    return 'bg-gray-400 cursor-not-allowed'
  }
  if (isParticipating.value) {
    return 'bg-gray-400 cursor-pointer'
  }
  return 'bg-[#ff6f3b] hover:bg-[#ff5722] cursor-pointer'
})

// 버튼 텍스트
const buttonText = computed(() => {
  if (isEnded.value) return '참여 종료'
  if (isParticipationFull.value) return '참여 종료'
  if (isParticipating.value) return '참여 취소'
  return '챌린지 참여하기'
})

// 참여 핸들러
const handleParticipation = () => {
  if (isEnded.value || isParticipationFull.value) return

  if (isParticipating.value) {
    cancelParticipation()
  } else {
    joinChallenge()
  }
}

// 댓글 비활성화 조건도 수정
const isCommentDisabled = computed(() => {
  if (isEnded.value) return true
  return newComment.value.trim() === ''
})

const getChallengeTypeColor = (type) => {
  const colors = {
    일일: 'bg-orange-100 text-orange-600',
    주간: 'bg-green-100 text-green-600',
    월간: 'bg-blue-100 text-blue-600',
    이벤트: 'bg-purple-100 text-purple-600',
  }
  return colors[type] || 'bg-gray-100 text-gray-600'
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
  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

/* Chrome, Safari, Edge */
.modal-container::-webkit-scrollbar {
  width: 6px;
}

.modal-container::-webkit-scrollbar-track {
  background: transparent;
  margin: 4px;
}

.modal-container::-webkit-scrollbar-thumb {
  background: rgba(203, 213, 225, 0.5); /* 연한 회색 */
  border-radius: 100px;
  transition: all 0.2s ease-in-out;
}

/* 호버 효과 */
.modal-container::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.8); /* 좀 더 진한 회색 */
}

/* 스크롤 중일 때 */
.modal-container::-webkit-scrollbar-thumb:active {
  background: rgba(255, 111, 59, 1);
}

/* 스크롤바 코너 스타일링 */
.modal-container::-webkit-scrollbar-corner {
  background: transparent;
}

/* 스크롤바가 있을 때만 보이게 하는 효과 */
.modal-container {
  scrollbar-gutter: stable;
}

/* 스크롤바 자연스러운 페이딩 효과 */
.modal-container {
  scroll-behavior: smooth;
}

/* 부드러운 스크롤 효과 */
.modal-container {
  scroll-behavior: smooth;
}
</style>
