// pacemaker 도메인 상태 store: 자동저축 활성화 상태
import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as pacemakerApi from '@/features/pacemaker/api/pacemaker.api'

export const usePacemakerStore = defineStore('feature-pacemaker', () => {
  /** @type {import('vue').Ref<import('@/features/pacemaker/api/pacemaker.api').PacemakerStatus | null>} */
  const pacemakerStatus = ref(null)

  async function fetchPacemakerStatus() {
    pacemakerStatus.value = await pacemakerApi.getPacemakerStatus()
  }

  async function togglePacemaker() {
    if (!pacemakerStatus.value?.autoSavingId) return
    const nextStatus = pacemakerStatus.value.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
    const result = await pacemakerApi.updatePacemakerStatus(
      pacemakerStatus.value.autoSavingId,
      nextStatus
    )
    pacemakerStatus.value.status = result.status
    pacemakerStatus.value.enabled = result.status === 'ACTIVE'
  }

  return { pacemakerStatus, fetchPacemakerStatus, togglePacemaker}
})
