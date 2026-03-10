import { z } from "zod";

const stringField = z.preprocess((v) => (v == null ? "" : String(v)), z.string());

const numberField = z
  .preprocess((v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }, z.number())
  .optional()
  .default(0);

export const externalViewDocumentRowSchema = z.looseObject({
  rowNo: numberField,
  eldocNo: stringField,
  docNo: stringField,
  docTtl: stringField,
  docClsfNo: stringField,
  docLclsfNo: stringField,
  docMclsfNo: stringField,
  docSclsfNo: stringField,
  docLclsfNm: stringField,
  docMclsfNm: stringField,
  docSclsfNm: stringField,
  clctYmd: stringField,
  endYmd: stringField,
  hldPrdDfyrs: stringField,
  hldPrdMmCnt: stringField,
  eldocYn: stringField,
  atchFileSn: stringField,
  deptId: stringField,
  addExpln: stringField,
});

export const externalViewDocumentListSchema = z.looseObject({
  list: z.array(externalViewDocumentRowSchema).optional().default([]),
  rows: z.array(externalViewDocumentRowSchema).optional().default([]),
  total: numberField,
  totalCount: numberField,
  rowCount: numberField,
});
