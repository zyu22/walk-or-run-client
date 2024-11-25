<!-- components/user/myGoalForm.vue -->
<template>
  <div class="flex h-full w-full items-center justify-center">
    <div class="mx-auto w-2/5 p-6">
      <h1 class="font-paperlogy mb-8 text-2xl">내 목표 관리</h1>
 
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- 챌린지 카테고리 선택 -->
        <div class="flex flex-col space-y-1">
          <label for="challengeCategory" class="mb-2 block">챌린지 카테고리</label>
          <select
            id="challengeCategory"
            v-model="goalInfo.challengeCategoryCode"
            class="w-full rounded-md border border-gray-200 px-3 py-3 text-base"
          >
            <option value="1">달리기</option>
            <option value="2">걷기</option>
          </select>
        </div>
 
        <!-- 챌린지 단위 선택 -->
        <div class="flex flex-col space-y-1">
          <label for="challengeUnit" class="mb-2 block text-sm">챌린지 단위</label>
          <select
            id="challengeUnit"
            v-model="goalInfo.challengeCategoryUnitCode"
            class="w-full rounded-md border border-gray-200 px-3 py-3 text-base"
          >
            <option value="1">시간(hour)</option>
            <option value="2">거리(km)</option>
          </select>
        </div>
 
        <!-- 목표량 필드 -->
        <div class="flex flex-col space-y-1">
          <label for="amount" class="mb-2 block text-sm">목표량</label>
          <input
            id="amount"
            v-model="goalInfo.targetAmount"
            type="number"
            placeholder="숫자를 입력하세요"
            class="w-full rounded-md border border-gray-200 px-3 py-3 text-base"
          />
        </div>
 
        <!-- 날짜 선택 -->
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col space-y-1">
            <label for="startDate" class="mb-2 block text-sm">시작날짜</label>
            <input
              id="startDate"
              v-model="goalInfo.startDate"
              type="date"
              class="w-full rounded-md border border-gray-200 px-3 py-3 text-base"
            />
          </div>
 
          <div class="flex flex-col space-y-1">
            <label for="endDate" class="mb-2 block text-sm">종료날짜</label>
            <input
              id="endDate"
              v-model="goalInfo.endDate"
              type="date"
              class="w-full rounded-md border border-gray-200 px-3 py-3 text-base"
            />
          </div>
        </div>
 
        <!-- 버튼 그룹 -->
        <div class="flex justify-center space-x-4 pt-4">
          <button
            type="submit"
            class="rounded-lg bg-orange-500 px-6 py-2 text-white transition-colors hover:bg-orange-600"
          >
            추가
          </button>
          <button
            type="button"
            @click="handleCancel"
            class="rounded-lg bg-orange-500 px-6 py-2 text-white transition-colors hover:bg-orange-600"
          >
            목록
          </button>
        </div>
      </form>
    </div>
  </div>
 </template>
 
 <script>
 import { ref, reactive } from 'vue'
 import { useRouter } from 'vue-router'
 import { useUserStore } from '@/stores/user'
 import api from '@/api/axios'
 
 export default {
  name: 'MyGoalForm',
 
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
 
    const goalInfo = reactive({
      userId: userStore.userId,
      challengeCategoryCode: '',
      challengeCategoryUnitCode: '',
      startDate: '',
      endDate: '',
      targetAmount: '',
    })
 
    const handleSubmit = async () => {
      try {
        // 선택한 값으로 goalInfo 객체 업데이트
        const payload = {
          userId: userStore.userId,
          challengeCategoryCode: goalInfo.challengeCategoryCode,
          challengeCategoryUnitCode: goalInfo.challengeCategoryUnitCode,
          startDate: goalInfo.startDate,
          endDate: goalInfo.endDate,
          targetAmount: goalInfo.targetAmount,
        }
 
        const token = localStorage.getItem('accessToken')
 
        // API 호출하여 목표 등록
        await api.post(`/user/${userStore.userId}/goal`, payload, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        })
        console.log('목표 추가 성공:', payload)
        // 성공 시 목록 페이지로 이동
        router.push('/user/goal')
      } catch (error) {
        console.error('목표 추가 실패:', error)
      }
    }
 
    const handleCancel = () => {
      router.push('/user/goal')
    }
 
    return {
      goalInfo,
      handleSubmit,
      handleCancel,
    }
  },
 }
 </script>