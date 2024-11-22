<!-- components/user/myPassword.vue -->
<template>
    <div class="max-w-md mx-auto p-6">
      <h1 class="text-2xl font-bold mb-8">내 비밀번호 관리</h1>
   
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 gap-6">
          <!-- 현재 비밀번호 -->
          <div class="flex flex-col space-y-1">
            <label for="currentPassword" class="block text-sm mb-2">현재 비밀번호</label>
            <input
              id="currentPassword"
              v-model="passwordInfo.currentPassword"
              type="password"
              class="w-full px-3 py-3 border border-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
   
          <!-- 비밀번호 변경 -->
          <div class="flex flex-col space-y-1">
            <label for="newPassword" class="block text-sm mb-2">비밀번호 변경</label>
            <input
              id="newPassword"
              v-model="passwordInfo.newPassword"
              type="password"
              class="w-full px-3 py-3 border border-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
   
          <!-- 비밀번호 확인 -->
          <div class="flex flex-col space-y-1">
            <label for="confirmPassword" class="block text-sm mb-2">비밀번호 확인</label>
            <input
              id="confirmPassword"
              v-model="passwordInfo.confirmPassword"
              type="password"
              class="w-full px-3 py-3 border border-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
   
          <!-- 비밀번호 질문 -->
          <div class="flex flex-col space-y-1">
            <label for="securityQuestion" class="block text-sm mb-2">비밀번호 질문</label>
            <input
              id="securityQuestion"
              v-model="passwordInfo.securityQuestion"
              type="text"
              placeholder="아버지의 성함은?"
              class="w-full px-3 py-3 border border-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
   
          <!-- 비밀번호 답변 -->
          <div class="flex flex-col space-y-1">
            <label for="securityAnswer" class="block text-sm mb-2">비밀번호 답변</label>
            <input
              id="securityAnswer"
              v-model="passwordInfo.securityAnswer"
              type="text"
              placeholder="홍길동"
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
    name: 'MyPassword',
   
    setup() {
      const router = useRouter()
   
      const passwordInfo = reactive({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        securityQuestion: '',
        securityAnswer: ''
      })
   
      const handleSubmit = async () => {
        try {
          // 비밀번호 유효성 검사
          if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
            alert('새 비밀번호가 일치하지 않습니다.')
            return
          }
   
          // API 호출 등 실제 비밀번호 업데이트 로직 구현
          console.log('비밀번호 업데이트:', passwordInfo)
          // 성공 시 처리 (예: 알림 표시)
        } catch (error) {
          console.error('비밀번호 업데이트 실패:', error)
        }
      }
   
      const handleCancel = () => {
        router.back()
      }
   
      return {
        passwordInfo,
        handleSubmit,
        handleCancel
      }
    }
   }
   </script>