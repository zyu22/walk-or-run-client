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

      <div v-if="!foundEmail">
        <form @submit.prevent="getuserEmail" class="space-y-12">
          <!-- 이름 -->
          <div>
            <label class="block text-sm font-medium text-gray-700">이름</label>
            <input
              type="text"
              v-model="findForm.name"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <!-- 전화번호 -->
          <div>
            <label class="block text-sm font-medium text-gray-700">전화번호</label>
            <input
              type="tel"
              v-model="findForm.phoneNumber"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <!-- 이메일 찾기 버튼 -->
          <button
            type="submit"
            class="w-full rounded-md bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600"
            :disabled="isLoading"
          >
            {{ isLoading ? '검색 중...' : '이메일 찾기' }}
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
        <!-- 이메일 찾기 결과 -->
        <div class="text-center">
          <p class="text-gray-700">
            고객님의 이메일은<br />
            <span class="mt-2 block text-lg font-medium text-orange-500">{{ foundEmail }}</span>
          </p>
        </div>

        <!-- 로그인 버튼 -->
        <router-link
          :to="{ name: 'login' }"
          class="block w-full rounded-md bg-orange-500 px-4 py-2 text-center text-white transition-colors hover:bg-orange-600"
        >
          로그인하기
        </router-link>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'
const router = useRouter()
const isLoading = ref(false)
const foundEmail = ref(null)

const findForm = reactive({
  name: '',
  phoneNumber: '',
})

// 이메일 찾기 처리
const getuserEmail = async () => {
  isLoading.value = true

  console.log('userName : ', findForm.name)
  console.log('userPhoneNumber: ', findForm.phoneNumber)
  try {
    const response = await api.post('auth/email', {
      userName: findForm.name,
      userPhoneNumber: findForm.phoneNumber,
    })

    if (response.status === 200) {
      foundEmail.value = response.data
    } else {
      foundEmail.value = false
    }
  } catch (error) {
    console.error('에러 상세:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    })
  } finally {
    isLoading.value = false
  }
}
</script>
