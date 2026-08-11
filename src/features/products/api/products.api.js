import { client } from '@/shared/api/client'

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function isValidProduct(product, productIdKey) {
  return (
    isRecord(product) &&
    product[productIdKey] != null &&
    typeof product.productName === 'string' &&
    product.productName.trim().length > 0 &&
    product.maximumInterestRate != null &&
    Number.isFinite(Number(product.maximumInterestRate)) &&
    Array.isArray(product.options)
  )
}

function validateProductListResponse(data, listKey, productIdKey) {
  if (!isRecord(data) || !Array.isArray(data[listKey])) {
    throw new TypeError('상품 목록 API 응답 형식이 올바르지 않습니다.')
  }

  if (!data[listKey].every((product) => isValidProduct(product, productIdKey))) {
    throw new TypeError('상품 목록에 필수 정보가 누락되었습니다.')
  }

  return data
}

function validateProductDetailResponse(data, productIdKey) {
  if (!isValidProduct(data, productIdKey)) {
    throw new TypeError('상품 상세 API 응답 형식이 올바르지 않습니다.')
  }

  return data
}

export async function getDepositProducts(params = {}) {
  const { data } = await client.get('/deposits', { params })
  return validateProductListResponse(data, 'deposits', 'depositProductId')
}

export async function getDepositProductDetail(depositProductId) {
  const { data } = await client.get(`/deposits/${depositProductId}`)
  return validateProductDetailResponse(data, 'depositProductId')
}

export async function getSavingProducts(params = {}) {
  const { data } = await client.get('/savings', { params })
  return validateProductListResponse(data, 'savings', 'savingProductId')
}

export async function getSavingProductDetail(savingProductId) {
  const { data } = await client.get(`/savings/${savingProductId}`)
  return validateProductDetailResponse(data, 'savingProductId')
}

const productApiByType = {
  deposit: {
    getList: getDepositProducts,
    getDetail: getDepositProductDetail,
  },
  saving: {
    getList: getSavingProducts,
    getDetail: getSavingProductDetail,
  },
}

export function isSupportedProductType(productType) {
  return Object.hasOwn(productApiByType, productType)
}

function getProductApi(productType) {
  if (!isSupportedProductType(productType)) {
    throw new TypeError(`지원하지 않는 상품 유형입니다: ${productType}`)
  }

  return productApiByType[productType]
}

export async function getProducts(productType, params = {}) {
  return getProductApi(productType).getList(params)
}

export async function getProductDetail(productType, productId) {
  return getProductApi(productType).getDetail(productId)
}
