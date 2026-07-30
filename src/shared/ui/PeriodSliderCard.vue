<!-- 목표설정 퍼널(GOAL-02) 공용 기간 슬라이더 카드: 개월 수 슬라이더 + 계산 결과 박스 -->
<template>
  <div class="w-full rounded-3xl border border-accent/50 bg-accent-light/70 p-8 shadow-sm">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-base font-bold text-gray-900">{{ label }}</p>
        <p v-if="caption" class="mt-0.5 text-xs text-gray-400">{{ caption }}</p>
      </div>
      <span v-if="!presets.length" class="shrink-0 text-base font-bold text-primary">
        {{ modelValue }}개월
      </span>
    </div>

    <div v-if="presets.length" class="mt-4 grid grid-cols-4 gap-2 w-full">
      <button
        v-for="preset in presets"
        :key="preset.value"
        type="button"
        class="w-full whitespace-nowrap rounded-full border px-4 py-2.5 text-center text-xs font-semibold transition-all shadow-sm"
        :class="
          modelValue === preset.value
            ? 'border-primary bg-primary text-white'
            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
        "
        @click="emit('update:modelValue', preset.value)"
      >
        {{ preset.label }}
      </button>
    </div>

    <div class="mt-5">
      <div v-if="presets.length" class="flex items-center justify-between">
        <p class="text-xs font-medium text-gray-500">세부 조정</p>
        <span class="text-xs font-bold text-primary">{{ modelValue }}개월</span>
      </div>
      <div class="relative mt-2 h-2 w-full">
        <div class="absolute inset-0 rounded-full bg-gray-200" />
        <div
          class="absolute inset-y-0 left-0 rounded-full bg-primary"
          :style="{ width: percent + '%' }"
        />
        <input
          type="range"
          :min="min"
          :max="max"
          :value="modelValue"
          class="absolute inset-0 h-2 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:shadow [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow"
          @input="emit('update:modelValue', Number($event.target.value))"
        />
      </div>
      <div class="mt-2 flex justify-between text-xs font-medium text-gray-400">
        <span>{{ min }}개월</span>
        <span>{{ max }}개월</span>
      </div>
    </div>

    <div
      class="mt-5 flex items-center justify-between rounded-2xl border border-accent bg-white p-5 shadow-sm"
    >
      <div>
        <p class="text-xs font-medium text-gray-500">{{ resultLabel }}</p>
        <p class="mt-1 text-2xl font-bold text-primary">{{ resultValue }}</p>
        <p v-if="resultCaption" class="mt-0.5 text-xs text-gray-400">{{ resultCaption }}</p>
      </div>
      <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-light">
        <svg
          width="22"
          height="22"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="shrink-0 text-primary"
          aria-hidden="true"
        >
          <g>
            <path
              d="M8.27743 12.9104C8.20307 12.6221 8.05282 12.3591 7.84233 12.1486C7.63184 11.9381 7.36879 11.7879 7.08055 11.7135L1.97071 10.3958C1.88353 10.3711 1.8068 10.3186 1.75216 10.2463C1.69753 10.174 1.66797 10.0858 1.66797 9.99522C1.66797 9.9046 1.69753 9.81645 1.75216 9.74415C1.8068 9.67185 1.88353 9.61934 1.97071 9.5946L7.08055 8.27612C7.36869 8.20183 7.63167 8.05171 7.84215 7.84138C8.05264 7.63104 8.20294 7.36816 8.27743 7.08007L9.59507 1.97023C9.61957 1.88271 9.67202 1.8056 9.74443 1.75067C9.81684 1.69575 9.90523 1.66602 9.99611 1.66602C10.087 1.66602 10.1754 1.69575 10.2478 1.75067C10.3202 1.8056 10.3727 1.88271 10.3972 1.97023L11.714 7.08007C11.7883 7.36832 11.9386 7.63137 12.1491 7.84186C12.3596 8.05235 12.6226 8.20259 12.9108 8.27695L18.0207 9.59377C18.1086 9.618 18.1861 9.6704 18.2413 9.74292C18.2965 9.81544 18.3264 9.90407 18.3264 9.99522C18.3264 10.0864 18.2965 10.175 18.2413 10.2475C18.1861 10.32 18.1086 10.3724 18.0207 10.3967L12.9108 11.7135C12.6226 11.7879 12.3596 11.9381 12.1491 12.1486C11.9386 12.3591 11.7883 12.6221 11.714 12.9104L10.3963 18.0202C10.3718 18.1077 10.3194 18.1848 10.247 18.2398C10.1746 18.2947 10.0862 18.3244 9.99528 18.3244C9.9044 18.3244 9.81601 18.2947 9.7436 18.2398C9.67119 18.1848 9.61873 18.1077 9.59424 18.0202L8.27743 12.9104Z"
              stroke="currentColor"
              stroke-width="1.6658"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M16.6562 2.49902V5.83062"
              stroke="currentColor"
              stroke-width="1.6658"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M18.3238 4.16406H14.9922"
              stroke="currentColor"
              stroke-width="1.6658"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M3.33203 14.1592V15.825"
              stroke="currentColor"
              stroke-width="1.6658"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M4.1658 14.9922H2.5"
              stroke="currentColor"
              stroke-width="1.6658"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
        </svg>
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

/**
 * @typedef {Object} PeriodPreset
 * @property {string} label 칩에 표시할 문구 (예: '1년')
 * @property {number} value 클릭 시 설정될 개월 수
 */

const props = defineProps({
  label: { type: String, required: true },
  modelValue: { type: Number, required: true },
  min: { type: Number, default: 6 },
  max: { type: Number, default: 60 },
  caption: { type: String, default: '' },
  resultLabel: { type: String, required: true },
  resultValue: { type: String, required: true },
  resultCaption: { type: String, default: '' },
  /** @type {import('vue').PropType<PeriodPreset[]>} */
  presets: { type: Array, default: () => [] },
})
const emit = defineEmits(['update:modelValue'])

const percent = computed(() => ((props.modelValue - props.min) / (props.max - props.min)) * 100)
</script>
