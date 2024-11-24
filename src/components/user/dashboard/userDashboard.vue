<template>
  <div>
    <header class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="font-paperlogy text-5xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-1 text-sm text-gray-600">운동 데이터 통계</p>
      </div>
      <div class="flex items-center gap-4">
        <DateRangePicker @update-date-range="handleDateRangeUpdate" />
      </div>
    </header>

    <!-- 로딩/에러/데이터 표시 -->
    <div v-if="loading" class="p-4 text-center">
      데이터를 불러오는 중...
    </div>

    <div v-else-if="error" class="p-4 bg-red-100 text-red-700 rounded">
      {{ error }}
      <button 
        @click="retryFetch" 
        class="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
      >
        다시 시도
      </button>
    </div>

    <div class="grid grid-cols-3 gap-6">
      <!-- 각 데이터 타입별 MetricCard -->
      <MetricCard 
        key="exerciseTime"
        :records="recordsMap.exerciseTime"
        title="⏱️총 운동 시간"
        subtitle="분 단위"
      />
      <MetricCard 
        key="distance"
        :records="recordsMap.distance"
        title="🚶‍♂️총 이동 거리"
        subtitle="미터 단위"
      />
      <!--
      <MetricCard 
        key="cadence"
        :records="recordsMap.cadence"
        title="🚴‍♀️케이던스"
        subtitle="분당 걸음 수"
      />
      -->
      <!-- 목표 출력 -->
      <UserGoal
      :title="'🎯내 목표'"
      subtitle="참여 챌린지 목록"
      />
      
    </div>

    <div class="grid grid-cols-2 gap-6 mt-6">
      <!-- 각 데이터 타입별 LineChart -->
      <LineChart 
        key="heartRate"
        :records="recordsMap.heartRate"
        title="💓심박수"
      />
      <LineChart 
        key="speed"
        :records="recordsMap.speed"
        title="💨속도"
      />

    </div>

    <div class="grid grid-cols-2 gap-6 mt-6">
      <!-- 각 데이터 타입별 BarChart -->
      <BarChart 
        key="step"
        :records="recordsMap.step"
        title="👣걸음 수"
      />
      <BarChart 
        key="calorie"
        :records="recordsMap.calorie"
        title="🔥소비 칼로리"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import api from '@/api/axios'
import DateRangePicker from '@/components/user/dashboard/dateRangePicker.vue'
import BarChart from '@/components/user/dashboard/barChart.vue'
import LineChart from '@/components/user/dashboard/lineChart.vue'
import MetricCard from '@/components/user/dashboard/metricCard.vue'
import UserGoal from '@/components/user/dashboard/UserGoal.vue'

const userStore = useUserStore()
const loading = ref(false)
const error = ref(null)
const startDate = ref(new Date().toISOString().split('T')[0])
const endDate = ref(new Date().toISOString().split('T')[0])

// 데이터 타입 정의
const dataTypes = [
  { key: 'step', label: '걸음 수', endpoint: 'record/step' },
  { key: 'speed', label: '속도', endpoint: 'record/speed' },
  { key: 'heartRate', label: '심박수', endpoint: 'record/heartRate' },
  { key: 'exerciseTime', label: '운동 시간', endpoint: 'record/exerciseTime' },
  { key: 'distance', label: '거리', endpoint: 'record/distance' },
  { key: 'calorie', label: '칼로리', endpoint: 'record/calorie' },
  { key: 'cadence', label: '케이던스', endpoint: 'record/cadence' }
]

// 각 데이터 타입별 records 저장
const recordsMap = ref({
  step: [],
  speed: [],
  heartRate: [],
  exerciseTime: [],
  distance: [],
  calorie: [],
  cadence: []
})

// 재사용 가능한 데이터 fetch 함수
const fetchData = async (dataType) => {
  if (!checkAuthStatus()) {
    error.value = '인증 토큰이 없습니다.'
    return
  }

  try {
    const response = await api.get(`/user/${userStore.userId}/${dataType.endpoint}`, {
      params: {
        startTime: startDate.value,
        endTime: endDate.value,
      }
    })
    
    // 응답 데이터가 배열인지 확인하고 초기화
    recordsMap.value[dataType.key] = Array.isArray(response.data) ? response.data : [];
    
    console.log(`Fetched ${dataType.label} data:`, recordsMap.value[dataType.key])
    
    if (!recordsMap.value[dataType.key].length) {
      console.log(`No ${dataType.label} data available for selected period`)
    }
  } catch (err) {
    console.error(`Failed to fetch ${dataType.label} data:`, err)
    error.value = `${dataType.label} 데이터 로딩 실패: ${
      err.response?.status === 401 ? '인증 오류' : err.message
    }`
    recordsMap.value[dataType.key] = [] 
  }
}

// 모든 데이터 가져오기
const fetchAllData = async () => {
  loading.value = true
  error.value = null

  try {
    await Promise.all(dataTypes.map(type => fetchData(type)))
  } catch (err) {
    console.error('Failed to fetch all data:', err)
    error.value = '데이터 로딩 실패'
  } finally {
    loading.value = false
  }
}

const handleDateRangeUpdate = async ({ startDate: newStartDate, endDate: newEndDate }) => {
  startDate.value = newStartDate
  endDate.value = newEndDate
  await fetchAllData()
}

const retryFetch = () => {
  fetchAllData()
}

// Auth check
const checkAuthStatus = () => {
  const token = localStorage.getItem('accessToken')
  return !!token
}

onMounted(async () => {
  if (checkAuthStatus()) {
    await fetchAllData()
  }
})
</script>