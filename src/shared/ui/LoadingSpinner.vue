<!-- 공용 로딩 스피너: API 응답을 기다리는 동안 화면 대신 보여줌 -->
<template>
  <div class="flex flex-col items-center justify-center gap-3 py-24 text-center">
    <div class="relative h-10 w-10 shrink-0">
      <div class="absolute inset-0 rounded-full border-4 border-gray-100" />
      <div
        class="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary"
      />
    </div>
    <p class="text-sm text-gray-500">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: { type: String, default: '불러오는 중이에요' },
})
</script>
