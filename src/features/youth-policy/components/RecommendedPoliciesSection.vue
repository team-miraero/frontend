<template>
  <section
    v-if="youthPolicyStore.isRecommendedLoading || youthPolicyStore.recommendedPolicies.length > 0"
    class="mt-4"
  >
    <div class="flex items-end justify-between gap-4">
      <h2 class="text-xl font-black text-gray-900">내 조건에 맞는 정책</h2>
      <button
        v-if="youthPolicyStore.recommendedPolicies.length > RECOMMENDED_PREVIEW_SIZE"
        type="button"
        class="shrink-0 text-sm font-bold text-primary hover:text-blue-700"
        @click="toggleExpanded"
      >
        {{
          isExpanded
            ? '미리보기로 돌아가기'
            : `전체보기 (${youthPolicyStore.recommendedPolicies.length})`
        }}
      </button>
    </div>

    <RecommendationBasisCard :profile="mypageStore.profile" />

    <div
      v-if="youthPolicyStore.isRecommendedLoading"
      class="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      <div
        v-for="index in 3"
        :key="index"
        class="h-[230px] animate-pulse rounded-2xl border-2 border-accent bg-white p-5"
      >
        <div class="h-4 w-20 rounded bg-gray-100" />
        <div class="mt-3 h-5 w-2/3 rounded bg-gray-100" />
        <div class="mt-3 h-3 w-full rounded bg-gray-100" />
        <div class="mt-4 h-8 w-full rounded bg-gray-100" />
      </div>
    </div>

    <div v-else class="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <RecommendedPolicyCard
        v-for="policy in visiblePolicies"
        :key="policy.youthPolicyId"
        :policy="policy"
        @view-detail="emit('view-detail', $event)"
      />
    </div>

    <div
      v-if="isExpanded && totalPages > 1"
      class="mt-6 flex items-center justify-center gap-3"
      aria-label="조건 일치 정책 페이지"
    >
      <button
        type="button"
        class="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-600 disabled:opacity-40"
        :disabled="page === 1"
        @click="page -= 1"
      >
        이전
      </button>
      <span class="min-w-16 text-center text-sm font-bold text-gray-500"
        >{{ page }} / {{ totalPages }}</span
      >
      <button
        type="button"
        class="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-600 disabled:opacity-40"
        :disabled="page === totalPages"
        @click="page += 1"
      >
        다음
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import RecommendationBasisCard from '@/features/youth-policy/components/RecommendationBasisCard.vue'
import RecommendedPolicyCard from '@/features/youth-policy/components/RecommendedPolicyCard.vue'
import {
  RECOMMENDED_PAGE_SIZE,
  RECOMMENDED_PREVIEW_SIZE,
} from '@/features/youth-policy/constants/youthPolicy.constants'
import { useYouthPolicyStore } from '@/features/youth-policy/store/youthPolicy.store'
import { useMypageStore } from '@/features/mypage'

const emit = defineEmits(['view-detail'])
const youthPolicyStore = useYouthPolicyStore()
const mypageStore = useMypageStore()
const isExpanded = ref(false)
const page = ref(1)

watch(
  () => youthPolicyStore.region,
  () => {
    page.value = 1
  }
)

const totalPages = computed(() =>
  Math.max(1, Math.ceil(youthPolicyStore.recommendedPolicies.length / RECOMMENDED_PAGE_SIZE))
)

const visiblePolicies = computed(() => {
  if (!isExpanded.value) {
    return youthPolicyStore.recommendedPolicies.slice(0, RECOMMENDED_PREVIEW_SIZE)
  }
  const start = (page.value - 1) * RECOMMENDED_PAGE_SIZE
  return youthPolicyStore.recommendedPolicies.slice(start, start + RECOMMENDED_PAGE_SIZE)
})

function toggleExpanded() {
  isExpanded.value = !isExpanded.value
  page.value = 1
}
</script>
