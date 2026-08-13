<!-- 목표설정 퍼널(GOAL-03) 공용 실현가능성 결과 카드: 여력 비교 + 상태별(성공/주의/위험) 콘텐츠 -->
<template>
  <div>
    <div
      class="animate-fade-in-up rounded-2xl border border-gray-200 bg-white p-6"
      style="animation-delay: 100ms"
    >
      <p class="text-xs font-medium text-gray-400">마이데이터 분석 결과</p>

      <div class="mt-3">
        <div class="flex items-center justify-between text-sm">
          <span class="relative inline-flex items-center gap-1.5 text-gray-500">
            <span>{{ availableLabel }}</span>
            <button
              v-if="availableHelp"
              type="button"
              class="flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 text-[10px] font-bold leading-none text-gray-400 transition-colors hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="월 가능 저축액 계산 기준 보기"
              :aria-expanded="isAvailableHelpOpen"
              aria-describedby="available-saving-help"
              @click="isAvailableHelpOpen = !isAvailableHelpOpen"
            >
              i
            </button>
            <span
              v-if="isAvailableHelpOpen"
              id="available-saving-help"
              role="tooltip"
              class="absolute left-0 top-6 z-20 w-[280px] rounded-xl border border-gray-200 bg-white p-3 text-xs leading-relaxed text-gray-600 shadow-lg"
            >
              <strong class="mb-1 block text-gray-900">어떻게 계산했나요?</strong>
              {{ availableHelp }}
            </span>
          </span>
          <span class="font-bold text-gray-900">{{ availableValueLabel }}</span>
        </div>
        <div class="mt-1.5 h-1.5 w-full rounded-full bg-gray-100">
          <div class="h-1.5 w-full rounded-full bg-primary" />
        </div>
      </div>

      <div class="mt-3">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-500">{{ requiredLabel }}</span>
          <span class="font-bold" :class="statusTextClass">{{ requiredValueLabel }}</span>
        </div>
        <div class="mt-1.5 h-1.5 w-full rounded-full bg-gray-100">
          <div
            class="h-1.5 rounded-full transition-all"
            :class="statusBarClass"
            :style="{ width: requiredBarPercent + '%' }"
          />
        </div>
      </div>

      <div class="mt-4 flex items-center gap-3 rounded-xl p-4" :class="statusBadgeBgClass">
        <span
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          :class="statusIconBgClass"
        >
          <svg
            v-if="status === 'success'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <svg
            v-else-if="status === 'warning'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4"
          >
            <path d="M12 9v4" />
            <path
              d="m10.29 3.86-8.02 13.9A1.5 1.5 0 0 0 3.5 20h17a1.5 1.5 0 0 0 1.23-2.24l-8.02-13.9a1.5 1.5 0 0 0-2.44 0Z"
            />
            <path d="M12 16h.01" />
          </svg>
          <svg
            v-else
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-5 w-5"
          >
            <line x1="12" y1="6" x2="12" y2="12.5" />
            <circle cx="12" cy="17.5" r="1.5" fill="currentColor" stroke="none" />
          </svg>
        </span>
        <div>
          <p class="text-sm font-bold" :class="statusTextClass">{{ statusTitle }}</p>
          <p class="mt-0.5 text-xs text-gray-500">{{ statusMessage }}</p>
        </div>
      </div>
    </div>

    <div
      v-if="!showAdjustment"
      class="mt-4 animate-fade-in-up rounded-2xl border border-gray-200 bg-white p-6"
      style="animation-delay: 175ms"
    >
      <p class="text-base font-bold leading-relaxed text-gray-900">
        매달 <span class="text-primary">{{ monthlyLabel }}</span
        >이면<br class="sm:hidden" />
        <span class="break-keep">
          <span class="text-primary">{{ periodLabel }}</span> 뒤 {{ goalLabel }} 가능해요
        </span>
      </p>

      <div class="mt-4 grid grid-cols-3 gap-2">
        <div v-for="stat in stats" :key="stat.label" class="rounded-xl bg-gray-50 p-3 text-center">
          <p class="text-[11px] text-gray-400">{{ stat.label }}</p>
          <p class="mt-1 text-sm font-bold text-gray-900">{{ stat.value }}</p>
        </div>
      </div>

      <button
        v-if="canAdjust"
        type="button"
        class="mt-4 w-full rounded-xl border border-primary/25 bg-white px-4 py-3 text-sm font-bold text-primary transition-colors hover:bg-accent-light"
        @click="emit('request-adjustment')"
      >
        계획 여유롭게 조정하기
      </button>
    </div>

    <div
      v-else
      class="mt-4 animate-fade-in-up rounded-2xl border border-gray-200 bg-white p-6"
      style="animation-delay: 175ms"
    >
      <div class="flex items-center justify-between gap-3">
        <p class="text-xs text-gray-400">계획 조정</p>
        <button
          v-if="canCloseAdjustment"
          type="button"
          class="text-xs font-bold text-gray-500 underline decoration-gray-300 underline-offset-4 transition-colors hover:text-primary"
          @click="emit('close-adjustment')"
        >
          조정하지 않고 돌아가기
        </button>
      </div>
      <p class="mt-0.5 text-sm font-bold text-gray-900">{{ adjustTitle }}</p>
      <p class="mt-1 text-xs leading-relaxed text-gray-500">{{ adjustMessage }}</p>

      <div class="mt-4 space-y-3">
        <label
          v-for="alt in alternatives"
          :key="alt.key"
          class="block cursor-pointer rounded-xl border p-4 transition-colors"
          :class="[
            selectedAlternative === alt.key
              ? 'border-primary bg-accent-light'
              : 'border-gray-200 bg-white hover:bg-gray-50',
          ]"
          @click="emit('update:selectedAlternative', alt.key)"
        >
          <span class="flex items-end justify-between gap-3">
            <span class="text-sm font-medium text-gray-900">{{ alt.label }}</span>
            <span class="text-xs font-bold text-primary">{{ alternativeValueLabel(alt.key) }}</span>
          </span>

          <span class="mt-4 block" @click.stop>
            <span class="relative block h-2 w-full">
              <span class="absolute inset-0 rounded-full bg-gray-200" />
              <span
                class="absolute inset-y-0 left-0 rounded-full bg-primary"
                :style="{ width: alternativePercent(alt) + '%' }"
              />
              <input
                :value="alternativeValue(alt.key)"
                type="range"
                :min="alt.min"
                :max="alt.max"
                :step="alt.step"
                class="absolute inset-0 h-2 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:shadow [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow"
                :aria-label="alt.label"
                @input="handleAlternativeInput(alt.key, $event)"
              />
            </span>
            <span class="mt-1 flex justify-between text-[11px] text-gray-400">
              <span>{{ alt.minLabel }}</span>
              <span>{{ alt.maxLabel }}</span>
            </span>
          </span>
        </label>
      </div>

      <div
        v-if="selectedAlternative"
        class="relative mt-4 flex min-h-[82px] items-center justify-between rounded-xl p-4"
        :class="recalculatedBoxClass.bg"
      >
        <div>
          <p class="mb-1 text-xs font-bold" :class="recalculatedBoxClass.value">
            {{ recalculatedStatusMessage }}
          </p>
          <p class="text-xs text-gray-500">{{ recalculated?.label ?? '조정 결과' }}</p>
          <p class="mt-0.5 text-lg font-bold" :class="recalculatedBoxClass.value">
            {{ recalculated?.value ?? '계산 중' }}
          </p>
        </div>
        <div v-if="recalculated" class="text-right">
          <p class="text-xs text-gray-500">{{ recalculated.sublabel }}</p>
          <p class="mt-0.5 text-sm font-bold text-gray-900">{{ recalculated.subvalue }}</p>
        </div>
        <span
          v-if="isRecalculating"
          class="absolute right-4 top-4 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary"
          aria-label="다시 계산하고 있어요"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { formatKRWCompact } from '@/shared/lib/money'

/**
 * @typedef {Object} FeasibilityStat
 * @property {string} label
 * @property {string} value
 */

/**
 * @typedef {Object} FeasibilityAlternative
 * @property {'period' | 'amount'} key
 * @property {string} label
 * @property {string} sublabel
 */

const props = defineProps({
  availableLabel: { type: String, required: true },
  availableHelp: { type: String, default: '' },
  availableAmount: { type: Number, required: true },
  requiredLabel: { type: String, required: true },
  requiredAmount: { type: Number, required: true },
  status: { type: String, required: true }, // 'success' | 'warning' | 'danger'
  statusTitle: { type: String, required: true },
  statusMessage: { type: String, default: '' },

  monthlyLabel: { type: String, default: '' },
  periodLabel: { type: String, default: '' },
  goalLabel: { type: String, default: '' },

  /** @type {import('vue').PropType<FeasibilityStat[]>} */
  stats: { type: Array, default: () => [] },

  adjustTitle: { type: String, default: '' },
  adjustMessage: { type: String, default: '' },
  /** @type {import('vue').PropType<FeasibilityAlternative[]>} */
  alternatives: { type: Array, default: () => [] },
  selectedAlternative: { type: String, default: '' },
  recalculated: { type: Object, default: null },
  recalculatedStatus: { type: String, default: 'danger' },
  isRecalculating: { type: Boolean, default: false },
  showAdjustment: { type: Boolean, default: false },
  canAdjust: { type: Boolean, default: false },
  canCloseAdjustment: { type: Boolean, default: false },
  periodExtension: { type: Number, default: 12 },
  amountReduction: { type: Number, default: 20 },
})
const isAvailableHelpOpen = ref(false)
const emit = defineEmits([
  'update:selectedAlternative',
  'update:periodExtension',
  'update:amountReduction',
  'request-adjustment',
  'close-adjustment',
])

function alternativeValue(key) {
  return key === 'period' ? props.periodExtension : props.amountReduction
}

function alternativeValueLabel(key) {
  if (key === 'period') return `+${props.periodExtension}개월`
  if (key === 'extra_capacity') return `+${props.amountReduction}만원`
  return `-${props.amountReduction}%`
}

function alternativePercent(alternative) {
  const range = alternative.max - alternative.min
  if (range <= 0) return 0
  return ((alternativeValue(alternative.key) - alternative.min) / range) * 100
}

function handleAlternativeInput(key, event) {
  const value = Number(event.target.value)
  emit('update:selectedAlternative', key)
  emit(key === 'period' ? 'update:periodExtension' : 'update:amountReduction', value)
}

const STATUS_CLASS = {
  success: {
    text: 'text-primary',
    bar: 'bg-primary',
    badgeBg: 'bg-accent-light',
    iconBg: 'bg-primary text-white',
  },
  warning: {
    text: 'text-amber-500',
    bar: 'bg-amber-400',
    badgeBg: 'bg-amber-50',
    iconBg: 'bg-amber-500 text-white',
  },
  danger: {
    text: 'text-red-500',
    bar: 'bg-red-400',
    badgeBg: 'bg-red-50',
    iconBg: 'bg-red-500 text-white',
  },
}

const statusClass = computed(() => STATUS_CLASS[props.status] ?? STATUS_CLASS.success)
const statusTextClass = computed(() => statusClass.value.text)
const statusBarClass = computed(() => statusClass.value.bar)
const statusBadgeBgClass = computed(() => statusClass.value.badgeBg)
const statusIconBgClass = computed(() => statusClass.value.iconBg)

const RECALCULATED_BOX_CLASS = {
  success: { bg: 'bg-accent-light', value: 'text-primary' },
  warning: { bg: 'bg-amber-50', value: 'text-amber-600' },
  danger: { bg: 'bg-red-50', value: 'text-red-600' },
}
const recalculatedBoxClass = computed(
  () => RECALCULATED_BOX_CLASS[props.recalculatedStatus] ?? RECALCULATED_BOX_CLASS.danger
)
const recalculatedStatusMessage = computed(() => {
  if (props.recalculatedStatus === 'success') return '이 계획이면 달성 가능해요'
  if (props.recalculatedStatus === 'warning') return '조금 빠듯하지만 진행할 수 있어요'
  return '조금 더 조정해 주세요'
})

const availableValueLabel = computed(() => formatKRWCompact(props.availableAmount))
const requiredValueLabel = computed(() => formatKRWCompact(props.requiredAmount))
const requiredBarPercent = computed(() =>
  props.availableAmount > 0
    ? Math.min(100, Math.round((props.requiredAmount / props.availableAmount) * 100))
    : 100
)
</script>
