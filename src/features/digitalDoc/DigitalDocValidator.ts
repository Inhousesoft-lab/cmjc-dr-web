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

export const digitalDocRowSchema = z.looseObject({
  rowNo: numberField,
  docLclsfNo: stringField,
  docMclsfNo: stringField,
  docSclsfNo: stringField,
  docLclsfNm: stringField,
  docMclsfNm: stringField,
  docSclsfNm: stringField,
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
});

export const digitalDocListSchema = z.looseObject({
  list: z.array(digitalDocRowSchema).optional().default([]),
  rows: z.array(digitalDocRowSchema).optional().default([]),
  total: numberField,
  totalCount: numberField,
  rowCount: numberField,
});

export const digitalDocHistoryRowSchema = z.looseObject({
  docLclsfNo: stringField,
  docMclsfNo: stringField,
  docSclsfNo: stringField,
  docLclsfNm: stringField,
  docMclsfNm: stringField,
  docSclsfNm: stringField,
  eldocNo: stringField,
  eldocHstryNo: stringField,
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
  actCn: stringField,
  acsrIpAddr: stringField,
  eqpmntNm: stringField,
});

export const digitalDocHistoryListSchema = z.looseObject({
  list: z.array(digitalDocHistoryRowSchema).optional().default([]),
});

export const digitalAuthrtRowSchema = z.looseObject({
  eldocNo: stringField,
  inqAuthrtNo: stringField,
  deptId: stringField,
  indvId: stringField,
  delYn: stringField,
  regDt: stringField,
  rgtrId: stringField,
  rgtrNm: stringField,
  mdfcnDt: stringField,
  mdfrId: stringField,
});

export const digitalAuthrtListSchema = z.looseObject({
  list: z.array(digitalAuthrtRowSchema).optional().default([]),
});

export const digitalAuthrtHistoryRowSchema = z.looseObject({
  eldocNo: stringField,
  inqAuthrtNo: stringField,
  inqAuthrtHstryNo: stringField,
  deptId: stringField,
  indvId: stringField,
  actCn: stringField,
  delYn: stringField,
  regDt: stringField,
  rgtrId: stringField,
  rgtrNm: stringField,
});

export const digitalAuthrtHistoryListSchema = z.looseObject({
  list: z.array(digitalAuthrtHistoryRowSchema).optional().default([]),
});

export const digitalAuthrtCreateSchema = z.object({
  deptId: z.string().trim().min(1, "부서를 선택해 주세요."),
  indvId: z.string().trim().min(1, "이름을 선택해 주세요."),
});

export function digitalAuthrtCreateValidator(data: unknown) {
  const result = digitalAuthrtCreateSchema.safeParse(data);
  return result.success
    ? { success: true as const, data: result.data, issues: [] }
    : { success: false as const, data: null, issues: result.error.issues };
}

const dateField = z
  .string()
  .trim()
  .regex(
    /^\d{4}-\d{2}-\d{2}$|^\d{8}$/,
    "날짜 형식은 YYYY-MM-DD 또는 YYYYMMDD 입니다.",
  );

const optionalString = z.preprocess(
  (v) => (v == null ? "" : String(v)),
  z.string().trim(),
);

export const digitalDocFormSchema = z
  .object({
    docLclsfNo: z.string().trim().min(1, "대분류를 선택해 주세요."),
    docMclsfNo: z.string().trim().min(1, "중분류를 선택해 주세요."),
    docSclsfNo: z.string().trim().min(1, "소분류를 선택해 주세요."),
    docNo: z.string().trim().min(1, "문서번호를 입력해 주세요."),
    docTtl: z.string().trim().min(1, "문서제목을 입력해 주세요."),
    clctYmd: dateField,
    hldPrdDfyrs: z.preprocess(
      (v) => (v == null ? "" : String(v)),
      z.string().trim().min(1, "보존연한을 선택해 주세요."),
    ),
    hldPrdMmCnt: optionalString,
    endYmd: optionalString,
    addExpln: optionalString,
    docClsfNo: optionalString,
  })
  .superRefine((data, ctx) => {
    if (data.hldPrdDfyrs !== "0") return;

    if (!/^\d+$/.test(data.hldPrdMmCnt) || Number(data.hldPrdMmCnt) <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["hldPrdMmCnt"],
        message: "직접입력 시 보존 개월 수를 입력해 주세요.",
      });
    }

    if (!/^\d{4}-\d{2}-\d{2}$|^\d{8}$/.test(data.endYmd)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endYmd"],
        message: "직접입력 시 종료일자를 선택해 주세요.",
      });
      return;
    }

    if (isDateRangeInvalid(data.clctYmd, data.endYmd)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endYmd"],
        message: "종료일은 수집일보다 빠를 수 없습니다.",
      });
    }
  });

export function digitalDocFormValidator(data: unknown) {
  const result = digitalDocFormSchema.safeParse(data);
  return result.success
    ? { success: true as const, data: result.data, issues: [] }
    : { success: false as const, data: null, issues: result.error.issues };
}

export const digitalDocUpdateSchema = z.object({
  eldocNo: z.string().trim().min(1, "전자문서 번호가 없습니다."),
  docClsfNo: z.string().trim().min(1, "문서분류를 선택해 주세요."),
  docNo: z.string().trim().min(1, "문서번호를 입력해 주세요."),
  docTtl: z.string().trim().min(1, "문서제목을 입력해 주세요."),
});

export function digitalDocUpdateValidator(data: unknown) {
  const result = digitalDocUpdateSchema.safeParse(data);
  return result.success
    ? { success: true as const, data: result.data, issues: [] }
    : { success: false as const, data: null, issues: result.error.issues };
}
