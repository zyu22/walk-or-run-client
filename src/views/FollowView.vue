<!-- views/FollowView.vue -->
<template>
    <div class="flex-1 p-8 mr-6 h-[calc(100vh-3rem)] bg-gray-50 rounded-2xl">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Follow /> <!-- router-view 대신 Follow 컴포넌트 직접 사용 -->
      </div>
    </div>
  </template>
  
  <script setup>
  import Follow from '../components/follow/Follow.vue' // 상대 경로 사용
  </script>