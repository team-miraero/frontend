<template>
  <header class="flex items-center justify-between border-b border-slate-200 bg-white px-10 py-5">
    <div>
      <p class="text-xs text-slate-500">안녕하세요, {{ userName }}님 👋</p>
      <h1 class="pt-0.5 text-[22px] font-black tracking-[-0.44px] text-[#0a192f]">
        내 로드맵 대시보드
      </h1>
    </div>

    <div class="flex items-center gap-3">
      <button
        type="button"
        class="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-4 py-2.5 text-xs font-bold text-primary"
      >
        <img src="@/assets/icons/pacemaker.svg" alt-="" class="size-[13px]" />
        페이스메이커
      </button>

      <div
        class="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#66b2ff] text-sm font-bold text-white"
      >
        {{ userInitial }}
      </div>
    </div>
  </header>
</template>
<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()

const userName = computed(() => authStore.user?.name ?? '')
const userInitial = computed(() => userName.value.charAt(0))
</script>
