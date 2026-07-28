<template>
  <div class="min-h-screen bg-gray-50">
    <header class="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
      <button class="text-gray-600" @click="$router.back()">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div class="font-bold text-gray-900">1 / 3</div>
      <div class="w-6"></div> <!-- Spacer for alignment -->
    </header>
    <main class="mx-auto max-w-4xl px-6 py-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>
