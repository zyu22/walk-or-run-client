<!-- components/user/myGoal.vue -->
<template>
    <div class="max-w-4xl mx-auto p-6">
      <h1 class="text-2xl font-bold mb-8">내 목표 관리</h1>
  
      <!-- 목표 리스트 -->
      <div class="space-y-4">
        <!-- 진행 중인 목표 -->
        <div class="border rounded-lg p-4 bg-white">
          <div class="flex items-start gap-4">
            <div class="w-3 h-3 rounded-full bg-orange-500 mt-1.5"></div>
            <div class="flex-1">
                <div class="flex flex-col mb-2">
                <h3 class="font-medium">[진행] 하루 만보 걷기</h3>
                <span class="text-sm text-gray-500">매일 10,000보 이상 걷기 목표</span>
              </div>
              <div class="grid grid-cols-3 gap-4 text-sm text-gray-600">
                <div>목표: 10km</div>
                <div>시작일: 2024-10-22</div>
                <div>종료일: 2024-10-23</div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- 더미 데이터들... -->
      </div>
  
      <!-- 추가 버튼 -->
      <div class="mt-6 flex justify-end">
        <button
          @click="goToForm"
          class="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          새 목표 추가
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import { useRouter } from 'vue-router'
  
  export default {
    name: 'MyGoal',
  
    setup() {
      const router = useRouter()
  
      const goToForm = () => {
        router.push('/user/goal/form')
      }
  
      return {
        goToForm
      }
    }
  }
  </script>