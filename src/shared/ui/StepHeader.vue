<!-- 목표설정 퍼널(GOAL-01~04) 공통 상단 헤더: 스크롤 감지 동적 Glassmorphism 헤더 -->
<template>
  <header
    class="sticky top-0 z-20 w-full py-4 transition-all duration-300"
    :class="[
      isScrolled
        ? 'border-b border-gray-100/80 bg-white/80 backdrop-blur-md shadow-sm'
        : 'border-b border-transparent bg-transparent shadow-none',
    ]"
  >
    <div
      class="mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 md:px-8 lg:px-[80px]"
    >
      <BrandHeader />
      <button
        v-if="showBack"
        type="button"
        class="flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-900"
        @click="emit('back')"
      >
        <span aria-hidden="true">‹</span>
        <span>{{ backLabel }}</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import BrandHeader from '@/shared/ui/BrandHeader.vue'

const props = defineProps({
  showBack: { type: Boolean, default: true },
  backLabel: { type: String, default: '이전' },
  threshold: { type: Number, default: 2 },
})

const emit = defineEmits(['back'])

const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > props.threshold
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
