// mypage 도메인 API 함수 골격 (MY-01)

/**
 * @typedef {Object} Profile
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string[]} linkedAccountIds
 */

/**
 * @returns {Promise<Profile>}
 */
export async function getProfile() {
  // TODO: 실제 API 연동 시 client.get('/mypage/profile')로 교체
  return { id: '', name: '', email: '', linkedAccountIds: [] }
}

/**
 * @param {{ name?: string }} payload
 * @returns {Promise<Profile>}
 */
export async function updateProfile(payload) {
  // TODO: 실제 API 연동 시 client.patch('/mypage/profile', payload)로 교체
  return { id: '', name: '', email: '', linkedAccountIds: [] }
}
