<!-- "다음달 자금마련" 페이스메이커 토글 카드 -->
<template>
  <div
    class="rounded-[20px] border border-primary/20 p-[25px]"
    style="background-image: linear-gradient(149deg, rgba(0,102,255,0.03) 0%, rgb(244,248,255) 100%)"
  >
    <div class="flex items-center justify-between">
      <p class="text-xs font-bold text-slate-400">다음달 자금마련</p>
      <button
        type="button"
        class="relative h-6 w-11 rounded-full transition-colors"
        :class="pacemaker?.enabled ? 'bg-primary' : 'bg-slate-200'"
        @click="$emit('toggle')"
      >
        <span
          class="absolute top-0.5 size-[18px] rounded-full bg-white transition-all"
          :class="pacemaker?.enabled ? 'left-[22px]' : 'left-0.5'"
        />
      </button>
    </div>

    <p class="pt-3 text-[11px] leading-[16.5px] text-slate-400">
      {{
        pacemaker?.enabled
          ? `이번달 +${formatWon(pacemaker.monthlySecuredAmount)} 자동 확보`
          : 'ON하면 하루 여유자금으로 다음달 자금을 미리 마련해줄게요'
      }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  pacemaker: {
    type: Object,
    default: null, // { enabled, monthlySecuredAmount }
  },
})
defineEmits(['toggle'])

function formatWon(amount) {
  return `${amount.toLocaleString()}원`
}
</script>