// 목표 페이스 계산 단일 소스
//
// 서버가 내려주는 currentAmount(누적 저축액)/goalAmount(목표 금액)/pace.expectedAmount(현재 시점까지
// 계획상 모았어야 하는 누적 금액)는 전부 "누적" 값이다. 화면에 "/월"로 보여줄 값은 이 누적 값을
// 그대로 쓰면 안 되고, 경과/전체 개월 수로 나눈 실제 월평균 속도로 다시 계산해야 한다.
//
//   currentMonthlyPace = currentAmount / elapsedMonths        (지금까지의 월평균 저축 속도)
//   targetMonthlyPace  = goalAmount / totalGoalMonths         (목표 달성에 필요한 월 저축 속도)
//   paceDifference     = currentMonthlyPace - targetMonthlyPace
//
// 로드맵 캐릭터 위치는 반대로 "누적 진행률"을 그대로 써야 한다 (월 페이스와 섞으면 안 됨).
//   currentProgress  = currentAmount / goalAmount * 100
//   expectedProgress = expectedAmount / goalAmount * 100

export const PACE_STATE = {
  NOT_STARTED: 'NOT_STARTED',
  ON_TRACK: 'ON_TRACK',
  AHEAD: 'AHEAD',
  BEHIND: 'BEHIND',
}

// 반올림 시 화면에 "0만원"으로 표시되는 오차 범위는 ON_TRACK으로 취급해
// 표시 상태(state)와 표시 숫자(label)가 항상 일치하도록 한다.
const NEGLIGIBLE_MANWON = 0.5

function clampPercent(value) {
  if (!Number.isFinite(value)) return 0
  return Math.min(100, Math.max(0, value))
}

/**
 * goal 원본(currentAmount/goalAmount/pace.expectedAmount/period.{goalMonths,remainMonths})으로부터
 * 월 페이스와 누적 진행률을 함께 계산한다.
 */
export function deriveGoalPaceMetrics(goal) {
  const currentAmount = Number(goal?.currentAmount ?? 0)
  const goalAmount = Number(goal?.goalAmount ?? 0)
  const expectedAmount = Number(goal?.pace?.expectedAmount ?? 0)
  const goalMonths = Number(goal?.period?.goalMonths ?? 0)
  const remainMonths = Number(goal?.period?.remainMonths ?? 0)

  // 시작 직후(경과 0개월)에는 나눗셈이 불가능하므로 최소 1개월로 보정한다.
  const elapsedMonths = Math.max(1, goalMonths - remainMonths)

  const currentMonthlyPace = currentAmount / elapsedMonths
  const targetMonthlyPace = goalMonths > 0 ? goalAmount / goalMonths : 0
  const paceDifference = currentMonthlyPace - targetMonthlyPace

  const currentProgress = goalAmount > 0 ? clampPercent((currentAmount / goalAmount) * 100) : 0
  const expectedProgress = goalAmount > 0 ? clampPercent((expectedAmount / goalAmount) * 100) : 0

  return {
    currentMonthlyPace,
    targetMonthlyPace,
    paceDifference,
    currentProgress,
    expectedProgress,
  }
}

// 화면 표시 상태·문구·CTA·클릭 동작이 전부 같은 값을 바라보도록 하는 단일 판정 함수.
// - 아직 실제 저축 진행이 없으면(currentAmount<=0) 무조건 시작 전(NOT_STARTED)
// - 그 외에는 새로 계산한 월 페이스 차이(paceDifference)의 부호로 판정
//   (반올림 시 "0만원"으로 보이는 오차는 ON_TRACK으로 취급해 숫자와 상태를 일치시킨다)
export function derivePaceState(goal) {
  const currentAmount = Number(goal?.currentAmount ?? 0)
  if (!(currentAmount > 0)) return PACE_STATE.NOT_STARTED

  const { paceDifference } = deriveGoalPaceMetrics(goal)
  const diffManwon = paceDifference / 10000
  if (diffManwon > NEGLIGIBLE_MANWON) return PACE_STATE.AHEAD
  if (diffManwon < -NEGLIGIBLE_MANWON) return PACE_STATE.BEHIND
  return PACE_STATE.ON_TRACK
}
