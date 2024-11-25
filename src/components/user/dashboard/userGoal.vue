<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-700">{{ title }}</h3>
        
        <!-- content 배열 내의 challengeTitle만 출력 -->
        <div v-if="challenges.content && challenges.content.length > 0">
          <p v-for="(challenge, index) in challenges.content" 
             :key="challenge.challengeId" 
             class="text-sm text-gray-500 mt-1">
            {{ index + 1 }}. {{ challenge.challengeTitle }}
          </p>
        </div>
        
        <!-- 데이터가 없을 경우 표시 -->
        <div v-else>
          <p class="text-sm text-gray-500 mt-1">데이터가 없습니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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
const challenges = ref({ content: [] }) // 초기값을 객체 형태로 설정
const icon = '🎯'

onMounted(async () => {
  await fetchChallenges()
})

const fetchChallenges = async () => {
  try {
    const response = await api.get(`/user/${userStore.userId}/challenge`, {
      headers: {
        'Authorization': `Bearer ${userStore.accessToken}`
      },
      params: {
        page: 1,
        size: 3
      }
    })

    // response.data를 그대로 할당
    challenges.value = response.data
    console.log("챌린지 출력: ", challenges.value)

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