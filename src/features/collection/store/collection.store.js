// collection 도메인 상태 store
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCollectionStore = defineStore('feature-collection', () => {
  // 담을 상태: collectionStatus
  const collectionStatus = ref(null)

  return { collectionStatus }
})
