<!-- ChallengeDetailModal.vue -->
<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
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
              :class="getChallengeTypeColor(getChallengeType(challenge.challengeTitle))"
            >
              {{ getChallengeType(challenge.challengeTitle) }}
            </span>
            <h2 class="text-2xl font-bold">{{ challenge.challengeTitle }}</h2>
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
          <!-- 기본 정보 -->
          <div>
            <p class="text-gray-600">{{ challenge.challengeDescription }}</p>
          </div>

          <!-- 챌린지 정보 -->
          <div class="grid grid-cols-2 gap-4">
            <div class="rounded-lg bg-gray-50 p-4">
              <p class="text-sm text-gray-500">참여자 수</p>
              <p class="text-lg font-semibold">{{ challenge.challengeParticipantCnt || 0 }}명</p>
            </div>
            <div class="rounded-lg bg-gray-50 p-4">
              <p class="text-sm text-gray-500">참여율</p>
              <p class="text-lg font-semibold">
                {{
                  (
                    (challenge.challengeParticipantCnt / challenge.challengeTargetCnt) *
                    100
                  ).toFixed(1)
                }}%
              </p>
            </div>
          </div>

          <!-- 상세 정보 -->
          <div v-if="challengeDetail">
            <!-- 여기에 API에서 받아온 상세 정보를 표시 -->
            <div class="rounded-lg bg-gray-50 p-4">
              <h3 class="mb-2 font-semibold">챌린지 상세 정보</h3>
              <!-- API 응답 구조에 따라 적절히 표시 -->
              <div class="space-y-2">
                <p>
                  <span class="font-medium">시작일:</span> {{ challengeDetail.challengeCreateDate }}
                </p>
                <p>
                  <span class="font-medium">종료일:</span> {{ challengeDetail.challengeDeleteDate }}
                </p>
                <p>
                  <span class="font-medium">카테고리:</span>
                  {{ challengeDetail.challengeCategoryName }}
                </p>
                <!-- 기타 상세 정보들 -->
              </div>
            </div>
          </div>

          <!-- 참여하기 버튼 -->
          <div class="mt-6">
            <button
              class="w-full rounded-lg px-4 py-2 text-white transition-colors"
              :class="{
                'cursor-pointer bg-[#ff6f3b] hover:bg-[#ff5722]': challenge.dday !== '종료',
                'cursor-not-allowed bg-gray-400': challenge.dday === '종료',
              }"
              :disabled="challenge.dday === '종료'"
            >
              {{ challenge.dday === '종료' ? '챌린지 종료' : '챌린지 참여하기' }}
            </button>
            <p v-if="challenge.dday === '종료'" class="mt-2 text-center text-sm text-gray-500">
              종료된 챌린지입니다
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  challenge: Object,
  challengeDetail: Object,
  isLoading: Boolean,
})

// 함수들을 컴포넌트 내부에서 정의
const getChallengeType = (title) => {
  if (title.includes('DAILY')) return 'Daily'
  if (title.includes('WEEKLY')) return 'Weekly'
  if (title.includes('MONTHLY')) return 'Monthly'
  if (title.includes('EVENT')) return 'Event'
  return 'Daily'
}

const getChallengeTypeColor = (type) => {
  const colors = {
    Daily: 'bg-orange-100 text-orange-600',
    Weekly: 'bg-green-100 text-green-600',
    Monthly: 'bg-blue-100 text-blue-600',
    Event: 'bg-purple-100 text-purple-600',
  }
  return colors[type] || 'bg-gray-100 text-gray-600'
}
</script>
