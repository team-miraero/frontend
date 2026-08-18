<!-- 페이스메이커 저금통 → 목표 연결계좌 입금 모달 -->
<template>
  <BaseModal :model-value="modelValue" hide-default-close @update:model-value="handleClose">
    <div class="flex items-center justify-between border-b border-slate-100 px-7 pb-[17px] pt-6">
      <div>
        <p class="inline-flex items-center gap-1 text-xs font-bold text-slate-400">
          <GoalTypeIcon :goal-type="target?.goalType" size="sm" /> {{ target?.goalName }} 목표
        </p>
        <h3 class="pt-0.5 text-base font-bold text-[#0a192f]">입금할 계좌에 입금하기</h3>
      </div>
      <button
        type="button"
        class="flex size-8 items-center justify-center rounded-full bg-[#f8fbff] disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="닫기"
        :disabled="isSubmitting"
        @click="handleClose(false)"
      >
        <img src="@/assets/icons/modal-close.svg" alt="" class="size-[15px]" />
      </button>
    </div>

    <div class="flex flex-col gap-5 px-7 py-5" :aria-busy="isSubmitting">
      <div
        class="flex items-center justify-between rounded-2xl border border-primary/20 bg-[#eaf2ff] px-4 py-3"
      >
        <p class="text-sm font-bold text-[#0a192f]">사용 가능한 여유자금</p>
        <p class="text-base font-bold text-primary">{{ formatWon(availableBalance) }}</p>
      </div>

      <button
        type="button"
        class="flex w-full items-center justify-between rounded-2xl border border-[#c5dcff] bg-[#f8fbff] px-4 py-3.5 text-left"
        :disabled="isSubmitting"
        @click="isAccountListOpen = !isAccountListOpen"
      >
        <div>
          <p class="text-xs text-slate-400">입금할 계좌</p>
          <p class="pt-0.5 text-sm font-bold text-[#0a192f]">
            {{ selectedOption?.icon }} {{ selectedOption?.accountNickname }}
          </p>
          <p class="text-xs text-slate-500">
            {{ selectedOption?.accountNumberMasked }}
          </p>
        </div>
        <p v-if="selectedOption?.accountBalance != null" class="text-sm font-bold text-[#0a192f]">
          {{ formatWon(selectedOption.accountBalance) }}
        </p>
      </button>

      <div v-if="isAccountListOpen" class="flex flex-col gap-2">
        <button
          v-for="option in target?.depositOptions ?? []"
          :key="option.accountId"
          type="button"
          class="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left"
          :class="option.accountId === selectedOption?.accountId ? 'border-[#c5dcff]' : ''"
          :disabled="isSubmitting"
          @click="selectOption(option)"
        >
          <span>
            <span class="block text-sm font-bold text-[#0a192f]"
              >{{ option.icon }} {{ option.accountNickname }}</span
            >
            <span class="block text-xs text-slate-400">{{ option.accountNumberMasked }}</span>
          </span>
          <span class="text-sm font-bold text-primary">{{
            formatWon(option.accountBalance)
          }}</span>
        </button>
      </div>

      <div>
        <p class="pb-2 text-xs font-bold text-slate-500">입금 금액</p>
        <input
          v-model="amountInput"
          type="text"
          inputmode="numeric"
          class="w-full rounded-2xl border bg-[#f7faff] px-5 py-4 text-right text-xl font-bold text-[#0a192f] outline-none"
          :class="isOverLimit ? 'border-[#fbcfe8]' : 'border-[#9dc0f5]'"
          :disabled="isSubmitting"
          @input="handleAmountInput"
        />

        <div class="flex gap-2 pt-2.5">
          <button
            v-for="chip in QUICK_ADD_CHIPS"
            :key="chip.label"
            type="button"
            class="flex-1 rounded-full border border-primary/20 bg-primary/[0.06] py-2 text-xs font-bold text-primary"
            :disabled="isSubmitting"
            @click="applyQuickAdd(chip)"
          >
            {{ chip.label }}
          </button>
        </div>

        <div
          v-if="isOverLimit"
          class="mt-2.5 flex items-start gap-2 rounded-[10px] border border-[#fbcfe8] bg-[#fff0f9] px-3.5 py-2.5"
        >
          <img src="@/assets/icons/deposit-warning.svg" alt="" class="mt-px size-3" />
          <p class="text-xs text-[#be185d]">
            여유자금({{ formatWon(availableBalance) }})을 초과하는 금액입니다.
          </p>
        </div>
      </div>

      <div
        v-if="errorMessage"
        class="rounded-xl border border-red-200 bg-red-50 px-4 py-3"
        role="alert"
      >
        <p class="text-xs font-bold text-red-600">입금하지 못했어요.</p>
        <p class="mt-1 text-xs leading-5 text-red-500">
          {{ errorMessage }} 입금하기 버튼을 눌러 다시 시도해 주세요.
        </p>
      </div>

      <button
        type="button"
        class="rounded-2xl py-3.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-70"
        :class="
          canSubmit ? 'shadow-[0_6px_10px_rgba(0,102,255,0.28)]' : 'bg-slate-200 !text-slate-400'
        "
        :style="
          canSubmit
            ? 'background-image: linear-gradient(173deg, rgb(0, 102, 255) 0%, rgb(102, 178, 255) 100%)'
            : ''
        "
        :disabled="!canSubmit || isSubmitting"
        @click="handleSubmit"
      >
        {{ submitButtonLabel }}
      </button>
    </div>
  </BaseModal>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import GoalTypeIcon from '@/shared/ui/GoalTypeIcon.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  target: {
    type: Object,
    default: null, // { goalId, goalName, icon, accountNickname, bankName, accountNumberMasked, accountBalance }
  },
  availableBalance: {
    type: Number,
    default: 0,
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:modelValue', 'deposit'])

const QUICK_ADD_CHIPS = [
  { label: '+5만', amount: 50000 },
  { label: '+10만', amount: 100000 },
  { label: '+20만', amount: 200000 },
  { label: '전체입금', full: true },
]

const amountInput = ref('0')
const isAccountListOpen = ref(false)
const selectedOption = ref(null)

const amount = computed(() => Number(amountInput.value) || 0)
const isOverLimit = computed(() => amount.value > props.availableBalance)
const canSubmit = computed(
  () => amount.value > 0 && !isOverLimit.value && selectedOption.value !== null
)
const submitButtonLabel = computed(() => {
  if (props.isSubmitting) return '입금 중...'
  if (!canSubmit.value) return '금액을 입력해주세요'
  return `${formatWon(amount.value)} ${props.errorMessage ? '다시 입금하기' : '입금하기'}`
})

// 모달이 새로 열릴 때마다 입력값 초기화
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      amountInput.value = '0'
      selectedOption.value =
        props.target?.depositOptions?.find(
          (option) => option.accountId === props.target?.accountId
        ) ??
        props.target?.depositOptions?.[0] ??
        null
      isAccountListOpen.value = false
    }
  }
)

function selectOption(option) {
  selectedOption.value = option
  isAccountListOpen.value = false
}

function handleAmountInput(event) {
  amountInput.value = event.target.value.replace(/[^0-9]/g, '')
}

function applyQuickAdd(chip) {
  amountInput.value = String(chip.full ? props.availableBalance : amount.value + chip.amount)
}

function handleClose(value) {
  if (props.isSubmitting) return
  emit('update:modelValue', value)
}

function handleSubmit() {
  if (!canSubmit.value || !selectedOption.value || props.isSubmitting) return
  emit('deposit', {
    accountId: selectedOption.value.accountId,
    amount: amount.value,
    moneyBoxId: selectedOption.value.moneyBoxId,
    option: selectedOption.value,
  })
}

function formatWon(value) {
  return `${value.toLocaleString()}원`
}
</script>
