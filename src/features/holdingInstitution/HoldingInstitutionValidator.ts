import { z } from "zod";
import { isDateRangeInvalid } from "@/utils/globalFunc";

const stringField = z.preprocess((v) => (v == null ? "" : String(v)), z.string());

const numberField = z
  .preprocess((v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }, z.number())
  .optional()
  .default(0);

export const holdingInstitutionRowSchema = z.looseObject({
  rowNo: numberField,
  eldocNo: stringField,
  docClsfNo: stringField,
  docNo: stringField,
  docTtl: stringField,
  clctYmd: stringField,
  hldPrdDfyrs: stringField,
  hldPrdMmCnt: stringField,
  endYmd: stringField,
  addExpln: stringField,
  deptId: stringField,
  deptNm: stringField,
  dstrcPrcsPrstCd: stringField,
  dstrcAplyDt: stringField,
  dstrcAplcntId: stringField,
  rsn: stringField,
  dstrcAprvDt: stringField,
  dstrcAutzrId: stringField,
  regDt: stringField,
  rgtrId: stringField,
  rgtrNm: stringField,
  mdfcnDt: stringField,
  mdfrId: stringField,
  docSclsfNo: stringField,
  docSclsfNm: stringField,
  docMclsfNo: stringField,
  docLclsfNo: stringField,
  docLclsfNm: stringField,
  docMclsfNm: stringField,
});

export const holdingInstitutionListSchema = z.looseObject({
  list: z.array(holdingInstitutionRowSchema).optional().default([]),
  rows: z.array(holdingInstitutionRowSchema).optional().default([]),
  total: numberField,
  totalCount: numberField,
  rowCount: numberField,
});

const searchStringField = z.preprocess((v) => (v == null ? "" : String(v)), z.string());

export const holdingInstitutionSearchSchema = z
  .object({
    fromClctYmd: searchStringField.optional().default(""),
    toClctYmd: searchStringField.optional().default(""),
    fromEndYmd: searchStringField.optional().default(""),
    toEndYmd: searchStringField.optional().default(""),
    pageNum: z.coerce.number().int().positive().optional(),
    pageSize: z.coerce.number().int().positive().optional(),
  })
  .passthrough()
  .superRefine((data, ctx) => {
    if (isDateRangeInvalid(data.fromClctYmd, data.toClctYmd)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["toClctYmd"],
        message: "수집일자 종료일은 시작일보다 빠를 수 없습니다.",
      });
    }

    if (isDateRangeInvalid(data.fromEndYmd, data.toEndYmd)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["toEndYmd"],
        message: "종료일자 종료일은 시작일보다 빠를 수 없습니다.",
      });
    }
  });

export function holdingInstitutionSearchValidator(data: unknown) {
  const result = holdingInstitutionSearchSchema.safeParse(data);
  return result.success
    ? { success: true as const, data: result.data, issues: [] }
    : { success: false as const, data: null, issues: result.error.issues };
}
