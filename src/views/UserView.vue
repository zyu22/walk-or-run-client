// views/UserView.vue
<template>
  <div class="min-h-screen bg-gray-50">
    <div class="relative">
            
      <!-- Login 컴포넌트 -->
      <Login @login="handleLogin" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Login from '@/components/user/Login.vue'

const router = useRouter()

// 로그인 처리
const handleLogin = async (loginData) => {
  try {
    console.log('로그인 시도:', loginData)
    // 여기에 실제 로그인 로직 구현
    // 예: API 호출, 상태 관리 등
    
    // 로그인 성공 시 다음 페이지로 이동
    // router.push('/dashboard')
  } catch (error) {
    console.error('로그인 실패:', error)
  }
}
</script>