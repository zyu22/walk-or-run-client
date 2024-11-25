<template>
  <div class="rounded-xl bg-white p-6 shadow-sm">
    <h2 class="mb-4 text-lg font-semibold">최근 활동</h2>
    <div class="space-y-4">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="flex items-center justify-between rounded-lg bg-gray-50 p-3"
      >
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <span class="rounded-full px-2 py-1 text-xs" :class="getTypeClass(activity.type)">
              {{ activity.type }}
            </span>
            <span class="text-sm text-gray-600">{{ activity.content }}</span>
          </div>
          <p class="mt-1 text-xs text-gray-500">
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
    required: true,
  },
})

const getTypeClass = (type) => {
  const classes = {
    REGISTER: 'bg-blue-100 text-blue-800',
    CHALLENGE: 'bg-green-100 text-green-800',
    COMPLETE: 'bg-purple-100 text-purple-800',
    UPDATE: 'bg-yellow-100 text-yellow-800',
    BADGE: 'bg-orange-100 text-orange-800',
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}
</script>
