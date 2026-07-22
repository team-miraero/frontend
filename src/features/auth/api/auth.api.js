// auth 도메인 API 함수 골격 (AUTH-01~03)

/**
 * @typedef {Object} LoginCredentials
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} SignupPayload
 * @property {string} email
 * @property {string} password
 * @property {string} name
 */

/**
 * @typedef {Object} AuthUser
 * @property {string} id
 * @property {string} name
 * @property {string} email
 */

/**
 * @param {LoginCredentials} credentials
 * @returns {Promise<{ accessToken: string, user: AuthUser }>}
 */
export async function login(credentials) {
  // TODO: 실제 API 연동 시 client.post('/auth/login', credentials)로 교체
  return { accessToken: '', user: { id: '', name: '', email: '' } }
}

/**
 * @param {SignupPayload} payload
 * @returns {Promise<AuthUser>}
 */
export async function signup(payload) {
  // TODO: 실제 API 연동 시 client.post('/auth/signup', payload)로 교체
  return { id: '', name: '', email: '' }
}

/**
 * @returns {Promise<AuthUser>}
 */
export async function getMe() {
  // TODO: 실제 API 연동 시 client.get('/auth/me')로 교체
  return { id: '', name: '', email: '' }
}
