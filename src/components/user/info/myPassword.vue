<template>
  <header class="mb-8 flex items-center justify-between">
    <div>
      <h1 class="font-paperlogy text-5xl font-bold text-gray-900">내 비밀번호 관리</h1>
      <p class="mt-2 text-sm text-gray-600">내 비밀번호를 수정할 수 있어요!</p>
    </div>
  </header>
  <div class="rounded-lg bg-white p-6 py-5 shadow-lg">
    <div class="mx-auto w-2/5 p-6">
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
            <div class="relative">
              <input
                id="newPassword"
                :type="showPassword ? 'text' : 'password'"
                v-model="passwordInfo.newPassword"
                autocomplete="new-password"
                class="w-full rounded-md border border-gray-200 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <button
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                @click="togglePassword(0)"
              >
                <svg
                  v-if="!showPassword"
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg
                  v-else
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                  ></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>
          </div>

          <!-- 비밀번호 확인 -->
          <div class="flex flex-col space-y-1">
            <label for="confirmPassword" class="mb-2 block text-sm">비밀번호 확인</label>
            <input
              id="confirmPassword"
              v-model="passwordInfo.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
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
import { useAlertStore } from '@/stores/alert'

const showPassword = ref(false)
const alertStore = useAlertStore()
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

// 비밀번호 표시/숨김 토글
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

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
      alertStore.showNotify({
        title: '알림',
        message: '현재 비밀번호를 입력해주세요.',
        type: 'error',
        position: 'center',
      })
      return
    }

    if (!passwordInfo.newPassword) {
      alertStore.showNotify({
        title: '알림',
        message: '변경할 비밀번호를 입력해주세요.',
        type: 'error',
        position: 'center',
      })
      return
    }
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      alertStore.showNotify({
        title: '알림',
        message: '새 비밀번호가 일치하지 않습니다.',
        type: 'error',
        position: 'center',
      })
      return
    }

    if (!passwordInfo.passwordQuestionAnswer) {
      alertStore.showNotify({
        title: '알림',
        message: '보안 질문의 답변을 입력해주세요.',
        type: 'error',
        position: 'center',
      })
      return
    }

    const accessToken = localStorage.getItem('accessToken')
    const userId = userStore.userId

    console.log('new: ', passwordInfo.newPassword)
    console.log('old: ', passwordInfo.currentPassword)

    const response = await api.post(
      `user/${userId}/password/change`,
      {
        userId: userId,
        userPassword: passwordInfo.currentPassword,
        newPassword: passwordInfo.newPassword,
        userPasswordAnswer: passwordInfo.passwordQuestionAnswer,
        userPasswordQuestionId: passwordInfo.passwordQuestionId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    console.log(response)

    if (response.status === 200) {
      alertStore.showNotify({
        title: '알림',
        message: '비밀번호가 성공적으로 변경되었습니다',
        type: 'success',
        position: 'top-right',
      })
    } else {
      alertStore.showNotify({
        title: '알림',
        message: '비밀번호 변경에 실패하였습니다.',
        type: 'error',
        position: 'top-right',
      })
      return
    }
  } catch (error) {
    console.error('비밀번호 업데이트 실패:', error)
    if (error.response) {
      alertStore.showNotify({
        title: '알림',
        message: '비밀번호 변경에 실패하였습니다. \n현재 비밀번호 및 질문과 답변을 확인해주세요.',
        type: 'error',
        position: 'center',
      })
    } else if (error.request) {
      // 요청이 이루어졌으나 응답을 받지 못한 경우
      alertStore.showNotify({
        title: '알림',
        message: '서버와의 통신에 실패했습니다. \n네트워크 연결을 확인해주세요.',
        type: 'error',
        position: 'top-right',
      })
    } else {
      // 요청을 설정하는 중에 문제가 발생한 경우
      alertStore.showNotify({
        title: '알림',
        message: '비밀번호 변경 요청 중 오류가 발생했습니다.',
        type: 'error',
        position: 'top-right',
      })
    }
  }
}

// 컴포넌트 마운트 시 보안 질문 목록 가져오기
onMounted(getpasswordQuetions)
</script>
