<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">로그인</h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">이메일</label>
          <input
            type="email"
            v-model="userEmail"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">비밀번호</label>
          <input
            type="password"
            v-model="userPassword"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
          :disabled="isLoading"
        >
          {{ isLoading ? '로딩중...' : '로그인' }}
        </button>
        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useUserStore } from '@/stores/user';

const VITE_API_URL = import.meta.env.VITE_API_URL;
const router = useRouter();
const userEmail = ref('');
const userPassword = ref('');
const error = ref('');
const isLoading = ref(false);
const userStore = useUserStore();


const handleLogin = async () => {
  try {
    const response = await axios.post(`${VITE_API_URL}/auth/login`, {
      userEmail: userEmail.value,
      userPassword: userPassword.value
    });

    if (response.status === 200) {
      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;
      console.log(accessToken);
      console.log(refreshToken);
      saveAuthTokens(accessToken, refreshToken);

      // token 값에 있는 userId, userRole, userEmail pinia로 저장
      userStore.updateUserInfo(accessToken);
      
      console.log('Login successful');
    } else if (response.status === 401) {
      console.error('Login failed: Invalid username or password');
    } else {
      console.error(`Login failed: ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    if (error.response) {
      // 서버 응답 오류
      console.error(`Login failed: ${error.response.status} - ${error.response.data.message}`);
    } else {
      // 네트워크 오류 또는 기타 오류
      console.error('Login failed:', error);
    }
  }
};

const saveAuthTokens = (accessToken, refreshToken) => {
  // local에 token 저장
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}

</script>