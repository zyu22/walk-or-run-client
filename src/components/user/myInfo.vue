<!-- components/user/myInfo.vue -->
<template>
    <div class="max-w-md mx-auto pt-20 px-8">
      <h1 class="text-2xl font-bold mb-8">내 정보 관리</h1>
   
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 gap-6">
          <!-- 이메일 필드 -->
          <div class="flex flex-col space-y-1">
            <label for="email" class="block text-sm mb-2">이메일</label>
            <input
              id="email"
              v-model="userInfo.email"
              type="email"
              placeholder="hello@example.com"
              class="w-full px-3 py-3 border border-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <!-- w-96 h-[50px] px-3 py-3 -->
          </div>
   
          <!-- 이름 필드 -->
          <div class="flex flex-col space-y-1">
            <label for="name" class="block text-sm mb-2">이름</label>
            <input
              id="name"
              v-model="userInfo.name"
              type="text"
              placeholder="김유정"
              class="w-full px-3 py-3 border border-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
   
          <!-- 닉네임 필드 -->
          <div class="flex flex-col space-y-1">
            <label for="nickname" class="block text-sm mb-2">닉네임</label>
            <input
              id="nickname"
              v-model="userInfo.nickname"
              type="text"
              placeholder="tomato"
              class="w-full px-3 py-3 border border-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
   
          <!-- 전화번호 필드 -->
          <div class="flex flex-col space-y-1">
            <label for="phone" class="block text-sm mb-2">전화번호</label>
            <input
              id="phone"
              v-model="userInfo.phone"
              type="tel"
              placeholder="010-1234-5678"
              class="w-full px-3 py-3 border border-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
   
        <!-- 버튼 그룹 -->
        <div class="flex justify-center space-x-4 pt-4">
          <button
            type="submit"
            class="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            변경
          </button>
          <button
            type="button"
            @click="handleCancel"
            class="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            취소
          </button>
        </div>
      </form>
   
      <!-- 푸터 -->
      <footer class="text-center text-gray-500 text-sm mt-12">
        © 2024 WalkOrRun. All rights reserved.
      </footer>
    </div>
  </template>
  
  <script>
  import { reactive } from 'vue'
  import { useRouter } from 'vue-router'
  
  export default {
    name: 'MyInfo',
  
    setup() {
      const router = useRouter()
  
      const userInfo = reactive({
        email: '',
        name: '',
        nickname: '',
        phone: ''
      })
  
      const handleSubmit = async () => {
        try {
          // API 호출 등 실제 정보 업데이트 로직 구현
          console.log('정보 업데이트:', userInfo)
          // 성공 시 처리 (예: 알림 표시)
        } catch (error) {
          console.error('정보 업데이트 실패:', error)
        }
      }
  
      const handleCancel = () => {
        router.back()
      }
  
      return {
        userInfo,
        handleSubmit,
        handleCancel
      }
    }
  }
  </script>