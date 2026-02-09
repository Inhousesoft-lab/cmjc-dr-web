import type { Paging } from "./common";

export interface SearchValues extends Paging {
  docLclsfNo: string;
  docMclsfNo: string;
  docSclsfNo: string;
  prvcInclYn: string;
  useEn: string;
  docClsfNm: string;
}

export interface DocClsf {
  rowNo: number;
  docClsfNo: string;
  docClsfSeCd: string;
  docClsfNm: string;
  upDocClsfNo: string;
  prvcInclYn: string;
  useEn: string;
  regYmd: string;
  rgtrId: string;
  mdfcnYmd: string;
  mdfrId: string;
  prvcFileHldPrst: DocClassSubDetail;
}

export interface DocClassificationSearchState {
  values: SearchValues;
}

export interface DocClassification {
  docClsfNo: string;
  docClsfSeCd: string;
  docClsfNm: string;
  upDocClsfNo: string;
  docLclsfNo: string;
  docMclsfNo: string;
  docSclsfNo: string;
  docLclsfNm: string;
  docMclsfNm: string;
  docSclsfNm: string;
  prvcInclYn: string;
  useEn: string;
  regDt: string;
  rgtrId: string;
  mdfcnDt: string;
  mdfrId: string;
}

export interface DocClassDetail {
  docClsfNo: string;
  //docClsfSeCd: string;
  docClsfSeCd: string;
  docClsfNm: string;
  upDocClsfNo: string | null;
  docLclsfNo: string;
  docMclsfNo: string;
  docSclsfNo: string;
  docLclsfNm: string;
  docMclsfNm: string;
  docSclsfNm: string;
  prvcInclYn: string;
  useEn: string;
  regDt: string;
  rgtrId: string;
  prvcFileHldPrst: Partial<DocClassSubDetail>;
}

export interface DocClassSubDetail {
  docClsfNo: string; // 문서분류번호
  prvcFileHldPrstNo: string; // 개인정보파일보유현황번호
  deptNm: string; // 부서명
  fileNm: string; // 파일명
  hldPrpsExpln: string; // 보유목적
  clctSttBssExpln: string; // 수집근거(법령)
  useDeptNm: string; // 사용부서명
  prvcPrcsMthdExpln: string; // 개인정보 처리방법
  hldPrdDfyrs: number | null; // 보유기간 년(1/3/5/10/30/준영구/영구/직접입력)
  hldPrdMmCnt: number | null; // 보유기간 월
  infoMnbdPrvcMttr: string; // 정보주체 개인정보항목
  sttyAgtPrvcMttr: string; // 법정대리인 개인정보항목
  rrnoClctYn: string; // 주민등록번호 수집여부(Y:수집, N:미수집)
  rrnoClctSttBssExpln: string; // 주민등록번호 수집 법령근거
  infoMnbdAgreYn: string; // 정보주체 동의여부(Y:동의, N:미동의)
  infoMnbdDsagClctSttBssExpln: string; // 정보주체 동의 없이 수집 법령근거
  sensInfoHldYn: string; // 민감정보 보유여부(Y:보유, N:미보유)
  sensInfoIndivAgreYn: string; // 민감정보 별도 동의여부(Y:동의, N:미동의)
  sensInfoHldSttBssExpln: string; // 민감정보 보유 법령근거
  uiiHldYn: string; // 고유식별정보 보유여부(Y:보유, N:미보유)
  uiiIndivAgreYn: string; // 고유식별정보 별도 동의여부(Y:동의, N:미동의)
  uiiHldSttBssExpln: string; // 고유식별정보 보유 법령근거
  prvcEvlTrgtYn: string; // 개인정보영향평가 대상여부(Y:대상, N:미대상)
  hndlPicNm: string; // 취급담당자
  tdptySplrcpNmCn: string; // 제3자 제공받는 자
  tdptyPvsnBssExpln: string; // 제3자 제공 근거
  tdptyPvsnMttr: string; // 제3자 제공 항목
  prvcPrcsCnsgnBzentyNmCn: string; // 개인정보처리 위탁 업체명
  prvcCnsgnCtrtYn: string; // 개인정보위탁계약 여부(Y:위탁계약, N:위탁계약 아님)
  prvcCnsgnFactIndctYn: string; // 개인정보위탁사실 게재여부(Y:게재, N:미게재)
  prpsExclUtztnPvsnYn: string; // 목적 외 이용.제공 여부(Y:제공, N:미제공)
  prpsExclUtztnPvsnBssExpln: string; // 목적 외 이용.제공 근거
}

export interface DocClassHistory {
  docClsfNo: string; // 문서분류번호
  docClsfHstryNo: string; // 문서분류이력번호
  docClsfSeCd: string; // 문서분류 구분코드(L:대, M:중, S:소)
  docClsfNm: string; // 문서분류명
  upDocClsfNo: string; // 상위문서분류번호
  prvcInclYn: string; // 개인정보포함여부(Y:포함, N:미포함)
  useEn: string; // 사용유무(Y:사용, N:미사용)
  deptNm: string; // 부서명
  fileNm: string; // 파일명
  hldPrps: string; // 보유목적
  clctSttBssExpln: string; // 수집근거(법령)
  useDeptNm: string; // 사용부서명
  prvcPrcsMthdExpln: string; // 개인정보 처리방법
  hldPrdDfyrs: number | null; // 보유기간 년(1/3/5/10/30/준영구/영구/직접입력)
  hldPrdMmCnt: number | null; // 보유기간 월
  infoMnbdPrvcMttr: string; // 정보주체 개인정보항목
  sttyAgtPrvcMttr: string; // 법정대리인 개인정보항목
  rrnoClctYn: string; // 주민등록번호 수집여부(Y:수집, N:미수집)
  rrnoClctSttBssExpln: string; // 주민등록번호 수집 법령근거
  infoMnbdAgreYn: string; // 정보주체 동의여부(Y:동의, N:미동의)
  infoMnbdDsagClctSttBssExpln: string; // 정보주체 동의 없이 수집 법령근거
  sensInfoHldYn: string; // 민감정보 보유여부(Y:보유, N:미보유)
  sensInfoIndivAgreYn: string; // 민감정보 별도 동의여부(Y:동의, N:미동의)
  sensInfoHldSttBssExpln: string; // 민감정보 보유 법령근거
  uiiHldYn: string; // 고유식별정보 보유여부(Y:보유, N:미보유)
  uiiIndivAgreYn: string; // 고유식별정보 별도 동의여부(Y:동의, N:미동의)
  uiiHldSttBssExpln: string; // 고유식별정보 보유 법령근거
  prvcEvlTrgtYn: string; // 개인정보영향평가 대상여부(Y:대상, N:미대상)
  hndlPicNm: string; // 취급담당자
  tdptySplrcpNmCn: string; // 제3자 제공받는 자
  tdptyPvsnBssExpln: string; // 제3자 제공 근거
  tdptyPvsnMttr: string; // 제3자 제공 항목
  prvcPrcsCnsgnBzentyNmCn: string; // 개인정보처리 위탁 업체명
  prvcCnsgnCtrtYn: string; // 개인정보위탁계약 여부(Y:위탁계약, N:위탁계약 아님)
  prvcCnsgnFactIndctYn: string; // 개인정보위탁사실 게재여부(Y:게재, N:미게재)
  prpsExclUtztnPvsnYn: string; // 목적 외 이용.제공 여부(Y:제공, N:미제공)
  prpsExclUtztnPvsnBssExpln: string; // 목적 외 이용.제공 근거
  actCn: string; // 행위내용
  acsrIpAddr: string; // 접속자IP주소
  regDt: string; // 등록일자
  rgtrId: string; // 등록자
  eqpmntNm: string; // 장비명
}

export interface DocClassDetailFormState {
  values: Partial<Omit<DocClassDetail, "id">>;
  errors: Partial<Record<keyof DocClassDetailFormState["values"], string>>;
}
