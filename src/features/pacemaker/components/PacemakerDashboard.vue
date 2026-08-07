<template>
  <div
    class="mx-auto flex w-full max-w-[900px] flex-col gap-6 px-4 py-6 pb-16 sm:px-8 lg:px-10 lg:py-8"
  >
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="mb-1 text-xs font-bold text-slate-400">페이스메이커 저금통</p>
        <h2 class="text-2xl font-black tracking-[-0.03em] text-[#0a192f]">
          오늘까지 모인 여유자금
        </h2>
      </div>
      <button
        type="button"
        class="shrink-0 rounded-full border border-[#c5dcff] bg-[#eaf2ff] px-4 py-2 text-xs font-bold text-primary transition hover:bg-[#dceaff] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
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
          <span class="rounded-full bg-white/20 px-2 py-1 text-[10px] font-black">
            자동저축 {{ isActive ? 'ON' : 'OFF' }}
          </span>
        </div>
        <p class="mt-1 text-[34px] font-black tracking-[-0.04em] sm:text-[36px]">
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
      class="rounded-[20px] border border-slate-200 bg-white px-5 py-5 sm:px-6"
      aria-labelledby="streak-title"
    >
      <div class="mb-4 flex items-center justify-between gap-3">
        <h3 id="streak-title" class="text-sm font-black text-[#0a192f]">
          이번 주 자동 저축 스트릭
        </h3>
        <span class="rounded-full bg-[#eaf2ff] px-2.5 py-1 text-xs font-bold text-primary">
          🔥 {{ formatNumber(pacemaker.currentStreak) }}일 연속
        </span>
      </div>

      <div
        v-if="weeklyStreak.length"
        class="grid gap-2"
        :style="{ gridTemplateColumns: `repeat(${weeklyStreak.length}, minmax(0, 1fr))` }"
      >
        <div
          v-for="day in weeklyStreak"
          :key="day.savingDate"
          class="flex flex-col items-center gap-1.5"
        >
          <div
            class="flex size-9 items-center justify-center rounded-full text-xs font-black"
            :class="
              day.status === 'SUCCESS'
                ? 'text-white shadow-[0_3px_10px_rgba(0,102,255,0.22)]'
                : 'bg-slate-100 text-slate-300'
            "
            :style="
              day.status === 'SUCCESS'
                ? { background: 'linear-gradient(135deg, #0066ff 0%, #66b2ff 100%)' }
                : undefined
            "
          >
            {{ day.status === 'SUCCESS' ? '✓' : '—' }}
          </div>
          <span
            class="text-xs font-bold"
            :class="day.status === 'SUCCESS' ? 'text-[#0a192f]' : 'text-slate-300'"
          >
            {{ formatDayOfWeek(day.dayOfWeek) }}
          </span>
        </div>
      </div>
      <p v-else class="py-4 text-center text-xs text-slate-400">이번 주 저축 기록이 없어요.</p>

      <div class="mt-4 flex items-center justify-between gap-3 text-xs text-slate-400">
        <span>이번 달 자동 저축 성공</span>
        <span class="font-black text-primary">
          {{ formatNumber(pacemaker.monthlySuccessCount) }}회
        </span>
      </div>
    </section>

    <section aria-labelledby="goal-accounts-title">
      <h3 id="goal-accounts-title" class="mb-3 text-sm font-black text-[#0a192f]">
        목표별 입금 계좌
      </h3>
      <div v-if="accountGroups.length" class="flex flex-col gap-3">
        <article
          v-for="group in accountGroups"
          :key="group.goalId"
          class="flex flex-col gap-3 rounded-[18px] border border-slate-200 bg-white px-4 py-4 sm:px-5"
        >
          <div class="flex items-center justify-between gap-3">
            <div class="flex min-w-0 items-center gap-3">
              <div
                class="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#eaf2ff] text-base"
              >
                {{ group.icon }}
              </div>
              <div class="min-w-0">
                <p class="truncate text-sm font-black text-[#0a192f]">{{ group.goalName }}</p>
                <p class="truncate text-xs text-slate-400">
                  출금계좌: {{ group.accounts[0].bankName }}
                  {{ group.accounts[0].accountNumberMasked }}
                </p>
              </div>
            </div>
            <button
              type="button"
              class="shrink-0 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white shadow-[0_3px_10px_rgba(0,102,255,0.2)] transition hover:bg-[#0055dd] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              :disabled="!pacemaker.moneyBoxBalance"
              @click="openDeposit(group.accounts[0])"
            >
              입금하기
            </button>
          </div>

          <div class="grid gap-2 sm:grid-cols-3">
            <div
              v-for="account in group.accounts.slice(0, 2)"
              :key="account.accountNumberMasked"
              class="rounded-xl border border-[#edf2ff] bg-[#f8fbff] px-3 py-2.5"
            >
              <p class="truncate text-xs text-slate-400">{{ account.accountNickname }}</p>
              <p class="mt-0.5 text-sm font-black text-primary">
                {{ formatCompactWon(account.accountBalance) }}
              </p>
            </div>
            <div class="rounded-xl border border-[#edf2ff] bg-[#f8fbff] px-3 py-2.5">
              <p class="text-xs text-slate-400">페이스메이커 저금통</p>
              <p class="mt-0.5 text-sm font-black text-[#0a192f]">
                {{ formatCompactWon(pacemaker.moneyBoxBalance) }}
              </p>
            </div>
          </div>
        </article>
      </div>
      <div
        v-else
        class="rounded-[18px] border border-dashed border-slate-300 bg-white px-5 py-8 text-center text-sm text-slate-400"
      >
        입금할 수 있는 목표 계좌가 아직 없어요.
      </div>
    </section>

    <section
      class="rounded-[20px] border border-slate-200 bg-white px-5 py-5 sm:px-6"
      aria-labelledby="history-title"
    >
      <h3 id="history-title" class="mb-4 text-sm font-black text-[#0a192f]">
        이번 달 자동 저축 내역
      </h3>
      <div v-if="recentHistories.length" class="divide-y divide-slate-100">
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
            class="shrink-0 text-sm font-black"
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
import { computed, ref } from 'vue'
import { usePacemakerStore } from '@/features/pacemaker/store/pacemaker.store'
import PacemakerDepositModal from '@/features/pacemaker/components/PacemakerDepositModal.vue'
import PacemakerDepositSuccessModal from '@/features/pacemaker/components/PacemakerDepositSuccessModal.vue'
import { useModal } from '@/shared/composables/useModal'

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

const pacemakerStore = usePacemakerStore()
const selectedDepositTarget = ref(null)
const depositedAmount = ref(0)
const { isOpen: isDepositModalOpen, open: openDepositModal } = useModal()
const { isOpen: isDepositSuccessModalOpen, open: openDepositSuccessModal } = useModal()

const dashboard = computed(() => pacemakerStore.pacemakerDashboard)
const pacemaker = computed(() => pacemakerStore.pacemakerView)
const isActive = computed(() => pacemaker.value.status === 'ACTIVE')
const recentHistories = computed(() => pacemakerStore.histories.slice(0, 5))
const weeklyStreak = computed(() => dashboard.value?.weeklyStreak ?? [])

const accountGroups = computed(() => {
  const groups = new Map()
  pacemakerStore.depositTargets.forEach((account) => {
    if (!groups.has(account.goalId)) {
      groups.set(account.goalId, {
        goalId: account.goalId,
        goalName: account.goalName,
        icon: account.icon,
        accounts: [],
      })
    }
    groups.get(account.goalId).accounts.push(account)
  })
  return Array.from(groups.values())
})

function openDeposit(account) {
  selectedDepositTarget.value = account
  openDepositModal()
}

async function handleDeposit({ goalId, amount }) {
  await pacemakerStore.depositToGoal(goalId, amount)
  depositedAmount.value = amount
  isDepositModalOpen.value = false
  openDepositSuccessModal()
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

function formatDayOfWeek(dayOfWeek) {
  return DAY_OF_WEEK_LABEL[dayOfWeek] ?? dayOfWeek
}
</script>
