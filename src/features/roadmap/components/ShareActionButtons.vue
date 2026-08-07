<!-- 친구에게 공유하기 액션 버튼 그리드 (이미지 저장 / 인스타그램 / 카카오톡 / 공유하기) -->
<template>
  <div class="mt-2 grid grid-cols-3 border-y border-slate-100 py-2">
    <button
      type="button"
      class="flex flex-col items-center justify-center gap-1 text-[11px] text-slate-500 transition-colors hover:text-primary disabled:opacity-60"
      :disabled="isSavingShareImage"
      @click="$emit('save-image')"
    >
      <img src="@/assets/images/download.png" alt="" class="size-6 object-contain" />
      <span class="inline-block text-center">{{
        isSavingShareImage ? '저장 중...' : '이미지 저장'
      }}</span>
    </button>
    <button
      type="button"
      class="flex flex-col items-center justify-center gap-1 text-[11px] text-slate-500 transition-colors hover:text-primary disabled:opacity-60"
      :disabled="isSaving"
      @click="$emit('share-instagram')"
    >
      <img src="@/assets/icons/instagram.svg" alt="" class="size-6 object-contain" />
      <span class="inline-block text-center">인스타그램</span>
    </button>
    <button
      type="button"
      class="flex flex-col items-center justify-center gap-1 text-[11px] text-slate-500 transition-colors hover:text-primary disabled:opacity-60"
      :disabled="isSharingKakao"
      @click="$emit('share-kakao')"
    >
      <img src="@/assets/icons/kakaotalk.svg" alt="" class="size-6 object-contain" />
      <span class="inline-block text-center">{{
        isSharingKakao ? '공유 중...' : '카카오톡'
      }}</span>
    </button>
  </div>

  <button
    type="button"
    class="mt-2 w-full rounded-2xl bg-primary py-2.5 text-sm font-bold text-white transition-all active:scale-[0.99]"
    @click="$emit('share')"
  >
    공유하기
  </button>
</template>

<script setup>
defineProps({
  isSavingShareImage: { type: Boolean, default: false },
  isSaving: { type: Boolean, default: false },
  isSharingKakao: { type: Boolean, default: false },
})

defineEmits(['save-image', 'share-instagram', 'share-kakao', 'share'])
</script>
