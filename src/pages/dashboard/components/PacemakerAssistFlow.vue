<template>
  <BaseModal
    :model-value="modelValue"
    hide-default-close
    :close-on-backdrop="!isSubmitting"
    @update:model-value="closeFlow"
  >
    <section role="dialog" aria-modal="true" :aria-labelledby="titleId" class="overflow-hidden">
      <header
        class="flex items-center justify-between gap-3 border-b border-slate-100 px-6 pb-4 pt-6 sm:px-7"
      >
        <div class="flex min-w-0 items-center gap-2.5">
          <button
            v-if="canGoBack"
            type="button"
            class="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f8fbff] text-sm font-black text-slate-500 transition hover:bg-blue-50 hover:text-primary"
            aria-label="이전 단계"
            :disabled="isSubmitting"
            @click="goBack"
          >
            ←
          </button>
          <div class="min-w-0">
            <p class="text-xs font-bold text-slate-400">{{ eyebrow }}</p>
            <h3 :id="titleId" class="truncate pt-0.5 text-base font-black text-[#0a192f]">
              {{ title }}
            </h3>
          </div>
        </div>
        <button
          type="button"
          class="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f8fbff] transition hover:bg-slate-100"
          aria-label="닫기"
          :disabled="isSubmitting"
          @click="closeFlow(false)"
        >
          <img src="@/assets/icons/modal-close.svg" alt="" class="size-[15px]" />
        </button>
      </header>

      <div v-if="step === 'strategy'" class="flex flex-col gap-3 px-6 py-5 sm:px-7">
        <div class="rounded-2xl border border-pink-200 bg-pink-50 px-4 py-3.5">
          <p class="text-sm leading-relaxed text-slate-700">
            이번 달 지출이 평소보다 늘어 목표 페이스가
            <strong class="font-black text-[#be185d]">{{ shortageLabel }} 부족해요.</strong>
            지금 상황에 맞는 대응 방법을 골라보세요.
          </p>
        </div>

        <button
          v-for="option in strategyOptions"
          :key="option.id"
          type="button"
          class="group flex w-full items-start gap-4 rounded-2xl border border-slate-200 bg-[#f4f8ff] p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/20 hover:bg-blue-50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
          @click="selectStrategy(option.id)"
        >
          <span
            class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F2F4F6] text-primary"
          >
            <AppIcon :name="option.icon" />
          </span>
          <span class="min-w-0 flex-1">
            <strong class="block text-sm font-bold text-[#0a192f] group-hover:text-primary">
              {{ option.title }}
            </strong>
            <span class="mt-0.5 block text-xs leading-relaxed text-slate-500">
              {{ option.description }}
            </span>
          </span>
          <span
            class="pt-1 text-lg text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-primary"
            aria-hidden="true"
            >›</span
          >
        </button>
      </div>

      <div v-else-if="step === 'accounts'" class="px-6 py-5 sm:px-7">
        <div
          v-if="goalStore.areAccountsLoading"
          class="rounded-2xl border border-slate-200 px-4 py-8 text-center text-sm font-bold text-slate-400"
          role="status"
        >
          사용 가능한 계좌를 불러오는 중이에요.
        </div>

        <div
          v-else-if="goalStore.accountsError"
          class="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-center"
          role="alert"
        >
          <p class="text-sm font-bold text-red-600">계좌를 불러오지 못했어요.</p>
          <button
            type="button"
            class="mt-3 rounded-full border border-red-200 bg-white px-4 py-2 text-xs font-bold text-red-600"
            @click="loadAccounts"
          >
            다시 시도
          </button>
        </div>

        <div v-else-if="availableAccounts.length" class="flex flex-col gap-3">
          <button
            v-for="account in availableAccounts"
            :key="account.accountId"
            type="button"
            class="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-[#f4f8ff] p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/20 hover:bg-blue-50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
            @click="selectAccount(account)"
          >
            <span class="min-w-0">
              <strong class="block truncate text-sm font-bold text-[#0a192f]">
                {{ account.accountName }}
              </strong>
              <span class="mt-0.5 block truncate text-xs text-slate-400">
                {{ account.institutionName }} {{ account.maskedAccountNumber }}
              </span>
            </span>
            <span class="shrink-0 text-right">
              <strong class="block text-sm font-black tabular-nums text-[#0a192f]">
                {{ formatKRW(account.balance) }}
              </strong>
              <span class="text-xs font-bold text-primary">선택 →</span>
            </span>
          </button>
        </div>

        <div v-else class="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center">
          <p class="text-sm font-bold text-[#0a192f]">끌어쓸 수 있는 입출금계좌가 없어요.</p>
          <p class="mt-1 text-xs text-slate-400">
            마이데이터에 다른 계좌를 연결한 뒤 다시 시도해 주세요.
          </p>
        </div>
      </div>

      <form v-else-if="step === 'amount'" class="px-6 py-5 sm:px-7" @submit.prevent="confirmPull">
        <div class="rounded-2xl border border-slate-200 bg-[#f4f8ff] p-4">
          <div class="flex items-center gap-3">
            <span
              class="flex size-9 items-center justify-center rounded-xl bg-blue-100 text-lg"
              aria-hidden="true"
              >🏦</span
            >
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-bold text-[#0a192f]">
                {{ selectedAccount.accountName }}
              </p>
              <p class="truncate text-xs text-slate-400">
                {{ selectedAccount.institutionName }} {{ selectedAccount.maskedAccountNumber }}
              </p>
            </div>
          </div>
          <div class="mt-3 flex items-end justify-between border-t border-slate-200 pt-3">
            <span class="text-xs text-slate-400">현재 잔액</span>
            <strong class="text-sm font-black tabular-nums text-[#0a192f]">
              {{ formatKRW(selectedAccount.balance) }}
            </strong>
          </div>
        </div>

        <label for="pacemaker-pull-amount" class="mt-4 block text-xs font-bold text-[#0a192f]">
          채울 금액
        </label>
        <div class="relative mt-2">
          <input
            id="pacemaker-pull-amount"
            :value="formattedPullAmount"
            type="text"
            inputmode="numeric"
            autocomplete="off"
            placeholder="0"
            class="w-full rounded-2xl border-2 border-slate-200 bg-[#f4f8ff] py-4 pl-4 pr-10 text-right text-xl font-black tracking-tight text-[#0a192f] outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
            aria-describedby="pacemaker-pull-help"
            @input="handlePullAmountInput"
          />
          <span
            class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-bold text-slate-400"
            >원</span
          >
        </div>

        <div class="mt-2.5 flex flex-wrap gap-2">
          <button
            v-for="amount in quickAmounts"
            :key="amount"
            type="button"
            class="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-primary transition hover:border-primary hover:bg-primary hover:text-white"
            @click="pullAmount = amount"
          >
            {{ formatKRWCompact(amount) }}
          </button>
        </div>

        <p
          v-if="pullAmount > selectedAccount.balance"
          id="pacemaker-pull-help"
          class="mt-4 rounded-xl border border-pink-200 bg-pink-50 px-3 py-2.5 text-xs font-bold leading-relaxed text-[#be185d]"
          role="alert"
        >
          계좌 잔액보다 큰 금액이에요. {{ formatKRW(selectedAccount.balance) }} 이하로 입력해
          주세요.
        </p>
        <p v-else id="pacemaker-pull-help" class="mt-4 text-xs leading-relaxed text-slate-400">
          선택한 금액만큼 이번 달 부족분을 채우는 계획에 반영돼요.
        </p>

        <div class="mt-5 flex gap-3">
          <button
            type="button"
            class="flex-1 rounded-2xl bg-slate-100 py-3.5 text-sm font-bold text-slate-500 transition hover:bg-slate-200"
            @click="goBack"
          >
            취소
          </button>
          <button
            type="submit"
            class="flex-[2] rounded-2xl bg-primary py-3.5 text-sm font-black text-white shadow-[0_4px_16px_rgba(0,102,255,0.28)] transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-200 disabled:shadow-none"
            :disabled="!isPullAmountValid"
          >
            {{ isPullAmountValid ? `${formatKRW(pullAmount)} 끌어쓰기` : '금액을 입력해 주세요' }}
          </button>
        </div>
      </form>

      <form
        v-else-if="step === 'goal'"
        class="px-6 py-5 sm:px-7"
        @submit.prevent="saveGoalAdjustment"
      >
        <label for="pacemaker-goal-amount" class="block text-xs font-bold text-[#0a192f]"
          >목표 금액</label
        >
        <div class="relative mt-2">
          <input
            id="pacemaker-goal-amount"
            :value="formattedGoalAmount"
            type="text"
            inputmode="numeric"
            autocomplete="off"
            class="w-full rounded-2xl border-2 border-slate-200 bg-[#f4f8ff] py-3.5 pl-4 pr-10 text-right text-base font-black text-[#0a192f] outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
            @input="handleGoalAmountInput"
          />
          <span
            class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-bold text-slate-400"
            >원</span
          >
        </div>

        <label for="pacemaker-goal-date" class="mt-4 block text-xs font-bold text-[#0a192f]"
          >목표 날짜</label
        >
        <input
          id="pacemaker-goal-date"
          v-model="goalDate"
          type="date"
          :min="minimumGoalDate"
          class="mt-2 w-full rounded-2xl border-2 border-slate-200 bg-[#f4f8ff] px-4 py-3.5 text-sm font-bold text-[#0a192f] outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
        />

        <div class="mt-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
          <p class="text-xs leading-relaxed text-slate-600">
            저장하면 새 목표 금액과 날짜를 기준으로 월별 페이스를 다시 계산해요.
          </p>
        </div>

        <p v-if="goalFormError" class="mt-3 text-xs font-bold text-red-600" role="alert">
          {{ goalFormError }}
        </p>

        <div class="mt-5 flex gap-3">
          <button
            type="button"
            class="flex-1 rounded-2xl bg-slate-100 py-3.5 text-sm font-bold text-slate-500 transition hover:bg-slate-200 disabled:opacity-50"
            :disabled="isSubmitting"
            @click="goBack"
          >
            취소
          </button>
          <button
            type="submit"
            class="flex-[2] rounded-2xl bg-primary py-3.5 text-sm font-black text-white shadow-[0_4px_16px_rgba(0,102,255,0.28)] transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-200 disabled:shadow-none"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? '반영하는 중…' : '저장 · 로드맵 반영' }}
          </button>
        </div>
      </form>

      <div v-else class="flex flex-col items-center px-6 py-8 text-center sm:px-7">
        <div
          class="flex size-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl"
          aria-hidden="true"
        >
          <AppIcon :name="successState.icon" size="xl" />
        </div>
        <h4 class="mt-4 text-lg font-black text-[#0a192f]">{{ successState.title }}</h4>
        <p class="mt-2 text-sm leading-relaxed text-slate-500">{{ successState.description }}</p>
        <div class="mt-5 w-full rounded-2xl border border-slate-200 bg-[#f8fbff] px-4 py-3.5">
          <div class="flex items-center justify-between gap-3 text-sm">
            <span class="text-slate-400">{{ successState.detailLabel }}</span>
            <strong class="text-right font-black text-primary">{{
              successState.detailValue
            }}</strong>
          </div>
        </div>
        <button
          type="button"
          class="mt-5 w-full rounded-2xl bg-primary py-3.5 text-sm font-black text-white shadow-[0_4px_16px_rgba(0,102,255,0.28)] transition hover:bg-blue-700"
          @click="closeFlow(false)"
        >
          확인
        </button>
      </div>
    </section>
  </BaseModal>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGoalStore } from '@/features/goal/store/goal.store'
import BaseModal from '@/shared/ui/BaseModal.vue'
import AppIcon from '@/shared/ui/AppIcon.vue'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import { formatKRW, formatKRWCompact } from '@/shared/lib/money'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  goal: { type: Object, required: true },
})

const emit = defineEmits(['update:modelValue', 'goal-adjusted'])

const router = useRouter()
const goalStore = useGoalStore()
const titleId = 'pacemaker-assist-flow-title'
const step = ref('strategy')
const selectedAccount = ref(null)
const pullAmount = ref(0)
const goalAmount = ref(0)
const goalDate = ref('')
const minimumGoalDate = ref('')
const goalFormError = ref('')
const isSubmitting = ref(false)
const shouldRefreshGoal = ref(false)
const successState = ref({
  icon: '✓',
  title: '',
  description: '',
  detailLabel: '',
  detailValue: '',
})

const strategyOptions = Object.freeze([
  {
    id: 'spending',
    icon: '✂️',
    title: '지출 줄이기',
    description: '지출 관리에서 이번 달 소비 내역을 확인하고 직접 조절해요.',
  },
  {
    id: 'pull',
    icon: '💸',
    title: '끌어쓰기',
    description: '다른 여유 통장에서 이번 달 부족한 자금을 채워요.',
  },
  {
    id: 'goal',
    icon: '📅',
    title: '목표 조정하기',
    description: '목표 금액이나 날짜를 수정해서 로드맵을 다시 맞춰요.',
  },
])

const quickAmounts = Object.freeze([50000, 100000, 200000, 300000])
const availableAccounts = computed(() =>
  goalStore.accounts.filter(
    (account) => account.accountType === 'CHECKING' && Number(account.balance) > 0
  )
)
const shortageLabel = computed(() =>
  formatKRW(Math.abs(Number(props.goal?.pace?.differenceAmount ?? 0)))
)
const formattedPullAmount = computed(() =>
  pullAmount.value ? pullAmount.value.toLocaleString('ko-KR') : ''
)
const formattedGoalAmount = computed(() =>
  goalAmount.value ? goalAmount.value.toLocaleString('ko-KR') : ''
)
const isPullAmountValid = computed(
  () => pullAmount.value > 0 && pullAmount.value <= Number(selectedAccount.value?.balance ?? 0)
)
const canGoBack = computed(() => !['strategy', 'success'].includes(step.value))

const eyebrow = computed(() => {
  if (step.value === 'accounts' || step.value === 'amount') return '끌어쓰기'
  if (step.value === 'goal') return '로드맵 반영'
  if (step.value === 'success') return '대응 전략 적용'
  return '대응 방법 선택'
})

const title = computed(() => {
  if (step.value === 'accounts') return '어떤 통장에서 채울까요?'
  if (step.value === 'amount') return '얼마를 채울까요?'
  if (step.value === 'goal') return '목표 조정하기'
  if (step.value === 'success') return '준비가 끝났어요'
  return '어떻게 할까요?'
})

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) resetFlow()
  }
)

function resetFlow() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  step.value = 'strategy'
  selectedAccount.value = null
  pullAmount.value = 0
  goalAmount.value = Number(props.goal?.goalAmount ?? 0)
  goalDate.value = normalizeGoalDate(props.goal?.period?.endDate)
  minimumGoalDate.value = toLocalDate(tomorrow)
  goalFormError.value = ''
  isSubmitting.value = false
  shouldRefreshGoal.value = false
}

function closeFlow(value) {
  if (isSubmitting.value) return
  const isOpen = value === true
  emit('update:modelValue', isOpen)
  if (!isOpen && shouldRefreshGoal.value) {
    shouldRefreshGoal.value = false
    emit('goal-adjusted')
  }
}

async function selectStrategy(strategy) {
  if (strategy === 'spending') {
    emit('update:modelValue', false)
    await router.push({ name: ROUTE_NAMES.SPENDING })
    return
  }

  if (strategy === 'pull') {
    step.value = 'accounts'
    await loadAccounts()
    return
  }

  step.value = 'goal'
}

async function loadAccounts() {
  await goalStore.fetchAccounts('CHECKING').catch(() => undefined)
}

function selectAccount(account) {
  selectedAccount.value = account
  pullAmount.value = 0
  step.value = 'amount'
}

function handlePullAmountInput(event) {
  const digitsOnly = event.target.value.replace(/[^0-9]/g, '')
  pullAmount.value = digitsOnly ? Number(digitsOnly) : 0
}

function handleGoalAmountInput(event) {
  const digitsOnly = event.target.value.replace(/[^0-9]/g, '')
  goalAmount.value = digitsOnly ? Number(digitsOnly) : 0
}

function confirmPull() {
  if (!isPullAmountValid.value) return

  successState.value = {
    icon: '💸',
    title: '부족분을 채울 준비가 됐어요',
    description: `${selectedAccount.value.accountName}에서 끌어쓸 금액을 확인했어요.`,
    detailLabel: '끌어쓸 금액',
    detailValue: formatKRW(pullAmount.value),
  }
  step.value = 'success'
}

async function saveGoalAdjustment() {
  goalFormError.value = ''

  if (!Number.isFinite(goalAmount.value) || goalAmount.value < 10000) {
    goalFormError.value = '목표 금액을 10,000원 이상으로 입력해 주세요.'
    return
  }
  if (goalAmount.value < Number(props.goal?.currentAmount ?? 0)) {
    goalFormError.value = '목표 금액은 현재 모인 금액보다 작게 설정할 수 없어요.'
    return
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(goalDate.value) || goalDate.value < minimumGoalDate.value) {
    goalFormError.value = '목표 날짜는 내일 이후로 선택해 주세요.'
    return
  }

  isSubmitting.value = true
  try {
    await goalStore.updateGoal(props.goal.goalId, {
      goalAmount: goalAmount.value,
      goalDate: goalDate.value,
      status: props.goal.status === 'PAUSED' ? 'PAUSED' : 'ACTIVE',
    })

    successState.value = {
      icon: '📅',
      title: '새 계획을 로드맵에 반영했어요',
      description: '변경한 목표를 기준으로 앞으로의 페이스를 이어가요.',
      detailLabel: '새 목표',
      detailValue: `${formatKRW(goalAmount.value)} · ${formatDate(goalDate.value)}`,
    }
    shouldRefreshGoal.value = true
    step.value = 'success'
  } catch (error) {
    goalFormError.value = error?.message ?? '목표를 수정하지 못했어요. 잠시 후 다시 시도해 주세요.'
  } finally {
    isSubmitting.value = false
  }
}

function goBack() {
  goalFormError.value = ''
  if (step.value === 'amount') {
    step.value = 'accounts'
    return
  }
  step.value = 'strategy'
}

function normalizeGoalDate(value) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value ?? '')) return value
  if (!/^\d{4}-\d{2}$/.test(value ?? '')) return ''

  const [year, month] = value.split('-').map(Number)
  const lastDay = new Date(year, month, 0).getDate()
  return `${value}-${String(lastDay).padStart(2, '0')}`
}

function toLocalDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDate(value) {
  return value.replaceAll('-', '.')
}
</script>
