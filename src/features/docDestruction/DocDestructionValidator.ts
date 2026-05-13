import { z } from "zod";
import { isDateRangeInvalid } from "@/utils/globalFunc";

const stringField = z.preprocess((v) => (v == null ? "" : String(v)), z.string());

const numberField = z.preprocess((v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}, z.number());

const addDateRangeIssue = (
  ctx: z.RefinementCtx,
  fromValue: string,
  toValue: string,
  path: string,
  message: string,
) => {
  if (!isDateRangeInvalid(fromValue, toValue)) {
    return;
  }

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    path: [path],
    message,
  });
};

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
  clctYmd: stringField.optional().default(""),
  dstrcAprvDt: stringField.optional().default(""),
  dstrcAprvYmd: stringField.optional().default(""),
  dstrcPrcsPrstCd: stringField.optional().default(""),
  rsn: stringField.optional().default(""),
  dstrcAplcntId: stringField.optional().default(""),
  dstrcAplyDt: stringField.optional().default(""),
  dstrcAutzrId: stringField.optional().default(""),
  endDate: stringField.optional().default(""),
  endYmd: stringField.optional().default(""),
  registrantDept: stringField.optional().default(""),
  deptNm: stringField.optional().default(""),
  rgtrId: stringField.optional().default(""),
  rgtrNm: stringField.optional().default(""),
  regDate: stringField.optional().default(""),
  regDt: stringField.optional().default(""),
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
  endYmd: stringField.optional().default(""),
  endDate: stringField.optional().default(""),
  dstrcAplcntId: stringField.optional().default(""),
  dstrcAplyDt: stringField.optional().default(""),
  dstrcAutzrId: stringField.optional().default(""),
  fileNm: stringField.optional().default(""),
  dataTypeLabel: stringField.optional().default(""),
  addExpln: stringField.optional().default(""),
  rsn: stringField.optional().default(""),
});

export const docDestructionSearchSchema = z
  .looseObject({
    fromClctYmd: stringField.optional().default(""),
    toClctYmd: stringField.optional().default(""),
    fromEndYmd: stringField.optional().default(""),
    toEndYmd: stringField.optional().default(""),
    fromDstrcAplyYmd: stringField.optional().default(""),
    toDstrcAplyYmd: stringField.optional().default(""),
    fromDstrcAprvYmd: stringField.optional().default(""),
    toDstrcAprvYmd: stringField.optional().default(""),
  })
  .superRefine((data, ctx) => {
    addDateRangeIssue(ctx, data.fromClctYmd, data.toClctYmd, "toClctYmd", "수집일 종료일은 시작일보다 빠를 수 없습니다.");
    addDateRangeIssue(ctx, data.fromEndYmd, data.toEndYmd, "toEndYmd", "종료일은 시작일보다 빠를 수 없습니다.");
    addDateRangeIssue(
      ctx,
      data.fromDstrcAplyYmd,
      data.toDstrcAplyYmd,
      "toDstrcAplyYmd",
      "파기신청일 종료일은 시작일보다 빠를 수 없습니다.",
    );
    addDateRangeIssue(
      ctx,
      data.fromDstrcAprvYmd,
      data.toDstrcAprvYmd,
      "toDstrcAprvYmd",
      "파기승인일 종료일은 시작일보다 빠를 수 없습니다.",
    );
  });

export function docDestructionSearchValidator(data: unknown) {
  const result = docDestructionSearchSchema.safeParse(data);
  return result.success
    ? { success: true as const, data: result.data, issues: [] }
    : { success: false as const, data: null, issues: result.error.issues };
}

export type DocDestructionListRowRaw = z.infer<typeof docDestructionListRowSchema>;
export type DocDestructionDetailRaw = z.infer<typeof docDestructionDetailSchema>;
