// components/admin/StatsCard.vue
<template>
  <div class="bg-white p-6 rounded-xl shadow-sm">
    <div class="flex justify-between items-start">
      <div>
        <p class="text-sm text-gray-600">{{ title }}</p>
        <div class="mt-2 flex items-baseline">
          <p class="text-2xl font-semibold">{{ value.toLocaleString() }}</p>
          <span 
            v-if="trend"
            :class="[
              'ml-2 text-sm',
              trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
            ]"
          >
            {{ trend }}
          </span>
        </div>
        <p v-if="period" class="text-xs text-gray-500 mt-1">{{ period }}</p>
      </div>
      <div :class="`text-2xl`">
        {{ icon }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: Number,
  icon: String,
  trend: String,
  period: String
})
</script>