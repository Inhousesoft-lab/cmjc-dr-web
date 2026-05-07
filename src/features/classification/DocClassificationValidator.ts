import { DocClassDetail } from "@/types/docClassification";
import { z } from "zod";

type ValidationResult = {
  issues: { message: string; path: string[] }[];
};

const REQUIRED_MESSAGE = "필수 입니다.";

const isBlank = (value: unknown): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  return false;
};

const docClassificationSchema = z
  .looseObject({
    docClsfSeCd: z.string().optional(),
    docLclsfNo: z.string().optional(),
    docMclsfNo: z.string().optional(),
    docSclsfNo: z.string().optional(),
    docLclsfNm: z.string().optional(),
    docMclsfNm: z.string().optional(),
    docSclsfNm: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.docClsfSeCd === "L" && isBlank(data.docLclsfNm)) {
      ctx.addIssue({
        code: "custom",
        message: REQUIRED_MESSAGE,
        path: ["docLclsfNm"],
      });
    }

    if (data.docClsfSeCd === "M" && isBlank(data.docLclsfNo)) {
      ctx.addIssue({
        code: "custom",
        message: REQUIRED_MESSAGE,
        path: ["docLclsfNo"],
      });
    }

    if (data.docClsfSeCd === "M" && isBlank(data.docMclsfNm)) {
      ctx.addIssue({
        code: "custom",
        message: REQUIRED_MESSAGE,
        path: ["docMclsfNm"],
      });
    }

    if (data.docClsfSeCd === "S" && isBlank(data.docLclsfNo)) {
      ctx.addIssue({
        code: "custom",
        message: REQUIRED_MESSAGE,
        path: ["docLclsfNo"],
      });
    }

    if (data.docClsfSeCd === "S" && isBlank(data.docMclsfNo)) {
      ctx.addIssue({
        code: "custom",
        message: REQUIRED_MESSAGE,
        path: ["docMclsfNo"],
      });
    }

    if (data.docClsfSeCd === "S" && isBlank(data.docSclsfNm)) {
      ctx.addIssue({
        code: "custom",
        message: REQUIRED_MESSAGE,
        path: ["docSclsfNm"],
      });
    }
  });

export function docClassificationvalidator(
  data: Partial<DocClassDetail>,
): ValidationResult {
  const result = docClassificationSchema.safeParse(data);

  if (result.success) return { issues: [] };

  return {
    issues: result.error.issues.map((issue) => ({
      message: issue.message,
      path: issue.path.map((p) => String(p)),
    })),
  };
}
