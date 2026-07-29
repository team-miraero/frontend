<!-- "연동된 저금통 · 계좌" 카드 -->
<template>
  <div
    class="rounded-[20px] border border-slate-200 bg-white p-[25px] shadow-[0_2px_7px_rgba(0,102,255,0.06)]"
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
        <p class="shrink-0 text-xs font-bold text-[#0a192f]">{{ formatManwon(asset.balance) }}</p>
      </div>
    </div>

    <div class="mt-2 flex items-center justify-between border-t border-slate-100 pt-2.5">
      <span class="text-xs text-slate-500">합계 잔액</span>
      <span class="text-xs font-black text-[#0a192f]">{{ formatManwon(totalBalance) }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import moneyBoxIcon from '@/assets/icons/money-box.svg'
import bankAccountIcon from '@/assets/icons/bank-account.svg'

const props = defineProps({
  assets: {
    type: Array,
    required: true,
  },
})

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

function formatManwon(amount) {
  return `${Math.round(amount / 10000).toLocaleString()}만원`
}
</script>
