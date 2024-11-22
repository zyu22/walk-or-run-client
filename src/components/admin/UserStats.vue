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

    <!-- 활동성 통계 -->
    <div class="space-y-3">
      <h3 class="text-sm font-medium">활동성 지표</h3>
      <div class="grid grid-cols-3 gap-4">
        <div>
          <p class="text-sm text-gray-600">일간 활성</p>
          <p class="mt-1">
            <span class="text-lg font-medium">{{ stats.activityStats.dailyActive.toLocaleString() }}</span>
            <span class="text-xs text-green-600 ml-1">{{ stats.growthRate.daily }}</span>
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-600">주간 활성</p>
          <p class="mt-1">
            <span class="text-lg font-medium">{{ stats.activityStats.weeklyActive.toLocaleString() }}</span>
            <span class="text-xs text-green-600 ml-1">{{ stats.growthRate.weekly }}</span>
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-600">월간 활성</p>
          <p class="mt-1">
            <span class="text-lg font-medium">{{ stats.activityStats.monthlyActive.toLocaleString() }}</span>
            <span class="text-xs text-green-600 ml-1">{{ stats.growthRate.monthly }}</span>
          </p>
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
})
</script>