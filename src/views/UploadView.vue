<!-- views/UploadView.vue -->
<template>
    <div class="flex-1 p-8 mr-6 h-[calc(100vh-3rem)] bg-gray-50 rounded-2xl">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <router-view></router-view> <!-- 자식 라우트가 있는 경우 -->
      </div>
    </div>
  </template>
  
  <script setup>
  // 자식 라우트를 사용할 경우 여기서 Upload 컴포넌트를 import 할 필요 없음
  </script>