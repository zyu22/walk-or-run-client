<template>
    <div class="flex w-full items-center justify-center">
      <div class="mx-auto w-3/5 pt-1">
        <h1 class="font-paperlogy text-5xl font-bold text-gray-900">Follow</h1>
        <p class="mb-8 mt-2 text-sm text-gray-600">사용자 관리</p>
        <div class="mb-8">
          
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
                  <span class="font-medium">{{ user.userNickname }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="relative">
                    <button
                      @click="toggleRoleMenu(user.userId)"
                      class="flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100"
                    >
                      {{ user.userRole }}
                      <svg
                        class="ml-2 h-4 w-4"
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
                      v-if="openRoleMenu === user.userId"
                      class="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      <button
                        v-for="role in ['USER', 'ADMIN']"
                        :key="role"
                        @click="changeUserRole(user, role)"
                        class="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                        :class="{ 'font-bold': user.userRole === role }"
                      >
                        {{ role }}
                      </button>
                    </div>
                  </div>
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
  const openRoleMenu = ref(null)
  
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
  
  const toggleRoleMenu = (userId) => {
    if (openRoleMenu.value === userId) {
      openRoleMenu.value = null
    } else {
      openRoleMenu.value = userId
    }
  }
  
  const changeUserRole = async (user, newRole) => {
    if (user.userRole === newRole) {
      openRoleMenu.value = null
      return
    }
  
    isLoading.value = true
    try {
      await api.patch(`/api/user/${user.userId}`, { role: newRole })
      user.userRole = newRole
      openRoleMenu.value = null
    } catch (error) {
      console.error('권한 변경 실패:', error)
    } finally {
      isLoading.value = false
    }
  }
  
  // 검색어 변경 시 디바운스 처리된 검색 실행
  const debouncedSearch = debounce(handleSearch, 300)
  watch(searchQuery, () => {
    debouncedSearch()
  })
  </script>