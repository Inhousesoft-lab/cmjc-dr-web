import type { Paging } from "./common";

export interface ExternalViewSearchValues extends Paging {
  docLclsfNo: string;
  docMclsfNo: string;
  docSclsfNo: string;
  docNo: string;
  docTtl: string;
  allowView: boolean;
  allowDownload: boolean;
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
  deptId: string;
  addExpln: string;
  canView: boolean;
  canDownload: boolean;
  downloadReasonRequired: boolean;
}

export interface ExternalViewFilePayload {
  blob: Blob;
  contentType: string;
  fileName: string;
}
