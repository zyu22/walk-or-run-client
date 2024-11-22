// components/user/Login.vue

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <!-- Logo -->
      <div class="flex justify-center mb-8">
        <img 
          src="@/assets/logo.png" 
          alt="WalkOrRun" 
          class="h-24 w-auto"
        />
      </div>

      <h2 class="text-2xl font-bold mb-6 text-center">Welcome Back!</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email" 
            v-model="email" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input 
            type="password" 
            v-model="password"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>

        <button 
          type="submit"
          class="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Loading...' : 'Login' }}
        </button>

        <p v-if="error" class="text-red-500 text-sm text-center mt-2">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['login-success']);

const email = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    error.value = '';

    // TODO: 실제 API 호출로 대체
    // 임시 로그인 로직
    const response = await mockLogin(email.value, password.value);
    
    emit('login-success', response.user);
  } catch (err) {
    error.value = err.message || '로그인에 실패했습니다.';
  } finally {
    isLoading.value = false;
  }
};

// 임시 로그인 함수 (실제 구현 시 API 호출로 대체)
const mockLogin = async (email, password) => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 딜레이

  // 테스트용 계정
  if (email === 'admin@test.com' && password === 'admin') {
    return {
      user: {
        id: 1,
        email: 'admin@test.com',
        name: 'Admin',
        role: 'ADMIN'
      }
    };
  } else if (email === 'user@test.com' && password === 'user') {
    return {
      user: {
        id: 2,
        email: 'user@test.com',
        name: 'User',
        role: 'USER'
      }
    };
  }

  throw new Error('Invalid credentials');
};
</script>