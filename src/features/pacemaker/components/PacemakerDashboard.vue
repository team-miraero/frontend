<template>
  <div class="page-container-narrow pb-10 pt-3 sm:pb-14 sm:pt-6 flex flex-col gap-4 sm:gap-6">
    <div class="flex items-center justify-between gap-2.5 sm:gap-4">
      <div class="min-w-0 flex-1">
        <h2 class="text-xl font-bold tracking-tight text-[#0a192f] whitespace-nowrap sm:text-2xl">
          오늘까지 모인 여유자금
        </h2>
      </div>
      <button
        type="button"
        class="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 sm:px-4 sm:py-2 cursor-pointer select-none"
        @click="$emit('edit-max-amount')"
      >
        ⚙ 상한선 수정
      </button>
    </div>

    <section
      class="relative overflow-hidden rounded-[24px] px-6 py-6 text-white shadow-[0_12px_40px_rgba(0,102,255,0.22)] sm:px-7"
      style="background: linear-gradient(135deg, #0066ff 0%, #66b2ff 100%)"
      aria-labelledby="pacemaker-balance-title"
    >
      <span
        class="pointer-events-none absolute right-0 top-0 size-40 translate-x-[30%] -translate-y-[30%] rounded-full bg-white/10"
        aria-hidden="true"
      />
      <span
        class="pointer-events-none absolute -bottom-16 right-28 size-32 rounded-full border-[18px] border-white/10"
        aria-hidden="true"
      />

      <div class="relative z-[1]">
        <div class="flex flex-wrap items-center gap-2">
          <p id="pacemaker-balance-title" class="text-sm font-bold text-white/80">
            페이스메이커 전용 저금통
            <span v-if="pacemaker.maskedAccountNumber" class="ml-1 font-medium text-white/60">
              {{ pacemaker.maskedAccountNumber }}
            </span>
          </p>
          <span class="rounded-full bg-white/20 px-2 py-1 text-[10px] font-bold">
            자동저축 {{ isActive ? 'ON' : 'OFF' }}
          </span>
        </div>
        <p class="mt-1 text-[34px] font-bold tracking-tight sm:text-[36px]">
          {{ formatNumber(pacemaker.moneyBoxBalance) }}<span class="ml-1 text-xl">원</span>
        </p>
        <p class="mt-1 text-xs text-white/70">
          오늘 자동 저축: +{{ formatNumber(pacemaker.todaySavingAmount) }}원
        </p>

        <div class="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
          <span
            class="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold"
          >
            <svg
              class="size-3"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M2.7 9.3 9.3 2.5 8 6.7h5.3l-6.6 6.8L8 9.3H2.7Z" />
            </svg>
            연속 {{ formatNumber(pacemaker.currentStreak) }}일 저축 중
          </span>
          <span class="rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold">
            하루 상한선 {{ formatNumber(pacemaker.maxAmount) }}원/일
          </span>
        </div>
      </div>
    </section>

    <section
      class="rounded-[20px] border border-slate-200 bg-white px-4 py-4 sm:px-6 sm:py-5 shadow-xs"
      aria-labelledby="streak-title"
    >
      <div class="mb-4 flex flex-col gap-1">
        <!-- 상단 헤더 행: 타이틀/전환 버튼 + 연속 일수 뱃지 수직 중앙 정렬 -->
        <div class="flex items-center justify-between gap-2">
          <button
            type="button"
            class="group inline-flex min-w-0 items-center gap-1.5 sm:gap-2 text-left outline-none cursor-pointer select-none"
            :aria-label="isMonthlyStreak ? '주간 스트릭 보기로 전환' : '월간 달력 보기로 전환'"
            @click="isMonthlyStreak = !isMonthlyStreak"
          >
            <h3 id="streak-title" class="truncate text-sm sm:text-base font-bold text-[#0a192f] transition-colors group-hover:text-primary">
              {{ isMonthlyStreak ? '이번 달 자동 저축 달력' : '이번 주 자동 저축 스트릭' }}
            </h3>
            <span
              class="flex size-5 sm:size-6 shrink-0 items-center justify-center rounded-full bg-slate-100/90 text-slate-500 transition-all duration-200 group-hover:bg-primary/10 group-hover:text-primary shadow-2xs"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                class="size-3 sm:size-3.5 transition-transform duration-200"
                :class="isMonthlyStreak ? 'rotate-180 text-primary' : ''"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </button>

          <!-- 🔥 연속 일수 뱃지 -->
          <span
            class="shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold shadow-2xs whitespace-nowrap transition-colors"
            :class="
              pacemaker.currentStreak > 0
                ? 'bg-orange-50 border border-orange-200/80 text-orange-600'
                : 'bg-slate-100 border border-slate-200/80 text-slate-500'
            "
          >
            <!-- 선명한 듀오톤 SVG 불꽃 -->
            <svg
              v-if="pacemaker.currentStreak > 0"
              class="size-3.5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 22C16.4183 22 20 18.4183 20 14C20 10.5 17.5 7.5 15 4C15 7 13.5 8 12.5 9C11.5 6 9 3 9 2C5.5 6.5 4 10 4 14C4 18.4183 7.58172 22 12 22Z"
                fill="#FF6B00"
              />
              <path
                d="M12 20C14.2091 20 16 18.2091 16 16C16 13.8 14.5 12 13 10.5C12.5 12 11.5 12.5 11 13C10.5 11.5 9 10 9 9.5C7.5 11.5 7 13.5 7 16C7 18.2091 8.79086 20 12 20Z"
                fill="#FFD233"
              />
            </svg>
            <svg
              v-else
              class="size-3.5 shrink-0 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M12 22c4 0 7-3 7-7 0-3-2-6-5-9 0 3-1 4-2 5-1-3-3-5-5-7 1 5-2 7-2 11 0 4 3 7 7 7Z" />
            </svg>
            <span>{{ formatNumber(pacemaker.currentStreak) }}일 연속</span>
          </span>
        </div>

        <!-- 하단 안내 문구 -->
        <p class="text-[11px] font-medium text-slate-400">
          {{ isMonthlyStreak ? '클릭하여 주간 스트릭으로 접기' : '클릭하여 월간 달력으로 펼치기' }} · {{ formatTodayLabel }} 기준
        </p>
      </div>

      <div v-if="!isMonthlyStreak" class="grid grid-cols-7 gap-1.5 sm:gap-2">
        <div v-for="day in weekDays" :key="day.label" class="flex flex-col items-center gap-1 sm:gap-1.5">
          <div
            class="flex size-8 sm:size-10 items-center justify-center rounded-full text-xs font-bold transition-all duration-150"
            :class="
              day.status === 'SUCCESS'
                ? 'bg-primary text-white shadow-xs scale-105'
                : 'bg-slate-100 text-slate-300'
            "
          >
            <svg
              v-if="day.status === 'SUCCESS'"
              class="size-3.5 sm:size-4 stroke-[3]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span v-else class="font-bold text-xs">—</span>
          </div>
          <span
            class="text-[11px] sm:text-xs font-bold"
            :class="day.status === 'SUCCESS' ? 'text-[#0a192f]' : 'text-slate-400'"
          >
            {{ day.label }}
          </span>
        </div>
      </div>
      <div v-else class="flex flex-col gap-2.5">
        <div class="grid grid-cols-7 gap-1.5 text-center text-[11px] font-medium text-slate-400">
          <span v-for="label in WEEKDAY_LABELS" :key="label">{{ label }}</span>
        </div>
        <div class="grid grid-cols-7 gap-x-1.5 gap-y-3">
          <span v-for="(day, index) in monthDays" :key="day?.date ?? `empty-${index}`">
            <span
              v-if="day"
              class="mx-auto flex size-7 items-center justify-center rounded-full text-[10px] font-bold transition-all"
              :class="monthDayClass(day)"
            >
              {{ day.day }}
            </span>
          </span>
        </div>
      </div>

      <div class="mt-4 flex items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-100 pt-3">
        <span>{{ monthLabel }} 자동 저축</span>
        <span class="font-bold text-primary">{{ formatNumber(monthlySuccessCount) }}회 성공</span>
      </div>
    </section>

    <section aria-labelledby="goal-accounts-title">
      <h3 id="goal-accounts-title" class="mb-2.5 px-0.5 text-base font-bold text-[#0a192f] sm:text-lg">
        목표별 입금 자산
      </h3>
      <div
        v-if="pacemakerStore.depositTargetsError"
        class="rounded-[18px] border border-red-200 bg-red-50 px-5 py-6 text-center"
        role="alert"
      >
        <p class="text-sm font-bold text-red-600">입금 대상을 불러오지 못했어요.</p>
        <button
          type="button"
          class="mt-3 rounded-full border border-red-200 bg-white px-4 py-2 text-xs font-bold text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="pacemakerStore.isDepositTargetsLoading"
          @click="retryDepositTargets"
        >
          {{ pacemakerStore.isDepositTargetsLoading ? '불러오는 중...' : '다시 시도' }}
        </button>
      </div>
      <div
        v-else-if="pacemakerStore.isDepositTargetsLoading"
        class="rounded-[18px] border border-slate-200 bg-white px-5 py-8 text-center text-sm text-slate-400"
        role="status"
      >
        입금 대상을 불러오는 중이에요.
      </div>
      <div v-else-if="accountGroups.length" class="flex flex-col gap-3">
        <article
          v-for="group in accountGroups"
          :key="group.goalId"
          class="flex flex-col gap-3 rounded-[18px] border border-slate-200 bg-white px-4 py-4 sm:px-5 shadow-xs"
        >
          <div class="flex items-center justify-between gap-3">
            <div class="flex min-w-0 items-center gap-3">
              <div
                class="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#F2F4F6] text-primary"
              >
                <GoalTypeIcon :goal-type="group.goalType" />
              </div>
              <div class="min-w-0">
                <p class="truncate text-sm font-bold text-[#0a192f]">{{ group.goalName }}</p>
                <p class="truncate text-xs text-slate-400">
                  목표에 바로 입금돼요
                </p>
              </div>
            </div>
            <button
              type="button"
              class="shrink-0 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white shadow-[0_3px_10px_rgba(0,102,255,0.2)] transition hover:bg-[#0055dd] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              :disabled="!pacemaker.moneyBoxBalance || !selectedDepositAsset(group)?.assetId"
              @click="openDeposit(group)"
            >
              입금하기
            </button>
          </div>

          <button
            type="button"
            class="rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-2.5 text-left disabled:cursor-default"
            :disabled="(group.depositAssets?.length ?? 0) < 2"
            :aria-expanded="expandedGoalId === group.goalId"
            @click="toggleAssetList(group.goalId)"
          >
            <span class="flex items-center justify-between gap-2">
              <span class="truncate text-xs text-slate-400">
                {{ depositAssetName(selectedDepositAsset(group)) }}
              </span>
              <span v-if="(group.depositAssets?.length ?? 0) > 1" class="text-xs text-slate-400">
                {{ expandedGoalId === group.goalId ? '⌃' : '⌄' }}
              </span>
            </span>
            <span class="mt-0.5 block text-sm font-bold text-primary">
              {{ formatCompactWon(selectedDepositAsset(group)?.balance) }}
            </span>
          </button>

          <div v-if="expandedGoalId === group.goalId" class="grid gap-2">
            <button
              v-for="asset in selectableAssets(group)"
              :key="`${asset.assetType}-${asset.assetId}`"
              type="button"
              class="w-full rounded-xl border border-[#edf2ff] bg-white px-3 py-2.5 text-left"
              @click="selectDepositAsset(group.goalId, asset)"
            >
              <span class="block truncate text-xs text-slate-400">
                {{ depositAssetName(asset) }}
              </span>
              <span class="mt-0.5 block text-sm font-bold text-primary">
                {{ formatCompactWon(asset.balance) }}
              </span>
            </button>
          </div>
        </article>
      </div>
      <div
        v-else
        class="rounded-[18px] border border-dashed border-slate-300 bg-white px-5 py-8 text-center text-sm text-slate-400"
      >
        입금할 수 있는 목표 자산이 아직 없어요.
      </div>
    </section>

    <section
      class="rounded-[20px] border border-slate-200 bg-white px-5 py-5 sm:px-6"
      aria-labelledby="history-title"
    >
      <h3 id="history-title" class="mb-4 text-sm font-bold text-[#0a192f]">
        이번 달 자동 저축 내역
      </h3>
      <div
        v-if="pacemakerStore.historiesError"
        class="rounded-xl border border-red-200 bg-red-50 px-5 py-6 text-center"
        role="alert"
      >
        <p class="text-sm font-bold text-red-600">자동 저축 내역을 불러오지 못했어요.</p>
        <button
          type="button"
          class="mt-3 rounded-full border border-red-200 bg-white px-4 py-2 text-xs font-bold text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="pacemakerStore.isHistoriesLoading"
          @click="retryHistories"
        >
          {{ pacemakerStore.isHistoriesLoading ? '불러오는 중...' : '다시 시도' }}
        </button>
      </div>
      <p
        v-else-if="pacemakerStore.isHistoriesLoading"
        class="py-6 text-center text-sm text-slate-400"
        role="status"
      >
        자동 저축 내역을 불러오는 중이에요.
      </p>
      <div v-else-if="recentHistories.length" class="divide-y divide-slate-100">
        <div
          v-for="item in recentHistories"
          :key="item.date"
          class="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
        >
          <div class="min-w-0">
            <p class="text-xs font-bold text-[#0a192f]">{{ formatHistoryDate(item.date) }}</p>
            <p class="mt-0.5 truncate text-xs text-slate-400">{{ describeHistory(item) }}</p>
          </div>
          <span
            class="shrink-0 text-sm font-bold"
            :class="item.status === 'SAVED' ? 'text-primary' : 'text-slate-300'"
          >
            {{ item.status === 'SAVED' ? `+${formatNumber(item.amount)}원` : '—' }}
          </span>
        </div>
      </div>
      <p v-else class="py-6 text-center text-sm text-slate-400">아직 자동 저축 내역이 없어요.</p>
    </section>

    <PacemakerDepositModal
      v-model="isDepositModalOpen"
      :target="selectedDepositTarget"
      :available-balance="pacemaker.moneyBoxBalance"
      :is-submitting="isDepositing"
      :error-message="depositErrorMessage"
      @deposit="handleDeposit"
    />
    <PacemakerDepositSuccessModal
      v-model="isDepositSuccessModalOpen"
      :target="selectedDepositTarget"
      :amount="depositedAmount"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { usePacemakerStore } from '@/features/pacemaker/store/pacemaker.store'
import { usePacemakerDeposit } from '@/features/pacemaker/composables/usePacemakerDeposit'
import PacemakerDepositModal from '@/features/pacemaker/components/PacemakerDepositModal.vue'
import PacemakerDepositSuccessModal from '@/features/pacemaker/components/PacemakerDepositSuccessModal.vue'
import { useModal } from '@/shared/composables/useModal'
import { getLocalDateKey } from '@/shared/lib/date'
import GoalTypeIcon from '@/shared/ui/GoalTypeIcon.vue'

defineEmits(['edit-max-amount'])

const DAY_OF_WEEK_LABEL = {
  MONDAY: '월',
  TUESDAY: '화',
  WEDNESDAY: '수',
  THURSDAY: '목',
  FRIDAY: '금',
  SATURDAY: '토',
  SUNDAY: '일',
}
const WEEKDAY_LABELS = ['월', '화', '수', '목', '금', '토', '일']

const pacemakerStore = usePacemakerStore()
const {
  selectedDepositTarget,
  depositedAmount,
  isDepositing,
  depositErrorMessage,
  openDeposit: openDepositTarget,
  submitDeposit,
  retryDepositTargets,
  retryHistories,
} = usePacemakerDeposit()
const selectedAssetIds = ref({})
const expandedGoalId = ref(null)
const isMonthlyStreak = ref(false)
const { isOpen: isDepositModalOpen, open: openDepositModal } = useModal()
const { isOpen: isDepositSuccessModalOpen, open: openDepositSuccessModal } = useModal()

const pacemaker = computed(() => pacemakerStore.pacemakerView)
const isActive = computed(() => pacemaker.value.status === 'ACTIVE')
const recentHistories = computed(() => pacemakerStore.histories.slice(0, 5))
const weeklyStreak = computed(() => pacemaker.value.weeklyStreak ?? [])
// 서버는 오늘 날짜를 별도로 내려주지 않으므로 로컬 오늘 날짜를 기준일로 쓴다.
const referenceDate = computed(() => getLocalDateKey(new Date()))
const weekDays = computed(() => {
  const byDay = new Map(weeklyStreak.value.map((day) => [day.dayOfWeek, day]))
  return ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map(
    (dayOfWeek) => ({
      ...byDay.get(dayOfWeek),
      // 서버는 saved(boolean)로 내려주므로 기존 화면 로직이 쓰는 SUCCESS/FAIL 표기로 맞춘다.
      status: byDay.get(dayOfWeek)?.saved ? 'SUCCESS' : 'FAIL',
      label: DAY_OF_WEEK_LABEL[dayOfWeek],
    })
  )
})
const monthDays = computed(() => {
  const [year, month] = referenceDate.value.split('-').map(Number)
  const lastDay = new Date(year, month, 0).getDate()
  const savedDates = new Set(
    pacemakerStore.histories.filter((item) => item.status === 'SAVED').map((item) => item.date)
  )
  const days = Array.from({ length: lastDay }, (_, index) => {
    const day = index + 1
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return {
      day,
      date,
      status: savedDates.has(date) ? 'SUCCESS' : 'FAIL',
      isToday: date === referenceDate.value,
      isFuture: date > referenceDate.value,
    }
  })
  const firstDay = new Date(year, month - 1, 1).getDay()
  const mondayOffset = firstDay === 0 ? 6 : firstDay - 1
  return [...Array(mondayOffset).fill(null), ...days]
})
const formatTodayLabel = computed(() => {
  const [, month, day] = referenceDate.value.split('-')
  return `${month}월 ${day}일`
})
const monthLabel = computed(() => `${referenceDate.value.split('-')[1]}월`)
const monthlySuccessCount = computed(() => pacemaker.value.monthlySuccessCount)

const accountGroups = computed(() => pacemakerStore.depositTargets)

// 계좌/저금통은 별도 ID 체계라 assetId만으로는 충돌할 수 있어 assetType까지 묶어 키로 쓴다.
function assetKey(asset) {
  return asset ? `${asset.assetType}-${asset.assetId}` : null
}

function selectedDepositAsset(group) {
  const selectedKey = selectedAssetIds.value[group.goalId]
  return (
    group.depositAssets?.find((asset) => assetKey(asset) === selectedKey) ??
    group.depositAssets?.[0]
  )
}

function selectableAssets(group) {
  const selectedKey = assetKey(selectedDepositAsset(group))
  return group.depositAssets?.filter((asset) => assetKey(asset) !== selectedKey) ?? []
}

// 왼쪽 카드에 표시할 계좌명을 계좌 상세 API(/accounts/{accountId})에서 조회해 캐시해둠
watch(
  accountGroups,
  (groups) => {
    groups.forEach((group) => {
      group.depositAssets?.forEach((asset) => {
        if (asset.assetType === 'ACCOUNT' && asset.assetId) {
          pacemakerStore.fetchAccountDetail(asset.assetId)
        }
      })
    })
  },
  { immediate: true }
)

// LOAN/ACCOUNT/MONEY_BOX가 같은 숫자 assetId 공간을 공유할 수 있어(서버 스펙 확인됨),
// ACCOUNT 전용 캐시(accountDetails)는 assetType이 ACCOUNT일 때만 조회한다.
function depositAssetName(asset) {
  if (!asset) return '입금 자산'
  if (asset.assetType === 'MONEY_BOX') return '저금통'
  if (asset.assetType === 'LOAN') return asset.financialInstitutionName ?? '대출 계좌'
  const accountName = pacemakerStore.accountDetails[asset.assetId]?.accountName
  return accountName ?? asset.financialInstitutionName ?? '입금 계좌'
}

function toggleAssetList(goalId) {
  expandedGoalId.value = expandedGoalId.value === goalId ? null : goalId
}

function selectDepositAsset(goalId, asset) {
  selectedAssetIds.value = { ...selectedAssetIds.value, [goalId]: assetKey(asset) }
  expandedGoalId.value = null
}

function openDeposit(group) {
  openDepositTarget(group, selectedDepositAsset(group))
  openDepositModal()
}

function handleDeposit(payload) {
  submitDeposit(payload, () => {
    isDepositModalOpen.value = false
    openDepositSuccessModal()
  })
}

function formatNumber(amount) {
  return Number(amount ?? 0).toLocaleString('ko-KR')
}

function formatCompactWon(amount) {
  const value = Number(amount ?? 0)
  if (value >= 100000000) return `${Math.round(value / 10000000) / 10}억원`
  if (value >= 10000) return `${Math.round(value / 1000) / 10}만원`
  return `${formatNumber(value)}원`
}

function formatHistoryDate(isoDate) {
  if (!isoDate) return '-'
  const [, month, day] = isoDate.split('-')
  return `${month}.${day}`
}

function describeHistory(item) {
  if (item.status === 'SAVED') {
    return item.description ?? '하루 여유자금 자동 저축'
  }
  return item.description ?? '여유자금 없음 — 저축 건너뜀'
}

function monthDayClass(day) {
  if (day.status === 'SUCCESS') return 'bg-primary text-white'
  if (day.isToday) return 'border border-primary text-primary'
  if (day.isFuture) return 'text-slate-300'
  return 'bg-slate-100 text-slate-400'
}
</script>
