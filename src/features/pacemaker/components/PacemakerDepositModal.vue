<!-- 페이스메이커 저금통 → 목표 연결계좌 입금 모달 -->
<template>
  <BaseModal :model-value="modelValue" hide-default-close @update:model-value="handleClose">
    <div class="flex items-center justify-between border-b border-slate-100 px-7 pb-[17px] pt-6">
      <div>
        <p class="text-xs font-bold text-slate-400">
          {{ target?.icon }} {{ target?.goalName }} 목표
        </p>
        <h3 class="pt-0.5 text-base font-black text-[#0a192f]">입금할 계좌에 입금하기</h3>
      </div>
      <button
        type="button"
        class="flex size-8 items-center justify-center rounded-full bg-[#f8fbff]"
        aria-label="닫기"
        @click="handleClose(false)"
      >
        <img src="@/assets/icons/modal-close.svg" alt="" class="size-[15px]" />
      </button>
    </div>

    <div class="flex flex-col gap-5 px-7 py-5">
      <div
        class="flex items-center justify-between rounded-2xl border border-primary/20 bg-[#eaf2ff] px-4 py-3"
      >
        <p class="text-sm font-bold text-[#0a192f]">사용 가능한 여유자금</p>
        <p class="text-base font-black text-primary">{{ formatWon(availableBalance) }}</p>
      </div>

      <button
        type="button"
        class="flex w-full items-center justify-between rounded-2xl border border-[#c5dcff] bg-[#f8fbff] px-4 py-3.5 text-left"
        @click="isAccountListOpen = !isAccountListOpen"
      >
        <div>
          <p class="text-xs text-slate-400">입금할 계좌</p>
          <p class="pt-0.5 text-sm font-bold text-[#0a192f]">
            {{ selectedOption?.icon }} {{ selectedOption?.accountNickname }}
          </p>
          <p class="text-xs text-slate-500">
            {{ selectedOption?.bankName }} {{ selectedOption?.accountNumberMasked }}
          </p>
        </div>
        <p
          v-if="selectedOption?.withdrawalBalance != null"
          class="text-sm font-bold text-[#0a192f]"
        >
          {{ formatManwon(selectedOption.withdrawalBalance) }}
        </p>
      </button>

      <div v-if="isAccountListOpen" class="flex flex-col gap-2">
        <button
          v-for="option in target?.depositOptions ?? []"
          :key="option.accountId"
          type="button"
          class="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left"
          :class="option.accountId === selectedOption?.accountId ? 'border-[#c5dcff]' : ''"
          @click="selectOption(option)"
        >
          <span>
            <span class="block text-sm font-bold text-[#0a192f]"
              >{{ option.icon }} {{ option.accountNickname }}</span
            >
            <span class="block text-xs text-slate-400"
              >{{ option.bankName }} {{ option.accountNumberMasked }}</span
            >
          </span>
          <span class="text-sm font-black text-primary">{{
            formatManwon(option.withdrawalBalance)
          }}</span>
        </button>
      </div>

      <div>
        <p class="pb-2 text-xs font-bold text-slate-500">입금 금액</p>
        <input
          v-model="amountInput"
          type="text"
          inputmode="numeric"
          class="w-full rounded-2xl border bg-[#f7faff] px-5 py-4 text-right text-xl font-black text-[#0a192f] outline-none"
          :class="isOverLimit ? 'border-[#fbcfe8]' : 'border-[#9dc0f5]'"
          @input="handleAmountInput"
        />

        <div class="flex gap-2 pt-2.5">
          <button
            v-for="chip in QUICK_ADD_CHIPS"
            :key="chip.label"
            type="button"
            class="flex-1 rounded-full border border-primary/20 bg-primary/[0.06] py-2 text-xs font-bold text-primary"
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

      <button
        type="button"
        class="rounded-2xl py-3.5 text-sm font-black text-white"
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
        {{ canSubmit ? `${formatWon(amount)} 입금하기` : '금액을 입력해주세요' }}
      </button>
    </div>
  </BaseModal>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import BaseModal from '@/shared/ui/BaseModal.vue'

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
})
const emit = defineEmits(['update:modelValue', 'deposit'])

const QUICK_ADD_CHIPS = [
  { label: '+5만', amount: 50000 },
  { label: '+10만', amount: 100000 },
  { label: '+20만', amount: 200000 },
  { label: '전체입금', full: true },
]

const amountInput = ref('0')
const isSubmitting = ref(false)
const isAccountListOpen = ref(false)
const selectedOption = ref(null)

const amount = computed(() => Number(amountInput.value) || 0)
const isOverLimit = computed(() => amount.value > props.availableBalance)
const canSubmit = computed(() => amount.value > 0 && !isOverLimit.value)

// 모달이 새로 열릴 때마다 입력값 초기화
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      amountInput.value = '0'
      selectedOption.value = props.target
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
  emit('update:modelValue', value)
}

async function handleSubmit() {
  if (!canSubmit.value || !props.target) return
  isSubmitting.value = true
  try {
    emit('deposit', {
      accountId: selectedOption.value.accountId,
      amount: amount.value,
      moneyBoxId: selectedOption.value.moneyBoxId,
    })
  } finally {
    isSubmitting.value = false
  }
}

function formatWon(value) {
  return `${value.toLocaleString()}원`
}

function formatManwon(value) {
  return `${Math.round(value / 10000).toLocaleString()}만원`
}
</script>
