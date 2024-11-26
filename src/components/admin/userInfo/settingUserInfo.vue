<template>
  <div class="mb-8">
    <div>
      <h1 class="font-paperlogy text-5xl font-bold text-gray-900">사용자 권한 관리</h1>
      <p class="mb-8 mt-2 text-sm text-gray-600">사용자의 권한을 효율적으로 관리할 수 있습니다</p>
    </div>

    <!-- 에러 메시지 -->
    <div v-if="error" class="mb-4 rounded-lg bg-red-50 p-4 text-red-600">
      {{ error }}
    </div>

    <!-- 검색 영역 -->
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
      <!-- 유저 검색 -->
      <div class="flex flex-1 gap-2">
        <div class="relative flex-1">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="`${selectedSearchField.label}으로 검색`"
            class="w-full rounded-lg border border-gray-200 px-4 py-3 pr-10"
            @keyup.enter="handleSearchButton"
            ref="searchInput"
          />
          <div v-if="isTyping" class="absolute right-3 top-1/2 -translate-y-1/2">
            <div
              class="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-orange-500"
            ></div>
          </div>
        </div>
        <button
          @click="handleSearchButton"
          class="rounded-lg bg-orange-500 px-6 py-3 text-white hover:bg-orange-600"
          :disabled="isLoading || isSearchLoading"
        >
          <span class="flex items-center gap-2">
            <svg
              v-if="!isSearchLoading"
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <div
              v-else
              class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
            ></div>
            검색
          </span>
        </button>
      </div>
    </div>

    <!-- 결과 목록 -->
    <div class="rounded-lg bg-white shadow-sm">
      <!-- 로딩 상태 -->
      <div v-if="isSearchLoading" class="p-8 text-center text-gray-500">
        <div
          class="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"
        ></div>
        <p class="mt-2">검색 중...</p>
      </div>
      <!-- 검색 결과가 없을 때 -->
      <div
        v-else-if="!isSearchLoading && displayedUsers.length === 0"
        class="py-20 text-center text-gray-500"
      >
        검색 결과가 없습니다
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
              {{ selectedSearchField.label === 'email' ? user.userEmail : user.userNickname }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span
              class="text-sm"
              :class="user.userRole === 'ADMIN' ? 'font-medium text-[black]' : 'text-gray-600'"
            >
              {{ user.userRole === 'ADMIN' ? '관리자' : '일반 사용자' }}
            </span>
            <button
              @click="toggleAdminRole(user)"
              class="relative inline-flex h-6 w-11 items-center rounded-full"
              :class="{
                'bg-[#ff6f3b]': user.userRole === 'ADMIN',
                'bg-gray-200 hover:bg-gray-300': user.userRole !== 'ADMIN',
              }"
              :disabled="isActionLoading || user.userRole === 'ADMIN'"
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

    <!-- 페이지네이션 -->
    <div class="mt-6 flex justify-center">
      <div v-if="pageInfo.totalPages > 1" class="flex space-x-2">
        <button
          v-for="page in pageInfo.totalPages"
          :key="page"
          @click="handlePageChange(page)"
          class="rounded-lg px-4 py-2"
          :class="
            currentPage === page
              ? 'bg-[#ff6f3b] text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          "
        >
          {{ page }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useAlertStore } from '@/stores/alert'
import api from '@/api/axios'
import { debounce } from 'lodash'

const alertStore = useAlertStore()
const userStore = useUserStore()
const isLoading = ref(false)
const searchQuery = ref('')
const searchResults = ref([])
const searchInput = ref(null)
const error = ref('')
const isSearchLoading = ref(false)
const isActionLoading = ref(false)
const isTyping = ref(false)

// 페이지네이션 관련 상태
const currentPage = ref(1)
const pageInfo = ref({
  totalPages: 0,
  totalElements: 0,
  size: 10,
})

const searchFieldOptions = [
  { label: '닉네임', value: 'nickname' },
  { label: '이메일', value: 'email' },
]

const selectedSearchField = ref(searchFieldOptions[0])
const showSearchFieldOptions = ref(false)

const displayedUsers = computed(() => searchResults.value)

const toggleSearchFieldOptions = () => {
  showSearchFieldOptions.value = !showSearchFieldOptions.value
}
const handleSearchFieldChange = async (option) => {
  selectedSearchField.value = option
  showSearchFieldOptions.value = false

  // 검색어가 있는 경우에만 즉시 검색 실행
  if (searchQuery.value.trim()) {
    isSearchLoading.value = true
    error.value = ''

    try {
      const response = await api.get('/search/user', {
        params: {
          key: option.value, // 새로 선택된 옵션의 value 사용
          value: searchQuery.value.trim(),
          page: currentPage.value,
          size: pageInfo.value.size,
        },
      })

      if (response.status === 200) {
        searchResults.value = response.data.content
        pageInfo.value = {
          totalPages: response.data.pageInfo.totalPages,
          totalElements: response.data.pageInfo.totalElements,
          size: response.data.pageInfo.pageSize,
        }
      } else {
        searchResults.value = []
        pageInfo.value = { totalPages: 0, totalElements: 0, size: 10 }
      }
    } catch (err) {
      alertStore.showNotify('오류', '검색에 실패하였습니다.', 'error')
      searchResults.value = []
      pageInfo.value = { totalPages: 0, totalElements: 0, size: 10 }
      handleError(err)
    } finally {
      isSearchLoading.value = false
    }
  }

  searchInput.value?.focus()
}

const handleSearchButton = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    pageInfo.value = { totalPages: 0, totalElements: 0, size: 10 }
    return
  }

  isSearchLoading.value = true
  error.value = ''

  try {
    const response = await api.get('/search/user', {
      params: {
        key: selectedSearchField.value.value,
        value: searchQuery.value.trim(),
        page: currentPage.value,
        size: pageInfo.value.size,
      },
    })

    if (response.status === 200) {
      searchResults.value = response.data.content
      pageInfo.value = {
        totalPages: response.data.pageInfo.totalPages,
        totalElements: response.data.pageInfo.totalElements,
        size: response.data.pageInfo.pageSize,
      }
    } else {
      searchResults.value = []
      pageInfo.value = { totalPages: 0, totalElements: 0, size: 10 }
    }
  } catch (err) {
    alertStore.showNotify('오류', '검색에 실패하였습니다.', 'error')
    searchResults.value = []
    pageInfo.value = { totalPages: 0, totalElements: 0, size: 10 }
    handleError(err)
  } finally {
    isSearchLoading.value = false
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  handleSearchButton()
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
  if (user.userRole === 'ADMIN') {
    error.value = '관리자 권한은 해제할 수 없습니다.'
    return
  }

  isActionLoading.value = true
  error.value = ''

  try {
    const token = localStorage.getItem('accessToken')
    const response = await api.patch(
      `/user/${user.userId}`,
      { role: 'ADMIN' },
      {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )

    if (response.data && response.data.code === 200) {
      user.userRole = 'ADMIN'
      alertStore.showNotify('성공', '관리자 권한이 부여되었습니다.', 'success')
    } else {
      throw new Error('서버 응답이 올바르지 않습니다.')
    }
  } catch (err) {
    console.error('권한 변경 실패:', err)
    handleError(err)
  } finally {
    isActionLoading.value = false
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

// 디바운스된 검색 함수 (타이핑 중 자동 검색)
const debouncedSearch = debounce(async (query) => {
  if (!query.trim()) {
    searchResults.value = []
    pageInfo.value = { totalPages: 0, totalElements: 0, size: 10 }
    isTyping.value = false
    return
  }

  try {
    const response = await api.get('/search/user', {
      params: {
        key: selectedSearchField.value.value,
        value: query.trim(),
        page: currentPage.value,
        size: pageInfo.value.size,
      },
    })

    if (response.data) {
      searchResults.value = response.data.content
      pageInfo.value = {
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements,
        size: response.data.size,
      }
    }
  } catch (error) {
    alertStore.showNotify('오류', '검색에 실패하였습니다.', 'error')
    searchResults.value = []
    pageInfo.value = { totalPages: 0, totalElements: 0, size: 10 }
  } finally {
    isTyping.value = false
  }
}, 300)

// 검색어 변경 감시
watch(searchQuery, (newQuery) => {
  isTyping.value = true
  currentPage.value = 1 // 검색어 변경 시 첫 페이지로 리셋
  debouncedSearch(newQuery)
})
</script>
