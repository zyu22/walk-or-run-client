// views/admin/AdminView.vue
<template>
  <Sidebar />
    <div class="p-8">
      <header class="mb-8">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div class="text-sm text-gray-600">관리자 모드</div>
        </div>
      </header>

      <!-- Test Stats Card -->
      <div class="bg-white p-6 rounded-xl shadow-sm mb-4">
        <h2>Test Card</h2>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          v-for="stat in statsData" 
          :key="stat.title"
          v-bind="stat"
        />
      </div>

      <!-- Test Stats -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white p-6 rounded-xl shadow-sm">
          <h2>Test Activity Feed</h2>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm">
          <h2>Test User Stats</h2>
        </div>
      </div>

      <!-- Test Board -->
      <div class="bg-white p-6 rounded-xl shadow-sm">
        <h2>Test Challenge Board</h2>
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '@/components/admin/AdminSidebar.vue'
import StatsCard from '@/components/admin/StatsCard.vue'
import ActivityFeed from '@/components/admin/ActivityFeed.vue'
import UserStats from '@/components/admin/UserStats.vue'
import ChallengeBoard from '@/components/admin/ChallengeBoard.vue'

// 테스트용 데이터
const statsData = ref([
  {
    title: '총 회원수',
    value: 2500,
    icon: '👥',
    trend: '+15%',
    period: '이번 달'
  }
])
</script>