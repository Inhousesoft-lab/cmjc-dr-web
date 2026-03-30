import type { Paging } from "./common";

export interface SearchValues extends Paging {
  docLclsfNo: string;
  docMclsfNo: string;
  docSclsfNo: string;
  docNo: string;
  docTtl: string;
  hldPrdChangedOnly: boolean;
}

export interface DigitalDocSearchState {
  values: Partial<Omit<SearchValues, "id">>;
}

export interface DigitalDoc {
  rowNo: number;
  docLclsfNo: string;
  docMclsfNo: string;
  docSclsfNo: string;
  docLclsfNm: string;
  docMclsfNm: string;
  docSclsfNm: string;
  eldocNo: string; // 전자문서번호
  docClsfNo: string; // 문서분류번호
  docNo: string; // 문서번호
  unqNo: string; // 고유번호
  docTtl: string; // 문서제목
  clctYmd: string; // 수집일자
  hldPrdDfyrs: any; // 보유기간 년(1/3/5/10/30/준영구/영구/직접입력)
  hldPrdMmCnt: any; // 보유기간 월
  endYmd: string; // 종료일자
  prvcInclYn: string; // 개인정보포함여부
  gvbkYn: string; // 반환여부(Y:반환,N:미반환)
  addExpln: string; // 비고
  eldocYn: string; // 전자문서여부
  atchFileSn: string; // 첨부파일일련번호(공통)
  deptId: string; // 기본권한(등록자 부서아이디)
  deptNm: string;
  dstrcPrcsPrstCd: string; // 파기처리현황코드(00:전자문서,01:파기신청,02:부서장승인파기,03:부서장승인,04:개인정보처리담당자승인 파기)
  dstrcAplyDt: string; // 파기신청일자
  dstrcAplcntId: string; // 파기신청자
  rsn: string; // 사유
  dstrcAprvDt: string; // 파기승인일자
  dstrcAutzrId: string; // 파기승인자
  prvcDstrcAprvDt: string; // 개인정보파기승인일자
  prvcDstrcAutzrId: string; // 개인정보파기승인자
  regDt: string; // 등록일자
  rgtrId: string; // 등록자
  rgtrNm: string;
  mdfcnDt: string; // 수정일자
  mdfrId: string; // 수정자
}

export interface DigitalDocUpdate {
  docLclsfNo: string;
  docMclsfNo: string;
  eldocNo: string; // 전자문서번호
  docClsfNo: string; // 문서분류번호
  docNo: string; // 문서번호
  docTtl: string; // 문서제목
  gvbkYn: string; // 반환여부(Y:반환,N:미반환)
}

export interface DigitalAuthrt {
  eldocNo: string; // 전자문서번호
  inqAuthrtNo: string; // 공람번호
  deptId: string; // 부서코드
  indvId: string; // 개인코드
  delYn: string; // 삭제여부(Y:삭제, N:유지)
  regDt: string; // 등록일자
  rgtrId: string; // 등록자
  mdfcnDt: string; // 수정일자
  mdfrId: string; // 수정자
}

export interface DigitalDocHistory {
  rowNo?: number;
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
  hldPrdDfyrs: string | number; // 보유기간 년(1/3/5/10/30/준영구/영구/직접입력)
  hldPrdMmCnt: string; // 보유기간 월
  endYmd: string; // 종료일자
  prvcInclYn: string; // 개인정보포함여부
  gvbkYn: string; // 반환여부
  addExpln: string; // 비고
  eldocYn: string; // 전자문서여부
  atchFileSn: string; // 첨부파일일련번호(공통)
  deptId: string; // 기본권한(등록자 부서아이디)
  deptNm: string;
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
  rgtrNm: string;
}

export interface DigitalAuthrtHistory {
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

export interface EldocState extends Paging {
  eldocNo: string;
}

export interface DigitalDocFormState {
  values: Partial<Omit<DigitalDoc, "id">>;
  errors: Partial<Record<keyof DigitalDocFormState["values"], string>>;
}
