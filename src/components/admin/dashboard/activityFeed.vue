// components/admin/ActivityFeed.vue
<template>
  <div class="bg-white p-6 rounded-xl shadow-sm">
    <h2 class="text-lg font-semibold mb-4">최근 활동</h2>
    <div class="space-y-4">
      <div 
        v-for="activity in activities" 
        :key="activity.id"
        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
      >
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <span 
              class="text-xs px-2 py-1 rounded-full"
              :class="getTypeClass(activity.type)"
            >
              {{ activity.type }}
            </span>
            <span class="text-sm text-gray-600">{{ activity.content }}</span>
          </div>
          <p class="text-xs text-gray-500 mt-1">
            {{ activity.user }}
          </p>
        </div>
        <span class="text-xs text-gray-400">{{ activity.timestamp }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  activities: {
    type: Array,
    required: true
  }
})

const getTypeClass = (type) => {
  const classes = {
    REGISTER: 'bg-blue-100 text-blue-800',
    CHALLENGE: 'bg-green-100 text-green-800',
    COMPLETE: 'bg-purple-100 text-purple-800',
    UPDATE: 'bg-yellow-100 text-yellow-800',
    BADGE: 'bg-orange-100 text-orange-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}
</script>