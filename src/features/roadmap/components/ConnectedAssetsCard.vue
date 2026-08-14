<!-- "연동된 저금통 · 계좌" 카드: 클릭하면 이 목표에 묶인 자금 상세 모달을 염 -->
<template>
  <button
    type="button"
    class="group flex flex-col justify-between rounded-2xl border border-slate-100 bg-[#f8fbff] p-4 text-left transition-all hover:bg-[#f2f7ff]"
    @click="$emit('open-detail')"
  >
    <div>
      <div class="flex items-center justify-between">
        <p class="text-xs font-bold text-slate-400">연동된 저금통 · 계좌</p>
        <span class="text-[11px] font-bold text-primary group-hover:translate-x-0.5 transition-transform">
          자세히 보기 ›
        </span>
      </div>

      <div class="flex flex-col gap-2 pt-2.5">
        <div
          v-for="asset in savingsAssets.slice(0, 2)"
          :key="asset.assetId"
          class="flex items-center gap-2.5"
        >
          <div class="flex size-7 items-center justify-center rounded-lg bg-white shadow-xs">
            <img :src="assetIcon(asset.assetType)" alt="" class="size-3.5" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-xs font-bold text-[#0a192f]">{{ asset.assetName }}</p>
            <p class="truncate text-[10px] text-slate-400">
              {{ asset.bankName }} {{ asset.accountNumberMasked }}
            </p>
          </div>
          <p class="shrink-0 text-xs font-black text-[#0a192f]">
            {{ formatKRWCompact(asset.balance) }}
          </p>
        </div>
      </div>
    </div>

    <div class="mt-3 flex items-center justify-between border-t border-slate-200/60 pt-2.5">
      <span class="text-xs font-bold text-slate-500">합계 잔액</span>
      <span class="text-sm font-black text-[#0a192f]">{{ formatKRWCompact(totalBalance) }}</span>
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

const savingsAssets = computed(() =>
  props.assets.filter((asset) => asset.assetType === 'MONEY_BOX' || asset.assetType === 'ACCOUNT')
)

const totalBalance = computed(() =>
  savingsAssets.value.reduce((sum, asset) => sum + (asset.balance ?? 0), 0)
)

function assetIcon(assetType) {
  return assetType === 'MONEY_BOX' ? moneyBoxIcon : bankAccountIcon
}
</script>
