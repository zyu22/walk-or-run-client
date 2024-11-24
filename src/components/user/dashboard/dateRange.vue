<template>
  <div class="flex items-center gap-2">
    <input 
      type="date" 
      v-model="startDate"
      class="px-2 py-1 border rounded text-sm"
    />
    <span class="text-gray-500">~</span>
    <input 
      type="date" 
      v-model="endDate"
      class="px-2 py-1 border rounded text-sm"
    />

    <div class="flex gap-2">
      <button 
        v-for="period in periods" 
        :key="period"
        @click="setPeriod(period)"
        :class="[
          'px-3 py-1 text-sm rounded',
          selectedPeriod === period 
            ? 'bg-blue-500 text-white' 
            : 'text-gray-500 hover:text-gray-700'
        ]"
      >
        {{ period }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, watch } from 'vue'

const props = defineProps({
  initialStartDate: {
    type: String,
    required: true
  },
  initialEndDate: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update-date-range'])

const periods = ['Week', 'Month', 'Year']
const selectedPeriod = ref('Week')
const startDate = ref(props.initialStartDate)
const endDate = ref(props.initialEndDate)

const setPeriod = (period) => {
  selectedPeriod.value = period
  const today = new Date()
  endDate.value = today.toISOString().split('T')[0]
  
  const newStartDate = new Date(today)
  switch (period) {
    case 'Week':
      newStartDate.setDate(newStartDate.getDate() - 7)
      break
    case 'Month':
      newStartDate.setMonth(newStartDate.getMonth() - 1)
      break
    case 'Year':
      newStartDate.setFullYear(newStartDate.getFullYear() - 1)
      break
  }
  startDate.value = newStartDate.toISOString().split('T')[0]

  emit('update-date-range', { startDate: startDate.value, endDate: endDate.value })
}

watch([startDate, endDate], () => {
  emit('update-date-range', { startDate: startDate.value, endDate: endDate.value })
})
</script>