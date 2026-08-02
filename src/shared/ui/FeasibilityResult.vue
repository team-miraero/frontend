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
          <span class="text-gray-500">{{ availableLabel }}</span>
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
            stroke-width="2"
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
            stroke-width="3.2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-6 w-6 text-red-500"
          >
            <path d="M12 6.5v6" />
            <path d="M12 16.8h.01" stroke-width="4" />
          </svg>
        </span>
        <div>
          <p class="text-sm font-bold" :class="statusTextClass">{{ statusTitle }}</p>
          <p class="mt-0.5 text-xs text-gray-500">{{ statusMessage }}</p>
        </div>
      </div>
    </div>

    <div
      v-if="status === 'success'"
      class="mt-4 animate-fade-in-up rounded-2xl border border-gray-200 bg-white p-6"
      style="animation-delay: 175ms"
    >
      <div class="flex items-center gap-2">
        <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-light text-primary">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4"
          >
            <path d="m3 17 6-6 4 4 8-8" />
            <path d="M17 7h4v4" />
          </svg>
        </span>
        <div>
          <p class="text-xs text-gray-400">{{ forecastLabel }}</p>
          <p class="text-sm font-bold text-gray-900">{{ forecastMessage }}</p>
        </div>
      </div>

      <p class="mt-4 text-lg font-bold leading-snug text-gray-900">
        매달 <span class="text-primary">{{ monthlyLabel }}</span>이면<br />
        <span class="text-primary">{{ periodLabel }}</span> 뒤 {{ goalLabel }} 가능해요
      </p>

      <div class="mt-4 grid grid-cols-3 gap-2">
        <div v-for="stat in stats" :key="stat.label" class="rounded-xl bg-gray-50 p-3 text-center">
          <p class="text-[11px] text-gray-400">{{ stat.label }}</p>
          <p class="mt-1 text-sm font-bold text-gray-900">{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <div
      v-else
      class="mt-4 animate-fade-in-up rounded-2xl border border-gray-200 bg-white p-6"
      style="animation-delay: 175ms"
    >
      <div class="flex items-center gap-2">
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          :class="adjustIconClass"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5" />
            <path d="M12 8h.01" />
          </svg>
        </span>
        <p class="text-sm font-bold text-gray-900">{{ adjustTitle }}</p>
      </div>
      <p class="mt-2 text-xs leading-relaxed text-gray-500">{{ adjustMessage }}</p>

      <div class="mt-4 space-y-2">
        <label
          v-for="alt in alternatives"
          :key="alt.key"
          class="flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-colors"
          :class="
            selectedAlternative === alt.key
              ? 'border-primary bg-accent-light'
              : 'border-gray-200 bg-white hover:bg-gray-50'
          "
          @click.prevent="emit('update:selectedAlternative', alt.key)"
        >
          <span class="flex items-center gap-2">
            <span class="flex h-5 w-5 shrink-0 items-center justify-center text-gray-400">
              <svg
                v-if="alt.key === 'period'"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-4 w-4"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
              </svg>
              <svg
                v-else
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-4 w-4"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M8 12h8" />
              </svg>
            </span>
            <span>
              <span class="block text-sm font-medium text-gray-900">{{ alt.label }}</span>
              <span class="block text-xs text-gray-400">{{ alt.sublabel }}</span>
            </span>
          </span>
          <span
            v-if="selectedAlternative === alt.key"
            class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-3 w-3"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
        </label>
      </div>

      <div
        v-if="recalculated"
        class="mt-4 flex items-center justify-between rounded-xl p-4"
        :class="recalculatedBoxClass.bg"
      >
        <div>
          <p class="text-xs text-gray-500">{{ recalculated.label }}</p>
          <p class="mt-0.5 text-lg font-bold" :class="recalculatedBoxClass.value">
            {{ recalculated.value }}
          </p>
        </div>
        <div class="text-right">
          <p class="text-xs text-gray-500">{{ recalculated.sublabel }}</p>
          <p class="mt-0.5 text-sm font-bold text-gray-900">{{ recalculated.subvalue }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
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
  availableAmount: { type: Number, required: true },
  requiredLabel: { type: String, required: true },
  requiredAmount: { type: Number, required: true },
  status: { type: String, required: true }, // 'success' | 'warning' | 'danger'
  statusTitle: { type: String, required: true },
  statusMessage: { type: String, default: '' },

  forecastLabel: { type: String, default: '' },
  forecastMessage: { type: String, default: '' },
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
})
const emit = defineEmits(['update:selectedAlternative'])

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
    iconBg: 'bg-amber-400 text-white',
  },
  danger: {
    text: 'text-red-500',
    bar: 'bg-red-400',
    badgeBg: 'bg-red-50',
    iconBg: 'bg-red-100 text-red-500 border-[3.5px] border-red-500 shadow-sm',
  },
}

const statusClass = computed(() => STATUS_CLASS[props.status] ?? STATUS_CLASS.success)
const statusTextClass = computed(() => statusClass.value.text)
const statusBarClass = computed(() => statusClass.value.bar)
const statusBadgeBgClass = computed(() => statusClass.value.badgeBg)
const statusIconBgClass = computed(() => statusClass.value.iconBg)

const ADJUST_ICON_CLASS = {
  warning: 'bg-amber-50 text-amber-500',
  danger: 'bg-red-50 text-red-500',
}
const adjustIconClass = computed(() => ADJUST_ICON_CLASS[props.status] ?? ADJUST_ICON_CLASS.danger)

const RECALCULATED_BOX_CLASS = {
  warning: { bg: 'bg-amber-50', value: 'text-amber-600' },
  danger: { bg: 'bg-red-50', value: 'text-red-600' },
}
const recalculatedBoxClass = computed(
  () => RECALCULATED_BOX_CLASS[props.status] ?? RECALCULATED_BOX_CLASS.danger
)

const availableValueLabel = computed(() => formatKRWCompact(props.availableAmount))
const requiredValueLabel = computed(() => formatKRWCompact(props.requiredAmount))
const requiredBarPercent = computed(() =>
  props.availableAmount > 0
    ? Math.min(100, Math.round((props.requiredAmount / props.availableAmount) * 100))
    : 100
)
</script>
