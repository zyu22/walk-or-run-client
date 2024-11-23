// views/MyPageView.vue
<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-sm">
      <div class="p-4">
        <h1 class="text-xl font-bold text-gray-800">마이페이지</h1>
      </div>
      <nav class="space-y-2 p-4">
        <router-link
          to="/mypage/info"
          class="block px-4 py-2 rounded-md hover:bg-orange-100 text-gray-700"
          :class="{ 'bg-orange-100': $route.name === 'userInfo' }"
        >
          내 정보 관리
        </router-link>
        <router-link
          to="/mypage/goal"
          class="block px-4 py-2 rounded-md hover:bg-orange-100 text-gray-700"
          :class="{ 'bg-orange-100': $route.name === 'userGoal' }"
        >
          목표 설정
        </router-link>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1">
      <router-view></router-view>
    </main>
  </div>
</template>