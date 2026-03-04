import { z } from "zod";

const stringField = z.preprocess((v) => (v == null ? "" : String(v)), z.string());

const numberField = z
  .preprocess((v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }, z.number())
  .optional()
  .default(0);

const EMPTY_PRVC_FILE_HLD_PRST = {
  infoMnbdAgreYn: "",
  hldPrdDfyrs: "",
  hldPrdMmCnt: "",
};

const EMPTY_DOC_CLSF = {
  rowNo: 0,
  docClsfNo: "",
  docClsfSeCd: "",
  docClsfNm: "",
  upDocClsfNo: "",
  docLclsfNo: "",
  docMclsfNo: "",
  docSclsfNo: "",
  docLclsfNm: "",
  docMclsfNm: "",
  docSclsfNm: "",
  prvcInclYn: "",
  useEn: "",
  regDt: "",
  rgtrId: "",
  mdfcnDt: "",
  mdfrId: "",
  prvcFileHldPrst: EMPTY_PRVC_FILE_HLD_PRST,
};

const prvcFileHldPrstSchema = z.looseObject({
  infoMnbdAgreYn: stringField,
  hldPrdDfyrs: stringField,
  hldPrdMmCnt: stringField,
});

const docClsfSchema = z.looseObject({
  rowNo: numberField,
  docClsfNo: stringField,
  docClsfSeCd: stringField,
  docClsfNm: stringField,
  upDocClsfNo: stringField,
  docLclsfNo: stringField,
  docMclsfNo: stringField,
  docSclsfNo: stringField,
  docLclsfNm: stringField,
  docMclsfNm: stringField,
  docSclsfNm: stringField,
  prvcInclYn: stringField,
  useEn: stringField,
  regDt: stringField,
  rgtrId: stringField,
  mdfcnDt: stringField,
  mdfrId: stringField,
  prvcFileHldPrst: z
    .preprocess((v) => (v == null ? undefined : v), prvcFileHldPrstSchema)
    .optional()
    .default(EMPTY_PRVC_FILE_HLD_PRST),
});

export const holdingInstitutionRowSchema = z.looseObject({
  rowNo: numberField,
  eldocNo: stringField,
  docClsfNo: stringField,
  docNo: stringField,
  unqNo: stringField,
  docTtl: stringField,
  clctYmd: stringField,
  hldPrdDfyrs: stringField,
  hldPrdMmCnt: stringField,
  endYmd: stringField,
  prvcInclYn: stringField,
  gvbkYn: stringField,
  addExpln: stringField,
  eldocYn: stringField,
  atchFileSn: stringField,
  deptId: stringField,
  dstrcPrcsPrstCd: stringField,
  dstrcAplyDt: stringField,
  dstrcAplcntId: stringField,
  rsn: stringField,
  dstrcAprvDt: stringField,
  dstrcAutzrId: stringField,
  prvcDstrcAprvDt: stringField,
  prvcDstrcAutzrId: stringField,
  regDt: stringField,
  rgtrId: stringField,
  mdfcnDt: stringField,
  mdfrId: stringField,
  docSclsfNo: stringField,
  docSclsfNm: stringField,
  docMclsfNo: stringField,
  docLclsfNo: stringField,
  docLclsfNm: stringField,
  docMclsfNm: stringField,
  endYmdAfterChanged: stringField,
  docClsf: z
    .preprocess((v) => (v == null ? undefined : v), docClsfSchema)
    .optional()
    .default(EMPTY_DOC_CLSF),
});

export const holdingInstitutionListSchema = z.looseObject({
  list: z.array(holdingInstitutionRowSchema).optional().default([]),
  total: numberField,
});
