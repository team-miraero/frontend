<!-- 좌측 사이드바 + 헤더 + 컨텐츠 영역 레이아웃 -->
<template>
  <div class="flex h-screen w-full flex-col overflow-hidden bg-[#f8fbff]">
    <DashboardHeader v-if="!route.meta.hideHeader" />
    <DashboardSidebar v-if="!route.meta.hideHeader" />
    <main class="flex-1 overflow-y-auto max-md:pb-[calc(80px+env(safe-area-inset-bottom))] [scrollbar-gutter:stable]">
      <RouterView v-slot="{ Component, route: currentRoute }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" :key="currentRoute.name || currentRoute.path" />
        </transition>
      </RouterView>
      <DashboardFooter v-if="!route.meta.hideHeader" />
    </main>
    <DashboardBottomNav v-if="!route.meta.hideHeader" />
  </div>
</template>

<script setup>
import { useRoute, RouterView } from 'vue-router'
import DashboardHeader from '@/app/layouts/components/DashboardHeader.vue'
import DashboardSidebar from '@/app/layouts/components/DashboardSidebar.vue'
import DashboardBottomNav from '@/app/layouts/components/DashboardBottomNav.vue'
import DashboardFooter from '@/app/layouts/components/DashboardFooter.vue'

const route = useRoute()
</script>

<style scoped>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.15s ease-out, transform 0.15s ease-out;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.page-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .page-fade-enter-active,
  .page-fade-leave-active {
    transition: none;
  }
  .page-fade-enter-from,
  .page-fade-leave-to {
    opacity: 1;
    transform: none;
  }
}
</style>
