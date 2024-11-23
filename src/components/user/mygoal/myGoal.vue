<!-- components/user/myGoalForm.vue -->
<template>
  <div class="flex h-full w-full items-center justify-center">
    <div class="mx-auto w-2/5 p-6">
      <h1 class="font-paperlogy mb-8 text-2xl">내 목표 관리</h1>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- 챌린지 필드 -->
        <div class="flex flex-col space-y-1">
          <label for="challenge" class="mb-2 block">목표</label>
          <input
            id="challenge"
            v-model="goalInfo.challenge"
            type="text"
            class="w-full rounded-md border border-gray-200 px-3 py-3 text-base"
          />
        </div>

        <!-- 운동유형 필드 -->
        <div class="flex flex-col space-y-1">
          <label for="type" class="mb-2 block text-sm">운동유형</label>
          <input
            id="type"
            v-model="goalInfo.type"
            type="text"
            placeholder="달리기 / 걷기"
            class="w-full rounded-md border border-gray-200 px-3 py-3 text-base"
          />
        </div>

        <!-- 목표 유형 필드 -->
        <div class="flex flex-col space-y-1">
          <label for="goalType" class="mb-2 block text-sm">목표 유형</label>
          <input
            id="goalType"
            v-model="goalInfo.goalType"
            type="text"
            placeholder="시간(hour) / 거리(km)"
            class="w-full rounded-md border border-gray-200 px-3 py-3 text-base"
          />
        </div>

        <!-- 목표량 필드 -->
        <div class="flex flex-col space-y-1">
          <label for="amount" class="mb-2 block text-sm">목표량</label>
          <input
            id="amount"
            v-model="goalInfo.amount"
            type="text"
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
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'MyGoalForm',

  setup() {
    const router = useRouter()

    const goalInfo = reactive({
      challenge: '',
      type: '',
      goalType: '',
      amount: '',
      startDate: '',
      endDate: '',
    })

    const handleSubmit = async () => {
      try {
        // API 호출 등 실제 목표 추가 로직 구현
        console.log('목표 추가:', goalInfo)
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
