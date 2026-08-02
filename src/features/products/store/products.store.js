import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import * as productsApi from '@/features/products/api/products.api'

export const useProductsStore = defineStore('feature-products', () => {
  const productsByType = reactive({ deposit: [], saving: [] })
  const loadedTypes = reactive({ deposit: false, saving: false })
  const isLoading = ref(false)
  const error = ref(null)
  let pendingListRequestCount = 0
  const listRequestIds = { deposit: 0, saving: 0 }

  const selectedProduct = ref(null)
  const isDetailLoading = ref(false)
  const detailError = ref(null)
  let detailRequestId = 0

  async function fetchProducts(productType, { force = false } = {}) {
    if (!productsApi.isSupportedProductType(productType)) {
      throw new TypeError(`지원하지 않는 상품 유형입니다: ${productType}`)
    }
    if (!force && loadedTypes[productType]) return

    const requestId = ++listRequestIds[productType]
    pendingListRequestCount += 1
    isLoading.value = true
    error.value = null

    try {
      const response = await productsApi.getProducts(productType)
      if (requestId !== listRequestIds[productType]) return

      const responseKey = productType === 'deposit' ? 'deposits' : 'savings'
      productsByType[productType] = response[responseKey] ?? []
      loadedTypes[productType] = true
    } catch (caughtError) {
      if (requestId === listRequestIds[productType]) {
        error.value = caughtError
      }
    } finally {
      pendingListRequestCount -= 1
      isLoading.value = pendingListRequestCount > 0
    }
  }

  async function fetchProductDetail(productType, productId) {
    const requestId = ++detailRequestId
    selectedProduct.value = null
    isDetailLoading.value = true
    detailError.value = null

    try {
      const product = await productsApi.getProductDetail(productType, productId)
      if (requestId === detailRequestId) {
        selectedProduct.value = product
      }
    } catch (caughtError) {
      if (requestId === detailRequestId) {
        detailError.value = caughtError
      }
    } finally {
      if (requestId === detailRequestId) {
        isDetailLoading.value = false
      }
    }
  }

  function clearSelectedProduct() {
    detailRequestId += 1
    selectedProduct.value = null
    isDetailLoading.value = false
    detailError.value = null
  }

  return {
    productsByType,
    isLoading,
    error,
    selectedProduct,
    isDetailLoading,
    detailError,
    fetchProducts,
    fetchProductDetail,
    clearSelectedProduct,
  }
})
