```vue
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
      <Bar
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
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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
      acc[timeKey] = []
    }

    // 데이터 타입별로 적절한 필드 선택
    let value = 0
    if (record.stepCount !== undefined) {
      value = record.stepCount
    } else if (record.totalCalorie !== undefined) {
      value = record.totalCalorie
    } else if (record.distance !== undefined) {
      value = record.distance
    } else if (record.meanHeartRate !== undefined) {
      value = record.meanHeartRate
    } else if (record.meanSpeed !== undefined) {
      value = record.meanSpeed
    } else if (record.cadence !== undefined) {
      value = record.cadence
    } else if (record.totalMinutes !== undefined) {
      value = record.totalMinutes
    }

    acc[timeKey].push(value)
    return acc
  }, {})

  // 평균 계산
  const labels = Object.keys(groupedData)
  const data = labels.map(key => {
    const values = groupedData[key]
    return values.reduce((sum, val) => sum + val, 0) / values.length
  })

  return { labels, data }
}

// 차트 데이터 생성
const chartData = computed(() => {
  const processed = processData(props.records)
  if (!processed) return null

  return {
    labels: processed.labels,
    datasets: [{
      label: props.title,
      data: processed.data,
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1
    }]
  }
})

// 차트 옵션
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
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
```

주요 기능:

1. 시간 기반 데이터 처리
   - Day: 시간별 데이터
   - Week: 일별 데이터
   - Month: 월별 데이터

2. 데이터 시각화
   - 시간순 정렬
   - 그룹화 및 평균 계산
   - 자동 스케일링

3. UI/UX
   - 기간 선택 버튼
   - 반응형 디자인
   - 툴팁 커스터마이징

4. 차트 옵션
   - x축 레이블 45도 회전
   - 숫자 천 단위 구분
   - 깔끔한 디자인

이제 BarChart 컴포넌트는:
1. props로 받은 records 데이터를 자동으로 처리
2. 선택된 기간에 따라 데이터 그룹화
3. 시간 기반 막대 그래프로 표시

사용 예시:
```vue
<BarChart 
  :records="recordsMap.step"
  title="걸음 수"
/>
```

이렇게 하면 시간 기반으로 데이터가 표시되고, 기간을 선택해서 볼 수 있습니다.