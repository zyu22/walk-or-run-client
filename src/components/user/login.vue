// components/Login.vue
<template>
  <div class="max-w-md mx-auto p-8">
    <!-- 로고 -->
    <div class="text-center mb-12">
      <h1 class="text-3xl font-bold">
        <span class="text-[#FF6B4D]">Walk</span>
        <span class="text-[#4DFF5C]">Or</span>
        <span class="text-[#FF6B4D]">Run</span>
      </h1>
    </div>

    <!-- 로그인 폼 -->
    <form @submit.prevent="handleLogin">
      <!-- 이메일 입력 -->
      <div class="mb-6">
        <label for="email" class="block text-sm mb-2">이메일</label>
        <div class="relative">
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="hello@example.com"
            required
            class="w-full px-3 py-3 border border-gray-200 rounded-md text-base"
          />
          <span class="absolute -top-5 right-0 text-sm text-gray-500 cursor-pointer">
            이메일 찾기
          </span>
        </div>
      </div>

      <!-- 비밀번호 입력 -->
      <div class="mb-6">
        <label for="password" class="block text-sm mb-2">비밀번호</label>
        <div class="relative">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="password"
            placeholder="••••••••••••"
            required
            class="w-full px-3 py-3 border border-gray-200 rounded-md text-base"
          />
          <button 
            type="button" 
            class="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
            @click="togglePassword"
          >
            <!-- 눈 모양 SVG (비밀번호 숨김 상태) -->
            <svg v-if="!showPassword" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <!-- 눈 모양 SVG (비밀번호 표시 상태) -->
            <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          </button>
          <span class="absolute -top-5 right-0 text-sm text-gray-500 cursor-pointer">
            비밀번호 찾기
          </span>
        </div>
      </div>

      <!-- 이용약관 동의 -->
      <div class="flex items-start gap-2 mb-6">
        <input 
          type="checkbox" 
          id="terms" 
          v-model="agreedToTerms"
          required
          class="mt-1"
        />
        <label for="terms" class="text-sm">
          아이디 저장
        </label>
      </div>

      <!-- 로그인 및 회원가입 버튼 -->
      <button 
        type="submit" 
        class="w-full py-4 mb-4 bg-black text-white rounded-md text-base hover:opacity-90 transition-opacity"
      >
        로그인
      </button>
      <button 
        type="button" 
        @click="goToSignup"
        class="w-full py-4 mb-4 bg-black text-white rounded-md text-base hover:opacity-90 transition-opacity"
      >
        회원가입
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// 상태 관리
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const agreedToTerms = ref(false)
const router = useRouter()

// 비밀번호 표시/숨김 토글
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// emit 정의
const emit = defineEmits(['login'])

// 로그인 처리
const handleLogin = async () => {
  try {
    // 부모 컴포넌트로 로그인 데이터 전달
    emit('login', {
      email: email.value,
      password: password.value
    })
  } catch (error) {
    console.error('로그인 실패:', error)
  }
}

// 회원가입 페이지로 이동
const goToSignup = () => {
  router.push('/signup')
}
</script>