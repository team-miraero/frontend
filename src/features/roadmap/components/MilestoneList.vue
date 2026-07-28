<!-- 전체 마일스톤 리스트 -->
<template>
  <div class="rounded-3xl border border-slate-200 bg-white p-[25px] shadow-[0_2px_7px_rgba(0,102,255,0.06)]">
    <p class="pb-5 text-xs font-bold uppercase tracking-[1.2px] text-slate-400">전체 마일스톤</p>

    <ul class="flex flex-col">
      <li v-for="(milestone, index) in milestones" :key="milestone.milestoneId" class="flex gap-4">
        <div class="flex w-8 flex-col items-center">
          <span
            class="flex size-7 shrink-0 items-center justify-center rounded-full border-2"
            :class="
              milestone.status === 'COMPLETED'
                ? 'border-primary bg-primary shadow-[0_4px_7px_rgba(0,102,255,0.25)]'
                : 'border-slate-200 bg-slate-100'
            "
          >
            <img
              v-if="milestone.status === 'COMPLETED'"
              src="@/assets/icons/milestone-dot-check.svg"
              alt=""
              class="size-2.5"
            />
            <span v-else class="size-1.5 rounded-full bg-slate-300" />
          </span>
          <span
            v-if="index < milestones.length - 1"
            class="my-1 w-0.5 flex-1 rounded-full"
            :class="milestone.status === 'COMPLETED' ? 'bg-primary/15' : 'bg-slate-200'"
          />
        </div>

        <div
          class="mb-4 flex-1 rounded-[18px] border px-4 py-4"
          :class="
            milestone.status === 'COMPLETED'
              ? 'border-primary/15 bg-primary/[0.02]'
              : 'border-slate-200 bg-slate-50'
          "
        >
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-2">
              <span
                class="text-[15px] font-black tracking-[-0.3px]"
                :class="milestone.status === 'COMPLETED' ? 'text-primary' : 'text-slate-400'"
              >
                {{ formatManwon(milestone.targetAmount) }}원
              </span>
              <span
                v-if="milestone.status === 'IN_PROGRESS'"
                class="rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold text-white"
              >
                진행 중
              </span>
              <span
                v-if="milestone.status === 'COMPLETED'"
                class="rounded-full bg-primary/[0.09] px-2 py-0.5 text-[9px] font-bold text-primary"
              >
                완료 ✓
              </span>
            </div>
            <div class="flex items-center gap-1.5">
              <span
                class="text-[10px]"
                :class="milestone.status === 'COMPLETED' ? 'text-primary/60' : 'text-slate-400'"
              >
                {{ milestone.targetDate }}
              </span>
              <img src="@/assets/icons/milestone-chevron.svg" alt="" class="size-[13px]" />
            </div>
          </div>

          <p
            class="pt-0.5 text-[11px] font-bold"
            :class="milestone.status === 'COMPLETED' ? 'text-slate-700' : 'text-slate-400'"
          >
            {{ milestone.title }}
          </p>

          <div v-if="milestone.tags?.length" class="flex gap-1.5 pt-2">
            <span
              v-for="tag in milestone.tags"
              :key="tag"
              class="rounded-full px-2 py-0.5 text-[9.5px] font-bold"
              :class="
                milestone.status === 'COMPLETED'
                  ? 'bg-primary/[0.07] text-primary'
                  : 'bg-slate-100 text-slate-400'
              "
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  milestones: {
    type: Array,
    required: true,
  },
})

function formatManwon(amount) {
  return `${Math.round(amount / 10000).toLocaleString()}만`
}
</script>