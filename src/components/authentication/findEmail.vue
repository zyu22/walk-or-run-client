<!-- components/FindEmail.vue -->
<template>
    <div class="max-w-md mx-auto p-8 mt-30">
      <!-- 로고 -->
      <div class="text-center mb-12">
        <h1 class="text-3xl font-bold">
          <span class="text-[#FF6B4D]">Walk</span>
          <span class="text-[#4DFF5C]">Or</span>
          <span class="text-[#FF6B4D]">Run</span>
        </h1>
      </div>
  
      <div v-if="!foundEmail">
        <!-- 이메일 찾기 폼 -->
        <h2 class="text-2xl font-medium text-center mb-8">이메일 찾기</h2>
        <p class="text-gray-600 text-center mb-8">이메일 정보를 입력하세요</p>
  
        <form @submit.prevent="handleFindEmail" class="space-y-6">
          <!-- 이름 입력 -->
          <div class="mb-6">
            <label for="name" class="block text-sm mb-2">이름</label>
            <input
              type="text"
              id="name"
              v-model="findForm.name"
              required
              class="w-full px-3 py-3 border border-gray-200 rounded-md text-base"
            />
          </div>
  
          <!-- 전화번호 입력 -->
          <div class="mb-6">
            <label for="phone" class="block text-sm mb-2">전화번호</label>
            <input
              type="tel"
              id="phone"
              v-model="findForm.phone"
              placeholder="010-1234-5678"
              required
              class="w-full px-3 py-3 border border-gray-200 rounded-md text-base"
            />
          </div>
  
          <!-- 이메일 찾기 버튼 -->
          <button 
            type="submit" 
            class="w-full py-4 bg-black text-white rounded-md text-base hover:opacity-90 transition-opacity"
            :disabled="isLoading"
          >
            {{ isLoading ? '검색 중...' : '이메일 찾기' }}
          </button>
        </form>
      </div>
  
      <div v-else>
        <!-- 이메일 찾기 결과 -->
        <h2 class="text-2xl font-medium text-center mb-8">이메일 찾기 결과</h2>
        <p class="text-center mb-8">
          고객님의 이메일은<br/>
          <span class="text-[#FF6B4D] font-medium">{{ foundEmail }}</span> 입니다.
        </p>
  
        <!-- 로그인 버튼 -->
        <button 
          @click="goToLogin"
          class="w-full py-4 bg-black text-white rounded-md text-base hover:opacity-90 transition-opacity"
        >
          로그인
        </button>
      </div>
  
      <!-- 하단 링크 -->
      <div class="text-center mt-6">
        <span 
          @click="goToLogin" 
          class="text-sm text-gray-500 hover:text-[#FF6B4D] cursor-pointer"
        >
          이미 계정이 있으신가요? 여기서 로그인하세요
        </span>
      </div>
  
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
  const isLoading = ref(false)
  const foundEmail = ref(null)
  
  const findForm = reactive({
    name: '',
    phone: ''
  })
  
  // 이메일 찾기 처리
  const handleFindEmail = async () => {
    isLoading.value = true
    try {
      const response = await fetch('http://localhost:8080/api/find-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(findForm)
      })
  
      if (response.ok) {
        const data = await response.json()
        foundEmail.value = data.email
      } else {
        throw new Error('이메일 찾기 실패')
      }
    } catch (error) {
      console.error('이메일 찾기 실패:', error)
      alert('이메일을 찾을 수 없습니다. 입력 정보를 확인해주세요.')
    } finally {
      isLoading.value = false
    }
  }
  
  // 로그인 페이지로 이동
  const goToLogin = () => {
    router.push('/login')
  }
  </script>