function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .toLocaleLowerCase('ko-KR')
    .replace(/[^\p{L}\p{N}]/gu, '')
}

function normalizeInstitution(value) {
  return normalizeText(value).replace(/은행$/, '')
}

function normalizeProductType(value) {
  const normalized = String(value ?? '').toLocaleLowerCase('en-US')
  return normalized === 'deposit' || normalized === 'saving' ? normalized : null
}

/**
 * productCode가 없는 연결 계좌를 기관명과 상품명으로 비교한다.
 * 계좌 상세를 조회한 경우 accountType까지 일치해야 같은 상품으로 본다.
 */
export function isLinkedProduct(product, productType, linkedAccounts = []) {
  const normalizedProductName = normalizeText(product?.productName)
  const normalizedProductInstitution = normalizeInstitution(product?.institutionName)
  if (!normalizedProductName) return false

  return linkedAccounts.some(({ asset, accountDetail }) => {
    const accountType = normalizeProductType(accountDetail?.accountType)
    if (accountType && accountType !== productType) return false

    const institution = normalizeInstitution(
      accountDetail?.institutionName ?? asset?.institutionName
    )
    if (
      normalizedProductInstitution &&
      institution &&
      normalizedProductInstitution !== institution
    ) {
      return false
    }

    const accountNames = [accountDetail?.accountName, asset?.assetName]
      .map(normalizeText)
      .filter(Boolean)

    return accountNames.includes(normalizedProductName)
  })
}
