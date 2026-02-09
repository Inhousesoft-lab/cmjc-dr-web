// 과제 응답에 포함되는 참여기관 정보
export interface StudyInstitutionListRowResponse {
  instId?: string; // 참여기관아이디
  instNm?: string; // 참여기관명
}

// 과제 응답에 포함되는 연구원 역할 정보
export interface StudyResearcherRoleListRowResponse {
  asmtStngPicId?: string; // 과제설정담당자아이디
  asmtStngPicNm?: string; // 과제설정담당자명
  picRoleId?: string; // 담당자역할아이디
  ptcpInstId?: string; // 참여기관아이디
  ptcpInstNm?: string; // 참여기관명
}

export interface Researcher {
  rscrId?: string; // 책임연구원
  rscrNm?: string; // 책임연구원명
  instId?: string; // 기관
  instNm?: string; // 기관명
}

// 역할 목록 항목
export interface RoleItem {
  roleId?: string; // 역할
  roleNm?: string; // 역할명
}

// 액션리스트
export interface AvailableActions {
  action: string;
  commentRequired: boolean;
}

export interface AvailableOperations {
  canEdit: boolean;
  canDelete: boolean;
}

export interface ApprovalStatusHistories {
  rowNo?: number;
  rscr?: Researcher;
  regDmndSttsCd?: string;
  rscrRvwCn: string;
  regDt: string;
}

// StudyInformationResponse 기반 과제 응답 모델
export interface Basic {
  asmtId?: string; // 과제아이디
  regDt?: string; // 등록일시
  rgtrId?: string; // 등록자아이디
  mdfcnDt?: string; // 수정일시
  mdfrId?: string; // 수정자아이디
  asmtDtlId?: string; // 과제상세아이디
  nxtmAsmtDtlId?: string; // 차기과제상세아이디
  asmtStngPicDtlStngId?: string; // 과제설정담당자상세설정아이디
  asmtNoNm?: string; // 과제번호명
  adrxAsmtNm?: string; // 약물부작용 과제명
  asmtVerCnt?: number; // 과제버전수
  asmtAbbrCn?: string; // 과제약어내용
  rschPrpsCn?: string; // 연구목적내용
  rschSmryCn?: string; // 연구요약내용
  rschTrprSttsCd?: string; // 연구대상자상태코드
  rschTrprSttsCdNm?: string; // 연구대상자상태코드명
  dssClsfCd?: string; // 질병분류코드
  dssClsfDtlCd?: string; // 질병분류상세코드
  asmtSttsCd?: string; // 과제상태코드
  asmtSttsCdNm?: string; // 과제상태명
  rspRscrId?: string; // 책임연구원아이디
  rspRscrNm?: string; // 책임연구원이름
  rschFldLclsfCd?: string; // 연구분야대분류코드
  rschFldMclsfCd?: string; // 연구분야중분류코드
  rschClsfLclsfCd?: string; // 연구분류대분류코드
  rschClsfMclsfCd?: string; // 연구분류중분류코드
  rschClsfSclsfCd?: string; // 연구분류소분류코드
  rschScpCd?: string; // 연구범위코드
  goalRschTrprCnt?: number; // 목표연구대상자수
  eyeTypeCd?: string; // 눈유형코드
  eyeTypeCdNm?: string; // 눈유형코드명
  altmntYn?: string; // 배정여부
  rschPrdBgngDt?: string; // 연구기간시작일시
  rschPrdEndDt?: string; // 연구기간종료일시
  rscoSprtInstLclsfCd?: string; // 연구비지원기관대분류코드
  rscoSprtInstMclsfCd?: string; // 연구비지원기관중분류코드
  rscoSprtInstSclsfCd?: string; // 연구비지원기관소분류코드
  utztnAplyInstAsmtYn?: string; // 이용신청기관과제여부
  utztnAplyInst?: StudyInstitutionListRowResponse; // 이용시청기관
  studyInstitutions?: StudyInstitutionListRowResponse[]; // 참여기관
  rschTrprIdAutoCrtYn?: string; // 연구대상자아이디자동생성여부
  brdtClctYn?: string; // 생년월일수집여부
  dcmntAgreExmptnYn?: string; // 서류동의면제여부
  altmntUseYn?: string; // 배정사용여부
  rctnNmUseYn?: string; // 반응명사용여부
  rctnNmId?: string; // 반응명아이디
  iprodUseYn?: string; // 시험약사용여부
  fileUldUseYn?: string; // 파일업로드사용여부
  regDmndSttsCd?: string; // 등록요청상태코드
  regDmndSttsCdNm?: string; // 등록요청상태코드명
  rscrId?: string; // 연구원아이디
  rscrNm?: string; // 연구원명
  rscrRvwCn?: string; // 책임연구원검토내용
  aplyDt?: string; // 신청일시
  aprvDt?: string; // 승인일시
  studyResearcherRoles?: StudyResearcherRoleListRowResponse[]; // 과제 연구원 역할 목록
  rspRscr?: Researcher; // 책임연구원 역할
  clnclTestDsgnr?: Researcher; // CRA
  versionLabel?: string; // 버전 라벨
  availableActions?: AvailableActions[];
  availableOperations?: AvailableOperations;
  approvalStatusHistories?: ApprovalStatusHistories[];
}

export interface ActionRequest {
  action: string;
  comment: string;
}
