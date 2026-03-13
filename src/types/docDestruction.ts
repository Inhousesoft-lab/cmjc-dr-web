import type { Paging } from "./common";

export interface DocDestructionSearchState {
  values: Partial<Omit<SearchValues, "id">>;
  rgtrNm: string;
}

export interface SearchValues extends Paging {
  reqCd?: string;              // 조회구분(APLY/APRV/CMPLT)
  docLclsfNo: string;           // 문서대분류번호
  docMclsfNo: string;           // 문서중분류번호 
  docSclsfNo: string;           // 문서소분류번호
  docNo: string;                // 문서번호
  docTtl: string;               // 문서제목
  hldPrdChangedOnly: boolean;  // 보유기간변경여부
  prvcInclYn: string;           // 개인정보포함여부
  docClsfNm: string;            // 문서분류명
  fromEndYmd: string;          // 종료일자(시작)
  toEndYmd: string;            // 종료일자(종료)
  fromDstrcAplyYmd: string;     // 파기신청일자(시작)
  toDstrcAplyYmd: string;       // 파기신청일자(종료)
  fromDstrcAprvYmd: string;     // 파기승인일자(시작)
  toDstrcAprvYmd: string;       // 파기승인일자(종료)
}

export interface SearchHisValues extends Paging {
  eldocNo: string;
}



export interface DocDestruction {
  rowNo: number;              // 전자문서번호 
  eldocNo: string;           // 전자문서번호
  docCategory: string; // 문서분류
  docNo: string; // 문서번호
  docTitle: string; // 문서제목
  hasPersonalInfo: string; // 개인정보 ("포함" / "미포함")
  prvcInclYn: string; // 개인정보 포함 여부 원본값
  clctYmd: string; // 수집일자
  hldPrdDfyrs: string; // 보존연한(년)
  hldPrdMmCnt: string; // 보존연한(월)
  collectDateLabel: string; // 수집일자(보존연한) 라벨
  dstrcAprvDt: string; // 파기일자
  rsn: string; // 폐기사유
  dstrcPrcsPrstCd: string; // 파기처리현황코드
  dstrcAplcntId: string; // 처리담당자
  dstrcAplyDt: string; // 파기신청일자
  dstrcAutzrId: string; // 처리부서장
  prvcDstrcAutzrId: string; // 개인정보 담당자
  endDate: string; // 종료일자
  docType: string; // 종류 (문서 / 파일 등)
  registrantDept: string; // 등록자(부서)
  rgtrNm: string;
  regDate: string; // 등록일자
  fileName: string; // 개인정보 파일명
  dataTypeLabel: string; // 자료의 종류
}

export interface DocDestructionDetail {
  eldocNo: string; // 전자문서번호
  //pstrcPrcsPrstCd: string; // 파기처리현황코드
}

export interface DocDestructionUpdate {
  password: string; // 비밀번호
  rsn: string; // 사유
  reqCd: string; // 파기처리현황 ("REQ": 파기신청, "APRV01": 부장승인, "APRV02": 개인정보처리담당자승인)
  docs : DocDestructionDetail[];
}


export interface DocDestructionHistory {
  docLclsfNo: string;
  docMclsfNo: string;
  docSclsfNo: string;
  docLclsfNm: string;
  docMclsfNm: string;
  docSclsfNm: string;
  eldocNo: string; // 전자문서번호
  eldocHstryNo: string; // 전자문서이력번호
  docClsfNo: string; // 문서분류번호
  docNo: string; // 문서번호
  unqNo: string; // 고유번호
  docTtl: string; // 문서제목
  clctYmd: string; // 수집일자
  hldPrdDfyrs: string; // 보유기간 년(1/3/5/10/30/준영구/영구/직접입력)
  hldPrdMmCnt: string; // 보유기간 월
  endYmd: string; // 종료일자
  prvcInclYn: string; // 개인정보포함여부
  gvbkYn: string; // 반환여부
  addExpln: string; // 비고
  eldocYn: string; // 전자문서여부
  atchFileSn: string; // 첨부파일일련번호(공통)
  deptId: string; // 기본권한(등록자 부서아이디)
  dstrcPrcsPrstCd: string; // 파기처리현황코드(00:전자문서,01:파기신청,02:부서장승인파기,03:부서장승인,04:개인정보처리담당자승인 파기)
  dstrcAplyDt: string; // 파기신청일자
  dstrcAplcntId: string; // 파기신청자
  rsn: string; // 사유
  dstrcAprvDt: string; // 파기승인일자
  dstrcAutzrId: string; // 파기승인자
  prvcDstrcAprvDt: string; // 개인정보파기승인일자
  prvcDstrcAutzrId: string; // 개인벙보파기승일자
  actCn: string; // 행위내용
  acsrIpAddr: string; // 접속자IP주소
  eqpmntNm: string; // 장비명
  regDt: string; // 등록일자
  rgtrId: string; // 등록자
}


export interface DocDestructionAuthrtHistory {
  eldocNo: string; // 전자문서번호
  inqAuthrtNo: string; // 공람번호
  inqAuthrtHstryNo: string; // 공람이력번호
  deptId: string; // 부서코드
  indvId: string; // 개인코드
  actCn: string; // 행위내용
  delYn: string; // 삭제여부(Y:삭제, N:유지)
  regDt: string; // 등록일자
  rgtrId: string; // 등록자
  rgtrNm: string;
}
