<template>
  <div class="min-h-full bg-[#f7f9fc]">
    <RoadmapSelector
      :goals="goals"
      :selected-goal-id="selectedGoalId"
      :disabled="areGoalsLoading"
      :helper-text="roadmapHelperText"
      @update:selected-goal-id="goalStore.selectGoal"
    />

    <div class="page-container pb-8 pt-5">
      <section
        class="flex flex-col gap-4 rounded-[20px] border border-[#b9d9ff] bg-[#f1f7ff] px-5 py-5 sm:flex-row sm:items-center sm:px-6"
        aria-labelledby="recommendation-summary-title"
      >
        <div
          class="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-[#b9d9ff] bg-white shadow-[0_4px_12px_rgba(0,102,255,0.08)]"
          aria-hidden="true"
        >
          <img :src="productsIcon" alt="" class="size-5" />
        </div>
        <div class="min-w-0">
          <div v-if="isRecommendationLoading" class="space-y-2 py-1">
            <div class="h-4 w-64 animate-pulse rounded bg-[#dcecff]" />
            <div class="h-3 w-96 max-w-full animate-pulse rounded bg-[#e3effc]" />
          </div>
          <template v-else>
            <h2
              id="recommendation-summary-title"
              class="text-base font-black tracking-[-0.25px] text-[#10233f]"
            >
              <template v-if="hasOnlyMoneyBox">
                <strong class="font-black text-primary">‘{{ selectedGoalName }}’</strong>
                목표 자금을 지금 저금통(이자 없음)에 모으고 있어요
              </template>
              <template v-else-if="linkedAssets.length > 0">
                <strong class="font-black text-primary">‘{{ selectedGoalName }}’</strong>
                연결 자산을 기준으로 추천 상품을 비교했어요
              </template>
              <template v-else> 현재 로드맵 연결 자산을 확인하지 못했어요 </template>
            </h2>
            <p
              v-if="hasOnlyMoneyBox && bestProduct"
              class="mt-1 text-[13px] leading-relaxed text-slate-500"
            >
              {{ bestProduct.productName }}은 우대조건 충족 시 최고
              <strong class="font-black text-primary">
                연 {{ formatRateCompact(bestRate) }}%
              </strong>
              금리를 제공해요. 이자가 없는 저금통과 가입 조건을 비교해 보세요.
            </p>
            <p
              v-else-if="linkedAssets.length > 0 && bestProduct"
              class="mt-1 text-[13px] leading-relaxed text-slate-500"
            >
              현재 연결 자산의 잔액 가중평균 금리는
              <strong class="font-black text-[#10233f]">
                연 {{ formatRate(currentInterestRate) }}%
              </strong>
              이고, 추천 상품 중 우대조건 충족 시 최고 금리는
              <strong class="font-black text-primary">연 {{ formatRate(bestRate) }}%</strong>
              입니다.
              <template v-if="rateDifference > 0">
                현재 금리보다
                <strong class="font-black text-primary">{{ formatRate(rateDifference) }}%p</strong>
                높아요.
              </template>
              <template v-else-if="rateDifference === 0"> 현재 상품과 같은 수준이에요. </template>
              <template v-else>
                현재 상품이
                <strong class="font-black text-primary">{{ formatRate(-rateDifference) }}%p</strong>
                더 높아요.
              </template>
            </p>
            <p v-else class="mt-1 text-[13px] leading-relaxed text-slate-500">
              잠시 후 로드맵의 연결 자산 정보를 다시 확인해 주세요.
            </p>
            <p class="mt-1 text-[11px] text-slate-400">
              <template v-if="appliedGoalDetail">
                {{ selectedGoalName }}
                <template v-if="appliedGoalDetail.goalAmount">
                  · 목표금액 {{ formatKRWCompact(appliedGoalDetail.goalAmount) }}
                </template>
                <template v-if="estimatedMonthlyContribution > 0">
                  · 월 {{ formatKRWCompact(estimatedMonthlyContribution) }} 목표 저축액
                </template>
                · 기본금리 기준 예상
              </template>
              <template v-else> {{ selectedGoalName }} 로드맵 </template>
            </p>
          </template>
        </div>
      </section>

      <section class="mt-5" aria-labelledby="product-list-title">
        <div class="flex items-end justify-between gap-4">
          <div
            class="flex min-w-0 items-center gap-2 overflow-x-auto pb-1"
            role="tablist"
            aria-label="상품 종류"
          >
            <button
              v-for="(tab, tabIndex) in productTabs"
              :id="`${tab.value}-tab`"
              :key="tab.value"
              type="button"
              role="tab"
              class="shrink-0 rounded-full border px-4 py-2 text-[13px] font-bold transition"
              :class="
                activeFilter === tab.value
                  ? 'border-primary bg-primary text-white shadow-[0_4px_10px_rgba(0,102,255,0.18)]'
                  : 'border-[#e0e7f0] bg-white text-slate-500 hover:border-primary/30 hover:text-primary'
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
          <p class="mb-2 shrink-0 text-xs font-medium text-slate-400">
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
            <p class="mt-3 text-[15px] font-black text-[#10233f]">상품을 불러오지 못했어요</p>
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
            <p class="mt-3 text-[15px] font-black text-[#10233f]">확인 가능한 상품이 아직 없어요</p>
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
              v-for="product in sortedProducts"
              :key="`${product.productType}-${getProductId(product)}`"
              :product="product"
              :product-type="product.productType"
              :is-highest-rate="Number(product.maximumInterestRate) === bestRate"
              :goal-name="selectedGoalName"
              :recommendation-impact="product.recommendationImpact"
              @view-detail="openProductDetail"
            />
          </div>
        </div>
      </section>

      <div
        class="mt-5 flex items-start gap-2.5 rounded-xl border border-[#e1e8f1] bg-[#f9fbfd] px-4 py-3 text-[11px] leading-relaxed text-slate-400"
      >
        <span
          class="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-slate-300 text-[10px]"
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
  ProductCard,
  ProductDetailModal,
  calculateRecommendationImpact,
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
    ? `이 페이지의 모든 상품은 ${selectedGoal.value.goalName} 로드맵 기준으로 확인해요`
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
      recommendationImpact: calculateRecommendationImpact({
        goal: appliedGoalDetail.value,
        linkedAssets: linkedAssets.value,
        product,
        productType: product.productType,
      }),
    }))
)

const filteredProducts = computed(() => {
  if (activeFilter.value === 'all') return recommendationProducts.value
  return recommendationProducts.value.filter(
    (product) => product.productType === activeFilter.value
  )
})

const sortedProducts = computed(() =>
  [...filteredProducts.value].sort(
    (a, b) => Number(b.maximumInterestRate) - Number(a.maximumInterestRate)
  )
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
