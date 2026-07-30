<template>
  <header>
    <!-- 상단 로고 및 뒤로가기 버튼 -->
    <div class="flex items-center justify-between">
      <BrandHeader />
      <button
        v-if="showBack"
        type="button"
        class="flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-900"
        @click="emit('back')"
      >
        <span aria-hidden="true">‹</span>
        <span>이전</span>
      </button>
    </div>

    <!-- 프로그레스 바 영역 -->
    <div class="mt-4 flex items-center gap-3">
      <div class="h-1 flex-1 rounded-full bg-gray-200 overflow-hidden">
        <!-- transition-all과 duration-1000을 주어 1초 동안 부드럽게 차오르게 합니다 -->
        <div
          class="h-full rounded-full bg-blue-600 transition-all duration-1000 ease-out"
          :style="{ width: activePercent + '%' }"
        ></div>
      </div>
      <span class="shrink-0 text-xs font-medium text-gray-400">
        {{ currentStep }}/{{ totalSteps }}
      </span>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BrandHeader from '@/features/auth/components/BrandHeader.vue'

const props = defineProps({
  currentStep: { type: Number, required: true },
  totalSteps: { type: Number, default: 3 },
  showBack: { type: Boolean, default: true },
})

const emit = defineEmits(['back'])

// 애니메이션을 위해 0으로 시작하는 상태값 생성
const activePercent = ref(0)

onMounted(() => {
  // 화면이 렌더링된 직후에 목표 퍼센트로 값을 변경하여 애니메이션 트리거
  setTimeout(() => {
    activePercent.value = (props.currentStep / props.totalSteps) * 100
  }, 100)
})
</script>
