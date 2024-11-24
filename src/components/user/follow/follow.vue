<template>
  <div class="flex w-full items-center justify-center">
    <div class="mx-auto w-3/5 pt-1">
      <h1 class="font-paperlogy text-5xl font-bold text-gray-900">Follow</h1>
      <p class="mb-8 mt-2 text-sm text-gray-600">팔로우 목록</p>
      <div class="mb-8">
        <!-- 통계 카드 섹션 -->
        <div class="mb-8 grid grid-cols-2 gap-6">
          <div
            @click="handleTabChange('following')"
            class="cursor-pointer rounded-lg bg-white p-6 shadow-sm transition-all"
            :class="{ 'ring-2 ring-orange-500': activeTab === 'following' }"
          >
            <div class="mb-2 text-gray-600">팔로잉</div>
            <div class="flex items-end">
              <span class="text-4xl font-bold">{{ followingCount }}</span>
              <span class="mb-1 ml-2 text-gray-500">명</span>
            </div>
          </div>
          <div
            @click="handleTabChange('follower')"
            class="cursor-pointer rounded-lg bg-white p-6 shadow-sm transition-all"
            :class="{ 'ring-2 ring-orange-500': activeTab === 'follower' }"
          >
            <div class="mb-2 text-gray-600">팔로워</div>
            <div class="flex items-end">
              <span class="text-4xl font-bold">{{ followerCount }}</span>
              <span class="mb-1 ml-2 text-gray-500">명</span>
            </div>
          </div>
        </div>

        <div class="mb-6 flex gap-4">
          <div class="relative">
            <button
              class="flex items-center rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-600 transition-colors hover:bg-gray-100"
              @click="toggleSearchFieldOptions"
            >
              {{ selectedSearchField.label }}
              <svg
                class="ml-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            <div
              v-if="showSearchFieldOptions"
              class="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <button
                v-for="option in searchFieldOptions"
                :key="option.value"
                class="block w-full px-4 py-2 text-left hover:bg-gray-100"
                @click="handleSearchFieldChange(option)"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="유저 검색"
            class="flex-1 rounded-lg border border-gray-200 px-4 py-3"
            :disabled="isLoading"
          />
        </div>

        <div class="rounded-lg bg-white shadow-sm">
          <div class="border-b border-gray-100 px-6 py-4">
            <h2 class="text-lg font-medium">
              {{
                isSearching
                  ? '검색 결과'
                  : activeTab === 'following'
                    ? '팔로잉 목록'
                    : '팔로워 목록'
              }}
            </h2>
          </div>

          <!-- 로딩 상태 -->
          <div v-if="isLoading" class="py-20 text-center text-gray-500">
            <div
              class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-orange-500"
            ></div>
            로딩 중...
          </div>

          <!-- 검색 결과가 없을 때 -->
          <div
            v-else-if="isSearching && searchResults.length === 0"
            class="py-20 text-center text-gray-500"
          >
            검색 결과가 없습니다.
          </div>

          <!-- 목록 -->
          <div v-else class="divide-y divide-gray-100">
            <div
              v-for="user in displayedUsers"
              :key="user.userId"
              class="flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50"
            >
              <div class="flex items-center space-x-4">
                <div class="h-12 w-12 overflow-hidden rounded-full bg-gray-200"></div>
                <div>
                  <div class="font-medium">{{ user.userNickname }}</div>
                </div>
              </div>
              <button
                v-if="user.userId !== userStore.userId"
                @click="handleFollowToggle(user.userId)"
                class="rounded-lg px-4 py-2 text-white transition-colors"
                :class="
                  isFollowing(user.userId)
                    ? 'bg-gray-500 hover:bg-gray-600'
                    : 'bg-orange-500 hover:bg-orange-600'
                "
              >
                {{ isFollowing(user.userId) ? '언팔로우' : '팔로우' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import api from '@/api/axios'
import { debounce } from 'lodash'

const userStore = useUserStore()
const activeTab = ref('following')
const isLoading = ref(false)
const searchQuery = ref('')
const followingList = ref([])
const followerList = ref([])
const searchResults = ref([])
const followingStatus = ref({})
const followerCount = ref(0)
const followingCount = ref(0)

const searchFieldOptions = [
  { label: '닉네임', value: 'nickname' },
  { label: '이메일', value: 'email' },
]

const selectedSearchField = ref(searchFieldOptions[0])
const showSearchFieldOptions = ref(false)

// 검색 중인지 여부
const isSearching = computed(() => searchQuery.value.trim().length > 0)

// 현재 보여줄 사용자 목록
const displayedUsers = computed(() => {
  if (isSearching.value) {
    return searchResults.value
  }
  return activeTab.value === 'following' ? followingList.value : followerList.value
})

const toggleSearchFieldOptions = () => {
  showSearchFieldOptions.value = !showSearchFieldOptions.value
}

const handleSearchFieldChange = (option) => {
  selectedSearchField.value = option
  showSearchFieldOptions.value = false
}

const checkFollowingStatus = async (userId) => {
  try {
    const response = await api.get(`/user/${userStore.userId}/follow/${userId}/status`)
    followingStatus.value[userId] = response.data
  } catch (error) {
    console.error('팔로우 여부 확인 실패:', error)
  }
}

const isFollowing = (userId) => {
  return followingStatus.value[userId] || false
}

const fetchFollowData = async () => {
  isLoading.value = true
  try {
    // 팔로잉 목록 조회
    const followingResponse = await api.get(`/user/${userStore.userId}/follow/followings`)
    followingList.value = followingResponse.data
    followingCount.value = followingResponse.data.length

    // 팔로워 목록 조회
    const followerResponse = await api.get(`/user/${userStore.userId}/follow/followers`)
    followerList.value = followerResponse.data
    followerCount.value = followerResponse.data.length

    // 팔로우 상태 확인
    const allUsers = [...followingList.value, ...followerList.value]
    const uniqueUsers = Array.from(new Set(allUsers.map((user) => user.userId)))
    await Promise.all(uniqueUsers.map((userId) => checkFollowingStatus(userId)))
  } catch (error) {
    console.error('팔로워/팔로잉 데이터 조회 실패:', error)
  } finally {
    isLoading.value = false
  }
}

const handleFollowToggle = async (userId) => {
  try {
    if (isFollowing(userId)) {
      // 언팔로우 요청
      await api.delete(`/user/${userStore.userId}/follow/${userId}`)
      followingCount.value -= 1
      // 팔로잉 목록에서 제거
      followingList.value = followingList.value.filter((user) => user.userId !== userId)
    } else {
      // 팔로우 요청
      await api.post(`/user/${userStore.userId}/follow/${userId}`)
      followingCount.value += 1
      // 팔로잉 목록 새로고침
      const followingResponse = await api.get(`/user/${userStore.userId}/follow/followings`)
      followingList.value = followingResponse.data
    }
    // 팔로우 상태 업데이트
    await checkFollowingStatus(userId)
  } catch (error) {
    console.error('팔로우/언팔로우 실패:', error)
  }
}

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  isLoading.value = true
  try {
    const response = await api.get('/search/user', {
      params: {
        key: selectedSearchField.value.value,
        value: searchQuery.value,
      },
    })

    if (Array.isArray(response.data.content)) {
      searchResults.value = response.data.content
      // 검색 결과의 팔로우 상태 확인
      await Promise.all(searchResults.value.map((user) => checkFollowingStatus(user.userId)))
    } else {
      searchResults.value = []
    }
  } catch (error) {
    console.error('검색 실패:', error)
    searchResults.value = []
  } finally {
    isLoading.value = false
  }
}

const handleTabChange = (tab) => {
  activeTab.value = tab
  if (!isSearching.value) {
    fetchFollowData()
  }
}

// 검색어 변경 시 디바운스 처리된 검색 실행
const debouncedSearch = debounce(handleSearch, 300)
watch(searchQuery, () => {
  debouncedSearch()
})

onMounted(() => {
  fetchFollowData()
})
</script>
