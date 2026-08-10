<!-- 페이스메이커 개설 2단계: 하루 자동 저축 상한선 설정 -->
<template>
  <section
    class="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_64px_rgba(15,38,70,0.1)] motion-safe:animate-fade-in-up"
    aria-labelledby="limit-title"
  >
    <div class="border-b border-slate-100 px-6 pb-5 pt-7 sm:px-8 sm:pt-8">
      <p class="text-xs font-black tracking-[0.12em] text-primary">
        {{ isEditMode ? '페이스메이커 상한선 변경' : '페이스메이커 설정 2/2' }}
      </p>
      <h2
        id="limit-title"
        class="mt-2 text-xl font-black leading-7 tracking-[-0.4px] text-[#0a192f]"
      >
        자동 저축 상한선을<br />설정해주세요
      </h2>
    </div>

    <div class="flex flex-col gap-6 px-5 py-6 sm:px-8">
      <div
        class="rounded-2xl border-[1.5px] border-[#c5dcff] bg-gradient-to-br from-[#eaf2ff] to-[#fff0f9] px-5 py-4 text-center"
        aria-live="polite"
      >
        <p class="text-xs font-semibold text-slate-500">하루 최대 자동 저축 금액</p>
        <p class="mt-1 text-[32px] font-black tracking-[-0.03em] text-primary">
          {{ formatNumber(selectedMaxAmount) }}<span class="ml-1 text-lg">원</span>
        </p>
      </div>

      <div>
        <label for="daily-saving-limit" class="sr-only">하루 자동 저축 상한선</label>
        <input
          id="daily-saving-limit"
          v-model.number="selectedMaxAmount"
          type="range"
          :min="MIN_DAILY_LIMIT"
          :max="MAX_DAILY_LIMIT"
          :step="DAILY_LIMIT_STEP"
          class="limit-slider w-full cursor-pointer appearance-none rounded-full"
          :style="limitSliderStyle"
          :disabled="isSubmitting"
        />
        <div class="mt-3 grid grid-cols-5 gap-1.5">
          <button
            v-for="amount in limitPresets"
            :key="amount"
            type="button"
            class="min-h-8 rounded-full px-1 text-[11px] font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 sm:text-xs"
            :class="
              selectedMaxAmount === amount
                ? 'bg-primary text-white shadow-[0_3px_10px_rgba(0,102,255,0.22)]'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            "
            :aria-pressed="selectedMaxAmount === amount"
            :disabled="isSubmitting"
            @click="selectedMaxAmount = amount"
          >
            {{ formatPreset(amount) }}
          </button>
        </div>
      </div>

      <div class="rounded-[14px] border border-slate-200 bg-[#f8fbff] px-4 py-3.5">
        <p class="text-xs leading-5 text-slate-500">
          여유자금이 상한선보다 적으면 여유자금 전액이 저축돼요.<br />
          매일 여유자금을 확인해 설정한 상한선까지 자동으로 저축해요.
        </p>
      </div>

      <p
        v-if="errorMessage"
        class="rounded-[14px] bg-red-50 px-4 py-3 text-xs font-semibold leading-5 text-red-600"
        role="alert"
      >
        {{ errorMessage }}
      </p>
    </div>

    <div class="flex flex-col gap-3 px-5 pb-7 sm:px-8">
      <button
        type="button"
        class="min-h-12 w-full rounded-2xl bg-gradient-to-br from-primary to-[#66b2ff] px-5 text-sm font-black text-white shadow-[0_6px_20px_rgba(0,102,255,0.28)] transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="isSubmitting"
        @click="$emit('complete')"
      >
        {{
          isSubmitting
            ? isEditMode
              ? '변경 중...'
              : '개설 중...'
            : isEditMode
              ? '변경 완료'
              : '개설 완료'
        }}
      </button>
      <button
        type="button"
        class="min-h-11 w-full rounded-2xl text-sm font-semibold text-slate-400 transition hover:bg-slate-50 hover:text-slate-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="isSubmitting"
        @click="$emit('back')"
      >
        {{ isEditMode ? '취소' : '이전으로' }}
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const MIN_DAILY_LIMIT = 1000
const MAX_DAILY_LIMIT = 50000
const DAILY_LIMIT_STEP = 1000

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'complete', 'back'])

const limitPresets = [1000, 10000, 20000, 30000, 50000]

const selectedMaxAmount = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const limitSliderStyle = computed(() => {
  const progress =
    ((selectedMaxAmount.value - MIN_DAILY_LIMIT) / (MAX_DAILY_LIMIT - MIN_DAILY_LIMIT)) * 100

  return {
    background: `linear-gradient(to right, #0066ff 0%, #0066ff ${progress}%, #e2e8f0 ${progress}%, #e2e8f0 100%)`,
  }
})

function formatNumber(amount) {
  return amount.toLocaleString('ko-KR')
}

function formatPreset(amount) {
  if (amount < 10000) return `${amount / 1000}천`
  return `${amount / 10000}만`
}
</script>

<style scoped>
.limit-slider {
  height: 6px;
}

.limit-slider::-webkit-slider-thumb {
  width: 22px;
  height: 22px;
  appearance: none;
  border: 3px solid #ffffff;
  border-radius: 9999px;
  background: #0066ff;
  box-shadow: 0 2px 10px rgba(0, 102, 255, 0.32);
}

.limit-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border: 3px solid #ffffff;
  border-radius: 9999px;
  background: #0066ff;
  box-shadow: 0 2px 10px rgba(0, 102, 255, 0.32);
}
</style>
