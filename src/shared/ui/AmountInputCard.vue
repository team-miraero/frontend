<!-- 목표설정 퍼널(GOAL-02) 공용 금액 입력 카드: 큰 숫자 입력 + 단위 + 선택적 배지/설명/프리셋 칩 -->
<template>
  <div class="rounded-3xl border border-accent/50 bg-accent-light/70 p-6 shadow-sm">
    <div class="flex items-center justify-between">
      <p class="text-base font-bold text-gray-900">{{ label }}</p>
      <span
        v-if="badge"
        class="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent-light px-2.5 py-1 text-xs font-semibold text-primary"
      >
        {{ badge }}
      </span>
    </div>

    <div class="relative mt-3">
      <input
        type="text"
        inputmode="numeric"
        class="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-2xl font-bold text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        :value="formattedValue"
        @input="handleInput"
      />
      <span class="absolute inset-y-0 right-5 flex items-center text-base text-gray-400">
        {{ unit }}
      </span>
    </div>

    <p v-if="caption" class="mt-1.5 text-xs text-gray-400">{{ caption }}</p>

    <div v-if="presets.length" class="mt-4 grid grid-cols-4 gap-2 w-full">
      <button
        v-for="preset in presets"
        :key="preset.value"
        type="button"
        class="w-full whitespace-nowrap rounded-full border px-1.5 py-2.5 text-center text-xs font-medium transition-all shadow-sm"
        :class="
          modelValue === preset.value
            ? 'border-primary bg-primary font-semibold text-white'
            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
        "
        @click="emit('update:modelValue', preset.value)"
      >
        {{ preset.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatKoreanNumber } from '@/shared/lib/money'

const props = defineProps({
  label: { type: String, required: true },
  modelValue: { type: Number, required: true },
  unit: { type: String, default: '원' },
  badge: { type: String, default: '' },
  caption: { type: String, default: '' },
  presets: { type: Array, default: () => [] },
})
const emit = defineEmits(['update:modelValue'])

const formattedValue = computed(() => formatKoreanNumber(props.modelValue))

function handleInput(event) {
  const digitsOnly = event.target.value.replace(/[^0-9]/g, '')
  emit('update:modelValue', digitsOnly ? Number(digitsOnly) : 0)
}
</script>
