// views/ChallengeView.vue
<template>
      <!-- 헤더 -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold">Challenge</h1>
        <div class="flex gap-2">
          <button 
            v-for="type in challengeTypes" 
            :key="type"
            @click="filterType = type"
            class="px-4 py-2 rounded-lg transition-colors"
            :class="filterType === type ? 'bg-[#ff6f3b] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'"
          >
            {{ type }}
          </button>
        </div>
      </div>

      <!-- 챌린지 카드 그리드 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="challenge in filteredChallenges" 
          :key="challenge.id"
          @click="openChallengeModal(challenge)"
          class="bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer p-6 group"
        >
          <div class="flex justify-between items-start mb-4">
            <span 
              class="px-3 py-1 rounded-full text-sm"
              :class="getChallengeTypeColor(challenge.type)"
            >
              {{ challenge.type }}
            </span>
            <span class="text-sm text-gray-500">D-{{ challenge.dday }}</span>
          </div>

          <h3 class="text-lg font-semibold mb-2 group-hover:text-[#ff6f3b]">{{ challenge.title }}</h3>
          <p class="text-sm text-gray-600 mb-4">{{ challenge.description }}</p>

          <div class="space-y-2">
            <div class="flex justify-between text-sm text-gray-500">
              <span>참여율</span>
              <span>{{ challenge.progress }}%</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2">
              <div 
                class="h-2 rounded-full bg-[#ff6f3b]"
                :style="{ width: `${challenge.progress}%` }"
              ></div>
            </div>
            <div class="text-sm text-gray-500 text-right">
              {{ challenge.participants.toLocaleString() }}명 참여 중
            </div>
          </div>
        </div>
      </div>

      <!-- 페이지네이션 -->
      <div class="flex justify-center mt-8 space-x-2">
        <button 
          v-for="page in totalPages" 
          :key="page"
          @click="currentPage = page"
          class="px-4 py-2 rounded-lg"
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
import { ref, computed } from 'vue';
import SideBar from '../components/dashboard/SideBar.vue';
import ChallengeDetailModal from '../components/dashboard/ChallengeDetailModal.vue';

const challengeTypes = ['All', 'Daily', 'Weekly', 'Monthly', 'Event'];
const filterType = ref('All');
const currentPage = ref(1);
const selectedChallenge = ref(null);



// 샘플 데이터 추가
const challenges = ref([
  {
    id: 1,
    type: 'Daily',
    title: '하루 만보 걷기',
    description: '매일 만보 걸으며 건강한 습관 만들기',
    dday: 1,
    progress: 85,
    participants: 2543,
    period: '2024.03.21 - 2024.03.21'
  },
  {
    id: 2,
    type: 'Weekly',
    title: '주 3회 운동하기',
    description: '일주일에 3번 이상 30분 운동 달성하기',
    dday: 5,
    progress: 45,
    participants: 1876,
    period: '2024.03.18 - 2024.03.24'
  },
  {
    id: 3,
    type: 'Monthly',
    title: '3월 체중 감량 챌린지',
    description: '한 달 동안 목표 체중 달성하기',
    dday: 10,
    progress: 62,
    participants: 3241,
    period: '2024.03.01 - 2024.03.31'
  },
  {
    id: 4,
    type: 'Event',
    title: '봄맞이 러닝 챌린지',
    description: '벚꽃과 함께하는 러닝 인증하기',
    dday: 7,
    progress: 28,
    participants: 982,
    period: '2024.03.20 - 2024.04.10'
  },
  {
    id: 5,
    type: 'Daily',
    title: '아침 스트레칭',
    description: '하루 10분 아침 스트레칭으로 상쾌한 하루 시작',
    dday: 1,
    progress: 92,
    participants: 1567,
    period: '2024.03.21 - 2024.03.21'
  },
  {
    id: 6,
    type: 'Weekly',
    title: '식단 기록하기',
    description: '매일 식단을 기록하고 주간 리포트 받기',
    dday: 4,
    progress: 73,
    participants: 2198,
    period: '2024.03.18 - 2024.03.24'
  },
  {
    id: 7,
    type: 'Monthly',
    title: '플로깅 챌린지',
    description: '달리기하면서 쓰레기도 줍는 환경 보호 활동',
    dday: 15,
    progress: 55,
    participants: 876,
    period: '2024.03.01 - 2024.03.31'
  },
  {
    id: 8,
    type: 'Event',
    title: '친구와 함께 운동',
    description: '친구와 함께 운동하고 인증샷 올리기',
    dday: 3,
    progress: 68,
    participants: 1432,
    period: '2024.03.15 - 2024.03.25'
  }
]);

const filteredChallenges = computed(() => {
  if (filterType.value === 'All') {
    return challenges.value;  // .value 추가
  }
  return challenges.value.filter(challenge => challenge.type === filterType.value);  // .value 추가
});

const getChallengeTypeColor = (type) => {
  const colors = {
    'Daily': 'bg-orange-100 text-orange-600',
    'Weekly': 'bg-green-100 text-green-600',
    'Monthly': 'bg-blue-100 text-blue-600',
    'Event': 'bg-purple-100 text-purple-600'
  };
  return colors[type] || 'bg-gray-100 text-gray-600';
};

const totalPages = computed(() => Math.ceil(filteredChallenges.value.length / 8));

const openChallengeModal = (challenge) => {
  selectedChallenge.value = challenge;
};

const closeModal = () => {
  selectedChallenge.value = null;
};
</script>