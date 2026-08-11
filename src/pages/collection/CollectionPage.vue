<!-- 목표 컬렉션 (Goal Collection) 페이지 (COLL-01~02) -->
<template>
  <div class="flex justify-center bg-[#f8fbff] min-h-[calc(100vh-80px)] pb-16">
    <div class="w-full max-w-[1440px] px-6 py-4 sm:px-8">
      <!-- 로딩 중일 때 스피너 표시 -->
      <div v-if="collectionStore.isLoading" class="flex h-96 items-center justify-center">
        <LoadingSpinner message="달성한 목표 컬렉션을 불러오고 있어요" />
      </div>

      <!-- 상태 1: 빈 컬렉션 (Empty State) -->
      <div v-else-if="!collectionStore.hasGoals" class="py-12">
        <EmptyCollection @start-roadmap="handleGoToGoalSelect" />
      </div>

      <!-- 상태 2: 달성 목표 존재 (Filled State) -->
      <div v-else class="flex flex-col gap-5">
        <!-- 상단 명예의 전당 요약 히어로 배너 -->
        <CollectionHeroBanner
          :total-count="collectionStore.totalAchievedCount"
          :total-amount="collectionStore.totalAchievedAmount"
        />

        <!-- 섹션 헤더 (대시보드 스플릿 기록 헤더 스타일) -->
        <div class="flex items-center justify-between pt-2">
          <div class="flex items-center gap-1.5">
            <span class="text-xs">🎖️</span>
            <p class="text-xs font-bold uppercase tracking-[1.2px] text-slate-400">
              완주한 로드맵 목록
            </p>
          </div>
          <span class="text-xs font-bold text-slate-400">
            총 {{ collectionStore.totalAchievedCount }}개
          </span>
        </div>

        <!-- 컬렉션 카드 그리드 목록 -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CollectionCard
            v-for="goal in collectionStore.achievedGoals"
            :key="goal.id"
            :goal="goal"
            @view-roadmap="handleViewRoadmap"
          />
        </div>

        <!-- 하단 배너 (Call to Action) -->
        <NextGoalBanner class="mt-2" @add-goal="handleGoToGoalSelect" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  useCollectionStore,
  EmptyCollection,
  CollectionCard,
  NextGoalBanner,
  CollectionHeroBanner,
} from '@/features/collection'
import LoadingSpinner from '@/shared/ui/LoadingSpinner.vue'
import { ROUTE_NAMES } from '@/shared/constants/routes'

const router = useRouter()
const collectionStore = useCollectionStore()

onMounted(async () => {
  await collectionStore.fetchAchievedGoals()
})

function handleGoToGoalSelect() {
  router.push({ name: ROUTE_NAMES.GOAL_SELECT })
}

function handleViewRoadmap(goal) {
  if (goal?.id) {
    router.push({ name: ROUTE_NAMES.DASHBOARD_GOAL, params: { goalId: goal.id } })
  } else {
    router.push({ name: ROUTE_NAMES.DASHBOARD })
  }
}
</script>
