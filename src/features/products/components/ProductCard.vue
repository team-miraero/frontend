<template>
  <article
    class="group flex h-full min-h-[310px] cursor-pointer flex-col overflow-hidden rounded-[18px] border bg-white shadow-[0_5px_16px_rgba(30,64,109,0.05)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(30,64,109,0.1)] focus:outline-none focus:ring-2 focus:ring-primary/30"
    :class="isHighestRate ? 'border-primary ring-1 ring-primary/70' : 'border-[#e1e8f1]'"
    role="button"
    tabindex="0"
    :aria-label="`${product.productName} 상품 상세 정보 보기`"
    @click="openDetail"
    @keydown.enter="openDetail"
    @keydown.space.prevent="openDetail"
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
          <dd class="mt-1 text-[13px] font-black text-slate-700" :title="fullTermLabel">
            {{ termLabel }}
          </dd>
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

    <div
      class="flex w-full items-center justify-between rounded-b-[17px] border-t border-[#e8edf4] px-5 py-3 text-xs font-bold text-slate-600 transition group-hover:bg-[#f8fbff] group-hover:text-primary"
      aria-hidden="true"
    >
      상품 상세 정보
      <span
        class="text-base text-slate-400 transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      >
        ›
      </span>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { formatProductLimit, formatRateCompact } from '@/features/products/lib/product-formatters'
import { CALCULATION_STATUS } from '@/features/products/lib/recommendation-impact'

const SIMILAR_RATE_THRESHOLD = 0.1

const props = defineProps({
  product: { type: Object, required: true },
  productType: { type: String, required: true },
  isHighestRate: { type: Boolean, default: false },
  goalName: { type: String, default: '선택한 목표' },
  eligibleMaturityTerms: { type: Array, default: () => [] },
  recommendationImpact: { type: Object, default: null },
  hasLinkedAssets: { type: Boolean, default: false },
  hasOnlyMoneyBox: { type: Boolean, default: false },
  currentInterestRate: { type: Number, default: null },
})

const emit = defineEmits(['view-detail'])

function openDetail() {
  emit('view-detail', props.product)
}

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
  if (terms.value.length >= 4) {
    return `${terms.value.slice(0, 3).join(' · ')}개월 외 ${terms.value.length - 3}개`
  }
  return `${terms.value.join(' · ')}개월`
})

const fullTermLabel = computed(() => {
  if (terms.value.length === 0) return '상품별 확인'
  return `${terms.value.join(' · ')}개월`
})

const maximumRateLabel = computed(() => formatRateCompact(props.product.maximumInterestRate))

const limitLabel = computed(() => formatProductLimit(props.product.maxLimit, props.productType))

const productInterestRate = computed(() => Number(props.product.maximumInterestRate))

const hasComparableInterestRates = computed(
  () =>
    props.hasLinkedAssets &&
    Number.isFinite(props.currentInterestRate) &&
    Number.isFinite(productInterestRate.value)
)

const interestRateDifference = computed(() =>
  hasComparableInterestRates.value ? productInterestRate.value - props.currentInterestRate : null
)

const interestRateComparisonDescription = computed(() =>
  `현재 연 ${formatRateCompact(props.currentInterestRate)}% · 이 상품 최고 연 ${formatRateCompact(
    productInterestRate.value
  )}%`
)

const impactTitle = computed(() => {
  const impact = props.recommendationImpact
  const status = impact?.calculationStatus

  if (status === CALCULATION_STATUS.CALCULATED) {
    if (impact.estimatedMonthsSaved > 0) {
      return `이 상품 활용 시 목표 ${impact.estimatedMonthsSaved}개월 단축`
    }

    if (impact.estimatedAdditionalAmount > 0) {
      return `이 상품 활용 시 ${impact.estimatedAdditionalAmount.toLocaleString()}원 더 모을 수 있어요`
    }
  }

  if (
    status === CALCULATION_STATUS.NOT_APPLICABLE &&
    props.eligibleMaturityTerms.length === 0 &&
    terms.value.length > 0
  ) {
    return '기간을 늘리면 이용할 수 있는 상품이에요'
  }

  if (
    hasComparableInterestRates.value &&
    interestRateDifference.value <= -SIMILAR_RATE_THRESHOLD
  ) {
    return '현재 계획을 유지하는 편이 유리해요'
  }

  if (props.hasOnlyMoneyBox && productInterestRate.value > 0) {
    return `저금통보다 최대 ${formatRateCompact(productInterestRate.value)}%p 높은 금리예요`
  }

  if (
    hasComparableInterestRates.value &&
    interestRateDifference.value >= SIMILAR_RATE_THRESHOLD
  ) {
    return `현재보다 최대 ${formatRateCompact(interestRateDifference.value)}%p 높은 금리예요`
  }

  if (
    hasComparableInterestRates.value &&
    Math.abs(interestRateDifference.value) < SIMILAR_RATE_THRESHOLD
  ) {
    return '현재 상품과 예상 효과가 비슷해요'
  }

  if (
    props.eligibleMaturityTerms.length > 0 &&
    (status === CALCULATION_STATUS.NOT_APPLICABLE || status === CALCULATION_STATUS.INSUFFICIENT_DATA)
  ) {
    return '가입 가능한 기간 옵션이 있어요'
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

  if (impact?.calculationStatus === CALCULATION_STATUS.CALCULATED) {
    const rateBasis = impact.interestRateBasis === 'MAX' ? '최고금리' : '기본금리'
    return `${impact.optionTerm}개월 · ${rateBasis} 연 ${formatRateCompact(
      impact.assumedInterestRate
    )}% 기준 예상`
  }

  if (
    impact?.calculationStatus === CALCULATION_STATUS.NOT_APPLICABLE &&
    props.eligibleMaturityTerms.length === 0 &&
    terms.value.length > 0
  ) {
    return `최단 ${terms.value[0]}개월 · 최고 연 ${formatRateCompact(
      productInterestRate.value
    )}%`
  }

  if (
    hasComparableInterestRates.value &&
    interestRateDifference.value <= -SIMILAR_RATE_THRESHOLD
  ) {
    return interestRateComparisonDescription.value
  }

  if (props.hasOnlyMoneyBox && productInterestRate.value > 0) {
    return `현재 저금통 0% · 이 상품 최고 연 ${formatRateCompact(productInterestRate.value)}%`
  }

  if (hasComparableInterestRates.value) {
    return interestRateComparisonDescription.value
  }

  if (
    props.eligibleMaturityTerms.length > 0 &&
    (impact?.calculationStatus === CALCULATION_STATUS.NOT_APPLICABLE ||
      impact?.calculationStatus === CALCULATION_STATUS.INSUFFICIENT_DATA)
  ) {
    return `${props.eligibleMaturityTerms.join(' · ')}개월 옵션으로 목표 기간 안에 만기돼요`
  }
  if (impact?.calculationStatus === CALCULATION_STATUS.NOT_APPLICABLE) {
    return `${props.goalName}의 남은 기간보다 상품 가입 기간이 길어요`
  }
  if (impact?.calculationStatus === CALCULATION_STATUS.NO_IMPROVEMENT) {
    return '상품 적용 전후 예상 금액 차이가 크지 않아요'
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
