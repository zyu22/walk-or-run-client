// components/LineChart.vue
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
      <Line
        v-if="chartData"
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'vue-chartjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps({
  title: {
    type: String,
    default: '걸음수'
  }
});

const chartData = ref({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: '걸음수',
      data: [4000, 3000, 5000, 2780, 4800, 3500, 4300],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
      fill: false
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
      beginAtZero: true,
      grid: {
        display: false
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
});
</script>