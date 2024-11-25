<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
      <div class="mb-6 flex justify-center">
        <img
          src="@/assets/logo.png"
          alt="WalkOrRun"
          class="h-40 w-auto cursor-pointer"
          @click="router.push({ name: 'login' })"
        />
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">이메일</label>
          <input
            type="email"
            v-model="userEmail"
            autocomplete="new-password"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">비밀번호</label>
          <input
            type="password"
            v-model="userPassword"
            autocomplete="new-password"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>

        <!-- 아이디 저장 체크박스 추가 -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              type="checkbox"
              id="remember"
              v-model="rememberEmail"
              class="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
            <label for="remember" class="ml-2 block text-sm text-gray-700">아이디 저장</label>
          </div>
        </div>
        <p v-if="error" class="text-center text-sm text-red-500">{{ error }}</p>
        <button
          type="submit"
          class="w-full rounded-md bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600"
          :disabled="isLoading"
        >
          {{ isLoading ? '로딩중...' : '로그인' }}
        </button>
      </form>

      <div class="mt-4 flex justify-center space-x-4 text-sm text-gray-600">
        <router-link :to="{ name: 'findEmail' }" class="hover:text-orange-500"
          >이메일 찾기</router-link
        >
        <span>|</span>
        <router-link :to="{ name: 'findPassword' }" class="hover:text-orange-500"
          >비밀번호 찾기</router-link
        >
      </div>

      <!-- 회원가입 링크 -->
      <div class="mt-6 text-center text-sm">
        <span class="text-gray-500">아직 회원이 아니신가요?</span>
        <router-link
          :to="{ name: 'register' }"
          class="ml-2 font-medium text-orange-500 hover:text-orange-600"
        >
          회원가입
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios' // axios 대신 api 인스턴스 사용
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userEmail = ref('')
const userPassword = ref('')
const rememberEmail = ref(false)
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
      const refreshToken = response.data.refresh_token

      // 아이디 저장 처리
      if (rememberEmail.value) {
        localStorage.setItem('rememberedEmail', userEmail.value)
      } else {
        localStorage.removeItem('rememberedEmail')
      }

      // localStorage에 토큰 저장
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      await userStore.updateUserInfo(accessToken)

      if (userStore.userRole === 'ADMIN') {
        router.push({ name: 'adminDashboard' })
      } else {
        router.push({ name: 'userDashboard' })
      }
    }
  } catch (err) {
    // error -> err로 변경
    if (err.response) {
      // error.response 체크
      if (err.response.status === 500) {
        console.log('여기 등장')
        error.value = '아이디와 비밀번호를 확인해주세요.'
      } else {
        error.value = err.response.data.message || '서버와의 연결에 문제가 있습니다.'
      }
    } else {
      error.value = '서버와의 연결에 문제가 있습니다.'
    }
  } finally {
    isLoading.value = false
  }
}

// 컴포넌트 마운트 시 저장된 이메일 불러오기
onMounted(() => {
  const savedEmail = localStorage.getItem('rememberedEmail')
  if (savedEmail) {
    userEmail.value = savedEmail
    rememberEmail.value = true
  }
})
</script>
