<template>
  <div class="flex h-full w-full items-center justify-center">
    <div class="mx-auto w-2/5 p-6">
      <h1 class="mb-8 font-paperlogy text-2xl">내 비밀번호 관리</h1>

      <form @submit.prevent="updatePassword" class="space-y-6">
        <input type="text" autocomplete="username" style="display: none" />
        <div class="grid grid-cols-1 gap-6">
          <!-- 현재 비밀번호 -->
          <div class="flex flex-col space-y-1">
            <label for="currentPassword" class="mb-2 block text-sm">현재 비밀번호</label>
            <input
              id="currentPassword"
              v-model="passwordInfo.currentPassword"
              type="password"
              autocomplete="new-password"
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
              autocomplete="new-password"
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
              autocomplete="new-password"
              class="w-full rounded-md border border-gray-200 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <!-- 비밀번호 질문 -->
          <div class="flex flex-col space-y-1">
            <label for="passwordQuetion" class="mb-2 block text-sm">비밀번호 질문</label>
            <select
              id="passwordQuetion"
              v-model="passwordInfo.passwordQuestionId"
              class="w-full rounded-md border border-gray-200 bg-white px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="" disabled>질문을 선택해주세요</option>
              <option v-for="question in passwordQuetions" :key="question.id" :value="question.id">
                {{ question.question }}
              </option>
            </select>
          </div>

          <!-- 비밀번호 답변 -->
          <div class="flex flex-col space-y-1">
            <label for="securityAnswer" class="mb-2 block text-sm">비밀번호 답변</label>
            <input
              id="securityAnswer"
              v-model="passwordInfo.passwordQuestionAnswer"
              type="text"
              placeholder="답변을 입력해주세요"
              autocomplete="new-password"
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
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import api from '@/api/axios'
const userStore = useUserStore()
const router = useRouter()
const passwordQuetions = ref([])

const passwordInfo = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  passwordQuestionId: '',
  passwordQuestionAnswer: '',
})

// DB에서 보안 질문 목록 가져오기
const getpasswordQuetions = async () => {
  try {
    const response = await api.get('auth/password-question')
    if (response.status === 200) {
      passwordQuetions.value = Object.entries(response.data).map(([id, question]) => ({
        id: parseInt(id),
        question: question,
      }))
    }
  } catch (error) {
    console.error('보안 질문 로드 실패:', error)
  }
}

const updatePassword = async () => {
  try {
    // 비밀번호 유효성 검사
    if (!passwordInfo.currentPassword) {
      alert('현재 비밀번호를 입력해주세요.')
      return
    }

    if (!passwordInfo.newPassword) {
      alert('변경할 비밀번호를 입력해주세요.')
      return
    }
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.')
      return
    }

    if (!passwordInfo.securityAnswer) {
      alert('보안 질문의 답변을 입력해주세요.')
      return
    }

    const accessToken = localStorage.getItem('accessToken')
    const userId = userStore.userId

    const response = await api.post(
      `user/${userId}/password/change`,
      {
        userId: userId,
        userPassword: passwordInfo.currentPassword,
        newPassword: passwordInfo.newPassword,
        userPasswordAnswer: passwordInfo.securityAnswer,
        userPasswordQuestionId: passwordInfo.passwordQuetion,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    if (response.status === 200) {
      alert('비밀번호가 성공적으로 변경되었습니다.')
      router.back()
    } else {
      throw new Error('비밀번호 변경 실패')
    }
  } catch (error) {
    console.error('비밀번호 업데이트 실패:', error)
    if (error.response) {
      // 서버에서 응답을 받았지만 2xx 범위를 벗어난 상태 코드가 반환된 경우
      alert('비밀번호 변경에 실패하였습니다. 현재 비밀번호 및 질문과 답변을 확인해주세요.')
    } else if (error.request) {
      // 요청이 이루어졌으나 응답을 받지 못한 경우
      alert('서버와의 통신에 실패했습니다. 네트워크 연결을 확인해주세요.')
    } else {
      // 요청을 설정하는 중에 문제가 발생한 경우
      alert('비밀번호 변경 요청 중 오류가 발생했습니다.')
    }
  }
}

// 컴포넌트 마운트 시 보안 질문 목록 가져오기
onMounted(getpasswordQuetions)
</script>
