<template>
  <MypageModal
    v-model="isOpen"
    title-id="goal-reset-modal-title"
    max-width-class="max-w-[460px]"
    :close-disabled="saving"
  >
    <template #heading>
      <div>
        <p class="text-xs font-semibold text-slate-400">{{ goal?.goalName }} 목표</p>
        <h2 id="goal-reset-modal-title" class="mt-0.5 text-base font-black text-[#0a192f]">
          목표 재설정
        </h2>
      </div>
    </template>

    <form class="flex flex-col gap-5 px-7 py-6" @submit.prevent="submit">
      <label class="block">
        <span class="mb-2 block text-sm font-bold text-[#0a192f]">목표 금액</span>
        <div class="relative">
          <input
            v-model.number="form.goalAmount"
            type="number"
            min="10000"
            step="10000"
            class="mypage-goal-input pr-14 tabular-nums"
            autofocus
            aria-describedby="goal-amount-caption"
          />
          <span
            class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 select-none text-sm font-semibold text-slate-500"
            >원</span
          >
        </div>
        <p id="goal-amount-caption" class="mt-1.5 text-xs text-slate-400">
          현재 모은 금액 {{ formatKRW(goal?.currentAmount ?? 0) }} 이상으로 설정해주세요.
        </p>
      </label>

      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="amount in amountPresets"
          :key="amount"
          type="button"
          class="rounded-full border px-2 py-2 text-xs font-bold transition-colors"
          :aria-pressed="form.goalAmount === amount"
          :class="
            form.goalAmount === amount
              ? 'border-primary bg-primary text-white'
              : 'border-[#c5dcff] bg-[#eaf2ff] text-primary'
          "
          @click="form.goalAmount = amount"
        >
          {{ formatKRWCompact(amount) }}
        </button>
      </div>

      <label class="block">
        <span class="mb-2 block text-sm font-bold text-[#0a192f]">목표 날짜</span>
        <input
          v-model="form.goalDate"
          type="date"
          :min="minimumGoalDate"
          class="mypage-goal-input"
        />
      </label>

      <fieldset>
        <legend class="mb-2 text-sm font-bold text-[#0a192f]">목표 상태</legend>
        <div class="grid grid-cols-2 gap-2 rounded-2xl bg-[#f4f8ff] p-1.5">
          <button
            v-for="option in statusOptions"
            :key="option.value"
            type="button"
            class="rounded-xl px-4 py-2.5 text-sm font-bold transition-all"
            :aria-pressed="form.status === option.value"
            :class="
              form.status === option.value
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-500 hover:text-[#0a192f]'
            "
            @click="form.status = option.value"
          >
            {{ option.label }}
          </button>
        </div>
      </fieldset>

      <div class="rounded-2xl border border-slate-200 bg-[#f4f8ff] px-5 py-4 text-sm">
        <p class="flex justify-between gap-4">
          <span class="text-slate-500">변경 목표</span>
          <strong class="text-right text-primary">{{ formatKRW(form.goalAmount || 0) }}</strong>
        </p>
        <p class="mt-2 flex justify-between gap-4">
          <span class="text-slate-500">달성 예정</span>
          <strong class="text-right text-[#0a192f]">{{ formatGoalDate(form.goalDate) }}</strong>
        </p>
      </div>

      <p v-if="validationError || error" class="text-sm text-red-700" role="alert">
        {{ validationError || error }}
      </p>

      <div class="mypage-modal-actions -mx-7 -mb-6 mt-1">
        <button
          type="button"
          class="mypage-modal-secondary"
          :disabled="saving"
          @click="isOpen = false"
        >
          취소
        </button>
        <button type="submit" class="mypage-modal-primary" :disabled="saving">
          <span v-if="saving" class="mypage-spinner text-white" aria-hidden="true" />
          {{ saving ? '저장 중' : '재설정 저장하기' }}
        </button>
      </div>
    </form>
  </MypageModal>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { formatKRW, formatKRWCompact } from '@/shared/lib/money'
import MypageModal from '@/features/mypage/components/MypageModal.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  goal: { type: Object, default: null },
  saving: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'submit'])
const form = reactive({ goalAmount: 0, goalDate: '', status: 'ACTIVE' })
const validationError = ref('')
const amountPresets = [10000000, 30000000, 50000000]
const statusOptions = [
  { value: 'ACTIVE', label: '진행 중' },
  { value: 'PAUSE', label: '일시 정지' },
]
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
// 반응형 의존성이 없어 computed로 두면 자정을 넘겨도 갱신되지 않으므로 열릴 때마다 계산한다.
const minimumGoalDate = ref('')

function toLocalDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function normalizeGoalDate(value) {
  if (!value) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  if (/^\d{4}-\d{2}$/.test(value)) return `${value}-01`
  return toLocalDate(new Date(value))
}

function formatGoalDate(value) {
  if (!value) return '-'
  const [year, month, day] = value.split('-')
  return `${year}년 ${Number(month)}월 ${Number(day)}일`
}

function resetForm() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  form.goalAmount = props.goal?.goalAmount ?? 0
  form.goalDate = normalizeGoalDate(props.goal?.period?.endDate)
  form.status = ['PAUSE', 'PAUSED'].includes(props.goal?.status) ? 'PAUSE' : 'ACTIVE'
  minimumGoalDate.value = toLocalDate(tomorrow)
  validationError.value = ''
}

function submit() {
  validationError.value = ''
  if (!Number.isFinite(form.goalAmount) || form.goalAmount < 10000) {
    validationError.value = '목표 금액을 1만원 이상 입력해주세요.'
    return
  }
  if (form.goalAmount < (props.goal?.currentAmount ?? 0)) {
    validationError.value = '목표 금액은 현재 모은 금액보다 작을 수 없습니다.'
    return
  }
  if (!form.goalDate || form.goalDate < minimumGoalDate.value) {
    validationError.value = '목표 날짜는 내일 이후로 설정해주세요.'
    return
  }

  emit('submit', {
    goalDate: form.goalDate,
    goalAmount: form.goalAmount,
    status: form.status,
  })
}

watch(
  () => props.modelValue,
  (opened) => {
    if (opened) resetForm()
  }
)
</script>
