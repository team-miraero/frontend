<template>
  <div class="min-h-full bg-[#f8fafc] pb-16">
    <RoadmapSelector
      :goals="goals"
      :selected-goal-id="selectedGoalId"
      :disabled="areGoalsLoading"
      @update:selected-goal-id="goalStore.selectGoal"
    />

    <div class="page-container pb-10 pt-4 sm:pb-14 sm:pt-6">
      <!-- 1. 상단 맞춤 추천 브리핑 카드 (메인 대시보드 스타일) -->
      <section
        class="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_24px_rgba(15,35,70,0.04)] sm:p-6 md:p-7"
        aria-labelledby="recommendation-summary-title"
      >
        <div class="flex flex-col gap-4">
          <!-- 로딩 상태 -->

          <!-- 로딩 상태 -->
          <div v-if="isRecommendationLoading" class="space-y-2 py-2">
            <div class="h-5 w-64 animate-pulse rounded-lg bg-slate-100" />
            <div class="h-4 w-96 max-w-full animate-pulse rounded-lg bg-slate-100" />
          </div>

          <!-- 브리핑 메인 헤드라인 & 설명 -->
          <template v-else>
            <div>
              <h2
                id="recommendation-summary-title"
                class="text-lg font-bold tracking-tight text-[#0a192f] sm:text-xl md:text-2xl"
              >
                <template v-if="hasNoMaturityEligibleProducts">
                  목표 기간 내 만기 가능한 상품이 없어요
                </template>
                <template v-else-if="hasOnlyMoneyBox">
                  <span class="text-primary">‘{{ selectedGoalName }}’</span> 저금통에 모인 돈, 이자 혜택까지 더해볼까요?
                </template>
                <template v-else-if="linkedAssets.length > 0">
                  <span class="text-primary">‘{{ selectedGoalName }}’</span> 연결 자산을 기준으로 추천 상품을 비교했어요
                </template>
                <template v-else> 현재 로드맵 연결 자산을 확인하지 못했어요 </template>
              </h2>
              <p
                v-if="hasNoMaturityEligibleProducts"
                class="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-500"
              >
                기간을 조정했을 때 이용할 수 있는 상품도 함께 보여드려요.
              </p>
              <p
                v-else-if="hasOnlyMoneyBox && bestProduct"
                class="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-500"
              >
                {{ bestProduct.productName }}에 연결하면 최고
                <strong class="font-bold text-primary tabular-nums">
                  연 {{ formatRateCompact(bestRate) }}%
                </strong>
                이자를 받으며 목표를 더 빠르게 달성할 수 있어요.
              </p>
              <p
                v-else-if="linkedAssets.length > 0 && bestProduct"
                class="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-500"
              >
                현재 연결 자산의 잔액 가중평균 금리는
                <strong class="font-bold text-[#0a192f] tabular-nums">
                  연 {{ formatRate(currentInterestRate) }}%
                </strong>
                이고, 추천 상품 중 최고 금리는
                <strong class="font-bold text-primary tabular-nums">연 {{ formatRate(bestRate) }}%</strong>
                입니다.
                <template v-if="rateDifference > 0">
                  현재 금리보다
                  <strong class="font-bold text-primary tabular-nums">{{ formatRate(rateDifference) }}%p</strong>
                  더 높아요.
                </template>
                <template v-else-if="rateDifference === 0"> 현재 상품과 같은 수준이에요. </template>
                <template v-else>
                  현재 상품이
                  <strong class="font-bold text-primary tabular-nums">{{ formatRate(-rateDifference) }}%p</strong>
                  더 높아요.
                </template>
              </p>
            </div>

            <!-- 하단 인셋 비교 카드 (대시보드 인셋 스타일) -->
            <div
              v-if="linkedAssets.length > 0 || bestProduct"
              class="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 sm:p-4 shadow-xs"
            >
              <div class="px-2">
                <span class="text-[11px] font-bold text-slate-400">현재 상태</span>
                <p class="mt-0.5 text-sm sm:text-base font-bold text-[#0a192f] tabular-nums">
                  {{ linkedAssets.length > 0 ? `연 ${formatRate(currentInterestRate)}%` : '일반 저금통 (0%)' }}
                </p>
              </div>
              <div class="px-2 border-l border-slate-200/70">
                <span class="text-[11px] font-bold text-slate-400">추천 상품 금리</span>
                <p class="mt-0.5 text-sm sm:text-base font-bold text-primary tabular-nums">
                  최고 연 {{ formatRate(bestRate) }}%
                </p>
              </div>
              <div class="col-span-2 sm:col-span-1 px-2 border-t sm:border-t-0 sm:border-l border-slate-200/70 pt-2 sm:pt-0">
                <span class="text-[11px] font-bold text-slate-400">금리 혜택</span>
                <p class="mt-0.5 text-sm sm:text-base font-bold text-primary tabular-nums">
                  {{ rateDifference > 0 ? `+${formatRate(rateDifference)}%p UP` : (hasOnlyMoneyBox ? `+${formatRate(bestRate)}%p 이자 혜택` : '동일 수준') }}
                </p>
              </div>
            </div>
          </template>
        </div>
      </section>

      <section class="mt-5" aria-labelledby="product-list-title">
        <div class="flex items-end justify-between gap-4">
          <div
            class="no-scrollbar -my-1.5 flex min-w-0 items-center gap-2 overflow-x-auto py-1.5 px-0.5"
            role="tablist"
            aria-label="상품 종류"
          >
            <button
              v-for="(tab, tabIndex) in productTabs"
              :id="`${tab.value}-tab`"
              :key="tab.value"
              type="button"
              role="tab"
              class="shrink-0 cursor-pointer rounded-full border px-4 py-2 text-xs font-bold transition-all duration-200 ease-out hover:-translate-y-0.5 select-none"
              :class="
                activeFilter === tab.value
                  ? 'border-primary bg-primary text-white shadow-[0_4px_14px_rgba(0,102,255,0.22)]'
                  : 'border-slate-200/90 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-[#0a192f]'
              "
              :aria-selected="activeFilter === tab.value"
              :aria-controls="`${tab.value}-panel`"
              :tabindex="activeFilter === tab.value ? 0 : -1"
              @click="activeFilter = tab.value"
              @keydown="handleProductTabKeydown($event, tabIndex)"
            >
              {{ tab.label }}
            </button>
          </div>
          <p class="mb-2 shrink-0 text-xs font-medium tabular-nums text-slate-400">
            {{ sortedProducts.length }}개 상품
          </p>
        </div>

        <h2 id="product-list-title" class="sr-only">추천 상품 목록</h2>

        <div
          :id="`${activeFilter}-panel`"
          role="tabpanel"
          :aria-labelledby="`${activeFilter}-tab`"
          class="mt-3"
          tabindex="0"
        >
          <div
            v-if="isRecommendationLoading"
            class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
            aria-label="상품 목록을 불러오는 중"
          >
            <div
              v-for="index in 6"
              :key="index"
              class="h-[310px] animate-pulse rounded-[18px] border border-[#e1e8f1] bg-white p-5"
            >
              <div class="h-3 w-20 rounded bg-slate-100" />
              <div class="mt-3 h-5 w-2/3 rounded bg-slate-100" />
              <div class="mt-5 h-11 rounded-xl bg-slate-100" />
              <div class="mt-3 h-14 rounded-xl bg-slate-100" />
            </div>
          </div>

          <div
            v-else-if="productsStore.error"
            class="flex min-h-[300px] flex-col items-center justify-center rounded-[18px] border border-[#e1e8f1] bg-white px-6 text-center"
          >
            <div
              class="flex size-11 items-center justify-center rounded-full bg-red-50 text-red-500"
            >
              !
            </div>
            <p class="mt-3 text-[15px] font-bold text-[#10233f]">상품을 불러오지 못했어요</p>
            <p class="mt-1 text-[13px] text-slate-400">잠시 후 다시 시도해 주세요.</p>
            <button
              type="button"
              class="mt-4 rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-white"
              @click="fetchAllProducts(true)"
            >
              다시 시도
            </button>
          </div>

          <div
            v-else-if="sortedProducts.length === 0"
            class="flex min-h-[300px] flex-col items-center justify-center rounded-[18px] border border-[#e1e8f1] bg-white px-6 text-center"
          >
            <div
              class="flex size-11 items-center justify-center rounded-full bg-[#eef5ff] text-primary"
            >
              %
            </div>
            <p class="mt-3 text-[15px] font-bold text-[#10233f]">확인 가능한 상품이 아직 없어요</p>
            <button
              type="button"
              class="mt-4 rounded-xl border border-primary/20 px-5 py-2.5 text-[13px] font-bold text-primary"
              @click="activeFilter = 'all'"
            >
              전체 상품 보기
            </button>
          </div>

          <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <ProductCard
              v-for="(product, productIndex) in sortedProducts"
              :key="`${product.productType}-${getProductId(product)}`"
              :product="product"
              :product-type="product.productType"
              :is-highest-rate="Number(product.maximumInterestRate) === bestRate"
              :is-top-recommended="productIndex === 0"
              :goal-name="selectedGoalName"
              :eligible-maturity-terms="product.eligibleMaturityTerms"
              :recommendation-impact="product.recommendationImpact"
              :has-linked-assets="linkedAssets.length > 0"
              :has-only-money-box="hasOnlyMoneyBox"
              :current-interest-rate="currentInterestRate"
              @view-detail="openProductDetail"
            />
          </div>
        </div>
      </section>

      <div
        class="mt-6 flex items-start gap-2.5 rounded-2xl border border-slate-200/60 bg-slate-50/80 p-4 text-[11px] leading-relaxed text-slate-400 shadow-xs"
      >
        <span
          class="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-slate-200/80 text-[10px] font-bold text-slate-600"
          aria-hidden="true"
        >
          i
        </span>
        <p>
          본 정보는 비교를 위한 참고 자료이며 금융상품 구매 권유가 아닙니다. 표시된 금리는 세전
          기준이며, 우대조건 충족 여부와 금융기관 공시에 따라 달라질 수 있습니다. 목표 단축 개월은
          현재 모은 금액과 남은 기간으로 월 목표 저축액을 추정하고 상품 기본금리를 적용한
          예상값입니다.
        </p>
      </div>
    </div>

    <ProductDetailModal
      :open="isDetailOpen"
      :product="productsStore.selectedProduct"
      :product-type="selectedProductType"
      :is-loading="productsStore.isDetailLoading"
      :has-error="Boolean(productsStore.detailError)"
      @close="closeProductDetail"
      @retry="retryProductDetail"
    />
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { goalApi, useGoalStore } from '@/features/goal'
import {
  CALCULATION_STATUS,
  ProductCard,
  ProductDetailModal,
  calculateRecommendationImpact,
  getMaturityEligibleTerms,
  calculateWeightedInterestRate,
  formatRate,
  formatRateCompact,
  isLinkedProduct,
  useProductsStore,
} from '@/features/products'
import RoadmapSelector from '@/shared/ui/RoadmapSelector.vue'
import productsIcon from '@/assets/icons/products.svg'
import { formatKRWCompact } from '@/shared/lib/money'

const productTabs = [
  { value: 'all', label: '전체' },
  { value: 'saving', label: '적금' },
  { value: 'deposit', label: '예금' },
]

const goalStore = useGoalStore()
const productsStore = useProductsStore()
const { goals, selectedGoalId, selectedGoal, areGoalsLoading } = storeToRefs(goalStore)

const activeFilter = ref('all')
const isDetailOpen = ref(false)
const detailProductId = ref(null)
const selectedProductType = ref('deposit')
const appliedGoalDetail = ref(null)
const linkedAssets = ref([])
const linkedAccounts = ref([])
const isAppliedProductLoading = ref(false)
let appliedProductRequestId = 0

const selectedGoalName = computed(() => selectedGoal.value?.goalName ?? '선택한 목표')
const roadmapHelperText = computed(() =>
  selectedGoal.value
    ? `‘${selectedGoal.value.goalName}’ 로드맵에 맞춘 추천이에요`
    : ''
)
const isRecommendationLoading = computed(
  () => areGoalsLoading.value || productsStore.isLoading || isAppliedProductLoading.value
)

const allProducts = computed(() => [
  ...productsStore.productsByType.saving.map((product) => ({
    ...product,
    productType: 'saving',
  })),
  ...productsStore.productsByType.deposit.map((product) => ({
    ...product,
    productType: 'deposit',
  })),
])

const recommendationProducts = computed(() =>
  allProducts.value
    .filter((product) => !isLinkedProduct(product, product.productType, linkedAccounts.value))
    .map((product) => ({
      ...product,
      eligibleMaturityTerms: getMaturityEligibleTerms(
        product,
        appliedGoalDetail.value?.period?.remainMonths
      ),
      recommendationImpact: calculateRecommendationImpact({
        goal: appliedGoalDetail.value,
        linkedAssets: linkedAssets.value,
        product,
        productType: product.productType,
      }),
    }))
)

const hasNoMaturityEligibleProducts = computed(() => {
  const remainMonths = Number(appliedGoalDetail.value?.period?.remainMonths)
  return (
    Number.isFinite(remainMonths) &&
    remainMonths > 0 &&
    recommendationProducts.value.length > 0 &&
    recommendationProducts.value.every((product) => product.eligibleMaturityTerms.length === 0)
  )
})

const filteredProducts = computed(() => {
  if (activeFilter.value === 'all') return recommendationProducts.value
  return recommendationProducts.value.filter(
    (product) => product.productType === activeFilter.value
  )
})

function needsLongerPeriod(product) {
  const termCount = new Set([
    ...(product.saveTerms ?? []),
    ...(product.options ?? []).map((option) => option.saveTerm),
  ]).size

  return (
    product.recommendationImpact?.calculationStatus === CALCULATION_STATUS.NOT_APPLICABLE &&
    (product.eligibleMaturityTerms?.length ?? 0) === 0 &&
    termCount > 0
  )
}

const sortedProducts = computed(() =>
  [...filteredProducts.value].sort((a, b) => {
    const aNeedsLongerPeriod = needsLongerPeriod(a)
    const bNeedsLongerPeriod = needsLongerPeriod(b)
    if (aNeedsLongerPeriod !== bNeedsLongerPeriod) {
      return aNeedsLongerPeriod ? 1 : -1
    }
    return Number(b.maximumInterestRate) - Number(a.maximumInterestRate)
  })
)

const bestProduct = computed(() =>
  recommendationProducts.value.reduce((currentBest, product) => {
    if (!currentBest) return product

    return Number(product.maximumInterestRate ?? 0) > Number(currentBest.maximumInterestRate ?? 0)
      ? product
      : currentBest
  }, null)
)

const bestRate = computed(() => Number(bestProduct.value?.maximumInterestRate ?? 0))

const hasOnlyMoneyBox = computed(
  () =>
    linkedAssets.value.length > 0 &&
    linkedAssets.value.every((asset) => asset.assetType === 'MONEY_BOX')
)

const currentInterestRate = computed(() => calculateWeightedInterestRate(linkedAssets.value))

const rateDifference = computed(() => bestRate.value - currentInterestRate.value)

const estimatedMonthlyContribution = computed(() => {
  const goalAmount = Number(appliedGoalDetail.value?.goalAmount)
  const currentAmount = Number(appliedGoalDetail.value?.currentAmount)
  const remainMonths = Number(appliedGoalDetail.value?.period?.remainMonths)
  if (![goalAmount, currentAmount, remainMonths].every(Number.isFinite) || remainMonths <= 0) {
    return 0
  }
  return Math.max(0, (goalAmount - currentAmount) / remainMonths)
})

onMounted(async () => {
  await Promise.all([goalStore.fetchGoals(), fetchAllProducts()])
})

watch(selectedGoalId, fetchAppliedProduct, { immediate: true })

async function fetchAppliedProduct(goalId) {
  const requestId = ++appliedProductRequestId

  if (!goalId) {
    appliedGoalDetail.value = null
    linkedAssets.value = []
    linkedAccounts.value = []
    isAppliedProductLoading.value = false
    return
  }

  isAppliedProductLoading.value = true
  try {
    const [linkedAssetData, goalDetail] = await Promise.all([
      goalApi.getGoalLinkedAssets(goalId),
      goalApi.getGoalDetail(goalId),
    ])
    if (requestId !== appliedProductRequestId) return

    const accountAssets = linkedAssetData.linkedAssets.filter(
      (asset) => asset.assetType === 'ACCOUNT'
    )
    let accounts = []
    if (accountAssets.length > 0) {
      try {
        accounts = (await goalApi.getAccounts()).accounts
      } catch {
        accounts = []
      }
    }
    if (requestId !== appliedProductRequestId) return

    linkedAssets.value = linkedAssetData.linkedAssets
    linkedAccounts.value = accountAssets.map((asset) => ({
      asset,
      accountDetail:
        accounts.find((account) => Number(account.accountId) === Number(asset.assetId)) ?? null,
    }))
    appliedGoalDetail.value = goalDetail
  } catch {
    if (requestId === appliedProductRequestId) {
      appliedGoalDetail.value = null
      linkedAssets.value = []
      linkedAccounts.value = []
    }
  } finally {
    if (requestId === appliedProductRequestId) {
      isAppliedProductLoading.value = false
    }
  }
}

async function fetchAllProducts(force = false) {
  await Promise.all([
    productsStore.fetchProducts('deposit', { force }),
    productsStore.fetchProducts('saving', { force }),
  ])
}

function getProductId(product) {
  return product.depositProductId ?? product.savingProductId
}

function handleProductTabKeydown(event, currentIndex) {
  const keyTargets = {
    ArrowRight: (currentIndex + 1) % productTabs.length,
    ArrowLeft: (currentIndex - 1 + productTabs.length) % productTabs.length,
    Home: 0,
    End: productTabs.length - 1,
  }
  const nextIndex = keyTargets[event.key]
  if (nextIndex === undefined) return

  event.preventDefault()
  const nextTab = productTabs[nextIndex]
  activeFilter.value = nextTab.value
  nextTick(() => document.getElementById(`${nextTab.value}-tab`)?.focus())
}

async function openProductDetail(product) {
  selectedProductType.value = product.productType
  detailProductId.value = getProductId(product)
  isDetailOpen.value = true

  if (product.isDetailLoaded) {
    productsStore.selectProduct(product)
    return
  }

  await productsStore.fetchProductDetail(selectedProductType.value, detailProductId.value)
}

function closeProductDetail() {
  isDetailOpen.value = false
  detailProductId.value = null
  productsStore.clearSelectedProduct()
}

function retryProductDetail() {
  if (detailProductId.value) {
    productsStore.fetchProductDetail(selectedProductType.value, detailProductId.value)
  }
}
</script>
