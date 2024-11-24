<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-700">{{ title }}</h3>
      <div class="flex gap-2">
        <button 
          v-for="period in timePeriods" 
          :key="period"
          @click="selectedPeriod = period"
          :class="[
            'px-3 py-1 rounded text-sm',
            selectedPeriod === period 
              ? 'bg-blue-50 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          {{ period }}
        </button>
      </div>
    </div>
    
    <div class="h-64">
      <Line
        v-if="chartData"
        :data="chartData"
        :options="chartOptions"
      />
      <div v-else class="h-full flex items-center justify-center text-gray-500">
        데이터가 없습니다
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps({
  records: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})

const timePeriods = ['Day', 'Week', 'Month']
const selectedPeriod = ref('Day')

// 데이터 처리 함수
const processData = (records) => {
  if (!records?.length) return null

  // 데이터 정렬
  const sortedRecords = [...records].sort(
    (a, b) => new Date(a.startTime) - new Date(b.startTime)
  )

  // 시간별 데이터 그룹화
  const groupedData = sortedRecords.reduce((acc, record) => {
    const date = new Date(record.startTime)
    let timeKey

    switch (selectedPeriod.value) {
      case 'Day':
        timeKey = date.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit'
        })
        break
      case 'Week':
        timeKey = date.toLocaleDateString('ko-KR', {
          weekday: 'short',
          month: 'numeric',
          day: 'numeric'
        })
        break
      case 'Month':
        timeKey = date.toLocaleDateString('ko-KR', {
          month: 'short',
          day: 'numeric'
        })
        break
    }

    if (!acc[timeKey]) {
      acc[timeKey] = {
        max: [],
        min: [],
        mean: []
      }
    }

    // 심박수 데이터 처리
    if (record.maxHeartRate !== undefined) {
      acc[timeKey].max.push(record.maxHeartRate)
      acc[timeKey].min.push(record.minHeartRate)
      acc[timeKey].mean.push(record.meanHeartRate)
    } else {
      // 다른 데이터 타입 처리 (기존 로직)
      let value = 0
      if (record.stepCount !== undefined) {
        value = record.stepCount
      } else if (record.totalCalorie !== undefined) {
        value = record.totalCalorie
      } else if (record.distance !== undefined) {
        value = record.distance
      } else if (record.meanSpeed !== undefined) {
        value = record.meanSpeed
      } else if (record.cadence !== undefined) {
        value = record.cadence
      } else if (record.totalMinutes !== undefined) {
        value = record.totalMinutes
      }
      acc[timeKey].mean.push(value)
    }

    return acc
  }, {})

  // 데이터 집계
  const labels = Object.keys(groupedData)
  const maxData = labels.map(key => {
    const values = groupedData[key].max
    return values.length ? values.reduce((sum, val) => sum + val, 0) / values.length : null
  })
  const minData = labels.map(key => {
    const values = groupedData[key].min
    return values.length ? values.reduce((sum, val) => sum + val, 0) / values.length : null
  })
  const meanData = labels.map(key => {
    const values = groupedData[key].mean
    return values.length ? values.reduce((sum, val) => sum + val, 0) / values.length : null
  })

  return {
    labels,
    max: maxData,
    min: minData,
    mean: meanData
  }
}

// 차트 데이터 생성
const chartData = computed(() => {
  const processed = processData(props.records)
  if (!processed) return null

  const datasets = []
  
  // 심박수 데이터인 경우
  if (processed.max.some(val => val !== null)) {
    datasets.push(
      {
        label: '최대 심박수',
        data: processed.max,
        borderColor: 'rgb(239, 68, 68)', // red
        tension: 0.1,
        fill: false,
        pointStyle: 'circle'
      },
      {
        label: '최소 심박수',
        data: processed.min,
        borderColor: 'rgb(34, 197, 94)', // green
        tension: 0.1,
        fill: false,
        pointStyle: 'circle'
      },
      {
        label: '평균 심박수',
        data: processed.mean,
        borderColor: 'rgb(59, 130, 246)', // blue
        tension: 0.1,
        fill: false,
        pointStyle: 'circle'
      }
    )
  } else {
    // 다른 데이터 타입인 경우 (기존 로직)
    datasets.push({
      label: props.title,
      data: processed.mean,
      borderColor: 'rgb(59, 130, 246)',
      tension: 0.1,
      fill: false,
      pointStyle: 'circle'
    })
  }

  return {
    labels: processed.labels,
    datasets
  }
})

// 차트 옵션
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true, // 범례 표시
      position: 'top',
      align: 'end'
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const value = context.raw
          return `${context.dataset.label}: ${value.toLocaleString()}`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: value => value.toLocaleString()
      }
    },
    x: {
      ticks: {
        maxRotation: 45,
        minRotation: 45
      }
    }
  }
}))

// 기간 변경 시 데이터 재처리
watch(selectedPeriod, () => {
  console.log('Selected period changed:', selectedPeriod.value)
})
</script>