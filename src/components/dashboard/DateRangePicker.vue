// components/DateRangePicker.vue
<template>
  <div class="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm">
    <div class="relative flex items-center gap-4">
      <div>
        <span class="text-sm text-gray-500 mr-2">날짜</span>
        <input
          type="date"
          v-model="startDate"
          class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-40"
          :max="endDate"
        />
      </div>

      <div class="text-gray-400 font-medium">-</div>
      
      <div>
        <input
          type="date"
          v-model="endDate"
          class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-40"
          :min="startDate"
        />
      </div>

      <button 
        @click="handleSearch" 
        class="ml-4 px-6 py-2 bg-[#ff6f3b] text-white rounded-lg hover:bg-[#ff825c] transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        조회
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const startDate = ref(new Date().toISOString().split('T')[0]);
const endDate = ref(new Date().toISOString().split('T')[0]);

const emit = defineEmits(['update-date-range']);

const handleSearch = () => {
  emit('update-date-range', {
    startDate: startDate.value,
    endDate: endDate.value
  });
};
</script>

<style scoped>
input[type="date"] {
  font-family: inherit;
  position: relative;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  background: transparent;
  bottom: 0;
  color: transparent;
  cursor: pointer;
  height: auto;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: auto;
}
</style>