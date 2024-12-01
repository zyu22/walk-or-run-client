<template>
  <!-- 헤더 -->
  <div class="mb-8">
    <h1 class="font-paperlogy text-5xl font-bold text-gray-900">Challenge</h1>
    <p class="mt-2 text-sm text-gray-600">나의 한계를 도전해보세요!</p>
  </div>
  <div class="mb-8 flex items-center justify-between">
    <!-- 상태 필터 -->
    <div class="flex gap-2">
      <button
        v-for="status in challengeStatus"
        :key="status"
        @click="handleStatusChange(status)"
        class="rounded-lg px-4 py-2 transition-colors"
        :class="
          filterStatus === status
            ? 'bg-[#00B074] text-white'
            : 'bg-white text-gray-600 hover:bg-gray-100'
        "
      >
        {{ status }}
      </button>
    </div>

    <div class="flex gap-2">
      <button
        v-for="type in challengeTypes"
        :key="type"
        @click="filterType = type"
        class="rounded-lg px-4 py-2 transition-colors"
        :class="
          filterType === type
            ? 'bg-[#ff6f3b] text-white'
            : 'bg-white text-gray-600 hover:bg-gray-100'
        "
      >
        {{ type }}
      </button>
    </div>
  </div>

  <div v-if="isLoading">Loading...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>
    <!-- 챌린지 카드 그리드 -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="challenge in filteredChallenges"
        :key="challenge.challengeId"
        @click="openChallengeModal(challenge)"
        class="group cursor-pointer rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md"
        :class="{
          'opacity-75': challenge.challengeIsEnded === 1,
          'border border-gray-200': challenge.challengeIsEnded === 1,
        }"
      >
        <div class="mb-4 flex items-start justify-between">
          <span
            class="rounded-full px-3 py-1 text-sm"
            :class="getChallengeTypeColor(getChallengeType(challenge))"
          >
            {{ getChallengeType(challenge) }}
          </span>
          <span class="text-sm text-gray-500">{{ challenge.dday || 0 }}</span>
        </div>

        <h3
          class="mb-2 text-lg font-semibold"
          :class="{
            'text-gray-900 group-hover:text-[#ff6f3b]': challenge.challengeIsEnded !== 1,
            'text-gray-400': challenge.challengeIsEnded === 1,
          }"
        >
          {{ challenge.challengeTitle }}
        </h3>
        <p
          class="mb-4 text-sm"
          :class="{
            'text-gray-600': challenge.challengeIsEnded !== 1,
            'text-gray-400': challenge.challengeIsEnded === 1,
          }"
        >
          {{ challenge.challengeDescription }}
        </p>
        <div class="space-y-2">
          <div class="flex justify-between text-sm text-gray-500">
            <span>참여율</span>
            <span
              >{{
                Math.min(
                  (challenge.challengeParticipantCnt / challenge.challengeTargetCnt) * 100,
                  100,
                ).toFixed(1)
              }}%</span
            >
          </div>
          <div class="h-2 w-full rounded-full bg-gray-100">
            <div
              class="h-2 rounded-full transition-all"
              :class="{
                'bg-red-500': getParticipationRate(challenge) < 30,
                'bg-yellow-500':
                  getParticipationRate(challenge) >= 30 && getParticipationRate(challenge) < 70,
                'bg-[#ff6f3b]': getParticipationRate(challenge) >= 70,
              }"
              :style="{
                width: `${Math.min((challenge.challengeParticipantCnt / challenge.challengeTargetCnt) * 100, 100).toFixed(1)}%`,
              }"
            ></div>
          </div>
          <div class="text-right text-sm text-gray-500">
            {{ challenge.challengeParticipantCnt || 0 }}명 참여 중
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 페이지네이션 -->
  <div v-if="pageInfo.totalPages > 1" class="mt-8 flex justify-center space-x-2">
    <button
      v-for="page in pageInfo.totalPages"
      :key="page"
      @click="handlePageChange(page)"
      class="rounded-lg px-4 py-2"
      :class="currentPage === page ? 'bg-[#ff6f3b] text-white' : 'bg-white text-gray-600'"
    >
      {{ page }}
    </button>
  </div>

  <!-- challenge.vue -->
  <ChallengeDetailModal
    v-if="selectedChallenge && challengeDetail && !isModalLoading"
    :challenge="selectedChallenge"
    :challengeDetail="challengeDetail"
    :challengeType="getChallengeType(selectedChallenge)"
    :initialComments="comments"
    :initialCommentPageInfo="commentPageInfo"
    :isLoading="isModalLoading"
    :challengeId="selectedChallenge.challengeId"
    @close="closeModal"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ChallengeDetailModal from '@/components/user/challenge/challengeDetailModal.vue'
import { useUserStore } from '@/stores/user'
import api from '@/api/axios'
import { useAlertStore } from '@/stores/alert'

const alertStore = useAlertStore()

const userStore = useUserStore()
const challengeTypes = ['전체', '일일', '주간', '월간', '이벤트']
const challengeStatus = ['전체', '진행중인 챌린지', '종료된 챌린지']
const filterStatus = ref('전체')
const filterType = ref('전체')
const currentPage = ref(1)
const comments = ref([])
const selectedChallenge = ref(null)
const challengeDetail = ref(null) // 챌린지 상세 정보 저장
const isModalLoading = ref(false) // 모달 로딩 상태
const challenges = ref([])
const isLoading = ref(false)
const error = ref(null)
const pageInfo = ref({
  currentPage: 1,
  pageSize: 16,
  totalElements: 0,
  totalPages: 0,
})
const commentPageInfo = ref({
  currentPage: 1,
  pageSize: 5,
  totalElements: 0,
  totalPages: 0,
})

// 필터 상태 변경 처리 함수
const handleStatusChange = (status) => {
  filterStatus.value = status

  let apiEndpoint = '/challenge'
  if (status === '진행중인 챌린지') {
    apiEndpoint = '/challenge/active' // challengeIsEnded === 0
  } else if (status === '종료된 챌린지') {
    apiEndpoint = '/challenge/end' // challengeIsEnded === 1
  }

  getChallege() // 필터 상태 변경 시 API 호출
}

// 참여율 계산
const getParticipationRate = (challenge) => {
  if (!challenge.challengeTargetCnt || challenge.challengeTargetCnt === 0) return 0
  return ((challenge.challengeParticipantCnt / challenge.challengeTargetCnt) * 100).toFixed(1)
}

// 태그 계산
const getChallengeType = (challenge) => {
  const start = new Date(challenge.challengeCreateDate)
  const end = new Date(challenge.challengeDeleteDate)

  if (!start || !end) {
    return '일일' // 기본값
  }

  const diffTime = end.getTime() - start.getTime()
  const diffDays = diffTime / (1000 * 60 * 60 * 24)

  if (diffDays <= 1) return '일일'
  if (diffDays <= 7) return '주간'
  if (diffDays <= 31) return '월간'
  return '이벤트'
}

// 챌린지 조회
const getChallege = async (page = 1) => {
  isLoading.value = true
  error.value = null

  let apiEndpoint = '/challenge' // 기본 엔드포인트

  // 필터 상태에 따라 다른 엔드포인트 설정
  if (filterStatus.value === '진행중인 챌린지') {
    apiEndpoint = '/challenge/active'
  } else if (filterStatus.value === '종료된 챌린지') {
    apiEndpoint = '/challenge/end'
  }

  try {
    console.log('조회 cc: ', challenges.value.challengeCreateDate)
    console.log('조회 ee: ', challenges.value.challengeCreateDate)
    const response = await api.get(apiEndpoint, {
      params: {
        page: page, // 백엔드에서 처리하므로 그대로 전달
        size: 16,
      },
    })

    challenges.value = response.data.content
    pageInfo.value = response.data.pageInfo
    currentPage.value = page
  } catch (err) {
    console.error('챌린지 데이터를 불러오는 데 실패했습니다:', err)
    error.value = '챌린지 데이터를 불러오는 데 실패했습니다. 다시 시도해 주세요.'
  } finally {
    isLoading.value = false
  }
}

// 챌린지 상세보기
const getChallengeDetail = async (challengeId) => {
  try {
    const response = await api.get(`/challenge/${challengeId}`)

    challengeDetail.value = response.data || {}

    return response.data
  } catch (err) {
    console.error('챌린지 상세 정보 에러:', err)
    console.error('에러 응답:', err.response) // 에러 응답 상세 확인
    challengeDetail.value = null
    throw err // 에러를 상위로 전파
  }
}

// 댓글 조회
const getComments = async (challengeId, page = 1) => {
  try {
    const response = await api.get(`/challenge/${challengeId}/comment`, {
      params: {
        page: page,
        size: commentPageInfo.value.pageSize,
      },
    })

    if (response.status === 204) {
    } else if (response.status === 200) {
      comments.value = response.data.content
      commentPageInfo.value = response.data.pageInfo || {
        currentPage: 1,
        pageSize: 5,
        totalElements: 0,
        totalPages: 0,
      }
    }
    return response.data
  } catch (err) {
    console.error('댓글 로딩 에러:', err)
    console.error('에러 응답:', err.response) // 에러 응답 상세 확인
    comments.value = []
    throw err // 에러를 상위로 전파
  }
}

// 페이지 변경 핸들러
const handlePageChange = (page) => {
  getChallege(page)
}
// 컴포넌트 마운트 시 첫 페이지 데이터 가져오기
onMounted(() => {
  getChallege(1)
})

const filteredChallenges = computed(() => {
  if (filterType.value === '전체') {
    return challenges.value
  }

  // 필터링 조건이 '일일', '주간', '월간', '이벤트'일 경우
  return challenges.value.filter((challenge) => getChallengeType(challenge) === filterType.value)
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

const openChallengeModal = async (challenge) => {
  if (!challenge?.challengeId) {
    alertStore.showNotify({
      title: '알림',
      message: '유효하지 않은 챌린지입니다.',
      type: 'error',
      position: 'center',
    })
    console.error('유효하지 않은 챌린지:', challenge)
    return
  }

  try {
    isModalLoading.value = true
    selectedChallenge.value = challenge

    // 상세 정보와 댓글을 순차적으로 가져옵니다
    const detailData = await getChallengeDetail(challenge.challengeId)
    if (detailData) {
      challengeDetail.value = detailData
      const commentsData = await getComments(challenge.challengeId)
      if (commentsData) {
        comments.value = commentsData.content || []
        commentPageInfo.value = commentsData.pageInfo || {
          currentPage: 1,
          pageSize: 5,
          totalElements: 0,
          totalPages: 0,
        }
      }
    }
  } catch (error) {
    console.error('모달 데이터 로딩 중 오류:', error)
    alertStore.showNotify({
      title: '알림',
      message: '데이터를 불러오는데 실패했습니다.',
      type: 'error',
      position: 'top-right',
    })
  } finally {
    isModalLoading.value = false
  }
}
const closeModal = () => {
  selectedChallenge.value = null
  comments.value = null
  commentPageInfo.value = {
    currentPage: 1,
    pageSize: 5,
    totalElements: 0,
    totalPages: 0,
  }
}
</script>
