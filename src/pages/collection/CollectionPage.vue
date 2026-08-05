<!-- 목표 컬렉션 (Goal Collection) 페이지 (COLL-01~02) -->
<template>
  <div class="flex justify-center bg-[#f8fbff] min-h-[calc(100vh-80px)] pb-20">
    <div class="w-full max-w-[1440px] px-6 py-8 sm:px-10">
      <!-- 로딩 중일 때 스피너 표시 -->
      <div v-if="collectionStore.isLoading" class="flex h-96 items-center justify-center">
        <LoadingSpinner message="달성한 목표 컬렉션을 불러오고 있어요" />
      </div>

      <!-- 상태 1: 빈 컬렉션 (Empty State) -->
      <div v-else-if="!collectionStore.hasGoals" class="py-12">
        <EmptyCollection @start-roadmap="handleGoToGoalSelect" />
      </div>

      <!-- 상태 2: 달성 목표 존재 (Filled State) -->
      <div v-else class="flex flex-col gap-8">
        <!-- 페이지 상단 헤더 -->
        <CollectionHeader :achieved-count="collectionStore.achievedGoals.length" />

        <!-- 컬렉션 카드 그리드 목록 -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CollectionCard
            v-for="goal in collectionStore.achievedGoals"
            :key="goal.id"
            :goal="goal"
            @view-roadmap="handleViewRoadmap"
          />
        </div>

        <!-- 하단 배너 (Call to Action) -->
        <NextGoalBanner class="mt-4" @add-goal="handleGoToGoalSelect" />
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
  CollectionHeader,
  CollectionCard,
  NextGoalBanner,
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
