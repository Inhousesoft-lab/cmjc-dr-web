import type { Paging } from "./common";

export interface SearchValues extends Paging {
  docLclsfNo: string;
  docMclsfNo: string;
  docSclsfNo: string;
  docNo: string;
  docTtl: string;
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
  docTtl: string; // 문서제목
  clctYmd: string; // 수집일자
  endYmd: string; // 종료일자
  addExpln: string; // 비고
  deptId: string; // 기본권한(등록자 부서아이디)
  deptNm: string;
  dstrcPrcsPrstCd: string; // 파기처리현황코드(00:전자문서,01:파기신청,02:부서장승인파기,03:부서장승인,04:개인정보처리담당자승인 파기)
  dstrcAplyDt: string; // 파기신청일자
  dstrcAplcntId: string; // 파기신청자
  rsn: string; // 사유
  dstrcAprvDt: string; // 파기승인일자
  dstrcAutzrId: string; // 파기승인자
  regDt: string; // 등록일자
  rgtrId: string; // 등록자
  rgtrNm: string;
  mdfcnDt: string; // 수정일자
  mdfrId: string; // 수정자
  customArticles?: DigitalDocCustomArticle[];
}

export interface DigitalDocUpdate {
  docLclsfNo: string;
  docMclsfNo: string;
  eldocNo: string; // 전자문서번호
  docClsfNo: string; // 문서분류번호
  docNo: string; // 문서번호
  docTtl: string; // 문서제목
  clctYmd: string; // 수집일자
  endYmd: string; // 종료일자
  addExpln: string; // 비고
  customArticles?: DigitalDocCustomArticle[];
}

export interface DigitalDocCustomArticle {
  eldocNo?: string;
  articleId: string;
  articleNm?: string;
  articleCn: string;
  articleSeq?: number;
}

export interface DigitalDocFirstPageOcrResult {
  called: boolean;
  success: boolean;
  skipped: boolean;
  skipReason?: string | null;
  filename?: string | null;
  errorMessage?: string | null;
  response?: Record<string, unknown> | null;
  fields?: Record<string, string> | null;
}

export interface DigitalDocCreateResult {
  result: number;
  eldocNo: string;
  firstPageOcr?: DigitalDocFirstPageOcrResult | null;
}

export interface DigitalAuthrt {
  eldocNo: string; // 전자문서번호
  inqAuthrtNo: string; // 공람번호
  deptId: string; // 부서코드
  deptNm?: string; // 부서명
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
  docTtl: string; // 문서제목
  clctYmd: string; // 수집일자
  endYmd: string; // 종료일자
  addExpln: string; // 비고
  deptId: string; // 기본권한(등록자 부서아이디)
  deptNm: string;
  dstrcPrcsPrstCd: string; // 파기처리현황코드(00:전자문서,01:파기신청,02:부서장승인파기,03:부서장승인,04:개인정보처리담당자승인 파기)
  dstrcAplyDt: string; // 파기신청일자
  dstrcAplcntId: string; // 파기신청자
  rsn: string; // 사유
  dstrcAprvDt: string; // 파기승인일자
  dstrcAutzrId: string; // 파기승인자
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
  deptNm?: string; // 부서명
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
