<!-- 목표설정 퍼널(GOAL-01~04) 공통 상단 헤더: 로고, 진행바, STEP 라벨 -->
<template>
  <header>
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

    <div class="mt-4 flex items-center gap-3">
      <div class="h-1 flex-1 rounded-full bg-accent overflow-hidden">
        <div
          class="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          :style="{ width: progressPercent + '%' }"
        />
      </div>
      <span class="shrink-0 text-xs font-medium text-gray-400"
        >{{ currentStep }}/{{ totalSteps }}</span
      >
    </div>

    <div v-if="goalLabel || stepLabel" class="mt-4">
      <span
        v-if="goalLabel"
        class="mb-2 inline-flex items-center gap-1 rounded-2xl bg-accent-light px-3 py-1 text-xs font-semibold text-primary"
      >
        {{ goalLabel }}
      </span>
      <p v-if="stepLabel" class="text-xs font-bold text-primary">{{ stepLabel }}</p>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import BrandHeader from '@/features/auth/components/BrandHeader.vue'

const props = defineProps({
  currentStep: { type: Number, required: true },
  totalSteps: { type: Number, default: 3 },
  stepLabel: { type: String, default: '' },
  goalLabel: { type: String, default: '' },
  showBack: { type: Boolean, default: true },
})

const emit = defineEmits(['back'])

const progressPercent = computed(() => (props.currentStep / props.totalSteps) * 100)
</script>
