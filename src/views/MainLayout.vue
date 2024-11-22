<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
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
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input 
            type="password" 
            v-model="password"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <button 
          type="submit"
          class="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Loading...' : 'Login' }}
        </button>

        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
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

    // Mock login - replace with actual API call
    const response = await mockLogin(email.value, password.value);
    emit('login-success', response.user);
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

const mockLogin = async (email, password) => {
  await new Promise(resolve => setTimeout(resolve, 1000));

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