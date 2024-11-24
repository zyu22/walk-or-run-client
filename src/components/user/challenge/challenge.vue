<template>
  <!-- 헤더 -->
  <div class="mb-8 flex items-center justify-between">
    <h1 class="text-2xl font-bold">Challenge</h1>
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
          'opacity-75': challenge.dday === '종료',
          'border border-gray-200': challenge.dday === '종료',
        }"
      >
        <div class="mb-4 flex items-start justify-between">
          <span
            class="rounded-full px-3 py-1 text-sm"
            :class="getChallengeTypeColor(getChallengeType(challenge.challengeTitle))"
          >
            {{ getChallengeType(challenge) }}
          </span>
          <span class="text-sm text-gray-500">{{ challenge.dday || 0 }}</span>
        </div>

        <h3
          class="mb-2 text-lg font-semibold"
          :class="{
            'text-gray-900 group-hover:text-[#ff6f3b]': challenge.dday !== '종료',
            'text-gray-400': challenge.dday === '종료',
          }"
        >
          {{ challenge.challengeTitle }}
        </h3>
        <p
          class="mb-4 text-sm"
          :class="{
            'text-gray-600': challenge.dday !== '종료',
            'text-gray-400': challenge.dday === '종료',
          }"
        >
          {{ challenge.challengeDescription }}
        </p>
        <div class="space-y-2">
          <div class="flex justify-between text-sm text-gray-500">
            <span>참여율</span>
            <span
              >{{
                ((challenge.challengeParticipantCnt / challenge.challengeTargetCnt) * 100).toFixed(
                  1,
                )
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
                width: `${((challenge.challengeParticipantCnt / challenge.challengeTargetCnt) * 100).toFixed(1)}%`,
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

  <!-- 챌린지 상세 모달 -->
  <ChallengeDetailModal
    v-if="selectedChallenge"
    :challenge="selectedChallenge"
    :challengeDetail="challengeDetail"
    :isLoading="isModalLoading"
    @close="closeModal"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ChallengeDetailModal from '@/components/user/challenge/challengeDetailModal.vue'
import { useUserStore } from '@/stores/user'
import api from '@/api/axios'
import { differenceInDays } from 'date-fns'

const userStore = useUserStore()
const challengeTypes = ['All', 'Daily', 'Weekly', 'Monthly', 'Event']
const filterType = ref('All')
const currentPage = ref(1)
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

const getParticipationRate = (challenge) => {
  if (!challenge.challengeTargetCnt || challenge.challengeTargetCnt === 0) return 0
  return ((challenge.challengeParticipantCnt / challenge.challengeTargetCnt) * 100).toFixed(1)
}

const getChallengeType = (challenge) => {
  console.log(challenge)
  // 챌린지 객체 전체를 받아서 필드명 확인
  console.log('챌린지 생성일:', challenge.challengeCreateDate) // 또는 challengeCreateDate
  console.log('챌린지 종료일:', challenge.challengeCreateDate) // 또는 challengeDeleteDate

  const start = new Date(challenge.challengeCreateDate)
  const end = new Date(challenge.challenge_delete_date)

  console.log('변환된 시작일:', start)
  console.log('변환된 종료일:', end)

  const diffTime = end.getTime() - start.getTime()
  const diffDays = diffTime / (1000 * 60 * 60 * 24)

  console.log('일수 차이:', diffDays)

  if (diffDays <= 1) return 'Daily'
  if (diffDays <= 7) return 'Weekly'
  if (diffDays <= 31) return 'Monthly'
  return 'Event'
}

// API에서 챌린지 데이터 가져오기
const getChallege = async (page = 1) => {
  isLoading.value = true
  error.value = null
  try {
    const response = await api.get('/challenge', {
      params: {
        page: page, // 백엔드에서 처리하므로 그대로 전달
        size: 16,
      },
    })
    // 응답 데이터 구조 확인
    console.log('API Response:', response.data)
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

// 챌린지 상세 정보 가져오기
const getChallengeDetail = async (challengeId) => {
  isModalLoading.value = true
  try {
    const response = await api.get(`/challenge/${challengeId}`, {
      params: {
        userId: userStore.userId,
      },
    })
    console.log('상세보기: ', response)
    challengeDetail.value = response.data
  } catch (err) {
    console.error('챌린지 상세 정보를 불러오는 데 실패했습니다:', err)
    alert('챌린지 상세 정보를 불러오는 데 실패했습니다.')
  } finally {
    isModalLoading.value = false
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
  if (filterType.value === 'All') {
    return challenges.value
  }
  return challenges.value.filter(
    (challenge) => getChallengeType(challenge.challengeTitle) === filterType.value,
  )
})

const getChallengeTypeColor = (type) => {
  const colors = {
    Daily: 'bg-orange-100 text-orange-600',
    Weekly: 'bg-green-100 text-green-600',
    Monthly: 'bg-blue-100 text-blue-600',
    Event: 'bg-purple-100 text-purple-600',
  }
  return colors[type] || 'bg-gray-100 text-gray-600'
}

// 모달 열기 함수 수정
const openChallengeModal = async (challenge) => {
  selectedChallenge.value = challenge // 기본 정보 먼저 설정
  await getChallengeDetail(challenge.challengeId) // 상세 정보 가져오기
}

const closeModal = () => {
  selectedChallenge.value = null
}
</script>
