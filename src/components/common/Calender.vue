<!-- components/common/DatePicker.vue -->
<template>
  <div class="relative">
    <div
      @click="toggleDatePicker"
      class="w-full cursor-pointer rounded-md border border-gray-200 px-3 py-2 hover:border-orange-500"
    >
      {{ modelValue ? formatDate(modelValue) : placeholder }}
    </div>

    <!-- 달력 -->
    <div
      v-if="isOpen"
      class="absolute right-0 z-[9999] mt-2 w-[300px] rounded-lg border bg-white p-4 shadow-lg"
      style="transform: translateY(-50%); margin-top: 200px"
    >
      <!-- 년월 선택 -->
      <div class="mb-4 flex items-center justify-between">
        <button @click="prevMonth" class="p-2 hover:bg-gray-100">◀</button>
        <span class="font-medium">{{ currentYear }}년 {{ currentMonth + 1 }}월</span>
        <button @click="nextMonth" class="p-2 hover:bg-gray-100">▶</button>
      </div>

      <!-- 요일 헤더 -->
      <div class="mb-2 grid grid-cols-7 gap-1">
        <div
          v-for="day in ['일', '월', '화', '수', '목', '금', '토']"
          :key="day"
          class="text-center text-sm font-medium"
        >
          {{ day }}
        </div>
      </div>

      <!-- 날짜 그리드 -->
      <div class="grid grid-cols-7 gap-1">
        <button
          v-for="date in dates"
          :key="date.date"
          @click="selectDate(date)"
          class="p-2 text-center hover:bg-orange-100"
          :class="[
            date.isCurrentMonth ? 'text-gray-700' : 'text-gray-300',
            date.date === modelValue ? 'bg-orange-500 text-white hover:bg-orange-600' : '',
          ]"
        >
          {{ new Date(date.date).getDate() }}
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAlertStore } from '@/stores/alert'

const alertStore = useAlertStore()
const props = defineProps({
  modelValue: String,
  placeholder: {
    type: String,
    default: '날짜 선택',
  },
  isEndDate: {
    type: Boolean,
    default: false,
  },
  startDate: {
    type: String,
    default: '',
  },
  endDate: {
    // endDate prop 추가
    type: String,
    default: '',
  },
  isStartDate: {
    // isStartDate prop 추가
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const currentDate = ref(new Date())

// 현재 보고 있는 년월
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())

// 달력에 표시할 날짜들 계산
const dates = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month, 1).getDay() // 해당 월의 첫 날의 요일
  const lastDate = new Date(year, month + 1, 0).getDate() // 해당 월의 마지막 날짜

  let dates = []

  // 이전 달의 날짜들
  const prevMonthLastDate = new Date(year, month, 0).getDate()
  for (let i = firstDay - 1; i >= 0; i--) {
    dates.push({
      date: `${year}-${String(month).padStart(2, '0')}-${String(prevMonthLastDate - i).padStart(2, '0')}`,
      isCurrentMonth: false,
    })
  }

  // 현재 달의 날짜들
  for (let i = 1; i <= lastDate; i++) {
    dates.push({
      date: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
      isCurrentMonth: true,
    })
  }

  // 다음 달의 날짜들 (42개 채우기)
  const remainingDays = 42 - dates.length
  for (let i = 1; i <= remainingDays; i++) {
    dates.push({
      date: `${year}-${String(month + 2).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
      isCurrentMonth: false,
    })
  }

  return dates
})

const toggleDatePicker = () => {
  isOpen.value = !isOpen.value
}

const selectDate = (date) => {
  const selectedDate = new Date(date.date)

  // 종료일 선택 시 검증
  if (props.isEndDate && props.startDate) {
    const startDate = new Date(props.startDate)
    if (selectedDate < startDate) {
      alertStore.showNotify({
        title: '알림',
        message: '종료일은 시작일 이후여야 합니다.',
        type: 'error',
        position: 'center',
      })
      return
    }
  }

  // 시작일 선택 시 검증
  if (props.isStartDate && props.endDate) {
    const endDate = new Date(props.endDate)
    if (selectedDate > endDate) {
      alertStore.showNotify({
        title: '알림',
        message: '시작일은 종료일 이전이어야 합니다.',
        type: 'error',
        position: 'center',
      })
      return
    }
  }

  emit('update:modelValue', date.date)
  isOpen.value = false
}
const prevMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentDate.value = newDate
}

const nextMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  currentDate.value = newDate
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const [year, month, day] = dateString.split('-')
  return `${year}-${month}-${day}`
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
