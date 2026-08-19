// 목표 페이스 상태(시작 전/적정/앞섬/뒤처짐) 판정 단일 소스
// 기존 paceStatus(AHEAD/ON_TRACK/BEHIND) 계산 로직은 그대로 두고,
// "아직 실제 저축 진행이 없는 상태(NOT_STARTED)"만 최우선으로 덧씌운다.
export const PACE_STATE = {
  NOT_STARTED: 'NOT_STARTED',
  ON_TRACK: 'ON_TRACK',
  AHEAD: 'AHEAD',
  BEHIND: 'BEHIND',
}

export function derivePaceState({ currentAmount, paceStatus }) {
  if (!(Number(currentAmount) > 0)) return PACE_STATE.NOT_STARTED

  const status = String(paceStatus ?? '').toUpperCase()
  if (status === 'AHEAD' || status === 'BEHIND' || status === 'ON_TRACK') return status
  return PACE_STATE.ON_TRACK
}
