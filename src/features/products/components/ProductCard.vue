<template>
  <article
    class="group flex h-full min-h-[310px] flex-col overflow-hidden rounded-[18px] border bg-white shadow-[0_5px_16px_rgba(30,64,109,0.05)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(30,64,109,0.1)]"
    :class="isHighestRate ? 'border-primary ring-1 ring-primary/70' : 'border-[#e1e8f1]'"
  >
    <div class="flex flex-1 flex-col p-5">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-1.5">
            <span
              class="rounded-md px-2 py-1 text-[10px] font-black"
              :class="
                productType === 'saving'
                  ? 'bg-[#e8f3ff] text-primary'
                  : 'bg-[#eeeaff] text-[#6754d9]'
              "
            >
              {{ productType === 'saving' ? '적금' : '예금' }}
            </span>
            <span
              v-if="isHighestRate"
              class="rounded-md bg-[#dff0ff] px-2 py-1 text-[10px] font-black text-primary"
            >
              최고금리
            </span>
          </div>
          <h3
            class="mt-2 truncate text-base font-black tracking-[-0.3px] text-[#10233f]"
            :title="product.productName"
          >
            {{ product.productName }}
          </h3>
        </div>

        <div class="shrink-0 rounded-xl border border-[#dbe8f8] bg-[#f3f8ff] px-3 py-2 text-right">
          <p class="text-lg font-black tracking-[-0.45px] text-primary">
            연 {{ maximumRateLabel }}%
          </p>
          <p class="mt-0.5 text-[10px] font-medium text-slate-400">우대금리 포함 최고</p>
        </div>
      </div>

      <dl class="mt-4 grid grid-cols-2 gap-2">
        <div class="rounded-xl bg-[#f5f8fc] px-3 py-2.5">
          <dt class="text-[11px] font-medium text-slate-400">납입 기간</dt>
          <dd class="mt-1 text-[13px] font-black text-slate-700">{{ termLabel }}</dd>
        </div>
        <div class="rounded-xl bg-[#f5f8fc] px-3 py-2.5">
          <dt class="text-[11px] font-medium text-slate-400">한도</dt>
          <dd class="mt-1 truncate text-[13px] font-black text-slate-700" :title="limitLabel">
            {{ limitLabel }}
          </dd>
        </div>
      </dl>

      <div
        class="mt-3 flex items-center gap-3 rounded-xl border border-[#9fd2ff] bg-[#eaf6ff] px-3 py-2.5"
      >
        <div
          class="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#55adff] text-xs font-black text-white"
          aria-hidden="true"
        >
          ₩
        </div>
        <div class="min-w-0">
          <p class="truncate text-[13px] font-black text-[#0870d5]">
            {{ impactTitle }}
          </p>
          <p class="mt-0.5 truncate text-[11px] font-medium text-[#5795ca]">
            {{ impactDescription }}
          </p>
        </div>
      </div>

      <div class="mt-3 flex min-h-6 flex-wrap content-start gap-1.5">
        <span
          v-for="tag in tags"
          :key="tag"
          class="rounded-full border border-[#e0e7f0] bg-[#f7f9fc] px-2 py-1 text-[10px] font-semibold text-slate-500"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <button
      type="button"
      class="flex w-full items-center justify-between rounded-b-[17px] border-t border-[#e8edf4] px-5 py-3 text-xs font-bold text-slate-600 transition hover:bg-[#f8fbff] hover:text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/20"
      :aria-label="`${product.productName} 상세 비교 정보 보기`"
      @click="$emit('view-detail', product)"
    >
      상세 비교 정보
      <span
        class="text-base text-slate-400 transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      >
        ›
      </span>
    </button>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { formatProductLimit, formatRateCompact } from '@/features/products/lib/product-formatters'
import { CALCULATION_STATUS } from '@/features/products/lib/recommendation-impact'
import { formatKRW, formatKRWCompact } from '@/shared/lib/money'

const props = defineProps({
  product: { type: Object, required: true },
  productType: { type: String, required: true },
  isHighestRate: { type: Boolean, default: false },
  goalName: { type: String, default: '선택한 목표' },
  recommendationImpact: { type: Object, default: null },
})

defineEmits(['view-detail'])

const terms = computed(() =>
  [
    ...new Set([
      ...(props.product.saveTerms ?? []),
      ...(props.product.options ?? []).map((option) => option.saveTerm),
    ]),
  ].sort((a, b) => a - b)
)

const termLabel = computed(() => {
  if (terms.value.length === 0) return '상품별 확인'
  if (terms.value.length === 1) return `${terms.value[0]}개월`
  return `${terms.value.join(' · ')}개월`
})

const maximumRateLabel = computed(() => formatRateCompact(props.product.maximumInterestRate))

const limitLabel = computed(() => formatProductLimit(props.product.maxLimit, props.productType))

const impactTitle = computed(() => {
  const impact = props.recommendationImpact
  const status = impact?.calculationStatus

  if (status === CALCULATION_STATUS.CALCULATED) {
    return `이 상품 활용 시 목표 ${impact.estimatedMonthsSaved}개월 단축`
  }
  if (status === CALCULATION_STATUS.NO_IMPROVEMENT && impact.estimatedAdditionalInterest > 0) {
    const interestLabel =
      impact.estimatedAdditionalInterest >= 10000
        ? formatKRWCompact(impact.estimatedAdditionalInterest)
        : formatKRW(impact.estimatedAdditionalInterest)
    return `예상 이자 약 ${interestLabel} 증가`
  }
  if (status === CALCULATION_STATUS.NO_IMPROVEMENT) {
    return '현재 계획과 예상 효과가 비슷해요'
  }
  if (status === CALCULATION_STATUS.NOT_APPLICABLE) {
    return '목표 기간 내 만기 가능한 옵션이 없어요'
  }
  return '목표 달성 효과를 계산할 수 없어요'
})

const impactDescription = computed(() => {
  const impact = props.recommendationImpact
  if (
    impact?.calculationStatus === CALCULATION_STATUS.CALCULATED ||
    impact?.calculationStatus === CALCULATION_STATUS.NO_IMPROVEMENT
  ) {
    const rateBasis = impact.interestRateBasis === 'MAX' ? '최고금리' : '기본금리'
    return `${impact.optionTerm}개월 · ${rateBasis} 연 ${formatRateCompact(
      impact.assumedInterestRate
    )}% 기준 예상`
  }
  if (impact?.calculationStatus === CALCULATION_STATUS.NOT_APPLICABLE) {
    return `${props.goalName}의 남은 기간보다 상품 가입 기간이 길어요`
  }
  return '목표와 연결 자산 정보를 확인해 주세요'
})

const tags = computed(() => {
  const values = new Set()

  props.product.reserveTypes?.forEach((reserveType) => {
    if (reserveType === 'F' || reserveType === 'FLEXIBLE' || reserveType === '자유적립식') {
      values.add('자유 납입')
    }
    if (reserveType === 'S' || reserveType === 'FIXED' || reserveType === '정액적립식') {
      values.add('정액 납입')
    }
  })

  props.product.options?.forEach((option) => {
    if (props.productType !== 'saving') return

    if (option.reserveType === 'F' || option.reserveTypeName === '자유적립식') {
      values.add('자유 납입')
    }
    if (option.reserveType === 'S' || option.reserveTypeName === '정액적립식') {
      values.add('정액 납입')
    }
  })

  if (/인터넷|스마트폰/.test(props.product.joinMethod ?? '')) values.add('비대면 가입')
  if (props.product.hasJoinRestriction === false || props.product.joinRestriction === '1') {
    values.add('가입 제한 없음')
  }

  return [...values].slice(0, 3)
})
</script>
