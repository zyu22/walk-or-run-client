// components/admin/ChallengeBoard.vue
<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-semibold">챌린지 현황</h2>
      <button class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
        챌린지 추가
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">유형</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">기간</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">참여자</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="challenge in challenges" :key="challenge.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="getTypeClass(challenge.type)"
              >
                {{ challenge.type }}
              </span>
            </td>
            <td class="px-6 py-4">{{ challenge.title }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ challenge.period }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ challenge.participants }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="getStatusClass(challenge.status)"
              >
                {{ challenge.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <button class="text-indigo-600 hover:text-indigo-900 mr-2">수정</button>
              <button class="text-red-600 hover:text-red-900">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AdminSidebar from './AdminSidebar.vue';

const challenges = ref([
  {
    id: 1,
    type: 'DAILY',
    title: '하루 만보 걷기',
    period: '2024.02.01 ~ 02.28',
    participants: '2,543명',
    status: 'ACTIVE'
  },
  {
    id: 2,
    type: 'WEEKLY',
    title: '주 3회 운동하기',
    period: '2024.02.01 ~ 02.28',
    participants: '1,876명',
    status: 'ACTIVE'
  },
  {
    id: 3,
    type: 'MONTHLY',
    title: '2월 체중 감량 챌린지',
    period: '2024.02.01 ~ 02.28',
    participants: '3,241명',
    status: 'ACTIVE'
  },
  {
    id: 4,
    type: 'EVENT',
    title: '설날 맞이 러닝',
    period: '2024.02.09 ~ 02.12',
    participants: '962명',
    status: 'COMPLETED'
  }
])

const getTypeClass = (type) => {
  const classes = {
    DAILY: 'bg-blue-100 text-blue-800',
    WEEKLY: 'bg-green-100 text-green-800',
    MONTHLY: 'bg-purple-100 text-purple-800',
    EVENT: 'bg-yellow-100 text-yellow-800'
  }
  return classes[type]
}

const getStatusClass = (status) => {
  const classes = {
    ACTIVE: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
    PENDING: 'bg-yellow-100 text-yellow-800'
  }
  return classes[status]
}
</script>