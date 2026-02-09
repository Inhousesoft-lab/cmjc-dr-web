export interface SettingResponse {
  asmtStngId?: string; // 과제설정아이디
  asmtId?: string; // 과제아이디
  rschTrprIdAutoCrtYn?: string; // 연구대상자아이디자동생성여부
  rschTrprIdAutoCrtCnt?: number; // 연구대상자아이디자동생성수
  verSchdlCrtrCd?: string; // 버전일정기준코드
  altmntUseYn?: string; // 배정사용여부
  rctnNmUseYn?: string; // 반응명사용여부
  rctnNmCd?: string; // 반응명코드 (TODO: 코드 필요)
  iprodUseYn?: string; // 임상시험사용여부
  fileUldUseYn?: string; // 파일업로드사용여부
  brdtClctYn?: string; // 생년월일수집여부
  dcmntAgreExmptnYn?: string; // 서류동의면제여부
  regDt?: string; // 등록일시
  rgtrId?: string; // 등록자아이디
  mdfcnDt?: string; // 수정일시
  mdfrId?: string; // 수정자아이디
}

// eCRF 목록
export interface EcrfList {
  clnclTestDtlId: string; // 임상시험상세아이디
  clnclTestId: string; // 임상시험아이디
  asmtId: string; // 과제아이디
  clnclTestNm: string; // 임상시험명
  clnclTestSeqCnt: number; // 임상시험순서
  clnclTestMltYn: string; // 임상시험다중여부
  clnclTestVerCnt: number; // 임상시험버전수 (예: 1.0)
  clnclTestAplcnYmd: string; // 임상시험적용일자 (YYYY-MM-DD)
  clnclTestSttsCd: string; // 임상시험상태코드
  clnclTestSttsNm?: string; // 상태명 (UI 표시용)
  regDt: string; // 등록일시
  rgtrId: string; // 등록자아이디
  rgtrNm?: string; // 작성자명 (UI 표시용)
  mdfcnDt: string; // 수정일시
  mdfrId: string; // 수정자아이디

  drag?: boolean; // 가상 컬럼: 드래그 핸들
  preview?: string; // 가상 컬럼: 미리보기 라벨
  history?: string; // 가상 컬럼: 이력 라벨
  codebook?: string; // 가상 컬럼: 코드북 라벨
}

// ecrf 등록용
export interface EcrfInsert {
  clnclTestNm: string; // 임상시험명
}

// ecrf 등록용
export interface EcrfUpdate {
  clnclTestDtlId: string; // 임상시험상세아이디
  clnclTestNm: string; // 임상시험명
}

// ecrf 버전업용
export interface EcrfVersionUpdate {
  clnclTestVerCnt?: number; // 버전
  versionUp?: boolean; // 버전업여부
  clnclTestAplcnYmd?: string; // 적용일자 (YYYY-MM-DD)
}

// ecrf 항목 리스트
export interface EcrfFieldList {
  artclId: string; // 항목아이디
  clnclTestDtlId: string; // 임상시험아이디
  artclDmnNm: string; // 항목도메인명
  artclMetaInfoNm: string; // 항목메타정보명
  artclVrblNm: string; // 항목변수명
  artclTypeCd: string; // 항목유형코드
  col: string; // 항목데이터유형코드
  artclLenExpln: string; // 항목길이설명
  unitId: string; // 단위아이디
  hlpArtclNmCn: string; // 도움말항목명내용
  hlpInptCn: string; // 도움말입력내용
  regDt: string; // 등록일시 (ISO 문자열)
  rgtrId: string; // 등록자아이디
  mdfcnDt: string; // 수정일시 (ISO 문자열)
  mdfrId: string; // 수정자아이디
}
