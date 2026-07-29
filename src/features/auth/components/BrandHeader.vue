<!-- 로고 + 서비스명 (auth 관련 화면들의 헤더 좌측에서 공통 사용) -->
<template>
  <div class="flex items-center gap-2">
    <img :src="logo" alt="" class="h-8 w-8 shrink-0" />
    <span class="text-lg font-bold text-gray-900">미래로</span>
  </div>
</template>

<script setup>
import logo from '@/assets/images/logo.png'
</script>
