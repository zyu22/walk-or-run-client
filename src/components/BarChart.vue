// components/BarChart.vue
<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-700">{{ title }}</h3>
      <div class="flex gap-2">
        <button class="text-sm text-gray-500 hover:text-gray-700">Week</button>
        <button class="text-sm text-gray-500 hover:text-gray-700">Month</button>
        <button class="text-sm text-gray-500 hover:text-gray-700">Year</button>
      </div>
    </div>
    
    <div class="h-64">
      <!-- Bar Chart will be rendered here -->
      <Bar
        v-if="chartData"
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps({
  title: {
    type: String,
    default: 'Customer Map'
  }
});

const chartData = ref({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Customer Activity',
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#7FBA00'
      ]
    }
  ]
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
});
</script>