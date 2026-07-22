<!-- 좌측 사이드바 + 컨텐츠 영역 레이아웃 -->
<template>
  <div class="flex min-h-screen w-full">
    <aside class="w-60 shrink-0 border-r border-gray-200">
      <!-- TODO: 사이드바 네비게이션 메뉴 구성 -->
    </aside>
    <main class="flex-1">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>
