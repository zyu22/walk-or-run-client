<!-- components/ResetPassword.vue -->
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
  
      <h2 class="text-center text-xl mb-4">비밀번호 재설정하기</h2>
      <p class="text-center text-gray-600 text-sm mb-8">아래의 항목을 입력하세요</p>
  
      <form @submit.prevent="handleResetPassword" class="space-y-6">
        <!-- 비밀번호 질문 표시 -->
        <div>
          <label for="question" class="block text-sm">비밀번호 질문</label>
          <input
            type="text"
            id="question"
            :value="selectedQuestion"
            disabled
            class="w-full px-3 py-2 mt-1 border border-gray-200 rounded-md bg-gray-50"
          />
        </div>
  
        <!-- 비밀번호 답변 -->
        <div>
          <label for="answer" class="block text-sm">비밀번호 답변</label>
          <input
            type="text"
            id="answer"
            v-model="resetForm.answer"
            required
            class="w-full px-3 py-2 mt-1 border border-gray-200 rounded-md"
          />
        </div>
  
        <!-- 새 비밀번호 -->
        <div>
          <label for="password" class="block text-sm">비밀번호</label>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="resetForm.password"
              required
              class="w-full px-3 py-2 mt-1 border border-gray-200 rounded-md"
            />
            <button 
              type="button"
              class="absolute right-3 top-1/2 transform -translate-y-1/2"
              @click="showPassword = !showPassword"
            >
              👁
            </button>
          </div>
        </div>
  
        <!-- 비밀번호 확인 -->
        <div>
          <label for="confirmPassword" class="block text-sm">비밀번호 확인</label>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="confirmPassword"
              v-model="resetForm.confirmPassword"
              required
              class="w-full px-3 py-2 mt-1 border border-gray-200 rounded-md"
            />
            <button 
              type="button"
              class="absolute right-3 top-1/2 transform -translate-y-1/2"
              @click="showPassword = !showPassword"
            >
              👁
            </button>
          </div>
        </div>
  
        <!-- 버튼 -->
        <button
          type="submit"
          class="w-full py-3 bg-black text-white rounded-md hover:opacity-90"
        >
          비밀번호 변경하기
        </button>
      </form>
  
      <!-- 하단 링크 -->
      <p class="text-center text-sm text-gray-500 mt-6">
        이미 계정이 있으신가요?
        <router-link to="/login" class="text-[#FF6B4D]">
          여기에서 로그인하세요
        </router-link>
      </p>
  
      <!-- 푸터 -->
      <footer class="text-center text-gray-500 text-sm mt-12">
        © 2024 WalkOrRun. All rights reserved.
      </footer>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  
  const router = useRouter()
  const route = useRoute()
  
  const showPassword = ref(false)
  const selectedQuestion = ref('')
  
  const resetForm = reactive({
    answer: '',
    password: '',
    confirmPassword: ''
  })
  
  onMounted(() => {
    // 이전 페이지에서 전달된 정보 확인
    if (!route.state?.verified) {
      router.push('/find-password')
      return
    }
    selectedQuestion.value = route.state.userInfo.securityQuestion
  })
  
  const handleResetPassword = async () => {
    if (resetForm.password !== resetForm.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }
  
    try {
      const response = await fetch('http://localhost:8080/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...resetForm,
          userInfo: route.state.userInfo
        })
      })
  
      if (response.ok) {
        alert('비밀번호가 성공적으로 변경되었습니다.')
        router.push('/login')
      } else {
        throw new Error('비밀번호 변경 실패')
      }
    } catch (error) {
      console.error('오류:', error)
      alert('비밀번호 변경에 실패했습니다. 다시 시도해주세요.')
    }
  }
  </script>