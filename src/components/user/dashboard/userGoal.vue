<template>
  <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <div>
      <div class="flex items-center gap-2 mb-4">
        <h3 class="text-lg font-semibold text-gray-700">
          {{ title }}
        </h3>
      </div>
      
      <!-- 필터링된 진행 중인 챌린지만 출력 -->
      <div v-if="activeChallengers.length > 0" class="space-y-3">
        <div v-for="(challenge, index) in activeChallengers.slice(0, 3)" 
             :key="challenge.challengeId" 
             class="group flex items-center p-3 transition-all duration-300 hover:bg-orange-50 rounded-lg cursor-pointer">
          <!-- 챌린지 번호 -->
          <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 text-[#FF6F3B] font-semibold mr-3 group-hover:bg-[#FF6F3B] group-hover:text-white transition-colors duration-300">
            {{ index + 1 }}
          </div>
          
          <!-- 챌린지 정보 -->
          <div class="flex-grow">
            <p class="text-sm font-medium text-gray-700 group-hover:text-[#FF6F3B] transition-colors duration-300">
              {{ challenge.challengeTitle }}
            </p>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-xs text-gray-500">{{ challenge.challengeCategoryName }}</span>
              <span class="text-xs px-2 py-0.5 rounded-full" 
                    :class="getDdayClass(challenge.dday)">
                {{ challenge.dday }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 데이터가 없을 경우 표시 -->
      <div v-else class="flex flex-col items-center justify-center p-6 text-gray-500">
        <span class="text-4xl mb-2">🎯</span>
        <p class="text-sm">참여 중인 챌린지가 없습니다</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import api from '@/api/axios'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  }
})

const userStore = useUserStore()
const challenges = ref({ content: [] })

// D-day 클래스 계산 함수
const getDdayClass = (dday) => {
  if (dday.includes('+')) {
    return 'bg-orange-100 text-[#FF6F3B]'
  } else if (dday.includes('-')) {
    return 'bg-green-100 text-green-600'
  }
  return 'bg-gray-100 text-gray-600'
}

// 진행 중인 챌린지만 필터링하는 computed 속성
const activeChallengers = computed(() => {
  if (!challenges.value.content) return []
  
  return challenges.value.content.filter(challenge => {
    // D+ 형식이 아닌 챌린지만 포함
    return !challenge.dday.includes('+')
  })
})

onMounted(async () => {
  await fetchChallenges()
})

const fetchChallenges = async () => {
  try {
    // size 파라미터를 제거하여 전체 데이터를 가져옴
    const response = await api.get(`/user/${userStore.userId}/challenge`, {
      headers: {
        'Authorization': `Bearer ${userStore.accessToken}`
      },
      params: {
        page: 1
      }
    })

    challenges.value = response.data
    console.log("전체 챌린지:", challenges.value)
    console.log("필터링된 챌린지:", activeChallengers.value)

  } catch (error) {
    console.error('Error fetching user challenges:', error)
    challenges.value = { content: [] }
  }
}

const checkAuthStatus = () => {
  const token = localStorage.getItem('accessToken')
  return !!token
}
</script>