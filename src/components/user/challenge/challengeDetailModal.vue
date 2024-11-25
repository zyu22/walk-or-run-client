<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    v-if="challengeDetail"
  >
    <div class="w-full max-w-2xl rounded-lg bg-white p-8">
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
              :class="getChallengeTypeColor(getChallengeType(challengeDetail.challengeTitle))"
            >
              {{ getChallengeType(challengeDetail.challengeTitle) }}
            </span>
            <h2 class="text-2xl font-bold">{{ challengeDetail.challengeTitle }}</h2>
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
            <p class="text-gray-600">{{ challengeDetail.challengeDescription }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="rounded-lg bg-gray-50 p-4">
              <p class="text-sm text-gray-500">참여자 수</p>
              <p class="text-lg font-semibold">
                {{ challengeDetail.challengeParticipantCnt || 0 }}명
              </p>
            </div>
            <div class="rounded-lg bg-gray-50 p-4">
              <p class="text-sm text-gray-500">참여율</p>
              <p class="text-lg font-semibold">
                {{
                  (
                    (challengeDetail.challengeParticipantCnt / challengeDetail.challengeTargetCnt) *
                    100
                  ).toFixed(1)
                }}%
              </p>
            </div>
          </div>

          <div v-if="challengeDetail">
            <div class="rounded-lg bg-gray-50 p-4">
              <div class="space-y-2">
                <p class="font-paperlogy text-xl">{{ challengeDetail.challengeCategoryName }}</p>
                <p>
                  <span class="font-medium">시작일:</span> {{ challengeDetail.challengeCreateDate }}
                </p>
                <p>
                  <span class="font-medium">종료일:</span> {{ challengeDetail.challengeDeleteDate }}
                </p>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <button
              @click="
                challengeDetail.challengeIsParticipant === 1
                  ? (showCancelModal = true)
                  : joinChallenge()
              "
              class="w-full rounded-lg px-4 py-2 text-white transition-colors"
              :class="{
                'cursor-pointer bg-[#ff6f3b] hover:bg-[#ff5722]':
                  challengeDetail.dday !== '종료' && challengeDetail.challengeIsParticipant === 0,
                'cursor-pointer bg-gray-400':
                  challengeDetail.dday === '종료' || challengeDetail.challengeIsParticipant === 1,
              }"
              :disabled="
                challengeDetail.dday === '종료' || challengeDetail.challengeIsParticipant === 1
              "
            >
              {{
                challengeDetail.challengeIsParticipant === 1
                  ? '참여 취소'
                  : challengeDetail.dday === '종료'
                    ? '챌린지 종료'
                    : '챌린지 참여하기'
              }}
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
    <div v-if="!comments.length" class="text-center text-gray-500 py-4">
      첫 번째 댓글을 작성해보세요!
    </div>
    
    <!-- 댓글 목록 -->
    <div 
      v-for="comment in comments" 
      :key="comment.commentId" 
      class="rounded-lg bg-gray-50 p-4 space-y-2"
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
        :class="currentPage === page ? 'bg-[#ff6f3b] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'"
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
              :disabled="newComment.trim() === ''"
            >
              댓글 작성
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref } from 'vue'
import { useUserStore } from '@/stores/user'
import api from '@/api/axios'


// 1. 먼저 props 정의
const props = defineProps({
  challenge: Object,
  challengeDetail: Object,
  isLoading: Boolean,
  challengeId: {
    type: [String, Number],
    required: true
  },
  initialComments: {
    type: Array,
    default: () => []
  },
  initialCommentPageInfo: {
    type: Object,
    default: () => ({
      currentPage: 1,
      pageSize: 10,
      totalElements: 0,
      totalPages: 0
    })
  }
})

// 2. emit 정의
const emit = defineEmits(['close'])

// 3. store 초기화
const userStore = useUserStore()

// 4. ref들 정의
const newComment = ref('')
const comments = ref(props.initialComments || [])
const commentPageInfo = ref(props.initialCommentPageInfo || {
  currentPage: 1,
  pageSize: 10,
  totalElements: 0,
  totalPages: 0
})
const currentPage = ref(1)
const isCommentsLoading = ref(false)

// 상태 변수
const showCancelModal = ref(false) // 참여 취소 모달 표시 여부
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



// 5. 함수들 정의
const loadComments = async (page) => {
  isCommentsLoading.value = true
  try {
    const response = await api.get(`/challenge/${props.challengeId}/comment`, {
      params: {
        page: page,
        size: commentPageInfo.value.pageSize
      }
    })
    
    if (response.data.content) {
      comments.value = response.data.content
      commentPageInfo.value = response.data.pageInfo || commentPageInfo.value
      currentPage.value = page
    }
  } catch (error) {
    console.error('댓글 로딩 실패:', error)
  } finally {
    isCommentsLoading.value = false
  }
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

// 댓글 수정
const updateComment = async (commentId) => {
  if (editingCommentContent.value.trim() === '') {
    alert('댓글 내용을 입력해주세요.')
    return
  }

  try {
    await api.put(`/challenge/${props.challengeId}/comment/${commentId}`, {
      commentContent : editingCommentContent.value,
    })

    console.log(currentPage.value)

    // 댓글 목록 새로고침
    await loadComments(currentPage.value)
    
    // 수정 모드 종료
    cancelEdit()
  } catch (error) {
    console.error('댓글 수정 실패:', error)
    alert('댓글 수정에 실패했습니다.')
  }
}

// 댓글 추가
const addComment = async () => {
  if (newComment.value.trim() === '') return
  
  try {
    // API 호출 추가 (실제 엔드포인트에 맞게 수정 필요)
    await api.post(`/challenge/${props.challengeId}/comment`, {
      commentContent : newComment.value,
      commentAuthorId : userStore.userId
    })
    
    // 댓글 목록 새로고침
    await loadComments(currentPage.value)
    newComment.value = ''
  } catch (error) {
    console.error('댓글 작성 실패:', error)
  }
}

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
        props.challengeDetail.challengeIsParticipant = 1
      }
    }
  } catch (error) {
    console.error('챌린지 참여 실패:', error)
  } finally {
    isLoading.value = false
  }
}

const cancelParticipation = async () => {
  if (!userStore.userId || !props.challenge?.challengeId) return
  
  try {
    const response = await api.delete(`challenge/${props.challenge.challengeId}/participant`, {
      data: { userId: userStore.userId },
    })
    if (response.status === 200) {
      if (props.challengeDetail) {
        props.challengeDetail.challengeIsParticipant = 0
      }
      showCancelModal.value = false
    }
  } catch (error) {
    console.error('참여 취소 실패:', error)
  }
}

const getChallengeType = (title) => {
  if (!title) return '일일'
  if (title.includes('일일')) return '일일'
  if (title.includes('주간')) return '주간'
  if (title.includes('월간')) return '월간'
  if (title.includes('이벤트')) return '이벤트'
  return '일일'
}

const getChallengeTypeColor = (type) => {
  const colors = {
    일일: 'bg-orange-100 text-orange-600',
    주간: 'bg-green-100 text-green-600',
    월간: 'bg-blue-100 text-blue-600',
    이벤트: 'bg-purple-100 text-purple-600',
  }
  return colors[type] || 'bg-gray-100 text-gray-600'
}
</script>
