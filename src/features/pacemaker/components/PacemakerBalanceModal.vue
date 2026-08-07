<!-- 페이스메이커 잔액/자동저축/입금 가능 계좌 모달 (개설됨 상태에서 CTA 클릭 시) -->
<template>
  <BaseModal
    :model-value="modelValue"
    hide-default-close
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="flex items-center justify-between border-b border-slate-100 px-7 pb-[17px] pt-6">
      <div>
        <p class="text-xs font-bold text-slate-400">페이스메이커 전용 저금통</p>
        <h3 class="pt-0.5 text-base font-black text-[#0a192f]">지금까지 모인 여유자금</h3>
      </div>
      <button
        type="button"
        class="flex size-8 items-center justify-center rounded-full bg-[#f8fbff]"
        aria-label="닫기"
        @click="$emit('update:modelValue', false)"
      >
        <img src="@/assets/icons/modal-close.svg" alt="" class="size-[15px]" />
      </button>
    </div>

    <div class="flex flex-col gap-4 px-7 py-5">
      <div
        class="relative overflow-hidden rounded-2xl px-5 py-4 shadow-[0_8px_24px_rgba(0,102,255,0.22)]"
        style="
          background-image: linear-gradient(163deg, rgb(0, 102, 255) 0%, rgb(102, 178, 255) 100%);
        "
      >
        <span class="absolute -right-6 -top-7 size-24 rounded-full bg-white/10" />
        <p class="relative text-xs font-bold text-white/80">페이스메이커 저금통 잔액</p>
        <p class="relative pt-1 text-[28px] font-black tracking-[-0.84px] text-white">
          {{ formatNumber(pacemaker.moneyBoxBalance) }}<span class="text-base"> 원</span>
        </p>
        <div class="relative flex items-center gap-2 pt-2 text-xs text-white/70">
          <span>오늘 +{{ formatNumber(pacemaker.todaySavingAmount) }}원</span>
          <span class="size-1 rounded-full bg-white/40" />
          <span>🔥 연속 {{ pacemaker.currentStreak }}일</span>
        </div>
      </div>

      <div
        class="flex items-center justify-between rounded-2xl border border-slate-200 bg-[#f4f8ff] px-4 py-3"
      >
        <div>
          <p class="text-sm font-bold text-[#0a192f]">자동 저축</p>
          <p class="text-xs text-slate-500">
            하루 상한선 {{ formatNumber(pacemaker.maxAmount) }}원
          </p>
        </div>
        <button
          type="button"
          class="relative h-6 w-11 rounded-full transition-colors"
          :class="pacemaker.enabled ? 'bg-primary' : 'bg-slate-300'"
          @click="$emit('toggle-auto-saving')"
        >
          <span
            class="absolute top-0.5 size-[18px] rounded-full bg-white transition-all"
            :class="pacemaker.enabled ? 'left-[23px]' : 'left-0.5'"
          />
        </button>
      </div>

      <div>
        <p class="pb-2 text-xs font-bold text-slate-500">연동된 목표 계좌 · 입금 가능</p>
        <div class="flex flex-col gap-2">
          <div
            v-for="goal in depositTargets"
            :key="goal.goalId"
            class="flex items-center justify-between rounded-2xl border border-[#edf2ff] bg-[#f8fbff] px-4 py-3"
          >
            <div class="flex items-center gap-3">
              <span class="text-lg leading-none">{{ goalIcon(goal.goalType) }}</span>
              <div>
                <p class="text-xs font-bold text-[#0a192f]">{{ goal.goalName }}</p>
                <p class="text-xs text-slate-400">
                  {{ goal.depositAssets?.[0]?.financialInstitutionName ?? '저금통' }}
                  {{ goal.depositAssets?.[0]?.maskedAccountNumber }}
                </p>
              </div>
            </div>
            <button
              type="button"
              class="rounded-full px-3 py-1.5 text-xs font-bold text-white"
              style="
                background-image: linear-gradient(
                  149deg,
                  rgb(0, 102, 255) 0%,
                  rgb(102, 178, 255) 100%
                );
              "
              @click="$emit('deposit', goal)"
            >
              입금
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        class="rounded-2xl border border-primary/20 bg-primary/[0.06] py-3 text-sm font-bold text-primary"
        @click="$emit('view-history')"
      >
        전체 자동 저축 내역 보기
      </button>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from '@/shared/ui/BaseModal.vue'

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  pacemaker: {
    type: Object,
    required: true,
  },
  depositTargets: {
    type: Array,
    default: () => [],
  },
})
defineEmits(['update:modelValue', 'toggle-auto-saving', 'deposit', 'view-history'])

function formatNumber(amount) {
  return (amount ?? 0).toLocaleString()
}

function goalIcon(goalType) {
  return { TRAVEL: '✈️', INDEPENDENCE: '🏠', EMERGENCY: '☂️', WEDDING: '💍' }[goalType] ?? '🎯'
}
</script>
