# 미래로 (Miraero)

MZ세대를 위한 목표 기반 자산관리 서비스 프론트엔드.

## 실행법

```bash
npm install
cp .env.example .env
npm run dev
```

- `npm run build` — 프로덕션 빌드
- `npm run preview` — 빌드 결과 미리보기
- `npm run lint` — ESLint 검사 및 자동 수정
- `npm run format` — Prettier 포맷팅

## 폴더 구조

```
src/
  app/        # 라우터, 레이아웃, 플러그인 (앱 전역 설정)
  pages/      # 라우트에 매핑되는 페이지 컴포넌트
  features/   # 도메인별 기능 모듈 (components/composables/store/api/constants/index.js)
  shared/     # 여러 feature가 공유하는 UI/유틸/상수/api 클라이언트
  stores/     # 전역 Pinia store (auth, ui)
  mocks/      # MSW 핸들러 및 fixture
  assets/     # 스타일(tailwind, 브랜드 토큰)
```

의존 방향은 `pages → features → shared` 단방향이며, feature 간 참조는 반드시 각 feature의
`index.js` barrel을 통해서만 합니다. import는 상대경로 없이 `@/` 절대경로만 사용합니다.

## 브랜치 · 커밋 컨벤션

- 브랜치: `feature/{도메인}-{기능ID}` (예: `feature/goal-GOAL-01`)
- 커밋: `type: 설명` — `feat`, `fix`, `chore`, `refactor`, `docs`, `style`, `test`
