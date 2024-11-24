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

      <form @submit.prevent="createUser" class="space-y-12">
        <!-- 이메일 입력 -->
        <div class="space-y-1">
          <div class="flex items-center">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700">이메일</label>
              <input
                type="email"
                v-model="signupInfo.email"
                autocomplete="new-password"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>
            <button
              type="button"
              class="ml-4 mt-6 rounded-md bg-gray-500 px-3 py-2 text-white transition-colors hover:bg-gray-600"
              @click="checkEmailDuplicate"
              :disabled="!signupInfo.email || isCheckingEmail"
            >
              {{ isCheckingNickname ? '확인 중...' : '중복 확인' }}
            </button>
          </div>
          <!-- 중복 확인 결과 메시지 -->
          <p
            v-if="emailMessage"
            :class="[
              'mt-1 text-sm',
              { 'text-green-500': isCheckingEmail, 'text-red-500': !isCheckingEmail },
            ]"
          >
            {{ emailMessage }}
          </p>
        </div>

        <!-- 비밀번호 입력 -->
        <div>
          <label class="block text-sm font-medium text-gray-700">비밀번호</label>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="signupInfo.password"
              autocomplete="new-password"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              required
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

        <!-- 비밀번호 확인 -->
        <div>
          <label class="block text-sm font-medium text-gray-700">비밀번호 확인</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="signupInfo.confirmPassword"
            autocomplete="new-password"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>

        <!-- 비밀번호 질문 -->
        <div>
          <label class="block text-sm font-medium text-gray-700">비밀번호 질문</label>
          <select
            v-model="signupInfo.passwordQuestionId"
            required
            class="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-orange-500 focus:ring-orange-500"
          >
            <option value="" disabled>질문을 선택해주세요</option>
            <option v-for="question in passwordQuestions" :key="question.id" :value="question.id">
              {{ question.question }}
            </option>
          </select>
        </div>

        <!-- 비밀번호 답변 -->
        <div>
          <label class="block text-sm font-medium text-gray-700">비밀번호 답변</label>
          <input
            type="text"
            v-model="signupInfo.passwordQuestionAnswer"
            placeholder="답변을 입력해주세요"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <!-- 이름 -->
        <div>
          <label class="block text-sm font-medium text-gray-700">이름</label>
          <input
            type="text"
            v-model="signupInfo.name"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <!-- 닉네임 입력 -->
        <div class="space-y-1">
          <div class="flex items-center">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700">닉네임</label>
              <input
                type="text"
                v-model="signupInfo.nickname"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            <button
              type="button"
              class="ml-4 rounded-md bg-gray-500 px-3 py-2 text-white transition-colors hover:bg-gray-600"
              @click="checkNicknameDuplicate"
              :disabled="!signupInfo.nickname || isCheckingNickname"
            >
              {{ isCheckingNickname ? '확인 중...' : '중복 확인' }}
            </button>
          </div>
          <p
            v-if="nicknameMessage"
            :class="[
              'text-sm',
              { 'text-green-500': isNicknameAvailable, 'text-red-500': !isNicknameAvailable },
            ]"
          >
            {{ nicknameMessage }}
          </p>
        </div>
        <!-- 전화번호 -->
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700">전화번호</label>
          <input
            type="tel"
            v-model="signupInfo.phoneNumber"
            @input="validatePhoneNumber"
            placeholder="숫자만 입력해주세요 (예: 01012345678)"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
          <p v-if="phoneNumberError" class="text-sm text-red-500">
            {{ phoneNumberError }}
          </p>
        </div>

        <!-- 이용약관 동의 -->
        <div class="flex items-start gap-2">
          <input
            type="checkbox"
            v-model="signupInfo.agreedToTerms"
            required
            class="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
          />
          <label class="text-sm text-gray-700">
            <span class="cursor-pointer hover:underline" @click="showTermsModal = true"
              >서비스 이용약관에 동의합니다.</span
            >
          </label>
        </div>

        <!-- 회원가입 버튼 -->
        <button
          type="submit"
          class="w-full rounded-md bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600"
        >
          회원가입
        </button>

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
      </form>
    </div>
  </div>
  <!-- 서비스 이용약관 모달 -->
  <div
    v-if="showTermsModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="w-full max-w-md rounded-lg bg-white p-8">
      <h2 class="mb-4 text-2xl font-bold">서비스 이용약관</h2>
      <div class="mb-6 text-gray-700">
        <!-- 실제 서비스 이용약관 내용을 여기에 추가 -->
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut risus in augue luctus
          venenatis. Sed tincidunt, magna in eleifend lobortis, sem neque vestibulum nunc, eu
          sollicitudin urna dolor nec libero.
        </p>
      </div>
      <div class="flex justify-end">
        <button
          class="rounded-md bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600"
          @click="showTermsModal = false"
        >
          확인
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const router = useRouter()
const showPassword = ref(false)
const showTermsModal = ref(false)
const passwordQuestions = ref([])
const isLoading = ref(false)
const emailMessage = ref('')
const nicknameMessage = ref('')
const isCheckingNickname = ref(false)
const isNicknameAvailable = ref(false)
const isCheckingEmail = ref(false)
const isEmailAvailable = ref(false)
const phoneNumberError = ref('')

// 회원가입 폼 데이터
const signupInfo = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  passwordQuestionId: '',
  passwordQuestionAnswer: '',
  name: '',
  nickname: '',
  phoneNumber: '',
  agreedToTerms: false,
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

// 비밀번호 표시/숨김 토글
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// 이메일 중복 확인
const checkEmailDuplicate = async () => {
  isLoading.value = true
  try {
    const response = await api.get('auth/valid-email', {
      params: {
        email: signupInfo.email,
      },
    })

    if (response.data.message == 1) {
      emailMessage.value = '이미 사용 중인 이메일입니다.'
      isCheckingEmail.value = false
      isEmailAvailable.value = false
    } else {
      emailMessage.value = '사용 가능한 이메일입니다.'
      isCheckingEmail.value = true
      isEmailAvailable.value = true
    }
  } catch (error) {
    console.error('이메일 중복 확인 실패:', error)
    alert('이메일 중복 확인에 실패했습니다. 다시 시도해주세요.')
  } finally {
    isLoading.value = false
  }
}

// 닉네임 중복 확인 함수
const checkNicknameDuplicate = async () => {
  if (!signupInfo.nickname) {
    nicknameMessage.value = '닉네임을 입력해주세요.'
    isNicknameAvailable.value = false
    return
  }
  isCheckingNickname.value = true
  nicknameMessage.value = ''

  try {
    const response = await api.get('auth/valid-nickname', {
      params: {
        nickname: signupInfo.nickname,
      },
    })

    if (response.data.message == 1) {
      nicknameMessage.value = '이미 사용 중인 닉네임입니다.'
      isNicknameAvailable.value = false
    } else {
      nicknameMessage.value = '사용 가능한 닉네임입니다.'
      isNicknameAvailable.value = true
    }
  } catch (error) {
    console.error('닉네임 중복 확인 실패:', error)
    nicknameMessage.value = '중복 확인에 실패했습니다. 다시 시도해주세요.'
    isNicknameAvailable.value = false
  } finally {
    isCheckingNickname.value = false
  }
}

// 전화번호 유효성 검사
const validatePhoneNumber = () => {
  // 숫자가 아닌 문자 제거
  signupInfo.phoneNumber = signupInfo.phoneNumber.replace(/[^0-9]/g, '')

  // 11자리가 넘어가면 11자리까지만 유지
  if (signupInfo.phoneNumber.length > 11) {
    signupInfo.phoneNumber = signupInfo.phoneNumber.slice(0, 11)
  }

  // 유효성 검사
  const phonePattern = /^010\d{8}$/

  if (signupInfo.phoneNumber.length > 0 && !phonePattern.test(signupInfo.phoneNumber)) {
    if (!signupInfo.phoneNumber.startsWith('010')) {
      phoneNumberError.value = '전화번호는 010으로 시작해야 합니다'
    } else if (signupInfo.phoneNumber.length !== 11) {
      phoneNumberError.value = '전화번호는 11자리여야 합니다'
    } else {
      phoneNumberError.value = '올바른 전화번호 형식이 아닙니다'
    }
  } else {
    phoneNumberError.value = ''
  }
}

// 회원가입 처리
const createUser = async () => {
  try {
    if (!isNicknameAvailable.value) {
      alert('닉네임 중복 확인을 해주세요.')
      return
    }

    if (!isEmailAvailable.value) {
      alert('이메일 중복 확인을 해주세요.')
      return
    }

    if (signupInfo.password !== signupInfo.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }

    const phonePattern = /^010\d{8}$/
    if (!phonePattern.test(signupInfo.phoneNumber)) {
      alert('올바른 전화번호 형식이 아닙니다')
      return
    }

    const response = await api.post('auth/register', {
      userName: signupInfo.name,
      userPassword: signupInfo.password,
      userEmail: signupInfo.email,
      userNickname: signupInfo.nickname,
      userPhoneNumber: signupInfo.phoneNumber,
      userPasswordQuestionId: signupInfo.passwordQuestionId,
      userPasswordAnswer: signupInfo.passwordQuestionAnswer,
    })

    if (response.status == 201) {
      alert('회원가입에 성공하였습니다.')
      router.push({ name: 'login' })
    } else if (response.status == 400) {
      alert('존재하는 회원입니다.')
      router.push({ name: 'login' })
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

// 컴포넌트 마운트 시 보안 질문 목록 가져오기
onMounted(getpasswordQuestion)
</script>
