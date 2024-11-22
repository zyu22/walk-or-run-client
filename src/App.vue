<template>
  <header>
    <div>
      <nav>
        <RouterLink to="/">링크 Home</RouterLink> || 
        <RouterLink to="/user/login">로그인</RouterLink> ||
        <RouterLink to="/admin">관리자</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<script setup></script>

<style scoped></style>
