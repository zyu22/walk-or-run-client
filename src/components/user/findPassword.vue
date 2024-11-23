<!-- components/FindPassword.vue -->
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
  
      <h2 class="text-center text-xl mb-4">비밀번호 찾기</h2>
      <p class="text-center text-gray-600 text-sm mb-8">아래의 정보를 입력하세요</p>
  
      <form @submit.prevent="verifyUserInfo" class="space-y-6">
        <!-- 이름 -->
        <div>
          <label for="name" class="block text-sm">이름</label>
          <input
            type="text"
            id="name"
            v-model="findForm.name"
            placeholder="김유정"
            required
            class="w-full px-3 py-2 mt-1 border border-gray-200 rounded-md"
          />
        </div>
  
        <!-- 전화번호 -->
        <div>
          <label for="phone" class="block text-sm">전화번호</label>
          <input
            type="tel"
            id="phone"
            v-model="findForm.phone"
            placeholder="010-1234-5678"
            required
            class="w-full px-3 py-2 mt-1 border border-gray-200 rounded-md"
          />
        </div>
  
        <!-- 비밀번호 질문 -->
        <div>
          <label for="securityQuestion" class="block text-sm">비밀번호 질문</label>
          <select
            id="securityQuestion"
            v-model="findForm.securityQuestion"
            required
            class="w-full px-3 py-2 mt-1 border border-gray-200 rounded-md bg-white"
          >
            <option value="" disabled>비밀번호 질문을 선택하세요</option>
            <option v-for="question in securityQuestions" :key="question.id" :value="question.id">
              {{ question.question }}
            </option>
          </select>
        </div>
  
        <!-- 답변 -->
        <div>
          <label for="answer" class="block text-sm">답변</label>
          <input
            type="text"
            id="answer"
            v-model="findForm.answer"
            placeholder="답변을 입력하세요"
            required
            class="w-full px-3 py-2 mt-1 border border-gray-200 rounded-md"
          />
        </div>
  
        <!-- 버튼 -->
        <button
          type="submit"
          class="w-full py-3 bg-black text-white rounded-md hover:opacity-90"
        >
          비밀번호 재설정하기
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
  import { reactive } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const securityQuestions = [
    { id: 1, question: '나의 보물 1호는?' },
    { id: 2, question: '내가 태어난 도시는?' },
    { id: 3, question: '어머니의 성함은?' },
    { id: 4, question: '아버지의 성함은?' },
  ]
  
  const findForm = reactive({
    name: '',
    phone: '',
    securityQuestion: '',
    answer: ''
  })
  
  const verifyUserInfo = async () => {
    try {
      // API 호출하여 사용자 정보 확인
      const response = await fetch('http://localhost:8080/api/verify-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(findForm)
      })
  
      if (response.ok) {
        // 검증 성공시 비밀번호 재설정 페이지로 이동
        router.push({
          name: 'resetPassword',
          // 필요한 정보를 state로 전달
          state: { verified: true, userInfo: findForm }
        })
      } else {
        alert('입력하신 정보와 일치하는 계정을 찾을 수 없습니다.')
      }
    } catch (error) {
      console.error('오류:', error)
      alert('오류가 발생했습니다. 다시 시도해주세요.')
    }
  }
  </script>