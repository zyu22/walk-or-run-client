<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-700">{{ title }}</h3>
        <p class="text-sm text-gray-500 mt-1">
          <span v-if="challenges.length > 0">1. {{ challenges[0].challengeTitle }}</span>
          <span v-else>1. --</span>
        </p>
        <p class="text-sm text-gray-500 mt-1">
          <span v-if="challenges.length > 1">2. {{ challenges[1].challengeTitle }}</span>
          
        </p>
        <p class="text-sm text-gray-500 mt-1">
          <span v-if="challenges.length > 2">3. {{ challenges[2].challengeTitle }}</span>
          
        </p>
      </div>
      <!--
      <div class="text-green-500 text-2xl">
        {{ icon }}
      </div>
      -->
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

const challenges = ref([])
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

    challenges.value = response.data

    console.log("챌린지 출력: ", challenges.value)

  } catch (error) {
    console.error('Error fetching user challenges:', error)
    challenges.value = []
  }
}

const checkAuthStatus = () => {
  const token = localStorage.getItem('accessToken')
  return !!token
}
</script>