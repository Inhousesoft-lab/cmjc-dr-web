# DigitalDocForm

`DigitalDocForm`은 전자문서 등록 화면이며, `zod` 기반 검증과 `redux thunk/slice/selectors`를 통해 저장 API(`insertEDocApiPath`)를 호출합니다.

## 관련 파일

- 페이지: `src/pages/ko/DigitalDoc/DigitalDocForm/index.tsx`
- Validator: `src/features/digitalDoc/DigitalDocValidator.ts`
- Thunk: `src/features/digitalDoc/DigitalDocThunk.ts`
- Slice: `src/features/digitalDoc/DigitalDocSlice.ts`
- Selectors: `src/features/digitalDoc/DigitalDocSelectors.ts`
- API Path: `src/api/digitalDoc/DigitalDocApiPaths.ts`

## 저장 프로세스

1. 사용자가 폼 입력 후 `등록` 버튼 클릭
2. `digitalDocFormValidator(payload)`로 선검증
3. 검증 성공 시 `dispatch(createDigitalDoc(payload)).unwrap()` 실행
4. thunk에서 `insertEDocApiPath()`로 `POST /api/dr/electronicdocument/add` 호출
5. slice가 `pending/fulfilled/rejected` 상태를 반영 (`saving`, `saveSuccess`, `saveError`)
6. 화면에서 selector로 상태를 읽어 버튼 비활성화/알림 처리

## 검증 규칙 (zod)

- 필수: `docLclsfNo`, `docMclsfNo`, `docSclsfNo`, `docNo`, `docTtl`, `clctYmd`, `hldPrdDfyrs`
- 날짜 형식: `YYYY-MM-DD`
- 보존연한 직접입력(`hldPrdDfyrs === "0"`)인 경우:
  - `hldPrdMmCnt`는 0보다 큰 숫자
  - `endYmd`는 필수

## 폼 상태와 파생값

- `docClsfNo`는 저장 시점에 `docSclsfNo || docMclsfNo || docLclsfNo`로 계산
- 저장 중에는 `saving === true`로 `등록` 버튼 비활성화

## Redux 상태

### Slice State (`digitalDocList`)

- 목록 상태: `rows`, `rowCount`, `loading`, `error`
- 저장 상태: `saving`, `saveSuccess`, `saveError`

### Selectors

- `selectDigitalDocSaving`
- `selectDigitalDocSaveSuccess`
- `selectDigitalDocSaveError`

## 사용자 피드백

- 검증 실패: 필드 에러 + 공통 에러 알림
- 저장 성공: 성공 알림 후 목록 화면 이동 (`/digitalDoc/list`)
- 저장 실패: 서버/네트워크 에러 메시지 알림

## 향후 확장 포인트

- 서버 응답 스키마(zod) 추가 검증
- 수정/상세 화면과 폼 상태 모델 통합
