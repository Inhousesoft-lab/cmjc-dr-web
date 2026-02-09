import type { Paging } from "./common";

export interface HoldingInstitutionSearchState {
  values: Partial<Omit<SearchValues, "id">>;
}

export interface SearchValues extends Paging {
  fromClctYmd: string;
  toClctYmd: string;
  fromEndYmd: string;
  toEndYmd: string;
  docLclsfNo: string;
  docMclsfNo: string;
  docSclsfNo: string;
  docNo: string;
  docTtl: string;
  infoMnbdAgreYn: string;
  hldPrdDfyrs: string;
  hldPrdChangedOnly: boolean;
}

export interface HoldingInstitution {
  rowNo: number; // 번호
  eldocNo: string; // 문서분류
  docClsfNo: string; // 문서번호
  docNo: string;
  unqNo: string;
  docTtl: string;
  clctYmd: string;
  hldPrdDfyrs: string;
  hldPrdMmCnt: string;
  endYmd: string;
  prvcInclYn: string;
  gvbkYn: string;
  addExpln: string;
  eldocYn: string;
  atchFileSn: string;
  deptId: string;
  dstrcPrcsPrstCd: string;
  dstrcAplyDt: string;
  dstrcAplcntId: string;
  rsn: string;
  dstrcAprvDt: string;
  dstrcAutzrId: string;
  prvcDstrcAprvDt: string;
  prvcDstrcAutzrId: string;
  regDt: string;
  rgtrId: string;
  mdfcnDt: string;
  mdfrId: string;
  docSclsfNo: string;
  docSclsfNm: string;
  docMclsfNo: string;
  docLclsfNo: string;
  docLclsfNm: string;
  docMclsfNm: string;
  endYmdAfterChanged: string;
  docClsf: DocClsf;
}

export interface DocClsf {
  rowNo: number; // 번호
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
  prvcFileHldPrst: PrvcFileHldPrst;
}

export interface PrvcFileHldPrst {
  docClsfNo: string;
  prvcFileHldPrstNo: string;
  deptNm: string;
  fileNm: string;
  hldPrpsExpln: string;
  clctSttBssExpln: string;
  useDeptNm: string;
  prvcPrcsMthdExpln: string;
  hldPrdDfyrs: string;
  hldPrdMmCnt: string;
  infoMnbdPrvcMttr: string;
  sttyAgtPrvcMttr: string;
  rrnoClctYn: string;
  rrnoClctSttBssExpln: string;
  infoMnbdAgreYn: string;
  infoMnbdDsagClctSttBssExpln: string;
  sensInfoHldYn: string;
  sensInfoIndivAgreYn: string;
  sensInfoHldSttBssExpln: string;
  uiiHldYn: string;
  uiiIndivAgreYn: string;
  uiiHldSttBssExpln: string;
  prvcEvlTrgtYn: string;
  hndlPicNm: string;
  tdptySplrcpNmCn: string;
  tdptyPvsnBssExpln: string;
  tdptyPvsnMttr: string;
  prvcPrcsCnsgnBzentyNmCn: string;
  prvcCnsgnCtrtYn: string;
  prvcCnsgnFactIndctYn: string;
  prpsExclUtztnPvsnYn: string;
  prpsExclUtztnPvsnBssExpln: string;
  regDt: string;
  rgtrId: string;
  mdfcnDt: string;
  mdfrId: string;
}
