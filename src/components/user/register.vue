<!-- components/Signup.vue -->
<template>
    <div class="max-w-md mx-auto p-8 mt-40">
      <!-- 로고 -->
      <div class="text-center mb-12">
        <h1 class="text-3xl font-bold">
          <span class="text-[#FF6B4D]">Walk</span>
          <span class="text-[#4DFF5C]">Or</span>
          <span class="text-[#FF6B4D]">Run</span>
        </h1>
      </div>
  
      <!-- 회원가입 폼 -->
      <form @submit.prevent="handleSignup">
        <!-- 이메일 입력 -->
        <div class="mb-6">
          <label for="email" class="block text-sm mb-2">이메일</label>
          <div class="relative">
            <input
              type="email"
              id="email"
              v-model="signupForm.email"
              placeholder="hello@example.com"
              required
              class="w-full px-3 py-3 border border-gray-200 rounded-md text-base"
            />
          </div>
        </div>
  
        <!-- 비밀번호 입력 -->
        <div class="mb-6">
          <label for="password" class="block text-sm mb-2">비밀번호</label>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="signupForm.password"
              placeholder="••••••••••••"
              required
              class="w-full px-3 py-3 border border-gray-200 rounded-md text-base"
            />
            <button 
              type="button" 
              class="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              @click="togglePassword"
            >
              <svg v-if="!showPassword" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            </button>
          </div>
        </div>
  
        <!-- 비밀번호 확인 -->
        <div class="mb-6">
          <label for="confirmPassword" class="block text-sm mb-2">비밀번호 확인</label>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="confirmPassword"
              v-model="signupForm.confirmPassword"
              placeholder="••••••••••••"
              required
              class="w-full px-3 py-3 border border-gray-200 rounded-md text-base"
            />
          </div>
        </div>
  
        <!-- 보안 질문 -->
        <div class="mb-6">
          <label for="securityQuestion" class="block text-sm mb-2">비밀번호 질문</label>
          <select
            id="securityQuestion"
            v-model="signupForm.securityQuestion"
            required
            class="w-full px-3 py-3 border border-gray-200 rounded-md text-base"
          >
            <option value="" disabled selected>질문을 선택해주세요</option>
            <option v-for="question in securityQuestions" :key="question.id" :value="question.id">
              {{ question.question }}
            </option>
          </select>
        </div>
  
        <!-- 보안 답변 -->
        <div class="mb-6">
          <label for="securityAnswer" class="block text-sm mb-2">비밀번호 답변</label>
          <input
            type="text"
            id="securityAnswer"
            v-model="signupForm.securityAnswer"
            placeholder="답변을 입력해주세요"
            required
            class="w-full px-3 py-3 border border-gray-200 rounded-md text-base"
          />
        </div>
  
        <!-- 이름 -->
        <div class="mb-6">
          <label for="name" class="block text-sm mb-2">이름</label>
          <input
            type="text"
            id="name"
            v-model="signupForm.name"
            required
            class="w-full px-3 py-3 border border-gray-200 rounded-md text-base"
          />
        </div>
  
        <!-- 닉네임 -->
        <div class="mb-6">
          <label for="nickname" class="block text-sm mb-2">닉네임</label>
          <input
            type="text"
            id="nickname"
            v-model="signupForm.nickname"
            required
            class="w-full px-3 py-3 border border-gray-200 rounded-md text-base"
          />
        </div>
  
        <!-- 전화번호 -->
        <div class="mb-6">
          <label for="phone" class="block text-sm mb-2">전화번호</label>
          <input
            type="tel"
            id="phone"
            v-model="signupForm.phone"
            placeholder="010-1234-5678"
            required
            class="w-full px-3 py-3 border border-gray-200 rounded-md text-base"
          />
        </div>
  
        <!-- 이용약관 동의 -->
        <div class="flex items-start gap-2 mb-6">
          <input 
            type="checkbox" 
            id="terms" 
            v-model="signupForm.agreedToTerms"
            required
            class="mt-1"
          />
          <label for="terms" class="text-sm">
            서비스 이용약관에 동의합니다.
          </label>
        </div>
  
        <!-- 회원가입 버튼 -->
        <button 
          type="submit" 
          class="w-full py-4 mb-4 bg-black text-white rounded-md text-base hover:opacity-90 transition-opacity"
        >
          회원가입
        </button>
  
        <!-- 로그인 링크 -->
        <p class="text-center text-sm text-gray-500">
          이미 계정이 있으신가요? 
          <span 
            @click="goToLogin" 
            class="text-[#FF6B4D] cursor-pointer hover:underline"
          >
            로그인하기
          </span>
        </p>
      </form>
  
      <!-- 푸터 -->
      <footer class="text-center text-gray-500 text-sm mt-12">
        © 2024 WalkOrRun. All rights reserved.
      </footer>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const showPassword = ref(false)
  
  // 보안 질문 목록
  const securityQuestions = [
    { id: 1, question: '내가 졸업한 초등학교 이름은?' },
    { id: 2, question: '어머니의 성함은?' },
    { id: 3, question: '아버지의 성함은?' },
    { id: 4, question: '나의 보물 1호는?' },
    { id: 5, question: '내가 가장 좋아하는 음식은?' },
    { id: 6, question: '내가 태어난 도시는?' }
  ]
  
  // 회원가입 폼 데이터
  const signupForm = reactive({
    email: '',
    password: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: '',
    name: '',
    nickname: '',
    phone: '',
    agreedToTerms: false
  })
  
  // 비밀번호 표시/숨김 토글
  const togglePassword = () => {
    showPassword.value = !showPassword.value
  }
  
  // 회원가입 처리
  const handleSignup = async () => {
    try {
      if (signupForm.password !== signupForm.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.')
        return
      }
  
      // API 호출 로직
      const response = await fetch('http://localhost:8080/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupForm)
      })
  
      if (response.ok) {
        alert('회원가입이 완료되었습니다.')
        router.push('/login')
      } else {
        throw new Error('회원가입 실패')
      }
    } catch (error) {
      console.error('회원가입 실패:', error)
      alert('회원가입에 실패했습니다. 다시 시도해주세요.')
    }
  }
  
  // 로그인 페이지로 이동
  const goToLogin = () => {
    router.push('/user/login')
  }
  </script>