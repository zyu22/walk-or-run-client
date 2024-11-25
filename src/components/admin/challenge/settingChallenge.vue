<template>
  <div class="rounded-xl bg-white p-6 shadow-sm">
    <div class="mb-10 flex items-center justify-between">
      <div>
        <h2 class="font-paperlogy text-5xl font-bold text-gray-900">챌린지 현황</h2>
        <p class="mt-1 text-sm text-gray-600">전체 챌린지 관리</p>
      </div>
      <button
        @click="openAddModal"
        class="rounded-lg bg-[#ff6f3b] px-4 py-2 text-white transition-colors hover:bg-[#ff5c2e]"
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
    <div v-else-if="error" class="py-20 text-center text-red-500">
      {{ error }}
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
            <th
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              관리
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="challenge in filteredChallenges" :key="challenge.challengeId">
            <td class="whitespace-nowrap px-6 py-4">
              <span
                class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                :class="getChallengeTypeColor(getChallengeType(challenge))"
              >
                {{ getChallengeType(challenge) }}
              </span>
            </td>
            <td class="px-6 py-4">{{ challenge.challengeTitle }}</td>
            <td class="whitespace-nowrap px-6 py-4">
              {{ formatDate(challenge.challengeCreateDate) }} ~
              {{ formatDate(challenge.challengeDeleteDate) }}
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="w-24 rounded-full bg-gray-100">
                  <div
                    class="h-2 rounded-full transition-all"
                    :class="{
                      'bg-red-500': getParticipationRate(challenge) < 30,
                      'bg-yellow-500':
                        getParticipationRate(challenge) >= 30 &&
                        getParticipationRate(challenge) < 70,
                      'bg-[#ff6f3b]': getParticipationRate(challenge) >= 70,
                    }"
                    :style="{
                      width: `${Math.min(
                        (challenge.challengeParticipantCnt / challenge.challengeTargetCnt) * 100,
                        100,
                      ).toFixed(1)}%`,
                    }"
                  ></div>
                </div>
                <span class="ml-2 text-sm text-gray-600">
                  {{ getParticipationRate(challenge) }}%
                </span>
              </div>
            </td>
            <td class="whitespace-nowrap px-6 py-4">
              <span
                class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                :class="
                  challenge.dday === '종료'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-green-100 text-green-800'
                "
              >
                {{ challenge.dday === '종료' ? '종료' : '진행중' }}
              </span>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm">
              <button class="mr-2 text-[#00B074] hover:text-[#009563]">수정</button>
              <button class="text-red-600 hover:text-red-900">삭제</button>
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
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/api/axios'
import addChallenge from '@/components/admin/challenge/addChallenge.vue'

const challenges = ref([])
const isLoading = ref(false)
const isAddModelOpen = ref(false)
const error = ref(null)
const currentPage = ref(1)
const pageInfo = ref({
  currentPage: 1,
  pageSize: 16,
  totalElements: 0,
  totalPages: 0,
})

const challengeStatus = ['전체', '진행중인 챌린지', '종료된 챌린지']
const challengeTypes = ['전체', '일일', '주간', '월간', '이벤트']
const filterStatus = ref('전체')
const filterType = ref('전체')

const openAddmodal = () => {
  isAddModelOpen.value = true
}

const clasAddModal = () => {
  isAddModelOpen.value = false
}

// 챌린지 목록 새로고침
const refreshChallenges = () => {
  getChallenge(currentPage.value)
}

// 필터링된 챌린지 목록
const filteredChallenges = computed(() => {
  if (filterType.value === '전체') {
    return challenges.value
  }
  return challenges.value.filter((challenge) => getChallengeType(challenge) === filterType.value)
})

// API 호출 함수
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

// 타입별 색상 클래스
const getChallengeTypeColor = (type) => {
  const colors = {
    일일: 'bg-orange-100 text-orange-600',
    주간: 'bg-green-100 text-green-600',
    월간: 'bg-blue-100 text-blue-600',
    이벤트: 'bg-purple-100 text-purple-600',
  }
  return colors[type] || 'bg-gray-100 text-gray-600'
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
