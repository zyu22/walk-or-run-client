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
                'cursor-not-allowed bg-gray-400':
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
          <div class="mt-6 rounded-lg bg-gray-50 p-4">
            <div v-if="comments.length === 0" class="text-sm text-gray-500">
              아직 댓글이 없습니다.
            </div>
            <div v-for="(comment, index) in comments" :key="index" class="mt-4">
              <div class="flex items-center space-x-2">
                <span class="font-medium text-gray-700">User</span>
                <span class="text-sm text-gray-500">{{ comment.date }}</span>
              </div>
              <p class="mt-2 text-gray-600">{{ comment.text }}</p>
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
import { watch, ref, defineProps, defineEmits, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import api from '@/api/axios'
// 입력된 새로운 댓글을 저장하는 변수
const newComment = ref('')
const userStore = useUserStore()

// 댓글 리스트 (실제로는 API에서 받아올 수 있습니다)
const comments = ref([
  { text: '이 챌린지는 정말 좋네요!', date: '2024-11-24' },
  { text: '이 챌린지에 참여하고 싶어요!', date: '2024-11-23' },
])

// 상태 변수
const showCancelModal = ref(false) // 참여 취소 모달 표시 여부
const isLoading = ref(false) // 로딩 상태 추적
const isJoined = ref(false) // 참여 여부 추적

// 댓글 추가 함수
const addComment = () => {
  if (newComment.value.trim() !== '') {
    const date = new Date().toLocaleDateString()
    comments.value.push({ text: newComment.value, date })
    newComment.value = ''
  }
}

const props = defineProps({
  challenge: Object, // challenge 객체를 받는다.
  challengeDetail: Object, // 추가적인 challenge 세부 정보
  isLoading: Boolean, // 모달 로딩 상태
})
// 챌린지 참여 함수
const joinChallenge = async () => {
  console.log('Challenge ID:', props.challengeDetail.challengeId)
  console.log('참여 여부:', props.challengeDetail.challengeIsParticipant)
  const challenge = props.challengeDetail
  if (userStore.userId && challenge.challengeId) {
    isLoading.value = true
    try {
      // API 요청: 챌린지 참여
      const response = await api.post(`challenge/${challenge.challengeId}`, {
        userId: userStore.userId,
      })

      // API 응답 성공 시 참여 상태 업데이트
      if (response.status === 200) {
        isJoined.value = true
        // 참여 성공 시 상태 업데이트
        console.log(challengeDetail)
        challenge.challengeIsParticipant = 1
        console.log('성공')
      }
    } catch (error) {
      console.error('챌린지 참여에 실패했습니다:', error)
    } finally {
      isLoading.value = false
    }
  }
}
// 참여 취소 함수
const cancelParticipation = async () => {
  if (userStore.userId) {
    try {
      const response = await api.delete(`challenge/${props.challenge.challengeId}/participant`, {
        data: { userId: userStore.userId },
      })
      if (response.status === 200) {
        // 참여 취소 성공 시 상태 업데이트
        props.challengeIsParticipant = 0
        showCancelModal.value = false
      }
    } catch (error) {
      console.error('참여 취소 실패:', error)
    }
  }
}
// 함수들을 컴포넌트 내부에서 정의
const getChallengeType = (title) => {
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
