<template>
  <div>
    <!-- 상단 헤더 영역 -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-5xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-1 text-sm text-gray-600">오늘의 활동을 확인하세요</p>
      </div>
      <DateRange
        :initialStartDate="startDate"
        :initialEndDate="endDate"
        @update-date-range="handleDateRangeUpdate"
      />
    </div>

    <!-- 차트 & 통계 영역 -->
    <div class="grid grid-cols-4 gap-6 mb-8">
      <MetricCard
        v-for="metric in metrics"
        :key="metric.title"
        :title="metric.title"
        :value="metric.value"
        :subtitle="metric.subtitle"
        :icon="metric.icon"
      />
    </div>

    <div class="grid grid-cols-2 gap-6 mb-8">
      <BarChart
        title="걸음수"
        :chartData="stepsChartData"
        :startTime="startDate"
        :endTime="endDate"
        :apiUrl="`/api/user/${userId}/record/step`"
      />
      <BarChart
        title="속도"
        :chartData="speedChartData"
        :startTime="startDate"
        :endTime="endDate"
        :apiUrl="`/api/user/${userId}/record/speed`"
      />
    </div>
    
    <div class="grid grid-cols-2 gap-6 mb-8">
      <BarChart
        title="심박수"
        :chartData="heartRateChartData"
        :startTime="startDate"
        :endTime="endDate"
        :apiUrl="`/api/user/${userId}/record/heartRate`"
      />
      <BarChart
        title="운동 시간"
        :chartData="exerciseTimeChartData"
        :startTime="startDate"
        :endTime="endDate"
        :apiUrl="`/api/user/${userId}/record/exerciseTime`"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import DateRange from '../components/dashboard/DateRange.vue'
import BarChart from '../components/dashboard/BarChart.vue'
import MetricCard from '../components/dashboard/MetricCard.vue'
import axios from 'axios'

const userId = ref('1') // 예시 사용자 ID, 실제 구현에서는 사용자 인증 정보에서 가져와야 합니다.
const startDate = ref(new Date().toISOString().split('T')[0])
const endDate = ref(new Date().toISOString().split('T')[0])

const metrics = reactive([
  { title: '총 걸음 수', value: '0', subtitle: '오늘', icon: 'footsteps' },
  { title: '평균 속도', value: '0 m/s', subtitle: '오늘', icon: 'speedometer' },
  { title: '평균 심박수', value: '0 bpm', subtitle: '오늘', icon: 'heart' },
  { title: '운동 시간', value: '0 분', subtitle: '오늘', icon: 'clock' },
])

const stepsChartData = ref({})
const speedChartData = ref({})
const heartRateChartData = ref({})
const exerciseTimeChartData = ref({})

const handleDateRangeUpdate = async ({ startDate: newStartDate, endDate: newEndDate }) => {
  startDate.value = newStartDate
  endDate.value = newEndDate
  await fetchAllData()
}

const fetchAllData = async () => {
  try {
    const [steps, speed, heartRate, exerciseTime] = await Promise.all([
      fetchData('step'),
      fetchData('speed'),
      fetchData('heartRate'),
      fetchData('exerciseTime')
    ])

    updateChartData('steps', steps)
    updateChartData('speed', speed)
    updateChartData('heartRate', heartRate)
    updateChartData('exerciseTime', exerciseTime)
    updateMetrics(steps, speed, heartRate, exerciseTime)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const fetchData = async (endpoint) => {
  const response = await axios.get(`/api/user/${userId.value}/record/${endpoint}`, {
    params: {
      startTime: startDate.value,
      endTime: endDate.value
    }
  })
  return response.data
}

const updateChartData = (type, data) => {
  const chartData = {
    labels: [],
    datasets: [{
      label: type === 'steps' ? '걸음 수' : type === 'speed' ? '속도' : type === 'heartRate' ? '심박수' : '운동 시간',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }]
  }

  data.forEach(item => {
    const date = new Date(item.startTime).toLocaleDateString()
    chartData.labels.push(date)
    chartData.datasets[0].data.push(item[getDataKey(type)])
  })

  switch(type) {
    case 'steps':
      stepsChartData.value = chartData
      break
    case 'speed':
      speedChartData.value = chartData
      break
    case 'heartRate':
      heartRateChartData.value = chartData
      break
    case 'exerciseTime':
      exerciseTimeChartData.value = chartData
      break
  }
}

const getDataKey = (type) => {
  switch(type) {
    case 'steps': return 'stepCount'
    case 'speed': return 'speed'
    case 'heartRate': return 'heartRate'
    case 'exerciseTime': return 'exerciseTime'
    default: return ''
  }
}

const updateMetrics = (steps, speed, heartRate, exerciseTime) => {
  if (steps.length > 0) {
    metrics[0].value = `${steps[0].stepCount} 걸음`
  }
  if (speed.length > 0) {
    metrics[1].value = `${speed[0].speed.toFixed(2)} m/s`
  }
  if (heartRate.length > 0) {
    metrics[2].value = `${heartRate[0].heartRate} bpm`
  }
  if (exerciseTime.length > 0) {
    metrics[3].value = `${exerciseTime[0].exerciseTime} 분`
  }
}

onMounted(() => {
  const accessToken = localStorage.getItem('accessToken')
  console.log('Access Token:', accessToken) // 토큰 출력
  if (!accessToken) {
    console.log('No access token found, redirecting to login')
    router.push('/user/login')
  } else {
    fetchAllData()
  }
})
</script>