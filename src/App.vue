<template>
  <RouterView />
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  checkLoginStatus();
});

const checkLoginStatus = () => {
  const userStr = localStorage.getItem('user');
  const isLoggedInStr = localStorage.getItem('isLoggedIn');
  
  if (!userStr || isLoggedInStr !== 'true') {
    router.push('/login');
  }
};
</script>