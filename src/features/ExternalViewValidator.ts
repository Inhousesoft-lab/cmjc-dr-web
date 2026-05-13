import { z } from "zod";

const stringField = z.preprocess((v) => (v == null ? "" : String(v)), z.string());

const numberField = z
  .preprocess((v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }, z.number())
  .optional()
  .default(0);

const booleanField = z.preprocess((v) => {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") {
    const normalized = v.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }
  return Boolean(v);
}, z.boolean());

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
  deptId: stringField,
  addExpln: stringField,
  canView: booleanField,
  canDownload: booleanField,
  downloadReasonRequired: booleanField,
});

export const externalViewDocumentListSchema = z.looseObject({
  list: z.array(externalViewDocumentRowSchema).optional().default([]),
  rows: z.array(externalViewDocumentRowSchema).optional().default([]),
  total: numberField,
  totalCount: numberField,
  rowCount: numberField,
});
