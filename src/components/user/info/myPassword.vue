<template>
  <div class="flex h-full w-full items-center justify-center">
    <div class="mx-auto w-2/5 p-6">
      <h1 class="font-paperlogy mb-8 text-2xl">내 비밀번호 관리</h1>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 gap-6">
          <!-- 현재 비밀번호 -->
          <div class="flex flex-col space-y-1">
            <label for="currentPassword" class="mb-2 block text-sm">현재 비밀번호</label>
            <input
              id="currentPassword"
              v-model="passwordInfo.currentPassword"
              type="password"
              class="w-full rounded-md border border-gray-200 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <!-- 비밀번호 변경 -->
          <div class="flex flex-col space-y-1">
            <label for="newPassword" class="mb-2 block text-sm">비밀번호 변경</label>
            <input
              id="newPassword"
              v-model="passwordInfo.newPassword"
              type="password"
              class="w-full rounded-md border border-gray-200 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <!-- 비밀번호 확인 -->
          <div class="flex flex-col space-y-1">
            <label for="confirmPassword" class="mb-2 block text-sm">비밀번호 확인</label>
            <input
              id="confirmPassword"
              v-model="passwordInfo.confirmPassword"
              type="password"
              class="w-full rounded-md border border-gray-200 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <!-- 비밀번호 질문 -->
          <div class="flex flex-col space-y-1">
            <label for="securityQuestion" class="mb-2 block text-sm">비밀번호 질문</label>
            <select
              id="securityQuestion"
              v-model="passwordInfo.securityQuestion"
              class="w-full rounded-md border border-gray-200 bg-white px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="" disabled>질문을 선택해주세요</option>
              <option v-for="question in securityQuestions" :key="question.id" :value="question.id">
                {{ question.question }}
              </option>
            </select>
          </div>

          <!-- 비밀번호 답변 -->
          <div class="flex flex-col space-y-1">
            <label for="securityAnswer" class="mb-2 block text-sm">비밀번호 답변</label>
            <input
              id="securityAnswer"
              v-model="passwordInfo.securityAnswer"
              type="text"
              placeholder="답변을 입력해주세요"
              class="w-full rounded-md border border-gray-200 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <!-- 버튼 그룹 -->
        <div class="flex justify-center space-x-4 pt-4">
          <button
            type="submit"
            class="rounded-lg bg-orange-500 px-6 py-2 text-white transition-colors hover:bg-orange-600"
          >
            변경
          </button>
          <button
            type="button"
            @click="handleCancel"
            class="rounded-lg bg-orange-500 px-6 py-2 text-white transition-colors hover:bg-orange-600"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios' // axios 대신 api 인스턴스 사용

const router = useRouter()
const securityQuestions = ref([])

const passwordInfo = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  securityQuestion: '',
  securityAnswer: '',
})

// DB에서 보안 질문 목록 가져오기
const getSecurityQuestions = async () => {
  try {
    const response = await api.get('auth/password-question')
    console.log('API 응답 전체:', response)
    console.log('응답 데이터 구조:', response.data)
    console.log('응답 데이터 타입:', typeof response.data)
    if (response.status === 200) {
      securityQuestions.value = Object.entries(response.data).map(([id, question]) => ({
        id: parseInt(id),
        question: question,
      }))

      console.log('변환된 보안질문:', securityQuestions.value)
    }
  } catch (error) {
    console.error('보안 질문 로드 실패:', error)
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
      body: JSON.stringify(passwordInfo),
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
onMounted(getSecurityQuestions)
</script>
