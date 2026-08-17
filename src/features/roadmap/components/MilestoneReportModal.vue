<!-- 스플릿 기록에서 선택한 마일스톤의 AI 리포트를 보여주는 모달 -->
<template>
  <BaseModal
    :model-value="modelValue"
    hide-default-close
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <article v-if="milestone" class="overflow-hidden rounded-2xl bg-white">
      <header
        class="border-b border-blue-100 bg-[linear-gradient(145deg,#f7faff_0%,#eef5ff_100%)] px-6 pb-6 pt-6"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex min-w-0 items-center gap-3">
            <div
              class="size-11 shrink-0 overflow-hidden rounded-xl shadow-[0_8px_18px_rgba(0,102,255,0.2)]"
            >
              <img :src="brandLogo" alt="미래로 로고" class="size-full object-contain" />
            </div>
            <div class="min-w-0">
              <p class="text-[11px] font-black uppercase tracking-[1.2px] text-primary">
                Miraero AI Report
              </p>
              <h2 class="pt-0.5 text-lg font-black tracking-tight text-[#0a192f]">
                마일스톤 AI 리포트
              </h2>
            </div>
          </div>
          <button
            type="button"
            class="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/80 shadow-sm transition hover:bg-white"
            aria-label="AI 리포트 닫기"
            @click="$emit('update:modelValue', false)"
          >
            <img src="@/assets/icons/modal-close.svg" alt="" class="size-[15px]" />
          </button>
        </div>

        <div class="mt-5 flex items-end justify-between gap-4">
          <div>
            <span
              class="inline-flex rounded-full bg-primary px-2.5 py-1 text-[10px] font-black text-white"
            >
              SPLIT {{ milestone.order }}
            </span>
            <p class="mt-2 text-xl font-black tracking-tight text-[#0a192f]">
              {{ reportTitle }}
            </p>
          </div>
          <span
            class="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-black"
            :class="milestoneStatus.className"
          >
            {{ milestoneStatus.label }}
          </span>
        </div>
      </header>

      <div class="px-6 pb-6 pt-5">
        <dl
          class="grid grid-cols-3 divide-x divide-slate-100 rounded-2xl border border-slate-100 bg-slate-50/70 px-2 py-3.5 text-center"
        >
          <div class="px-2">
            <dt class="text-[10px] font-bold text-slate-400">목표 금액</dt>
            <dd class="mt-1 text-xs font-black text-[#0a192f]">{{ formattedAmount }}</dd>
          </div>
          <div class="px-2">
            <dt class="text-[10px] font-bold text-slate-400">목표 지점</dt>
            <dd class="mt-1 text-xs font-black text-primary">{{ milestone.percentage }}%</dd>
          </div>
          <div class="px-2">
            <dt class="text-[10px] font-bold text-slate-400">달성일</dt>
            <dd class="mt-1 text-xs font-black text-[#0a192f]">{{ achievedDate }}</dd>
          </div>
        </dl>

        <section v-if="reportContent" class="mt-5" aria-label="AI 분석 내용">
          <div class="mb-3 flex items-center gap-2">
            <span
              class="flex size-5 items-center justify-center rounded-full bg-emerald-50 text-[11px] font-black text-emerald-600"
            >
              ✓
            </span>
            <p class="text-xs font-black text-emerald-600">AI 분석 완료</p>
          </div>
          <p class="whitespace-pre-line text-sm leading-7 text-slate-600">{{ reportContent }}</p>
        </section>

        <section
          v-else
          class="mt-5 rounded-2xl border border-dashed border-blue-200 bg-[#f8fbff] px-5 py-8 text-center"
          aria-live="polite"
        >
          <div
            class="mx-auto flex size-11 items-center justify-center rounded-2xl bg-blue-100 text-xl"
          >
            {{ emptyState.icon }}
          </div>
          <p class="mt-3 text-sm font-black text-[#0a192f]">{{ emptyState.title }}</p>
          <p class="mt-1.5 text-xs leading-5 text-slate-500">{{ emptyState.description }}</p>
        </section>

        <p class="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-[11px] leading-5 text-slate-400">
          AI 리포트는 목표 진행 데이터와 연결 자산 흐름을 바탕으로 작성된 참고 정보예요.
        </p>

        <button
          type="button"
          class="mt-5 w-full rounded-2xl bg-primary py-3.5 text-sm font-bold text-white shadow-[0_6px_16px_rgba(0,102,255,0.2)] transition hover:bg-blue-700"
          @click="$emit('update:modelValue', false)"
        >
          확인
        </button>
      </div>
    </article>
  </BaseModal>
</template>

<script setup>
import { computed } from 'vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import brandLogo from '@/assets/images/logo.png'
import { formatKRWCompact } from '@/shared/lib/money'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  milestone: { type: Object, default: null },
})

defineEmits(['update:modelValue'])

const reportTitle = computed(
  () =>
    props.milestone?.report?.title ||
    props.milestone?.title ||
    `${props.milestone?.percentage ?? 0}% 마일스톤`
)

const reportContent = computed(() => String(props.milestone?.report?.content ?? '').trim())
const reportStatus = computed(() => String(props.milestone?.report?.status ?? '').toUpperCase())
const formattedAmount = computed(() => formatKRWCompact(props.milestone?.targetAmount ?? 0))
const achievedDate = computed(() => props.milestone?.targetDate?.replaceAll('-', '.') ?? '달성 전')

const milestoneStatus = computed(() => {
  if (props.milestone?.status === 'COMPLETED') {
    return { label: '달성 완료', className: 'bg-emerald-50 text-emerald-600' }
  }
  if (props.milestone?.status === 'IN_PROGRESS') {
    return { label: '진행 중', className: 'bg-blue-100 text-primary' }
  }
  return { label: '도전 대기', className: 'bg-slate-100 text-slate-500' }
})

const emptyState = computed(() => {
  if (['FAILED', 'ERROR'].includes(reportStatus.value)) {
    return {
      icon: '↻',
      title: '리포트를 불러오지 못했어요',
      description: 'AI 분석이 다시 완료되면 이곳에서 내용을 확인할 수 있어요.',
    }
  }

  if (props.milestone?.status === 'COMPLETED') {
    return {
      icon: '✨',
      title: 'AI 리포트를 준비하고 있어요',
      description: '달성 데이터를 분석 중이에요. 잠시 후 다시 확인해 주세요.',
    }
  }

  return {
    icon: '🔒',
    title: '달성 후 리포트가 열려요',
    description: '이 마일스톤에 도달하면 AI가 진행 과정을 분석해 드려요.',
  }
})
</script>
