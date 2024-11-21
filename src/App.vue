<template>
  <header>
    <div>
      <nav>
        <RouterLink to="/">링크 Home</RouterLink> || 
        <RouterLink to="/user">로그인</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<script setup></script>

<style scoped></style>
