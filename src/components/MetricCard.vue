<template>
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-700">{{ title }}</h3>
          <p class="text-3xl font-bold mt-2">{{ value }}</p>
          <p class="text-sm text-gray-500 mt-1">{{ subtitle }}</p>
        </div>
        <div class="text-green-500 text-2xl">
          {{ icon }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    title: String,
    value: [String, Number],
    subtitle: String,
    icon: String
  });
  </script>