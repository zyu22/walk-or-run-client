<template>
  <div class="flex w-full items-center justify-center">
    <div class="mx-auto w-3/5 pt-1">
      <h1 class="font-paperlogy text-5xl font-bold text-gray-900">Follow</h1>
      <p class="mb-8 mt-2 text-sm text-gray-600">사용자 관리</p>
      <div class="mb-8">
        <!-- 에러 메시지 표시 -->
        <div v-if="error" class="mb-4 rounded-lg bg-red-50 p-4 text-red-600">
          {{ error }}
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
            class="flex-1 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            :disabled="isLoading"
            ref="searchInput"
          />
        </div>

        <div class="rounded-lg bg-white shadow-sm">  
          <!-- 로딩 상태 -->
          <div v-if="isLoading" class="py-20 text-center text-gray-500">
            <div
              class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-orange-500"
            ></div>
            로딩 중...
          </div>

          <!-- 검색 결과가 없을 때 -->
          <div
            v-else-if="displayedUsers.length === 0"
            class="py-20 text-center text-gray-500"
          >
            표시할 사용자가 없습니다.
          </div>

          <!-- 목록 -->
<div v-else class="divide-y divide-gray-100">
  <div
    v-for="user in displayedUsers"
    :key="user.userId"
    class="flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50"
  >
    <div class="flex items-center space-x-4">
      <span class="font-medium">
        {{ selectedSearchField.value === 'email' ? user.userEmail : user.userNickname }}
      </span>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-sm" :class="user.userRole === 'ADMIN' ? 'text-purple-600 font-medium' : 'text-gray-600'">
        {{ user.userRole === 'ADMIN' ? '관리자' : '일반 사용자' }}
      </span>
      <button
        @click="toggleAdminRole(user)"
        class="relative inline-flex h-6 w-11 items-center rounded-full"
        :class="{ 
          'bg-purple-600': user.userRole === 'ADMIN',
          'bg-gray-200 hover:bg-gray-300': user.userRole !== 'ADMIN'
        }"
        :disabled="user.userRole === 'ADMIN' || isLoading"
      >
        <span
          class="inline-block h-4 w-4 transform rounded-full bg-white transition"
          :class="user.userRole === 'ADMIN' ? 'translate-x-6' : 'translate-x-1'"
        ></span>
      </button>
    </div>
  </div>
</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import api from '@/api/axios'
import { debounce } from 'lodash'

const userStore = useUserStore()
const isLoading = ref(false)
const searchQuery = ref('')
const searchResults = ref([])
const searchInput = ref(null)
const error = ref('') // error ref 추가

const searchFieldOptions = [
  { label: '닉네임', value: 'nickname' },
  { label: '이메일', value: 'email' },
]

const selectedSearchField = ref(searchFieldOptions[0])
const showSearchFieldOptions = ref(false)

// 검색 중인지 여부
const isSearching = computed(() => searchQuery.value.trim().length > 0)

// 현재 보여줄 사용자 목록
const displayedUsers = computed(() => searchResults.value)

const toggleSearchFieldOptions = () => {
  showSearchFieldOptions.value = !showSearchFieldOptions.value
}

const handleSearchFieldChange = (option) => {
  selectedSearchField.value = option
  showSearchFieldOptions.value = false
  searchInput.value?.focus()
}

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  isLoading.value = true
  error.value = ''
  
  try {
    const response = await api.get('/search/user', {
      params: {
        key: selectedSearchField.value.value,
        value: searchQuery.value,
      },
    })

    if (Array.isArray(response.data.content)) {
      // API 응답 확인
      console.log('Search Response:', response.data.content)
      searchResults.value = response.data.content
    } else {
      searchResults.value = []
    }
  } catch (err) {
    console.error('검색 실패:', err)
    searchResults.value = []
    error.value = '검색 중 오류가 발생했습니다.'
  } finally {
    isLoading.value = false
  }
}

const checkAuthStatus = () => {
  const token = localStorage.getItem('accessToken')
  if (!token) {
    error.value = '인증 토큰이 없습니다.'
    return false
  }
  return true
}

const toggleAdminRole = async (user) => {
  if (!checkAuthStatus()) return
  
  // ADMIN -> USER 전환은 허용하지 않음
  if (user.userRole === 'ADMIN') {
    error.value = '관리자 권한은 해제할 수 없습니다.'
    return
  }
  
  const newRole = 'ADMIN' // USER -> ADMIN만 가능
  isLoading.value = true
  error.value = ''

  try {
    const token = localStorage.getItem('accessToken')
    const response = await api.patch(`/user/${user.userId}`, 
      { role: newRole },
      {
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    if (response.data && response.data.code === 200) {
      user.userRole = newRole
    } else {
      throw new Error('서버 응답이 올바르지 않습니다.')
    }
  } catch (err) {
    console.error('권한 변경 실패:', err)
    handleError(err)
  } finally {
    isLoading.value = false
  }
}

const handleError = (err) => {
  if (err.response) {
    switch (err.response.status) {
      case 401:
        error.value = '인증이 만료되었습니다. 다시 로그인해주세요.'
        break
      case 403:
        error.value = '권한이 없습니다.'
        break
      case 404:
        error.value = '사용자를 찾을 수 없습니다.'
        break
      default:
        error.value = '권한 변경 중 오류가 발생했습니다.'
    }
  } else if (err.message === 'Network Error') {
    error.value = '서버와 통신할 수 없습니다.'
  } else {
    error.value = err.message
  }
}

// 검색어 변경 시 디바운스 처리된 검색 실행
const debouncedSearch = debounce(handleSearch, 300)
watch(searchQuery, () => {
  debouncedSearch()
})
</script>
