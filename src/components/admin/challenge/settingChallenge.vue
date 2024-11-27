<template>
  <div class="modal-container rounded-xl bg-white p-6 shadow-sm">
    <div class="mb-10 flex items-center justify-between">
      <div>
        <h2 class="font-paperlogy text-5xl font-bold text-gray-900">챌린지 현황</h2>
        <p class="mt-1 text-sm text-gray-600">전체 챌린지 관리</p>
      </div>
      <button
        @click="openAddmodal"
        class="rounded-lg bg-[black] px-4 py-2 text-white transition-colors hover:bg-opacity-70"
      >
        챌린지 추가
      </button>
    </div>

    <!-- 필터 섹션 -->
    <div class="mb-6 flex items-center justify-between">
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
          @click="handleTypeChange(type)"
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

    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="h-12 w-12 animate-spin rounded-full border-b-2 border-[#ff6f3b]"></div>
      <span class="ml-3 text-gray-500">로딩 중...</span>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-20">
      <p class="text-lg text-gray-500">{{ error }}</p>
      <button
        v-if="error === '아직 등록된 챌린지가 없습니다.'"
        @click="openAddmodal"
        class="mt-4 rounded-lg bg-[#ff6f3b] px-4 py-2 text-white transition-colors hover:bg-opacity-70"
      >
        첫 챌린지 등록하기
      </button>
    </div>

    <!-- 테이블 -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              유형
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              카테고리
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              제목
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              기간
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              참여율
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              상태
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr
            v-for="challenge in filteredChallenges"
            :key="challenge.challengeId"
            @click="openDetailModal(challenge)"
            :class="[
              'group cursor-pointer transition-colors hover:bg-gray-50',
              challenge.challengeIsEnded === 1 ? 'is-ended bg-gray-50' : 'bg-white',
            ]"
          >
            <!-- 유형 -->
            <td class="whitespace-nowrap px-6 py-4">
              <span
                class="inline-flex rounded-full px-3 py-1 text-xs font-semibold transition-colors group-[.is-ended]:bg-gray-100 group-[.is-ended]:text-gray-500"
                :class="getChallengeTypeColor(getChallengeType(challenge))"
              >
                {{ getChallengeType(challenge) }}
              </span>
            </td>

            <!-- 카테고리 -->
            <td class="whitespace-nowrap px-6 py-4">
              <span
                class="inline-flex rounded-full px-3 py-1 text-xs font-semibold transition-colors group-[.is-ended]:bg-gray-100 group-[.is-ended]:text-gray-500"
                :class="getCategoryColor(challenge.challengeCategoryCode)"
              >
                {{ getCategoryName(challenge.challengeCategoryCode) }}
              </span>
            </td>

            <!-- 제목 -->
            <td class="px-6 py-4 text-gray-900 group-[.is-ended]:text-gray-500">
              {{ challenge.challengeTitle }}
            </td>

            <!-- 기간 -->
            <td class="whitespace-nowrap px-6 py-4 text-gray-900 group-[.is-ended]:text-gray-500">
              {{ formatDate(challenge.challengeCreateDate) }} ~
              {{ formatDate(challenge.challengeDeleteDate) }}
            </td>

            <!-- 참여율 -->
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="w-24 rounded-full bg-gray-100">
                  <div
                    class="h-2 rounded-full transition-all group-[.is-ended]:bg-gray-300"
                    :class="{
                      'bg-red-500': getParticipationRate(challenge) < 30,
                      'bg-yellow-500':
                        getParticipationRate(challenge) >= 30 &&
                        getParticipationRate(challenge) < 70,
                      'bg-[#ff6f3b]': getParticipationRate(challenge) >= 70,
                    }"
                    :style="{
                      width: `${Math.min((challenge.challengeParticipantCnt / challenge.challengeTargetCnt) * 100, 100).toFixed(1)}%`,
                    }"
                  ></div>
                </div>
                <span class="ml-2 text-sm text-gray-600 group-[.is-ended]:text-gray-500">
                  {{ getParticipationRate(challenge) }}%
                </span>
              </div>
            </td>
            <td class="whitespace-nowrap px-6 py-4">
              <span
                class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                :class="
                  challenge.challengeIsEnded === 1
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-gray-100 text-green-600'
                "
              >
                {{ challenge.challengeIsEnded === 1 ? '종료' : '진행중' }}
              </span>
            </td>
            <<<<<<< HEAD
            <!-- 관리 -->
            <td class="whitespace-nowrap px-6 py-4 text-sm">
              <button
                class="mr-2 text-[#00B074] hover:text-[#009563] group-[.is-ended]:text-gray-400"
                :disabled="challenge.challengeIsEnded === 1"
              >
                수정
              </button>
              <button
                class="text-red-600 hover:text-red-900 group-[.is-ended]:text-gray-400"
                :disabled="challenge.challengeIsEnded === 1"
              >
                삭제
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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
  </div>

  <!-- 챌린지 추가 모달 -->
  <ChallengeAddModal
    :is-open="isAddModalOpen"
    @close="closeAddModal"
    @refresh="refreshChallenges"
  />

  <!-- 챌린지 상세 모달 -->
  <settingChallengeDetailModal
    v-if="selectedChallenge && !isModalLoading"
    :challenge="selectedChallenge"
    :challengeDetail="challengeDetail || {}"
    :challengeType="getChallengeType(selectedChallenge)"
    :initialComments="comments || []"
    :initialCommentPageInfo="commentPageInfo"
    :isLoading="isModalLoading"
    :challengeId="selectedChallenge.challengeId"
    @close="closeDetailModal"
  />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import api from '@/api/axios'
import ChallengeAddModal from '@/components/admin/challenge/addChallenge.vue'
import settingChallengeDetailModal from '@/components/admin/challenge/settingChallengeDetailModal.vue'

const userStore = useUserStore()
const challengeStatus = ['전체', '진행중인 챌린지', '종료된 챌린지']
const challengeTypes = ['전체', '일일', '주간', '월간', '이벤트']
const filterStatus = ref('전체')
const filterType = ref('전체')

const selectedChallenge = ref(null)
const comments = ref([])
const challengeDetail = ref(null) // 챌린지 상세 정보 저장
const isModalLoading = ref(false) // 모달 로딩 상태
const challenges = ref([])
const isLoading = ref(false)
const isAddModalOpen = ref(false)

const error = ref(null)
const currentPage = ref(1)
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

const openAddmodal = () => {
  isAddModalOpen.value = true
}

const closeAddModal = () => {
  isAddModalOpen.value = false
}

const closeDetailModal = () => {
  selectedChallenge.value = null
  comments.value = null
  commentPageInfo.value = {
    currentPage: 1,
    pageSize: 5,
    totalElements: 0,
    totalPages: 0,
  }
}

// 챌린지 목록 새로고침
const refreshChallenges = () => {
  getChallenge(currentPage.value)
}

const filteredChallenges = computed(() => {
  // 현재 시간 가져오기
  const currentDate = new Date()

  // 기본 필터링 (타입에 따른)
  let filtered = challenges.value

  if (filterType.value !== '전체') {
    filtered = filtered.filter((challenge) => getChallengeType(challenge) === filterType.value)
  }

  // 각 챌린지에 대해 isEnded 상태를 계산
  filtered = filtered.map((challenge) => ({
    ...challenge,
    challengeIsEnded:
      challenge.challengeIsEnded === 1 || new Date(challenge.challengeDeleteDate) < currentDate
        ? 1
        : 0,
  }))

  return filtered
})

const getChallenge = async (page = 1) => {
  isLoading.value = true
  error.value = null

  let apiEndpoint = '/challenge'

  if (filterStatus.value === '진행중인 챌린지') {
    apiEndpoint = '/challenge/active'
  } else if (filterStatus.value === '종료된 챌린지') {
    apiEndpoint = '/challenge/end'
  }

  try {
    const response = await api.get(apiEndpoint, {
      params: {
        page: page,
        size: 15,
      },
    })

    if (response.status === 204) {
      challenges.value = []
      pageInfo.value = {
        currentPage: 1,
        pageSize: 15,
        totalElements: 0,
        totalPages: 0,
      }
      error.value = '아직 등록된 챌린지가 없습니다.'
      return
    }

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

// 필터 상태 변경 핸들러
const handleStatusChange = (status) => {
  filterStatus.value = status
  getChallenge(1)
}

// 타입 필터 변경 핸들러
const handleTypeChange = (type) => {
  filterType.value = type
}

// 페이지 변경 핸들러
const handlePageChange = (page) => {
  getChallenge(page)
}

// 챌린지 타입 판별 함수
const getChallengeType = (challenge) => {
  const start = new Date(challenge.challengeCreateDate)
  const end = new Date(challenge.challengeDeleteDate)

  if (!start || !end) {
    return '일일'
  }

  const diffTime = end.getTime() - start.getTime()
  const diffDays = diffTime / (1000 * 60 * 60 * 24)

  if (diffDays <= 1) return '일일'
  if (diffDays <= 7) return '주간'
  if (diffDays <= 31) return '월간'
  return '이벤트'
}
const openDetailModal = async (challenge) => {
  if (!challenge?.challengeId) {
    console.error('유효하지 않은 챌린지:', challenge)
    return
  }

  try {
    isModalLoading.value = true
    selectedChallenge.value = challenge // 선택된 챌린지 설정

    // 상세 정보와 댓글 동시에 가져오기
    const [detailResponse, commentsResponse] = await Promise.all([
      getChallengeDetail(challenge.challengeId),
      getComments(challenge.challengeId),
    ])

    // 응답 데이터 설정
    challengeDetail.value = detailResponse
    comments.value = commentsResponse?.content || []
    commentPageInfo.value = commentsResponse?.pageInfo || {
      currentPage: 1,
      pageSize: 5,
      totalElements: 0,
      totalPages: 0,
    }
  } catch (error) {
    console.error('모달 데이터 로딩 중 오류:', error)
    alert('데이터를 불러오는데 실패했습니다.')
    selectedChallenge.value = null // 에러 시 선택된 챌린지 초기화
  } finally {
    isModalLoading.value = false
  }
}

// 챌린지 상세보기
const getChallengeDetail = async (challengeId) => {
  try {
    const response = await api.get(`/challenge/${challengeId}`, {
      params: {
        userId: userStore.userId,
      },
    })

    const data = response.data || {}
    challengeDetail.value = {
      ...data,
      challengeCreateDate: data.challengeCreateDate ? data.challengeCreateDate.split(' ')[0] : '',
      challengeDeleteDate: data.challengeDeleteDate ? data.challengeDeleteDate.split(' ')[0] : '',
    }

    return challengeDetail.value
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

// 타입별 색상 클래스
const getChallengeTypeColor = (type) => {
  const colors = {
    일일: 'bg-[gray]/10 text-orange-600',
    주간: 'bg-[gray]/10 text-green-600',
    월간: 'bg-[gray]/10 text-blue-600',
    이벤트: 'bg-[gray]/10 text-purple-600',
  }
  return colors[type] || 'bg-gray-100 text-gray-600'
}

// 카테고리 색상
const getCategoryColor = (categoryCode) => {
  const colors = {
    1: 'bg-[gray]/10 text-[#ff6f3b]',
    2: 'bg-[gray]/10 text-[#00B074]',
  }
  return colors[categoryCode] || 'bg-gray-100 text-gray-600'
}

// 카테고리 코드를 한글 이름으로 변환
const getCategoryName = (categoryCode) => {
  const names = {
    1: '뛰거나',
    2: '걷거나',
  }
  return names[categoryCode] || '기타'
}

// 참여율 계산
const getParticipationRate = (challenge) => {
  if (!challenge.challengeTargetCnt || challenge.challengeTargetCnt === 0) return 0
  return ((challenge.challengeParticipantCnt / challenge.challengeTargetCnt) * 100).toFixed(1)
}

// 날짜 포맷팅
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(
    date.getDate(),
  ).padStart(2, '0')}`
}

onMounted(() => {
  getChallenge(1)
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
