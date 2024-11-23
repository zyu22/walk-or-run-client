<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
      <h2 class="mb-6 text-center text-2xl font-bold">로그인</h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">이메일</label>
          <input
            type="email"
            v-model="userEmail"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">비밀번호</label>
          <input
            type="password"
            v-model="userPassword"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full rounded-md bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600"
          :disabled="isLoading"
        >
          {{ isLoading ? '로딩중...' : '로그인' }}
        </button>
        <p v-if="error" class="text-center text-sm text-red-500">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios' // axios 대신 api 인스턴스 사용
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userEmail = ref('')
const userPassword = ref('')
const error = ref('')
const isLoading = ref(false)
const userStore = useUserStore()

const handleLogin = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const response = await api.post('auth/login', {
      userEmail: userEmail.value,
      userPassword: userPassword.value,
    })

    if (response.status === 200) {
      const accessToken = response.data.access_token
      console.log(response.data)
      const refreshToken = response.data.refresh_token

      // localStorage에 토큰 저장
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      // Pinia store 업데이트
      userStore.updateUserInfo(accessToken)

      router.push('/dashboard')
    }
  } catch (error) {
    if (error.response) {
      error.value = error.response.data.message || '로그인에 실패했습니다.'
    } else {
      error.value = '서버와의 연결에 문제가 있습니다.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>
