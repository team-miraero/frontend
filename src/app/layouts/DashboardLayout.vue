<!-- 좌측 사이드바 + 헤더 + 컨텐츠 영역 레이아웃 -->
<template>
  <div class="flex h-screen w-full overflow-hidden bg-[#f8fbff]">
    <DashboardSidebar />
    <div class="flex min-w-0 flex-1 flex-col">
      <DashboardHeader />
      <main class="flex-1 overflow-y-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import DashboardHeader from '@/app/layouts/components/DashboardHeader.vue'
import DashboardSidebar from './components/DashboardSidebar.vue'
</script>
