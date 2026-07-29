<!-- "다음달 자금마련" 페이스메이커 토글 카드 -->
<template>
  <div
    class="flex flex-col gap-3 rounded-[20px] border p-[25px]"
    :class="cardClass"
    :style="cardStyle"
  >
    <!-- 상단: 라벨 + 토글 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-1.5">
        <p class="text-xs font-bold text-slate-400">다음달 자금마련</p>
        <span
          v-if="!isRegistered"
          class="rounded-full bg-slate-200 px-1.5 py-0.5 text-[9px] font-bold text-slate-500"
        >
          미개설
        </span>
      </div>
      <button
        type="button"
        class="relative h-6 w-11 rounded-full transition-colors"
        :class="pacemaker?.enabled ? 'bg-primary' : 'bg-slate-300'"
        @click="$emit('toggle')"
      >
        <span
          class="absolute top-0.5 size-[18px] rounded-full bg-white transition-all"
          :class="pacemaker?.enabled ? 'left-[23px]' : 'left-0.5'"
        />
      </button>
    </div>

    <!-- ON 상태: 헤드라인 2줄 + 캡션 + 하이라이트 박스 -->
    <template v-if="isOn">
      <div class="text-[13px] font-black leading-[18.2px] tracking-[-0.13px] text-[#0a192f]">
        <p>다음달 목표자금을</p>
        <p>미리 마련해줄게요</p>
      </div>
      <p class="text-[9px] leading-[13.5px] text-slate-500">오늘 하루 여유자금을 자동 저축</p>
      <div class="rounded-[10px] bg-[#eaf2ff] px-3 py-2">
        <p class="text-[11px] font-bold text-primary">
          이번달 +{{ formatWon(pacemaker.monthlySecuredAmount) }} 자동 확보
        </p>
      </div>
    </template>

    <!-- OFF 상태(개설됨/미개설) -->
    <template v-else>
      <p class="pt-3 text-[12px] font-bold leading-[18px] text-slate-600">
        {{ offDescription }}
      </p>

      <!-- 하단 상태 안내 박스 (인디케이터 + 액션 링크 추가) -->
      <div class="mt-3 flex items-center justify-between rounded-[10px] bg-slate-100 px-3 py-2">
        <div class="flex items-center gap-2">
          <!-- 상태별 미니 닷(Dot) 아이콘 -->
          <span
            class="size-1.5 rounded-full"
            :class="isRegistered ? 'bg-slate-400' : 'bg-slate-300'"
          />
          <p class="text-[11px] font-semibold text-slate-500">
            {{ isRegistered ? '지금은 OFF 상태예요' : '개설 후 이용할 수 있어요' }}
          </p>
        </div>

        <!-- 미개설 상태일 때 우측 유도 텍스트 -->
        <span v-if="!isRegistered" class="text-[11px] font-bold text-primary"> 개설하기 &gt; </span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  pacemaker: {
    type: Object,
    default: null, // { autoSavingId, registered, status, enabled, monthlySecuredAmount }
  },
})
defineEmits(['toggle'])

const isRegistered = computed(() => props.pacemaker?.registered === true)
const isOn = computed(() => isRegistered.value && props.pacemaker?.enabled === true)

const offDescription = computed(() =>
  isRegistered.value
    ? 'ON하면 하루 여유자금으로 다음달 자금을 미리 마련해줄게요'
    : '아직 페이스메이커 전용 저금통이 개설되지 않았어요, 개설되면 페이스메이커가 다음달 목표자금마련을 자동으로 해드릴게요'
)

const cardClass = computed(() => {
  if (isOn.value) return 'border-primary/[0.19] shadow-[0_2px_14px_rgba(0,102,255,0.06)]'
  if (isRegistered.value) return 'border-slate-200'
  return 'border-dashed border-slate-300'
})

const cardStyle = computed(() => {
  if (isOn.value) {
    return 'background-image: linear-gradient(149deg, rgba(0, 102, 255, 0.03) 0%, rgb(244, 248, 255) 100%);'
  }
  return 'background-color: #f8fafc;'
})

function formatWon(amount) {
  return `${amount.toLocaleString()}원`
}
</script>
