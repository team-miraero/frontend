<template>
  <div class="space-y-3">
    <section
      class="rounded-3xl border border-gray-200/80 bg-white p-5 shadow-[0_4px_24px_rgba(15,35,70,0.03)]"
    >
      <p class="text-xs font-medium text-gray-400">마이데이터 분석 결과</p>
      <dl class="mt-3 divide-y divide-gray-100">
        <div class="flex items-center justify-between py-3 text-sm">
          <dt class="flex items-center gap-1.5 text-gray-500">
            <span>{{ availableLabel }}</span>
            <div class="relative inline-flex items-center">
              <button
                type="button"
                class="inline-flex size-4 items-center justify-center rounded-full text-gray-400 transition-colors hover:text-[#0066FF] hover:bg-blue-50 focus:outline-none shrink-0"
                :class="isInfoOpen ? 'text-[#0066FF] bg-blue-50' : ''"
                title="월 가능액 산정 기준 보기"
                @click.stop="isInfoOpen = !isInfoOpen"
              >
                <svg
                  class="size-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </button>
              <div
                v-if="isInfoOpen"
                class="absolute left-0 top-6 z-30 w-64 animate-fade-in-up rounded-2xl border border-blue-200 bg-white p-3.5 text-xs leading-relaxed text-gray-800 shadow-xl ring-1 ring-black/5 text-left"
                @click.stop
              >
                <div class="flex items-start justify-between gap-2">
                  <p class="text-xs font-medium leading-relaxed text-gray-700 break-keep">
                    <span class="font-bold text-[#0066FF]">💡 월 가능액 산정 기준</span><br />
                    최근 3개월 평균 소득에서 고정 지출을 제외한 순수 저축·상환 여력이에요.
                  </p>
                  <button
                    type="button"
                    class="shrink-0 text-gray-400 hover:text-gray-700 text-xs font-bold px-1"
                    @click.stop="isInfoOpen = false"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </dt>
          <dd class="font-bold text-gray-900">{{ availableValueLabel }}</dd>
        </div>
        <div class="flex items-center justify-between py-3 text-sm">
          <dt class="text-gray-500">{{ requiredLabel }}</dt>
          <dd class="font-bold" :class="statusTextClass">{{ requiredValueLabel }}</dd>
        </div>
      </dl>
      <div class="mt-2 flex items-center gap-3 rounded-2xl border p-3.5" :class="statusBoxClass">
        <span
          class="flex size-8 shrink-0 items-center justify-center rounded-xl text-white shadow-xs"
          :class="statusIconClass"
        >
          <!-- 1) 성공: 체크마크 -->
          <svg
            v-if="status === 'success'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-4"
            aria-hidden="true"
          >
            <path d="m5 12 4 4L19 6" />
          </svg>

          <!-- 2) 주의 (조정할 때): 경고 표지판 (삼각형 경고 아이콘) -->
          <svg
            v-else-if="status === 'warning'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-4"
            aria-hidden="true"
          >
            <path
              d="m10.29 3.86-8.02 13.9A1.5 1.5 0 0 0 3.5 20h17a1.5 1.5 0 0 0 1.23-2.24l-8.02-13.9a1.5 1.5 0 0 0-2.44 0Z"
            />
            <path d="M12 9v4" />
            <path d="M12 16h.01" />
          </svg>

          <!-- 3) 위험 (아예 부족일 때): 느낌표 아이콘 (원형 느낌표) -->
          <svg
            v-else
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-4"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </span>
        <div>
          <p class="text-sm font-bold" :class="statusTextClass">{{ differenceTitle }}</p>
        </div>
      </div>
    </section>

    <!-- 카드 2: 목표 달성 예측 (조정 모드가 아닐 때) -->
    <section
      v-if="!showAdjustment"
      class="rounded-3xl border border-gray-200/80 bg-white p-5 shadow-[0_4px_24px_rgba(15,35,70,0.03)] sm:p-6"
    >
      <p class="break-keep text-base font-bold leading-relaxed text-gray-900 sm:text-lg">
        매달 <span class="text-primary">{{ monthlyLabel }}</span>이면 <span class="text-primary">{{ periodLabel }}</span> 뒤 {{ goalLabel }} 달성이 가능해요
      </p>

      <div class="mt-4 grid grid-cols-3 gap-2">
        <div v-for="stat in stats" :key="stat.label" class="rounded-xl bg-gray-50 p-3 text-center">
          <p class="text-[11px] text-gray-400">{{ stat.label }}</p>
          <p class="mt-1 whitespace-nowrap text-sm font-bold text-gray-900">{{ stat.value }}</p>
        </div>
      </div>

      <button
        v-if="canAdjust"
        type="button"
        class="mt-4 w-full rounded-2xl border border-[#0066FF] bg-[#EBF3FF] px-4 py-3 text-sm font-bold text-[#0066FF] transition-all hover:bg-blue-100/70"
        @click="emit('request-adjustment')"
      >
        계획 여유롭게 조정하기
      </button>
    </section>

    <section
      v-else
      class="rounded-3xl border border-gray-200/80 bg-white p-5 shadow-[0_4px_24px_rgba(15,35,70,0.03)]"
    >
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-xs font-medium text-gray-400">계획 조정</p>
          <h2 class="mt-1 text-base font-bold text-gray-900">{{ adjustTitle }}</h2>
        </div>
        <button
          v-if="canCloseAdjustment"
          type="button"
          class="shrink-0 text-xs font-semibold text-gray-400 hover:text-primary"
          @click="emit('close-adjustment')"
        >
          닫기
        </button>
      </div>
      <p v-if="adjustMessage" class="mt-1 text-xs leading-relaxed text-gray-500">
        {{ adjustMessage }}
      </p>

      <div class="mt-4 space-y-2.5">
        <div
          v-for="alternative in alternatives"
          :key="alternative.key"
          role="button"
          tabindex="0"
          class="block cursor-pointer rounded-2xl border-2 p-4 transition-all text-left"
          :class="[
            selectedAlternative === alternative.key
              ? 'border-[#0066FF] bg-[#EBF3FF] shadow-xs'
              : 'border-transparent bg-[#F4F7FA] hover:bg-slate-100/90',
          ]"
          @click="emit('update:selectedAlternative', alternative.key)"
          @keydown.space.prevent="emit('update:selectedAlternative', alternative.key)"
          @keydown.enter.prevent="emit('update:selectedAlternative', alternative.key)"
        >
          <!-- 상단 헤더: 라디오 동그라미 + 라벨 + 수치 뱃지 + 펼침 화살표 -->
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2.5">
              <!-- 라디오 체크 동그라미 -->
              <div
                class="size-5 rounded-full flex items-center justify-center transition-all shrink-0"
                :class="
                  selectedAlternative === alternative.key
                    ? 'bg-[#0066FF] text-white shadow-xs'
                    : 'border-2 border-slate-300 bg-white text-transparent'
                "
              >
                <svg class="size-3 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <span
                class="text-sm font-bold transition-colors"
                :class="selectedAlternative === alternative.key ? 'text-[#0066FF]' : 'text-gray-900'"
              >
                {{ alternative.label }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <span
                class="text-xs font-bold px-2 py-0.5 rounded-full transition-colors"
                :class="
                  selectedAlternative === alternative.key
                    ? 'bg-white text-primary shadow-xs'
                    : 'text-slate-500 bg-white/70'
                "
              >
                {{ alternativeValueLabel(alternative.key) }}
              </span>
              <!-- 화살표 아이콘 -->
              <svg
                class="size-4 text-slate-400 transition-transform duration-200"
                :class="selectedAlternative === alternative.key ? 'rotate-180 text-primary' : ''"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <!-- 아코디언 내용: 선택되었을 때만 슬라이더 펼침 -->
          <div
            v-if="selectedAlternative === alternative.key"
            class="mt-3.5 pt-3 border-t border-[#0066FF]/15 animate-fade-in"
            @click.stop
          >
            <input
              :value="alternativeValue(alternative.key)"
              type="range"
              :min="alternative.min"
              :max="alternative.max"
              :step="alternative.step"
              class="h-2.5 w-full cursor-pointer appearance-none rounded-lg accent-primary border border-slate-300/80 shadow-inner transition-all"
              :style="{
                background: `linear-gradient(to right, #0066FF 0%, #0066FF ${alternativePercent(alternative)}%, #E2E8F0 ${alternativePercent(alternative)}%, #E2E8F0 100%)`,
              }"
              :aria-label="alternative.label"
              @input="handleAlternativeInput(alternative.key, $event)"
            />
            <div class="mt-1.5 flex justify-between text-[11px] font-bold text-slate-500">
              <span>{{ alternative.minLabel }}</span>
              <span>{{ alternative.maxLabel }}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="selectedAlternative"
        class="relative mt-4 flex min-h-[78px] items-center justify-between rounded-2xl border p-4"
        :class="recalculatedBoxClass.bg"
      >
        <div>
          <p class="text-xs font-bold" :class="recalculatedBoxClass.value">
            {{ recalculatedStatusMessage }}
          </p>
          <p class="mt-1 text-xs text-gray-500">{{ recalculated?.label ?? '조정 결과' }}</p>
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
          class="absolute right-4 top-4 size-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary"
          aria-label="다시 계산하고 있어요"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { formatKRWCompact } from '@/shared/lib/money'

const isInfoOpen = ref(false)

function handleDocumentClick() {
  if (isInfoOpen.value) {
    isInfoOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
})

const props = defineProps({
  availableLabel: { type: String, required: true },
  availableAmount: { type: Number, required: true },
  requiredLabel: { type: String, required: true },
  requiredAmount: { type: Number, required: true },
  status: { type: String, required: true },
  monthlyLabel: { type: String, default: '' },
  periodLabel: { type: String, default: '' },
  goalLabel: { type: String, default: '' },
  stats: { type: Array, default: () => [] },
  adjustTitle: { type: String, default: '' },
  adjustMessage: { type: String, default: '' },
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
  if (!alternative || typeof alternative.min !== 'number' || typeof alternative.max !== 'number')
    return 0
  const range = alternative.max - alternative.min
  if (range <= 0) return 0
  const val = alternativeValue(alternative.key)
  return Math.min(100, Math.max(0, ((val - alternative.min) / range) * 100))
}

function handleAlternativeInput(key, event) {
  const value = Number(event.target.value)
  emit('update:selectedAlternative', key)
  emit(key === 'period' ? 'update:periodExtension' : 'update:amountReduction', value)
}

const STATUS_CLASS = {
  success: {
    text: 'text-emerald-600',
    box: 'border-emerald-100 bg-emerald-50/80',
    icon: 'bg-emerald-500',
  },
  warning: { text: 'text-amber-600', box: 'border-amber-100 bg-amber-50/80', icon: 'bg-amber-500' },
  danger: { text: 'text-rose-600', box: 'border-rose-100 bg-rose-50/80', icon: 'bg-rose-500' },
}
const statusClass = computed(() => STATUS_CLASS[props.status] ?? STATUS_CLASS.danger)
const statusTextClass = computed(() => statusClass.value.text)
const statusBoxClass = computed(() => statusClass.value.box)
const statusIconClass = computed(() => statusClass.value.icon)
const availableValueLabel = computed(() => formatKRWCompact(props.availableAmount))
const requiredValueLabel = computed(() => formatKRWCompact(props.requiredAmount))
const differenceAmount = computed(() => Math.abs(props.availableAmount - props.requiredAmount))
const differenceTitle = computed(() => {
  const amount = formatKRWCompact(differenceAmount.value)
  return props.status === 'success' ? `매달 ${amount} 여유가 있어요` : `매달 ${amount} 부족해요`
})
const RECALCULATED_BOX_CLASS = {
  success: { bg: 'border-blue-200 bg-blue-50', value: 'text-primary' },
  warning: { bg: 'border-amber-200 bg-amber-50/80', value: 'text-amber-600' },
  danger: { bg: 'border-rose-200 bg-rose-50/80', value: 'text-rose-600' },
}
const recalculatedBoxClass = computed(
  () => RECALCULATED_BOX_CLASS[props.recalculatedStatus] ?? RECALCULATED_BOX_CLASS.danger
)
const recalculatedStatusMessage = computed(() => {
  if (props.recalculatedStatus === 'success') return '이 계획이면 달성 가능해요'
  if (props.recalculatedStatus === 'warning') return '조금 빠듯하지만 진행할 수 있어요'
  return '조금 더 조정해 주세요'
})
</script>
