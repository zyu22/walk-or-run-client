<template>
  <div>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-5xl font-bold text-gray-900">Admin</h1>
        <p class="mt-1 text-sm text-gray-600">관리자 페이지입니다.</p>
      </div>
      <div class="flex items-center gap-4">
        <DateRangePicker @update-date-range="handleDateRangeUpdate" />
      </div>
    </div>

    <div class="mb-8 grid grid-cols-4 gap-6">
      <StatsCard v-for="stat in statsData" :key="stat.title" v-bind="stat" />
    </div>

    <div class="mb-8 grid grid-cols-2 gap-6">
      <ActivityFeed :activities="recentActivities" />
      <UserStats :stats="userStats" />
    </div>

    <div class="rounded-xl bg-white p-6 shadow-sm">
      <ChallengeBoard />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import StatsCard from '@/components/admin/dashboard/statsCard.vue'
import ActivityFeed from '@/components/admin/dashboard/activityFeed.vue'
import UserStats from '@/components/admin/dashboard/userStats.vue'
import ChallengeBoard from '@/components/admin/challenge/settingChallenge.vue'
import DateRangePicker from '@/components/admin/dashboard/dateRangePicker.vue'

const startDate = ref(new Date().toISOString().split('T')[0])
const endDate = ref(new Date().toISOString().split('T')[0])

// 통계 카드 데이터
const statsData = ref([
  {
    title: '총 회원수',
    value: 2500,
    icon: '👥',
    trend: '+15%',
    period: '이번 달',
  },
  {
    title: '신규 가입',
    value: 180,
    icon: '🆕',
    trend: '+5%',
    period: '이번 주',
  },
  {
    title: '활성 챌린지',
    value: 42,
    icon: '🎯',
    trend: '+3',
    period: '오늘',
  },
  {
    title: '완료된 챌린지',
    value: 156,
    icon: '✅',
    trend: '+12',
    period: '이번 달',
  },
])

// 활동 데이터
const recentActivities = ref([
  {
    id: 1,
    type: 'REGISTER',
    content: '신규 회원 가입',
    user: 'sarah_kim',
    timestamp: '2024-02-22 09:30',
  },
  {
    id: 2,
    type: 'CHALLENGE',
    content: '새 챌린지 등록',
    user: 'admin',
    timestamp: '2024-02-22 09:15',
  },
  {
    id: 3,
    type: 'UPDATE',
    content: '챌린지 수정',
    user: 'admin',
    timestamp: '2024-02-22 09:00',
  },
])

// 사용자 통계 데이터
const userStats = ref({
  totalUsers: 3548,
  activeUsers: 3150,
  adminCount: 3,
  membershipStats: [
    { type: '일반 회원', count: 2850, percentage: 80.3 },
    { type: 'PRO 회원', count: 580, percentage: 16.3 },
    { type: '체험 회원', count: 118, percentage: 3.4 },
  ],
})

// 날짜 범위가 변경될 때 호출되는 함수
const handleDateRangeUpdate = async ({ startDate: newStartDate, endDate: newEndDate }) => {
  startDate.value = newStartDate
  endDate.value = newEndDate
  await fetchData()
}

// 데이터 가져오기 함수
const fetchData = async () => {
  // TODO: API 호출하여 선택된 날짜 범위의 데이터 가져오기
  // 현재는 임시 데모 데이터 사용
}

// 초기 데이터 로드
handleDateRangeUpdate({ startDate: startDate.value, endDate: endDate.value })
</script>
