// products 도메인 상태 store
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductsStore = defineStore('feature-products', () => {
  // 담을 상태: recommendedProducts, selectedProduct
  const recommendedProducts = ref([])
  const selectedProduct = ref(null)

  return { recommendedProducts, selectedProduct }
})
