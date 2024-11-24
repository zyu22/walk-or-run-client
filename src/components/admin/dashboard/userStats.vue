// components/admin/UserStats.vue
<template>
  <div class="bg-white p-6 rounded-xl shadow-sm">
    <h2 class="text-lg font-semibold mb-4">사용자 통계</h2>
    
    <!-- 총계 -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="text-center">
        <p class="text-sm text-gray-600">총 사용자</p>
        <p class="text-xl font-semibold mt-1">{{ stats.totalUsers.toLocaleString() }}</p>
      </div>
      <div class="text-center">
        <p class="text-sm text-gray-600">활성 사용자</p>
        <p class="text-xl font-semibold mt-1">{{ stats.activeUsers.toLocaleString() }}</p>
      </div>
      <div class="text-center">
        <p class="text-sm text-gray-600">관리자</p>
        <p class="text-xl font-semibold mt-1">{{ stats.adminCount }}</p>
      </div>
    </div>

    <!-- 멤버십 통계 -->
    <div class="mb-6">
      <h3 class="text-sm font-medium mb-3">멤버십 분포</h3>
      <div class="space-y-3">
        <div 
          v-for="membership in stats.membershipStats" 
          :key="membership.type"
          class="relative"
        >
          <div class="flex justify-between mb-1">
            <span class="text-sm">{{ membership.type }}</span>
            <span class="text-sm">{{ membership.count.toLocaleString() }}</span>
          </div>
          <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              class="h-full bg-orange-500 rounded-full"
              :style="{ width: `${membership.percentage}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Object,
    required: true
  }
});
</script>

// views/admin/AdminView.vue의 userStats 데이터를 다음과 같이 수정:
const userStats = ref({
  totalUsers: 3548,
  activeUsers: 3150,
  adminCount: 3,
  membershipStats: [
    { type: '일반 회원', count: 2850, percentage: 80.3 },
    { type: 'PRO 회원', count: 580, percentage: 16.3 },
    { type: '체험 회원', count: 118, percentage: 3.4 }
  ]
});