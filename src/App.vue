<template>
  <header>
    <div class="flex mt-6">
      <SideBar />
      <div class="flex-1 p-8 mr-6 h-[calc(100vh-3rem)] bg-gray-50 rounded-2xl">
        <RouterView />
      </div>
    </div>
  </header>
</template>

<script setup>
import SideBar from './components/dashboard/SideBar.vue';
</script>

<style scoped></style>
