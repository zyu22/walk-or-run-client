<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
      <div class="mb-6 flex justify-center">
        <img
          src="@/assets/logo.png"
          alt="WalkOrRun"
          class="h-40 w-auto cursor-pointer"
          @click="router.push({ name: 'register' })"
        />
      </div>

      <div v-if="!foundUser">
        <form @submit.prevent="checkUserPassword" class="space-y-12">
          <!-- 이름 -->
          <div>
            <label class="block text-sm font-medium text-gray-700">이메일</label>
            <input
              type="email"
              v-model="findForm.email"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <!-- 비밀번호 질문 -->
          <div>
            <label class="block text-sm font-medium text-gray-700">비밀번호 질문</label>
            <select
              v-model="findForm.passwordQuestionId"
              required
              class="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-orange-500 focus:ring-orange-500"
            >
              <option value="" disabled>질문을 선택해주세요</option>
              <option v-for="question in passwordQuestions" :key="question.id" :value="question.id">
                {{ question.question }}
              </option>
            </select>
          </div>

          <!-- 답변 -->
          <div>
            <label class="block text-sm font-medium text-gray-700">비밀번호 답변</label>
            <input
              type="text"
              v-model="findForm.passwordQuestionAnswer"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <!-- 버튼 -->
          <button
            type="submit"
            class="w-full rounded-md bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600"
          >
            비밀번호 변경
          </button>
        </form>
        <!-- 로그인 링크 -->
        <div class="mt-4 flex justify-center space-x-4 text-sm text-gray-600">
          <span class="text-gray-500">이미 계정이 있으신가요?</span>
          <router-link
            :to="{ name: 'login' }"
            class="font-medium text-orange-500 hover:text-orange-600"
          >
            로그인하기
          </router-link>
        </div>
      </div>
      <div v-else class="space-y-12">
        <!-- 비밀번호 변경 form -->
        <div>
          <form @submit.prevent="updatePassword" class="space-y-12">
            <!-- 새 비밀번호 입력 -->
            <div>
              <label class="block text-sm font-medium text-gray-700">새 비밀번호</label>
              <div class="relative">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="resetForm.password"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
                <button
                  type="button"
                  class="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  @click="togglePassword"
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

            <!-- 새 비밀번호 확인 -->
            <div>
              <label class="block text-sm font-medium text-gray-700">새 비밀번호 확인</label>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="resetForm.confirmPassword"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <!-- 비밀번호 변경 버튼 -->
            <button
              type="submit"
              class="w-full rounded-md bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600"
              :disabled="isLoading"
            >
              {{ isLoading ? '변경 중...' : '비밀번호 변경' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const router = useRouter()
const passwordQuestions = ref([])
const foundUser = ref(false)
const findForm = reactive({
  email: '',
  passwordQuestionId: '',
  passwordQuestionAnswer: '',
})

const showPassword = ref(false)
const isLoading = ref(false)
const resetForm = reactive({
  password: '',
  confirmPassword: '',
})

// DB에서 보안 질문 목록 가져오기
const getpasswordQuestion = async () => {
  try {
    const response = await api.get('auth/password-question')
    if (response.status === 200) {
      passwordQuestions.value = Object.entries(response.data).map(([id, question]) => ({
        id: parseInt(id),
        question: question,
      }))
    }
  } catch (error) {
    console.error('보안 질문 로드 실패:', error)
  }
}

const checkUserPassword = async () => {
  try {
    const response = await api.post('auth/password/find', {
      userEmail: findForm.email,
      userPasswordQuestionId: findForm.passwordQuestionId,
      userPasswordAnswer: findForm.passwordQuestionAnswer,
    })

    if (response.status == 200) {
      foundUser.value = true
    } else {
      alert('해당하는 유저가 없습니다. 확인해주세요.')
    }
  } catch (error) {
    console.error('에러 상세:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    })
  }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const updatePassword = async () => {
  if (resetForm.password !== resetForm.confirmPassword) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  }

  isLoading.value = true
  try {
    console.log('userEmail: ', findForm.email)
    console.log('userPassword: ', resetForm.password)
    const response = await api.post('auth/password/change', {
      userEmail: findForm.email,
      userPassword: resetForm.password,
    })

    console.log(response)
    if (response.status === 200) {
      alert('비밀번호가 성공적으로 변경되었습니다.')
      router.push({ name: 'login' })
    }
  } catch (error) {
    console.error('에러 상세:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    })
    alert('비밀번호 변경에 실패했습니다. 다시 시도해주세요.')
  } finally {
    isLoading.value = false
  }
}
onMounted(getpasswordQuestion)
</script>
