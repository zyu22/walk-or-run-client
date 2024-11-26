<template>
  <div>
    <div
      @click="showModal = true"
      class="transform cursor-pointer rounded-lg bg-white p-6 shadow-md transition duration-300 hover:scale-105"
    >
      <h2 class="mb-4 text-2xl font-bold text-blue-600">운동 기록하기</h2>
      <p class="text-gray-700">
        걷기와 달리기를 기록하고, 걸음 수, 보폭, 심박수, 속도 등 상세한 통계를 확인하세요.
      </p>
    </div>

    <Modal :showModal="showModal" @close="showModal = false" style="z-index: 9999">
      <template v-slot:header>
        <h3>운동 기록 대시보드</h3>
      </template>

      <template v-slot:body>
        <div class="p-4">
          <Bar :data="chartData" :options="chartOptions" />
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import Modal from '@/components/authentication/Modal.vue'
import { Bar } from 'vue-chartjs'
import { ref } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const showModal = ref(false)
const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    {
      label: 'Total Steps',
      backgroundColor: '#3B82F6',
      data: [8000, 10000, 12000, 11000, 13000],
    },
  ],
}
const chartOptions = {
  responsive: true,
}
</script>
<style scoped>
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9998;
}
</style>
