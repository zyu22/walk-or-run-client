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
            <select
              id="securityQuestion"
              v-model="passwordInfo.securityQuestion"
              class="w-full px-3 py-3 border border-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              <option value="" disabled>질문을 선택해주세요</option>
              <option 
                v-for="question in securityQuestions" 
                :key="question.id" 
                :value="question.id"
              >
                {{ question.question }}
              </option>
            </select>
          </div>
   
          <!-- 비밀번호 답변 -->
          <div class="flex flex-col space-y-1">
            <label for="securityAnswer" class="block text-sm mb-2">비밀번호 답변</label>
            <input
              id="securityAnswer"
              v-model="passwordInfo.securityAnswer"
              type="text"
              placeholder="답변을 입력해주세요"
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
   import { reactive, ref, onMounted } from 'vue'
   import { useRouter } from 'vue-router'
   
   export default {
    name: 'MyPassword',
   
    setup() {
      const router = useRouter()
      const securityQuestions = ref([])
      
      const passwordInfo = reactive({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        securityQuestion: '',
        securityAnswer: ''
      })
   
      // DB에서 보안 질문 목록 가져오기
      const fetchSecurityQuestions = async () => {
        try {
          const response = await fetch('http://localhost:8080/api/security-questions')
          if (response.ok) {
            securityQuestions.value = await response.json()
          }
        } catch (error) {
          console.error('보안 질문 로드 실패:', error)
          // 임시 데이터
          securityQuestions.value = [
            { id: 1, question: '내가 졸업한 초등학교 이름은?' },
            { id: 2, question: '어머니의 성함은?' },
            { id: 3, question: '아버지의 성함은?' },
            { id: 4, question: '나의 보물 1호는?' },
            { id: 5, question: '내가 가장 좋아하는 음식은?' },
            { id: 6, question: '내가 태어난 도시는?' }
          ]
        }
      }
   
      const handleSubmit = async () => {
        try {
          // 비밀번호 유효성 검사
          if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
            alert('새 비밀번호가 일치하지 않습니다.')
            return
          }
   
          if (!passwordInfo.securityQuestion) {
            alert('보안 질문을 선택해주세요.')
            return
          }
   
          if (!passwordInfo.securityAnswer) {
            alert('보안 질문의 답변을 입력해주세요.')
            return
          }
   
          // API 호출 등 실제 비밀번호 업데이트 로직 구현
          const response = await fetch('http://localhost:8080/api/update-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(passwordInfo)
          })
   
          if (response.ok) {
            alert('비밀번호가 성공적으로 변경되었습니다.')
            router.back()
          } else {
            throw new Error('비밀번호 변경 실패')
          }
        } catch (error) {
          console.error('비밀번호 업데이트 실패:', error)
          alert('비밀번호 변경에 실패했습니다. 다시 시도해주세요.')
        }
      }
   
      const handleCancel = () => {
        router.back()
      }
   
      // 컴포넌트 마운트 시 보안 질문 목록 가져오기
      onMounted(fetchSecurityQuestions)
   
      return {
        passwordInfo,
        securityQuestions,
        handleSubmit,
        handleCancel
      }
    }
   }
   </script>