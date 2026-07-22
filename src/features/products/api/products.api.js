// products 도메인 API 함수 골격: KB 상품 추천 (KB-01~02)

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {number} interestRate
 */

/**
 * @typedef {Object} ProductDetail
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {number} interestRate
 * @property {string} conditions
 */

/**
 * @param {string} goalId
 * @returns {Promise<Product[]>}
 */
export async function getRecommendedProducts(goalId) {
  // TODO: 실제 API 연동 시 client.get(`/products/recommendations?goalId=${goalId}`)로 교체
  return []
}

/**
 * @param {string} productId
 * @returns {Promise<ProductDetail>}
 */
export async function getProductDetail(productId) {
  // TODO: 실제 API 연동 시 client.get(`/products/${productId}`)로 교체
  return { id: '', name: '', description: '', interestRate: 0, conditions: '' }
}
