<template>
  <div class="min-h-screen bg-gray-50">
    <main class="mx-auto max-w-4xl px-6 py-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>
