<!-- 청년정책 상세 모달 -->
<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      @mousedown.self="emit('close')"
    >
      <section
        class="flex max-h-[calc(100vh-2rem)] w-full max-w-[560px] flex-col overflow-hidden rounded-2xl bg-white shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="policy-detail-title"
      >
        <header class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 id="policy-detail-title" class="text-sm font-bold text-primary">청년 정책 상세</h2>
          <button
            type="button"
            class="flex size-8 items-center justify-center rounded-full bg-gray-100 text-lg text-gray-500"
            aria-label="닫기"
            @click="emit('close')"
          >
            ×
          </button>
        </header>

        <div class="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          <div v-if="isLoading" class="flex min-h-[280px] flex-col items-center justify-center">
            <span class="size-8 animate-spin rounded-full border-4 border-primary/15 border-t-primary" />
            <p class="mt-3 text-sm text-gray-500">정책 정보를 불러오고 있어요</p>
          </div>

          <div v-else-if="hasError" class="flex min-h-[280px] flex-col items-center justify-center text-center">
            <p class="text-sm font-bold text-gray-900">상세 정보를 불러오지 못했어요</p>
            <button
              type="button"
              class="mt-4 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white"
              @click="emit('retry')"
            >
              다시 시도
            </button>
          </div>

          <div v-else-if="policy">
            <span class="rounded-full bg-accent-light px-3 py-1 text-[11px] font-bold text-primary">
              {{ policy.providerInstitutionName }}
            </span>
            <h3 class="mt-3 text-xl font-black text-gray-900">{{ policy.policyName }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-gray-500">{{ policy.policyDescription }}</p>

            <div class="mt-5 rounded-2xl bg-accent-light px-5 py-4">
              <p class="text-xs text-primary/70">지원 내용</p>
              <p class="mt-1 text-sm font-bold text-primary">{{ policy.supportContent }}</p>
            </div>

            <dl class="mt-5 divide-y divide-gray-100 rounded-2xl border border-gray-100 px-4">
              <div v-for="item in infoRows" :key="item.label" class="grid grid-cols-[96px_1fr] gap-3 py-3">
                <dt class="text-xs text-gray-400">{{ item.label }}</dt>
                <dd class="text-sm font-bold leading-relaxed text-gray-700">{{ item.value }}</dd>
              </div>
            </dl>

            <a
              v-if="policy.applicationUrl"
              :href="policy.applicationUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-5 flex items-center justify-center rounded-xl bg-primary py-3 text-sm font-bold text-white"
            >
              신청하러 가기
            </a>
          </div>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  /** @type {import('vue').PropType<import('@/features/youth-policy/api/youthPolicy.api').YouthPolicyDetail | null>} */
  policy: { type: Object, default: null },
  isLoading: { type: Boolean, default: false },
  hasError: { type: Boolean, default: false },
})
const emit = defineEmits(['close', 'retry'])

const infoRows = computed(() => {
  if (!props.policy) return []
  return [
    { label: '신청 기간', value: props.policy.applicationPeriod || '별도 공지' },
    { label: '지원 대상', value: props.policy.qualification || '정보 없음' },
    { label: '소득 조건', value: props.policy.incomeConditionText || '별도 조건 없음' },
    { label: '신청 방법', value: props.policy.applicationMethod || '정보 없음' },
  ].filter((row) => row.value)
})
</script>
