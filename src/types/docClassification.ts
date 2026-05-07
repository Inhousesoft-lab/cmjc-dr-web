import type { Paging } from "./common";

export interface DocClassificationSearch extends Paging {
  docLclsfNo: string;
  docMclsfNo: string;
  docSclsfNo: string;
  useEn: string;
  docClsfNm: string;
}

export interface DocClsf {
  rowNo: number;
  docClsfNo: string;
  docClsfSeCd: string;
  docClsfNm: string;
  upDocClsfNo: string;
  useEn: string;
  regYmd: string;
  rgtrId: string;
  mdfrId: string;
  mdfcnYmd: string;
}

export interface DocClassificationVO {
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
  useEn: string;
  regDt: string;
  rgtrId: string;
  rgtrNm: string;
  mdfcnDt: string;
  mdfrId: string;
}

export interface DocClassDetail {
  docClsfNo: string;
  docClsfSeCd: string;
  docClsfNm: string;
  upDocClsfNo: string | null;
  docLclsfNo: string;
  docMclsfNo: string;
  docSclsfNo: string;
  docLclsfNm: string;
  docMclsfNm: string;
  docSclsfNm: string;
  useEn: string;
  regDt: string;
  rgtrId: string;
  rgtrNm?: string;
  mdfrId: string;
}

export interface DocClassHistory {
  docClsfNo: string;
  docClsfHstryNo: string;
  docClsfSeCd: string;
  docClsfNm: string;
  upDocClsfNo: string;
  useEn: string;
  actCn: string;
  acsrIpAddr: string;
  regDt: string;
  rgtrId: string;
  rgtrNm: string;
  eqpmntNm: string;
}

export interface DocClassificationDeleteRequest {
  docClsfNo: string;
  password: string;
  reason: string;
}

export interface DocClassificationUnuseRequest {
  docClsfNo: string;
  password: string;
  reason: string;
}

export interface DocClassificationDeleteCheckResponse {
  hasLinkedElectronicDocs: boolean;
}

export interface DocClassDetailFormState {
  values: Partial<Omit<DocClassDetail, "id">>;
  errors: Partial<Record<keyof DocClassDetailFormState["values"], string>>;
}
