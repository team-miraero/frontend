<!-- 페이스메이커 개설 2단계: 하루 자동 저축 상한선 설정 -->
<template>
  <section
    class="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_64px_rgba(15,38,70,0.1)] motion-safe:animate-fade-in-up"
    aria-labelledby="limit-title"
  >
    <div class="border-b border-slate-100 px-6 pb-5 pt-7 sm:px-8 sm:pt-8">
      <p class="text-xs font-bold tracking-wider text-primary">
        {{ isEditMode ? '페이스메이커 상한선 변경' : '페이스메이커 설정' }}
      </p>
      <h2
        id="limit-title"
        class="mt-2 text-xl font-bold leading-7 tracking-tight text-[#0a192f]"
      >
        매일 최대 얼마까지<br />자동저축할까요?
      </h2>
    </div>

    <div class="flex flex-col gap-6 px-5 py-6 sm:px-8">
      <div
        class="rounded-2xl border-[1.5px] border-[#c5dcff] bg-gradient-to-br from-[#eaf2ff] to-[#fff0f9] px-5 py-4 text-center"
        aria-live="polite"
      >
        <p class="text-xs font-semibold text-slate-500">하루 최대 자동 저축 금액</p>
        <p class="mt-1 text-[32px] font-bold tracking-tight text-primary">
          {{ formatNumber(selectedMaxAmount) }}<span class="ml-1 text-lg">원</span>
        </p>
        <p class="mt-2 text-xs font-semibold text-primary/80">
          예상 효과 · 이 상한선대로면 한 달에 최대 {{ formatNumber(selectedMaxAmount * 30) }}원까지 모을 수 있어요
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

      <div v-if="!isEditMode" class="flex flex-col gap-3">
        <p class="text-xs font-bold text-slate-400">연동할 입출금계좌 선택</p>

        <p
          v-if="isAccountsLoading"
          class="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-center text-xs font-semibold text-slate-400"
        >
          계좌 정보를 불러오는 중이에요...
        </p>

        <div
          v-else-if="accountsError"
          class="rounded-2xl border border-slate-200 bg-white px-4 py-5 text-center"
        >
          <p class="text-xs font-semibold text-slate-500">계좌 정보를 불러오지 못했어요.</p>
          <button
            type="button"
            class="mt-2 text-xs font-bold text-primary underline underline-offset-2"
            @click="loadAccounts"
          >
            다시 시도
          </button>
        </div>

        <p
          v-else-if="checkingAccounts.length === 0"
          class="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-center text-xs font-semibold text-slate-400"
        >
          연동 가능한 입출금계좌가 없어요.
        </p>

        <ul v-else class="flex flex-col gap-2.5">
          <li v-for="account in checkingAccounts" :key="account.accountId">
            <button
              type="button"
              class="flex w-full items-center justify-between gap-3 rounded-2xl border-[1.5px] px-4 py-3.5 text-left transition disabled:cursor-not-allowed disabled:opacity-60"
              :class="
                selectedAccountId === account.accountId
                  ? 'border-primary bg-accent-light'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              "
              :aria-pressed="selectedAccountId === account.accountId"
              :disabled="isSubmitting"
              @click="selectAccount(account.accountId)"
            >
              <span class="min-w-0">
                <span class="block text-[11px] font-bold text-slate-400">
                  {{ account.institutionName }}
                </span>
                <span class="mt-0.5 block truncate text-sm font-bold text-[#0a192f]">
                  {{ account.accountName }}
                </span>
                <span class="mt-0.5 block text-xs text-slate-400">
                  {{ account.maskedAccountNumber }}
                </span>
              </span>

              <span class="flex shrink-0 flex-col items-end gap-1.5">
                <span class="text-sm font-bold text-[#0a192f]">
                  {{ formatNumber(account.balance)
                  }}<span class="ml-0.5 text-xs font-semibold text-slate-400">원</span>
                </span>
                <span
                  class="flex size-5 items-center justify-center rounded-full border-2 transition"
                  :class="
                    selectedAccountId === account.accountId
                      ? 'border-primary bg-primary'
                      : 'border-slate-300 bg-white'
                  "
                >
                  <svg
                    v-if="selectedAccountId === account.accountId"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="size-2.5 text-white"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
              </span>
            </button>
          </li>
        </ul>

        <div class="rounded-[14px] border border-slate-200 bg-[#f8fbff] px-4 py-3.5">
          <p class="flex items-start gap-1.5 text-xs leading-5 text-slate-500">
            <span
              class="mt-0.5 shrink-0 rounded-full bg-accent-light px-1.5 py-0.5 text-[10px] font-bold text-primary"
            >
              Tip
            </span>
            <span>페이스메이커는 주 입출금통장과 연동하는 것이 바람직해요.</span>
          </p>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-3 px-5 pb-7 sm:px-8">
      <button
        type="button"
        class="min-h-12 w-full rounded-2xl bg-gradient-to-br from-primary to-[#66b2ff] px-5 text-sm font-bold text-white shadow-[0_6px_20px_rgba(0,102,255,0.28)] transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="isSubmitting || (!isEditMode && !selectedAccountId)"
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
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useGoalStore } from '@/features/goal'

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
  selectedAccountId: {
    type: Number,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'update:selectedAccountId', 'complete'])

// 페이스메이커용 저금통과 연동할 주 입출금계좌 선택: 기존 목표 설정(GOAL-04)에서 쓰는
// 계좌 조회 스토어·API를 그대로 재사용한다.
const goalStore = useGoalStore()
const { accounts, areAccountsLoading: isAccountsLoading, accountsError } = storeToRefs(goalStore)

const checkingAccounts = computed(() =>
  accounts.value.filter((account) => account.accountType === 'CHECKING')
)

// 금융 서비스 특성상 출금 계좌는 사용자가 직접 확인하고 선택해야 하므로 자동 선택하지 않는다.
async function loadAccounts() {
  try {
    await goalStore.fetchAccounts('CHECKING')
  } catch {
    // accountsError는 store에서 세팅됨. 화면은 위 재시도 블록으로 안내.
  }
}

function selectAccount(accountId) {
  emit('update:selectedAccountId', accountId)
}

onMounted(() => {
  if (!props.isEditMode) loadAccounts()
})

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
