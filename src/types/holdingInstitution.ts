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
  hldPrdDfyrs: string;
}

export interface HoldingInstitution {
  rowNo: number;
  eldocNo: string;
  docClsfNo: string;
  docNo: string;
  docTtl: string;
  clctYmd: string;
  hldPrdDfyrs: string;
  hldPrdMmCnt: string;
  endYmd: string;
  addExpln: string;
  deptId: string;
  deptNm: string;
  dstrcPrcsPrstCd: string;
  dstrcAplyDt: string;
  dstrcAplcntId: string;
  rsn: string;
  dstrcAprvDt: string;
  dstrcAutzrId: string;
  regDt: string;
  rgtrId: string;
  rgtrNm: string;
  mdfcnDt: string;
  mdfrId: string;
  docSclsfNo: string;
  docSclsfNm: string;
  docMclsfNo: string;
  docLclsfNo: string;
  docLclsfNm: string;
  docMclsfNm: string;
}
