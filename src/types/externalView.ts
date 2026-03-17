import type { Paging } from "./common";

export interface ExternalViewSearchValues extends Paging {
  docLclsfNo: string;
  docMclsfNo: string;
  docSclsfNo: string;
  docNo: string;
  docTtl: string;
}

export interface ExternalViewDocument {
  rowNo: number;
  eldocNo: string;
  docNo: string;
  docTtl: string;
  docClsfNo: string;
  docLclsfNo: string;
  docMclsfNo: string;
  docSclsfNo: string;
  docLclsfNm: string;
  docMclsfNm: string;
  docSclsfNm: string;
  clctYmd: string;
  endYmd: string;
  hldPrdDfyrs: string;
  hldPrdMmCnt: string;
  eldocYn: string;
  prvcInclYn: string;
  atchFileSn: string;
  deptId: string;
  addExpln: string;
}

export interface ExternalViewFilePayload {
  blob: Blob;
  contentType: string;
  fileName: string;
}
