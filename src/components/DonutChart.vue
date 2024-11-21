<template>
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-700 mb-4">{{ title }}</h3>
      <div class="relative w-40 h-40 mx-auto">
        <!-- 여기에 차트 라이브러리 구현 -->
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-2xl font-bold">{{ percentage }}%</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    title: String,
    percentage: Number
  });
  </script>