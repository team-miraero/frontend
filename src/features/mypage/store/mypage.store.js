import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import * as mypageApi from '@/features/mypage/api/mypage.api'
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  MYPAGE_NOTIFICATION_ITEMS,
  MYPAGE_NOTIFICATION_STORAGE_KEY,
} from '@/features/mypage/constants/mypage.constants'

function loadNotificationSettings() {
  if (typeof window === 'undefined') return { ...DEFAULT_NOTIFICATION_SETTINGS }

  try {
    const savedSettings = JSON.parse(
      window.localStorage.getItem(MYPAGE_NOTIFICATION_STORAGE_KEY) ?? '{}'
    )

    // 목록에서 삭제된 알림 항목의 값이 저장소에 남지 않도록 현재 항목만 반영한다.
    return Object.fromEntries(
      Object.entries(DEFAULT_NOTIFICATION_SETTINGS).map(([id, defaultEnabled]) => [
        id,
        typeof savedSettings[id] === 'boolean' ? savedSettings[id] : defaultEnabled,
      ])
    )
  } catch {
    return { ...DEFAULT_NOTIFICATION_SETTINGS }
  }
}

export const useMypageStore = defineStore('feature-mypage', () => {
  const profile = ref(null)
  const profileImagePreviewUrl = ref('')
  const mydataConnections = ref([])
  const isProfileLoading = ref(false)
  const isProfileImageSaving = ref(false)
  const isPasswordChanging = ref(false)
  const isMydataConnectionsLoading = ref(false)
  const isAccountsSyncing = ref(false)
  const profileError = ref(null)
  const mydataConnectionsError = ref(null)
  const accountsSyncError = ref(null)
  const notificationSettings = ref(loadNotificationSettings())

  const displayProfileImageUrl = computed(
    () => profileImagePreviewUrl.value || profile.value?.profileImageUrl || ''
  )
  const notificationItems = computed(() =>
    MYPAGE_NOTIFICATION_ITEMS.map((item) => ({
      ...item,
      enabled: notificationSettings.value[item.id] ?? item.defaultEnabled,
    }))
  )

  async function fetchProfile() {
    isProfileLoading.value = true
    profileError.value = null

    try {
      const fetchedProfile = await mypageApi.getProfile()
      profile.value = fetchedProfile
      return fetchedProfile
    } catch (error) {
      profileError.value = error
      throw error
    } finally {
      isProfileLoading.value = false
    }
  }

  async function updateProfileImage(file) {
    isProfileImageSaving.value = true
    profileError.value = null

    try {
      const result = await mypageApi.updateProfileImage(file)
      if (profileImagePreviewUrl.value) URL.revokeObjectURL(profileImagePreviewUrl.value)
      profileImagePreviewUrl.value = URL.createObjectURL(file)
      if (profile.value) profile.value.profileImageUrl = result.profileImageUrl
      return result
    } catch (error) {
      profileError.value = error
      throw error
    } finally {
      isProfileImageSaving.value = false
    }
  }

  async function changePassword(payload) {
    isPasswordChanging.value = true

    try {
      await mypageApi.changePassword(payload)
    } finally {
      isPasswordChanging.value = false
    }
  }

  async function fetchMydataConnections() {
    isMydataConnectionsLoading.value = true
    mydataConnectionsError.value = null

    try {
      const connections = await mypageApi.getMydataConnections()
      mydataConnections.value = connections
      return connections
    } catch (error) {
      mydataConnectionsError.value = error
      throw error
    } finally {
      isMydataConnectionsLoading.value = false
    }
  }

  async function syncAccounts() {
    if (isAccountsSyncing.value) return null

    isAccountsSyncing.value = true
    accountsSyncError.value = null

    try {
      return await mypageApi.syncAccounts()
    } catch (error) {
      accountsSyncError.value = error
      throw error
    } finally {
      isAccountsSyncing.value = false
    }
  }

  function toggleNotification(id) {
    if (!Object.hasOwn(notificationSettings.value, id)) return
    notificationSettings.value = {
      ...notificationSettings.value,
      [id]: !notificationSettings.value[id],
    }

    // 알림 API가 제공되기 전까지 이 기기의 화면 설정으로만 보관한다.
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        MYPAGE_NOTIFICATION_STORAGE_KEY,
        JSON.stringify(notificationSettings.value)
      )
    }
  }

  function clearProfile() {
    if (profileImagePreviewUrl.value) URL.revokeObjectURL(profileImagePreviewUrl.value)
    profile.value = null
    profileImagePreviewUrl.value = ''
    mydataConnections.value = []
    profileError.value = null
    mydataConnectionsError.value = null
    accountsSyncError.value = null
  }

  return {
    profile,
    displayProfileImageUrl,
    mydataConnections,
    notificationItems,
    isProfileLoading,
    isProfileImageSaving,
    isPasswordChanging,
    isMydataConnectionsLoading,
    isAccountsSyncing,
    profileError,
    mydataConnectionsError,
    accountsSyncError,
    fetchProfile,
    updateProfileImage,
    changePassword,
    fetchMydataConnections,
    syncAccounts,
    toggleNotification,
    clearProfile,
  }
})
