<template>
    <div class="max-w-4xl mx-auto p-6">
      <h1 class="text-2xl font-bold mb-8">팔로우</h1>
      <!-- 통계 카드 섹션 -->
      <div class="grid grid-cols-2 gap-6 mb-8">
        <div 
          @click="activeTab = 'followers'"
          class="bg-white rounded-lg p-6 shadow-sm cursor-pointer transition-all"
          :class="{'ring-2 ring-orange-500': activeTab === 'followers'}"
        >
          <div class="text-gray-600 mb-2">팔로워</div>
          <div class="flex items-end">
            <span class="text-4xl font-bold">35</span>
            <span class="text-gray-500 ml-2 mb-1">명</span>
          </div>
        </div>
        <div 
          @click="activeTab = 'following'"
          class="bg-white rounded-lg p-6 shadow-sm cursor-pointer transition-all"
          :class="{'ring-2 ring-orange-500': activeTab === 'following'}"
        >
          <div class="text-gray-600 mb-2">팔로잉</div>
          <div class="flex items-end">
            <span class="text-4xl font-bold">72</span>
            <span class="text-gray-500 ml-2 mb-1">명</span>
          </div>
        </div>
      </div>
   
      <!-- 검색 바 -->
      <div class="relative mb-6 flex">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="유저 검색" 
          class="w-full px-4 py-3 pl-10 border border-gray-200 rounded-l-lg"
        />
        <svg class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <button 
          @click="handleSearch"
          class="px-6 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 transition-colors flex items-center"
        >
          검색
        </button>
      </div>
   
      <!-- 팔로워/팔로잉 목록 -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="border-b border-gray-100 px-6 py-4">
          <h2 class="text-lg font-medium">
            {{ activeTab === 'followers' ? '팔로워' : '팔로잉' }} 목록
          </h2>
        </div>
        
        <!-- 로딩 상태 -->
        <div v-if="isLoading" class="py-20 text-center text-gray-500">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          로딩 중...
        </div>
   
        <!-- 목록 -->
        <div v-else class="divide-y divide-gray-100">
          <template v-if="activeTab === 'followers'">
            <div v-for="follower in filteredFollowers" :key="follower.id" 
                 class="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                  <img v-if="follower.image" :src="follower.image" :alt="follower.name" class="w-full h-full object-cover">
                </div>
                <div>
                  <div class="font-medium">{{ follower.name }}</div>
                  <div class="text-sm text-gray-500">{{ follower.status }}</div>
                </div>
              </div>
              <button 
                @click="handleUnfollow(follower.id)"
                class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                언팔로우
              </button>
            </div>
          </template>
   
          <template v-else>
            <div v-for="following in filteredFollowing" :key="following.id"
                 class="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                  <img v-if="following.image" :src="following.image" :alt="following.name" class="w-full h-full object-cover">
                </div>
                <div>
                  <div class="font-medium">{{ following.name }}</div>
                  <div class="text-sm text-gray-500">{{ following.status }}</div>
                </div>
              </div>
              <button 
                @click="handleUnfollow(following.id)"
                class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                언팔로잉
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
   </template>
   
   <script>
   import { ref, computed } from 'vue'
   
   export default {
    name: 'Follow',
    setup() {
      const activeTab = ref('followers')
      const isLoading = ref(false)
      const searchQuery = ref('')
   
      // 더미 데이터
      const followers = ref([
        { id: 1, name: 'tomato', status: '달리기를 사랑하는 토마토', image: null },
        { id: 2, name: 'running_master', status: '매일 10km 달리기 중', image: null },
        { id: 3, name: 'walker_kim', status: '하루 만보 걷기 챌린지 진행 중', image: null }
      ])
   
      const following = ref([
        { id: 4, name: 'marathon_pro', status: '마라톤 준비 중', image: null },
        { id: 5, name: 'health_junkie', status: '운동이 삶의 기쁨', image: null },
        { id: 6, name: 'daily_runner', status: '매일 조깅하는 직장인', image: null }
      ])
   
      // 필터링된 목록
      const filteredFollowers = computed(() => {
        return followers.value.filter(f => 
          f.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          f.status.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      })
   
      const filteredFollowing = computed(() => {
        return following.value.filter(f => 
          f.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          f.status.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      })
   
      // 검색 처리
      const handleSearch = async () => {
        isLoading.value = true
        try {
          // API 호출 로직
          await new Promise(resolve => setTimeout(resolve, 1000)) // 시뮬레이션
        } catch (error) {
          console.error('검색 실패:', error)
        } finally {
          isLoading.value = false
        }
      }
   
      // 언팔로우 처리
      const handleUnfollow = async (id) => {
        try {
          // API 호출 로직
          console.log('언팔로우:', id)
        } catch (error) {
          console.error('언팔로우 실패:', error)
        }
      }
   
      return {
        activeTab,
        isLoading,
        searchQuery,
        filteredFollowers,
        filteredFollowing,
        handleSearch,
        handleUnfollow
      }
    }
   }
   </script>