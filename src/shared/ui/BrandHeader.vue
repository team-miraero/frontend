<!-- 로고 + 서비스명 (온보딩·auth·goal 등 여러 화면 헤더 좌측에서 공통 사용) — 클릭 시 첫 화면으로 이동 -->
<template>
  <RouterLink :to="{ name: ROUTE_NAMES.ONBOARDING }" class="flex items-center gap-2">
    <img :src="logo" alt="" class="h-8 w-8 shrink-0" />
    <span class="text-lg font-bold text-gray-900">미래로</span>
  </RouterLink>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import logo from '@/assets/images/logo.png'
</script>
