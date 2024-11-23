<template>
  <div class="bar-chart">
    <h3>{{ title }}</h3>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <canvas v-else ref="chartRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';
import api from '@/api/axios';

// Props
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  apiEndpoint: {
    type: String,
    required: true
  }
});

// Refs
const chartRef = ref(null);
const chartInstance = ref(null);
const loading = ref(false);
const error = ref(null);
const startDate = ref(new Date().toISOString().split('T')[0]);
const endDate = ref(new Date().toISOString().split('T')[0]);

// API 호출 함수
const fetchData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const accessToken = localStorage.getItem('accessToken')
    const response = await api.get(
      `/${props.apiEndpoint}`, {
        params: {
          startTime: startDate.value,
          endTime: endDate.value
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (response.status !== 200) {
      throw new Error('Failed to fetch data');
    }

    const data = response.data;
    updateChartData(data);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      error.value = '인증에 실패했습니다. 다시 로그인해주세요.';
      // 토큰 갱신 로직 추가 또는 로그인 페이지로 리다이렉트
    } else {
      error.value = '데이터를 불러오는데 실패했습니다';
    }
    console.error('Error fetching data:', err);
  } finally {
    loading.value = false;
  }
};

// 차트 데이터 업데이트 함수
const updateChartData = (data) => {
  console.log('Received data:', data); // 받은 데이터 로깅

  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  const ctx = chartRef.value.getContext('2d');
  chartInstance.value = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(item => new Date(item.startTime).toLocaleDateString()),
      datasets: [{
        label: props.title,
        data: data.map(item => {
          console.log('Data item:', item); // 각 데이터 항목 로깅
          return item.value; // 또는 적절한 필드명
        }),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
};

// 컴포넌트 마운트 시 데이터 fetch
onMounted(() => {
  fetchData();
});

// 날짜 변경 시 데이터 re-fetch
watch([startDate, endDate], () => {
  fetchData();
});
</script>

<style scoped>
.bar-chart {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}
</style>