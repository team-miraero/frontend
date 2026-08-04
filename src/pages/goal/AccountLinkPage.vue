<!-- 계좌·저금통 연결 페이지 (GOAL-04) -->
<template>
  <HeroBackground class="font-['Noto_Sans_KR',sans-serif]">
    <StepHeader @back="handleBack" />

    <div class="relative z-10 mx-auto w-full max-w-[650px] animate-fade-in-up px-4 pb-40 pt-2">
      <span
        v-if="selectedGoal"
        class="inline-flex items-center gap-1.5 rounded-2xl bg-accent-light px-3 py-1 text-xs font-semibold text-primary"
      >
        <svg
          v-if="selectedGoalId === 'INDEPENDENCE'"
          class="h-3.5 w-3.5 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <svg
          v-else-if="selectedGoalId === 'EMERGENCY'"
          class="h-3.5 w-3.5 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <svg
          v-else-if="selectedGoalId === 'MARRIAGE'"
          class="h-3.5 w-3.5 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <svg
          v-else-if="selectedGoalId === 'STUDENT_LOAN'"
          class="h-3.5 w-3.5 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 14v6.5" />
        </svg>
        <span>{{ selectedGoal?.title }}</span>
      </span>

      <h1 class="mt-4 text-[30px] font-bold leading-tight text-gray-900">
        이 목표, 어디에<br />모을까요?
      </h1>
      <p class="mt-2 text-sm text-gray-500">
        목표 전용 공간을 정해야 진행률을 정확하게 추적할 수 있어요.
      </p>

      <LoadingSpinner v-if="areAccountsLoading" message="연결 가능한 계좌를 불러오고 있어요" />

      <div
        v-else-if="accountsError"
        class="mt-6 flex min-h-[300px] flex-col items-center justify-center rounded-[18px] border border-gray-200 bg-white px-6 text-center"
      >
        <div class="flex size-11 items-center justify-center rounded-full bg-red-50 text-red-500">
          !
        </div>
        <p class="mt-3 text-[15px] font-black text-gray-900">계좌 정보를 불러오지 못했어요</p>
        <p class="mt-1 text-[13px] text-gray-400">잠시 후 다시 시도해 주세요.</p>
        <button
          type="button"
          class="mt-4 rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-white"
          @click="loadAccounts"
        >
          다시 시도
        </button>
      </div>

      <template v-else>
      <div class="mt-6 space-y-3">
        <AccountOptionCard
          title="저금통 만들기"
          description="없으면 클릭 한 번으로 가벼운 목표 제금통을 만들어요. 부담 없이 시작하고, 나중에 이자 붙는 KB 목표적금으로 바꿀 수 있어요."
          recommended
          :tags="['별도 서류 없음', '1분 이내 완성', '목표 전용 보관']"
          :selected="mode === 'moneybox'"
          @select="mode = 'moneybox'"
        >
          <template #icon>
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.4122 4.58203C16.0376 4.58203 14.8462 5.86505 14.6629 6.41491C11.4553 5.04025 4.58203 6.13998 4.58203 10.9971C4.58203 12.6467 4.58203 13.7464 6.41491 15.1211V18.3287H10.0807V16.4958H12.83V18.3287H16.4958V14.6629C17.4122 14.2047 18.0537 13.7464 18.3287 12.83H20.1615V9.16424H18.3287C18.3287 8.2478 17.8704 7.78958 17.4122 7.33136V4.58203Z"
                stroke="#94A3B8"
                stroke-width="1.83288"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M1.83203 8.24805V9.16449C1.83203 10.1726 2.65683 10.9974 3.66491 10.9974H4.58136"
                stroke="#94A3B8"
                stroke-width="1.83288"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.6641 10.0811H14.6741"
                stroke="#94A3B8"
                stroke-width="1.83288"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </template>

          <div>
            <div class="flex items-center justify-between">
              <p class="text-sm font-semibold text-gray-900">자동이체 설정</p>
              <span class="text-xs text-gray-400">설정해두면 매달 자동으로 저축돼요</span>
            </div>

            <div class="mt-3">
              <div class="flex items-center justify-between">
                <label for="transfer-amount" class="text-xs font-medium text-gray-500"
                  >월 이체 금액</label
                >
                <span
                  class="rounded-full bg-accent-light px-2 py-0.5 text-[11px] font-semibold text-primary"
                >
                  실현가능성 기준 자동입력
                </span>
              </div>
              <div class="mt-1.5 flex items-center rounded-xl border border-gray-200 px-4 py-3">
                <input
                  id="transfer-amount"
                  type="text"
                  inputmode="numeric"
                  :value="formattedTransferAmount"
                  class="w-full bg-transparent text-lg font-bold text-gray-900 outline-none"
                  @input="handleTransferAmountInput"
                />
                <span class="shrink-0 text-sm text-gray-400">원</span>
              </div>
              <p v-if="transferAmount > 0" class="mt-1 text-xs text-primary">
                = {{ formatKRWCompact(transferAmount) }}/월
              </p>
            </div>

            <div class="mt-4">
              <div class="flex items-center justify-between">
                <span class="text-xs font-medium text-gray-500">이체 날짜</span>
                <span class="text-xs text-gray-400">급여일 다음 날 추천</span>
              </div>
              <div class="mt-1.5 grid grid-cols-5 gap-2">
                <button
                  v-for="day in TRANSFER_DAYS"
                  :key="day"
                  type="button"
                  class="rounded-xl border py-2 text-sm font-medium transition-colors"
                  :class="
                    transferDay === day
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  "
                  @click="transferDay = day"
                >
                  {{ day }}일
                </button>
              </div>
            </div>

            <div class="mt-4">
              <span class="text-xs font-medium text-gray-500">출금 계좌</span>
              <div class="mt-1.5 space-y-2">
                <AccountListItem
                  v-for="account in checkingAccounts"
                  :key="account.accountId"
                  :label="`${account.accountName} ${account.maskedAccountNumber}`"
                  :sublabel="
                    account.accountId === checkingAccounts[0]?.accountId ? '급여 계좌' : ''
                  "
                  :selected="selectedWithdrawalAccountId === account.accountId"
                  @select="selectedWithdrawalAccountId = account.accountId"
                />
              </div>
              <p v-if="selectedWithdrawalAccount" class="mt-2 text-xs text-gray-400">
                매달 {{ transferDay }}일에 {{ selectedWithdrawalAccount.accountName }}
                {{ selectedWithdrawalAccount.maskedAccountNumber }}에서 출금돼요
              </p>
            </div>
          </div>
        </AccountOptionCard>

        <AccountOptionCard
          title="기존 저축 계좌 연결"
          description="이미 이 목표용 적금·저축이 있다면 연결하세요. 기존 이율 그대로, 마이데이터로 잔액을 추적해요."
          :selected="mode === 'account'"
          @select="mode = 'account'"
        >
          <template #icon>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-5 w-5"
            >
              <rect x="3" y="6" width="18" height="13" rx="2" />
              <path d="M3 10h18" />
            </svg>
          </template>

          <div>
            <span class="text-xs font-medium text-gray-500">마이데이터 계좌 목록</span>
            <div class="mt-1.5 space-y-2">
              <AccountListItem
                v-for="account in savingAccounts"
                :key="account.accountId"
                :label="`${account.accountName} ${account.maskedAccountNumber}`"
                :sublabel="`잔액 ${formatKRWCompact(account.balance)} · 연 ${account.interestRate}%`"
                multiple
                :selected="selectedExistingAccountIds.includes(account.accountId)"
                @select="toggleExistingAccount(account.accountId)"
              />
            </div>
          </div>
        </AccountOptionCard>
      </div>

      <p class="mt-4 flex items-start gap-1.5 text-xs leading-relaxed text-gray-400">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="mt-0.5 h-3.5 w-3.5 shrink-0"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5" />
          <path d="M12 8h.01" />
        </svg>
        <span>
          한 계좌·저금통은 한 목표 전용이에요. 목표들의 색이 섞이지 않도록 각 목표마다 별도 공간을
          사용해요.
        </span>
      </p>

      <div
        v-if="OTHER_ACTIVE_GOAL"
        class="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
        >
          <path
            d="m10.29 3.86-8.02 13.9A1.5 1.5 0 0 0 3.5 20h17a1.5 1.5 0 0 0 1.23-2.24l-8.02-13.9a1.5 1.5 0 0 0-2.44 0Z"
          />
          <path d="M12 9v4" />
          <path d="M12 16h.01" />
        </svg>
        <div>
          <p class="text-xs font-bold text-amber-700">다른 진행 중인 목표가 있어요</p>
          <p class="mt-0.5 text-xs text-amber-600">
            현재 진행중인 목표: {{ OTHER_ACTIVE_GOAL.label }}(월
            {{ formatKRWCompact(OTHER_ACTIVE_GOAL.monthlyAmount) }})
          </p>
        </div>
      </div>
      </template>
    </div>

    <p v-if="submitError" class="mx-auto w-full max-w-[650px] px-4 text-center text-xs text-red-500">
      {{ submitError }}
    </p>
    <BottomCTA
      v-if="!areAccountsLoading && !accountsError"
      :label="ctaLabel"
      :disabled="ctaDisabled"
      @click="handleSubmit"
    />
  </HeroBackground>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import HeroBackground from '@/shared/ui/HeroBackground.vue'
import StepHeader from '@/shared/ui/StepHeader.vue'
import BottomCTA from '@/shared/ui/BottomCTA.vue'
import LoadingSpinner from '@/shared/ui/LoadingSpinner.vue'
import AccountOptionCard from '@/shared/ui/AccountOptionCard.vue'
import AccountListItem from '@/shared/ui/AccountListItem.vue'
import { useGoalStore } from '@/features/goal'
import { GOAL_PRESETS } from '@/features/goal/constants/goal.constants.js'
import { GOAL_API_TYPE_BY_PRESET_ID } from '@/features/goal/constants/goalApiType.js'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import { formatKoreanNumber, formatKRWCompact } from '@/shared/lib/money'

const TRANSFER_DAYS = [5, 10, 15, 20, 25]

// TODO: 실제 "다른 진행 중인 목표 조회" API 연동 전까지 사용하는 mock 데이터
const OTHER_ACTIVE_GOAL = { label: '비상금 목돈', monthlyAmount: 200000 }

const router = useRouter()
const goalStore = useGoalStore()
const { selectedGoalId, goalParams, feasibility, accounts, areAccountsLoading, accountsError } =
  storeToRefs(goalStore)

const selectedGoal = computed(() => GOAL_PRESETS.find((preset) => preset.id === selectedGoalId.value))

const mode = ref('moneybox')
const transferAmount = ref(0)
const transferDay = ref(10)

const formattedTransferAmount = computed(() => formatKoreanNumber(transferAmount.value))

function handleTransferAmountInput(event) {
  const digitsOnly = event.target.value.replace(/[^0-9]/g, '')
  transferAmount.value = digitsOnly ? Number(digitsOnly) : 0
}
const selectedWithdrawalAccountId = ref(null)
const selectedExistingAccountIds = ref([])

const checkingAccounts = computed(() =>
  accounts.value.filter((account) => account.accountType === 'CHECKING')
)
const savingAccounts = computed(() =>
  accounts.value.filter((account) => account.accountType !== 'CHECKING')
)
const selectedWithdrawalAccount = computed(() =>
  checkingAccounts.value.find((account) => account.accountId === selectedWithdrawalAccountId.value)
)

function toggleExistingAccount(accountId) {
  selectedExistingAccountIds.value = selectedExistingAccountIds.value.includes(accountId)
    ? selectedExistingAccountIds.value.filter((id) => id !== accountId)
    : [...selectedExistingAccountIds.value, accountId]
}

async function loadAccounts() {
  try {
    const { accounts: fetchedAccounts } = await goalStore.fetchAccounts()
    selectedWithdrawalAccountId.value =
      fetchedAccounts.find((account) => account.accountType === 'CHECKING')?.accountId ?? null
    const firstSavingAccountId = fetchedAccounts.find(
      (account) => account.accountType !== 'CHECKING'
    )?.accountId
    selectedExistingAccountIds.value = firstSavingAccountId ? [firstSavingAccountId] : []
  } catch {
    // accountsError는 store에서 세팅됨. 화면은 아래 재시도 블록으로 안내.
  }
}

onMounted(async () => {
  if (!goalParams.value) {
    goalParams.value = { amount: 12400000, months: 24, startAmount: 0 }
  }

  const defaultTransfer =
    feasibility.value?.requiredMonthly ||
    goalParams.value?.loanResult?.monthlyPayment ||
    525866
  transferAmount.value = defaultTransfer

  await loadAccounts()
})

const isSubmitting = ref(false)
const submitError = ref('')

const ctaLabel = computed(() => {
  if (isSubmitting.value) return '만드는 중...'
  return mode.value === 'moneybox' ? '저금통 만들고 시작하기' : '연결하고 시작하기'
})
const ctaDisabled = computed(() => {
  if (isSubmitting.value) return true
  return mode.value === 'moneybox'
    ? !selectedWithdrawalAccountId.value || !transferAmount.value || transferAmount.value <= 0
    : selectedExistingAccountIds.value.length === 0
})

function handleBack() {
  router.push({ name: ROUTE_NAMES.GOAL_FEASIBILITY })
}

async function handleSubmit() {
  isSubmitting.value = true
  submitError.value = ''
  try {
    const result = await goalStore.submitGoalCreation({
      goalName: selectedGoal.value?.title,
      goalType: GOAL_API_TYPE_BY_PRESET_ID[selectedGoalId.value],
      goalAmount: goalParams.value.amount,
      goalMonths: goalParams.value.months,
      startAmount: goalParams.value.startAmount,
      moneyBox:
        mode.value === 'moneybox'
          ? {
              type: 'GOAL',
              name: `${selectedGoal.value?.title ?? '목표'} 저금통`,
              amount: transferAmount.value,
              transferDay: transferDay.value,
              withdrawalAccountId: selectedWithdrawalAccountId.value,
            }
          : null,
      existingAccountIds: mode.value === 'account' ? selectedExistingAccountIds.value : [],
    })

    if (result && result.goalId) {
      router.push({ name: ROUTE_NAMES.DASHBOARD_GOAL, params: { goalId: result.goalId } })
    } else {
      router.push({ name: ROUTE_NAMES.DASHBOARD })
    }
  } catch (error) {
    console.error('Failed to submit goal creation:', error)
    submitError.value = '목표 생성에 실패했어요. 잠시 후 다시 시도해 주세요.'
    router.push({ name: ROUTE_NAMES.DASHBOARD })
  } finally {
    isSubmitting.value = false
  }
}
</script>
