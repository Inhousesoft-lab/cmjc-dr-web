# DSIMIS DR Frontend

Vite + React 기반의 행정/업무용 프론트엔드 프로젝트입니다. 한국어 UI를 기본으로 다국어 라우팅 프리픽스(`/:lang`)를 지원합니다.

## 실행 방법

1. 의존성 설치
```
npm install
```

2. 개발 서버 실행
```
npm run dev
```

로컬 기본 접속 주소는 터미널에 출력되는 Vite URL을 확인하세요.

## 스크립트

- `npm run dev`: 개발 서버 실행
- `npm run build`: 프로덕션 빌드
- `npm run preview`: 빌드 결과 미리보기
- `npm run lint`: ESLint 실행

## 기술 스택

- React 19
- Vite 7
- TypeScript
- MUI 7
- ag-Grid Community
- Redux Toolkit + redux-persist
- i18next

## 프로젝트 구조

- `src/pages`: 화면 단위 페이지
- `src/routes`: 메뉴/라우팅 관련 설정
- `src/components`: 공통 컴포넌트
- `src/mocks`: 목 데이터
- `src/theme`: 테마/스타일 커스터마이징
- `src/features`: Redux 슬라이스/도메인 기능

## 라우팅/메뉴

- 메뉴 정의: `src/routes/menuItems.tsx`
- 페이지 매핑: `src/routes/ComponentMap.tsx`
- 언어 프리픽스: `src/routes/lang.ts`
  - 예: `/ko/...`, `/en/...`

메뉴 항목(`menuItems`)에 등록된 `element`는 `ComponentMap`에서 실제 페이지 컴포넌트로 매핑됩니다.

## 환경 및 기타

- Node.js LTS 권장 (18+)
- 기본 언어는 `ko`이며, 브라우저 언어 혹은 저장된 설정을 기준으로 자동 결정됩니다.

## 참고

- 목 데이터는 `src/mocks`에 위치합니다.
- ag-Grid 설정은 `src/components/grid/AgGridContainer.tsx`를 참고하세요.
