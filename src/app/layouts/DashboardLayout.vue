<!-- 좌측 사이드바 + 헤더 + 컨텐츠 영역 레이아웃 -->
<template>
  <div class="flex h-screen w-full flex-col overflow-hidden bg-[#fbfdff]">
    <DashboardHeader v-if="!route.meta.hideHeader" />
    <DashboardSidebar v-if="!route.meta.hideHeader" />
    <main class="flex-1 overflow-y-auto max-md:pb-[calc(80px+env(safe-area-inset-bottom))] [scrollbar-gutter:stable]">
      <RouterView />
    </main>
    <DashboardBottomNav v-if="!route.meta.hideHeader" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { RouterView } from 'vue-router'
import DashboardHeader from '@/app/layouts/components/DashboardHeader.vue'
import DashboardSidebar from '@/app/layouts/components/DashboardSidebar.vue'
import DashboardBottomNav from '@/app/layouts/components/DashboardBottomNav.vue'

const route = useRoute()
</script>
