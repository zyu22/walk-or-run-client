<template>
  <div class="bg-white rounded-lg shadow p-6">
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

  const sum = props.records.reduce((acc, record) => {
    if (record.value !== undefined) {
      return acc + record.value;
    } else {
      return acc;
    }
  }, 0);

  return sum / props.records.length;
});
</script>