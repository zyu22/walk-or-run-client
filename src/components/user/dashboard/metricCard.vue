<template>
  <div class="bg-white rounded-lg shadow-lg h-40 flex flex-col justify-between">
    <div>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-700">{{ title }}</h3>
          <p class="text-3xl font-bold mt-2">{{ average.toLocaleString() }}</p>
          <p class="text-sm text-gray-500 mt-1">{{ subtitle }}</p>
        </div>
        <div class="text-green-500 text-2xl">
          {{ icon }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: String,
  records: {
    type: Array,
    required: true
  },
  subtitle: String,
  icon: String
});

const average = computed(() => {
  if (!props.records?.length) return 0;

  let sum = 0;
  let count = 0;

  for (const record of props.records) {
    if (record.timeInterval !== undefined) {
      sum += record.timeInterval;
      count++;
    } else if (record.distance !== undefined) {
      sum += record.distance;
      count++;
    } else if (record.cadence !== undefined) {
      sum += record.cadence;
      count++;
    }
  }

  return Math.round(sum);
});
</script>