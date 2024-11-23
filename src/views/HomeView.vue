// HomeView.vue
<template>
  <div>
    <!-- 상단 헤더 영역 -->
    <div class="mb-8 flex items-center justify-between">
      <!-- 좌측 타이틀 -->
      <div>
        <h1 class="text-5xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-1 text-sm text-gray-600">오늘의 활동을 확인하세요</p>
      </div>

      <!-- 우측 날짜 선택기 -->
      <div class="flex items-center gap-4">
        <DateRangePicker @update-date-range="handleDateRangeUpdate" />
      </div>
    </div>

    <!-- 상단 통계 카드들 -->
    <div class="mb-8 grid grid-cols-4 gap-6">
      <MetricCard title="총 걸음 수" :value="metrics.totalSteps" subtitle="총 걸음" icon="👣" />
      <MetricCard title="평균 걸음" :value="metrics.avgSteps" subtitle="일일 평균" icon="📊" />
      <MetricCard title="평균 심박수" :value="metrics.avgHeartRate" subtitle="BPM" icon="❤️" />
      <MetricCard
        title="소비 칼로리"
        :value="metrics.totalCalories"
        subtitle="총 칼로리"
        icon="🔥"
      />
    </div>

    <!-- 차트들 -->
    <div class="mb-8 grid grid-cols-3 gap-6">
      <DonutChart title="체중 감량" :percentage="metrics.weightLossPercentage" />
      <DonutChart title="Customer Growth" :percentage="metrics.growthPercentage" />
      <DonutChart title="Total Revenue" :percentage="metrics.revenuePercentage" />
    </div>

    <div class="grid grid-cols-2 gap-6">
      <LineChart title="걸음수" :dateRange="{ startDate, endDate }" />
      <BarChart title="Customer Map" :dateRange="{ startDate, endDate }" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import SideBar from '../components/Sidebar.vue'
import MetricCard from '../components/dashboard/MetricCard.vue'
import DonutChart from '../components/dashboard/DonutChart.vue'
import LineChart from '../components/dashboard/LineChart.vue'
import BarChart from '../components/dashboard/BarChart.vue'
import DateRangePicker from '../components/dashboard/DateRangePicker.vue'

const startDate = ref(new Date().toISOString().split('T')[0])
const endDate = ref(new Date().toISOString().split('T')[0])

// 통계 데이터를 저장할 reactive 객체
const metrics = reactive({
  totalSteps: 2500,
  avgSteps: 250,
  avgHeartRate: 1.5,
  totalCalories: 250,
  weightLossPercentage: 81,
  growthPercentage: 22,
  revenuePercentage: 62,
})

// 날짜 범위가 변경될 때 호출되는 함수
const handleDateRangeUpdate = async ({ startDate: newStartDate, endDate: newEndDate }) => {
  startDate.value = newStartDate
  endDate.value = newEndDate
  await fetchMetricsData()
}

// 검색 버튼 클릭 핸들러
const handleSearch = async () => {
  await fetchMetricsData()
}

// 데이터 가져오기 함수
const fetchMetricsData = async () => {
  // TODO: API 호출하여 선택된 날짜 범위의 데이터 가져오기
  // 현재는 임시 데모 데이터 사용
  metrics.totalSteps = 2500
  metrics.avgSteps = 250
  metrics.avgHeartRate = 1.5
  metrics.totalCalories = 250
  metrics.weightLossPercentage = 81
  metrics.growthPercentage = 22
  metrics.revenuePercentage = 62
}

// 초기 데이터 로드
handleDateRangeUpdate({ startDate: startDate.value, endDate: endDate.value })
</script>
