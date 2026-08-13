<!-- "연동된 저금통 · 계좌" 카드: 클릭하면 이 목표에 묶인 자금(대출 포함) 상세 모달을 염 -->
<template>
  <!-- 데스크톱(lg 이상): 기존 배치 그대로 유지 -->
  <button
    type="button"
    class="hidden w-full rounded-[20px] border border-slate-200 bg-white p-4 text-left shadow-[0_2px_7px_rgba(0,102,255,0.06)] lg:block"
    @click="$emit('open-detail')"
  >
    <div class="flex items-center justify-between">
      <p class="text-xs font-bold text-slate-400">연동된 저금통 · 계좌</p>
    </div>

    <div class="flex flex-col gap-2 pt-3">
      <div v-for="asset in savingsAssets" :key="asset.assetId" class="flex items-center gap-2.5">
        <div class="flex size-7 items-center justify-center rounded-lg bg-[#eaf2ff]">
          <img :src="assetIcon(asset.assetType)" alt="" class="size-[13px]" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-xs font-bold text-[#0a192f]">{{ asset.assetName }}</p>
          <p class="truncate text-xs text-slate-400">
            {{ asset.bankName }} {{ asset.accountNumberMasked }}
          </p>
        </div>
        <p class="shrink-0 text-xs font-bold text-[#0a192f]">
          {{ formatKRWCompact(asset.balance) }}
        </p>
      </div>
    </div>

    <div class="mt-2 flex items-center justify-between border-t border-slate-100 pt-2.5">
      <span class="text-xs text-slate-500">합계 잔액</span>
      <span class="text-xs font-black text-[#0a192f]">{{ formatKRWCompact(totalBalance) }}</span>
    </div>
  </button>

  <!-- 모바일(lg 미만): 타이틀을 "연동된 자산"으로 줄이고 합계 잔액을 줄바꿈한 축약형 -->
  <button
    type="button"
    class="w-full rounded-[20px] border border-slate-200 bg-white p-3.5 text-left shadow-[0_2px_7px_rgba(0,102,255,0.06)] lg:hidden"
    @click="$emit('open-detail')"
  >
    <p class="text-xs font-bold text-slate-400">연동된 자산</p>

    <div class="flex flex-col gap-2 pt-3">
      <div v-for="asset in savingsAssets" :key="asset.assetId" class="flex items-center gap-2">
        <div class="flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#eaf2ff]">
          <img :src="assetIcon(asset.assetType)" alt="" class="size-3" />
        </div>
        <p class="min-w-0 truncate text-xs font-bold text-[#0a192f]">
          {{ firstWord(asset.assetName) }}
        </p>
      </div>
    </div>

    <div class="mt-2 flex flex-col gap-0.5 border-t border-slate-100 pt-2">
      <span class="text-[11px] text-slate-500">합계 잔액</span>
      <span class="text-lg font-black text-[#0a192f]">{{ formatKRWCompact(totalBalance) }}</span>
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import moneyBoxIcon from '@/assets/icons/money-box.svg'
import bankAccountIcon from '@/assets/icons/bank-account.svg'
import { formatKRWCompact } from '@/shared/lib/money'

const props = defineProps({
  assets: {
    type: Array,
    required: true,
  },
})
defineEmits(['open-detail'])

// LOAN은 저축 목적 자산이 아니라서 이 카드(저금통·계좌)에서는 제외
const savingsAssets = computed(() =>
  props.assets.filter((asset) => asset.assetType === 'MONEY_BOX' || asset.assetType === 'ACCOUNT')
)

const totalBalance = computed(() =>
  savingsAssets.value.reduce((sum, asset) => sum + (asset.balance ?? 0), 0)
)

function assetIcon(assetType) {
  return assetType === 'MONEY_BOX' ? moneyBoxIcon : bankAccountIcon
}

// 모바일 축약형: 자산명이 길어 글씨가 깨지는 것을 막기 위해 첫 단어 그룹만 노출
function firstWord(name) {
  return name.split(' ')[0]
}
</script>
