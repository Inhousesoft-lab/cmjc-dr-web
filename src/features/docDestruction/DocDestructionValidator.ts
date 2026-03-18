import { z } from "zod";

const stringField = z.preprocess((v) => (v == null ? "" : String(v)), z.string());

const numberField = z.preprocess((v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}, z.number());

export const docDestructionListRowSchema = z.looseObject({
  rowNo: numberField.optional().default(0),
  eldocNo: stringField.optional().default(""),
  docCategory: stringField.optional().default(""),
  docClsfNm: stringField.optional().default(""),
  docLclsfNm: stringField.optional().default(""),
  docMclsfNm: stringField.optional().default(""),
  docSclsfNm: stringField.optional().default(""),
  docNo: stringField.optional().default(""),
  docTitle: stringField.optional().default(""),
  docTtl: stringField.optional().default(""),
  hasPersonalInfo: stringField.optional().default(""),
  prvcInclYn: stringField.optional().default(""),
  collectDateLabel: stringField.optional().default(""),
  clctYmd: stringField.optional().default(""),
  hldPrdDfyrs: stringField.optional().default(""),
  hldPrdMmCnt: stringField.optional().default(""),
  dstrcAprvDt: stringField.optional().default(""),
  dstrcAprvYmd: stringField.optional().default(""),
  dstrcPrcsPrstCd: stringField.optional().default(""),
  rsn: stringField.optional().default(""),
  dstrcAplcntId: stringField.optional().default(""),
  dstrcAplyDt: stringField.optional().default(""),
  dstrcAutzrId: stringField.optional().default(""),
  prvcDstrcAutzrId: stringField.optional().default(""),
  endDate: stringField.optional().default(""),
  endYmd: stringField.optional().default(""),
  docType: stringField.optional().default(""),
  eldocYn: stringField.optional().default(""),
  registrantDept: stringField.optional().default(""),
  deptNm: stringField.optional().default(""),
  rgtrId: stringField.optional().default(""),
  rgtrNm: stringField.optional().default(""),
  regDate: stringField.optional().default(""),
  regDt: stringField.optional().default(""),
  fileName: stringField.optional().default(""),
  fileNm: stringField.optional().default(""),
  dataTypeLabel: stringField.optional().default(""),
});

export const docDestructionListSchema = z.looseObject({
  list: z.array(docDestructionListRowSchema).optional().default([]),
  rows: z.array(docDestructionListRowSchema).optional().default([]),
  total: numberField.optional().default(0),
  totalCount: numberField.optional().default(0),
  rowCount: numberField.optional().default(0),
});

export const docDestructionDetailSchema = z.looseObject({
  eldocNo: stringField.optional().default(""),
  docClsfNm: stringField.optional().default(""),
  docCategory: stringField.optional().default(""),
  docLclsfNm: stringField.optional().default(""),
  docMclsfNm: stringField.optional().default(""),
  docSclsfNm: stringField.optional().default(""),
  docNo: stringField.optional().default(""),
  docTtl: stringField.optional().default(""),
  docTitle: stringField.optional().default(""),
  dstrcAprvDt: stringField.optional().default(""),
  dstrcAprvYmd: stringField.optional().default(""),
  clctYmd: stringField.optional().default(""),
  collectDateLabel: stringField.optional().default(""),
  hldPrdDfyrs: stringField.optional().default(""),
  hldPrdMmCnt: stringField.optional().default(""),
  endYmd: stringField.optional().default(""),
  endDate: stringField.optional().default(""),
  dstrcAplcntId: stringField.optional().default(""),
  dstrcAplyDt: stringField.optional().default(""),
  dstrcAutzrId: stringField.optional().default(""),
  prvcInclYn: stringField.optional().default(""),
  hasPersonalInfo: stringField.optional().default(""),
  prvcDstrcAutzrId: stringField.optional().default(""),
  prvcDstrcAprvDt: stringField.optional().default(""),
  eldocYn: stringField.optional().default(""),
  docType: stringField.optional().default(""),
  fileNm: stringField.optional().default(""),
  fileName: stringField.optional().default(""),
  dataTypeLabel: stringField.optional().default(""),
  addExpln: stringField.optional().default(""),
  rsn: stringField.optional().default(""),
});

export type DocDestructionListRowRaw = z.infer<typeof docDestructionListRowSchema>;
export type DocDestructionDetailRaw = z.infer<typeof docDestructionDetailSchema>;
