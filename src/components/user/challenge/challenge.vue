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
        :key="challenge.id"
        @click="openChallengeModal(challenge)"
        class="group cursor-pointer rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md"
      >
        <div class="mb-4 flex items-start justify-between">
          <span
            class="rounded-full px-3 py-1 text-sm"
            :class="getChallengeTypeColor(challenge.type)"
          >
            {{ challenge.type }}
          </span>
          <span class="text-sm text-gray-500">D-{{ challenge.dday }}</span>
        </div>

        <h3 class="mb-2 text-lg font-semibold group-hover:text-[#ff6f3b]">{{ challenge.title }}</h3>
        <p class="mb-4 text-sm text-gray-600">{{ challenge.description }}</p>

        <div class="space-y-2">
          <div class="flex justify-between text-sm text-gray-500">
            <span>참여율</span>
            <span>{{ challenge.progress }}%</span>
          </div>
          <div class="h-2 w-full rounded-full bg-gray-100">
            <div
              class="h-2 rounded-full bg-[#ff6f3b]"
              :style="{ width: `${challenge.progress}%` }"
            ></div>
          </div>
          <div class="text-right text-sm text-gray-500">
            {{ challenge.participants.toLocaleString() }}명 참여 중
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 페이지네이션 -->
  <div class="mt-8 flex justify-center space-x-2">
    <button
      v-for="page in totalPages"
      :key="page"
      @click="currentPage = page"
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
    @close="closeModal"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ChallengeDetailModal from '@/components/user/challenge/challengeDetailModal.vue'
import api from '@/api/axios.js'

const challengeTypes = ['All', 'Daily', 'Weekly', 'Monthly', 'Event']
const filterType = ref('All')
const currentPage = ref(1)
const selectedChallenge = ref(null)
const challenges = ref([])
const isLoading = ref(false)
const error = ref(null)

// API에서 챌린지 데이터 가져오기
const fetchChallenges = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await api.get('/challenge') // API 엔드포인트에 맞게 조정하세요
    challenges.value = response.data
  } catch (err) {
    console.error('챌린지 데이터를 불러오는 데 실패했습니다:', err)
    error.value = '챌린지 데이터를 불러오는 데 실패했습니다. 다시 시도해 주세요.'
  } finally {
    isLoading.value = false
  }
}

// 컴포넌트 마운트 시 데이터 가져오기
onMounted(fetchChallenges)

const filteredChallenges = computed(() => {
  if (filterType.value === 'All') {
    return challenges.value
  }
  return challenges.value.filter((challenge) => challenge.type === filterType.value)
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

const totalPages = computed(() => Math.ceil(filteredChallenges.value.length / 8))

const openChallengeModal = (challenge) => {
  selectedChallenge.value = challenge
}

const closeModal = () => {
  selectedChallenge.value = null
}
</script>
