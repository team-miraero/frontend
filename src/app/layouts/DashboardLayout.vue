<!-- 좌측 사이드바 + 헤더 + 컨텐츠 영역 레이아웃 -->
<template>
  <div class="flex h-screen w-full flex-col overflow-hidden bg-[#fbfdff]">
    <DashboardHeader v-if="!route.meta.hideHeader" />
    <main class="flex-1 overflow-y-auto [scrollbar-gutter:stable]">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { RouterView } from 'vue-router'
import DashboardHeader from '@/app/layouts/components/DashboardHeader.vue'

const route = useRoute()
</script>
