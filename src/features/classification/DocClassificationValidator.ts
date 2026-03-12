import { DocClassDetail, DocClassSubDetail } from "@/types/docClassification";
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
    prvcInclYn: z.string().optional(),
    prvcFileHldPrst: z.looseObject({}).optional(),
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

    if (data.prvcInclYn === "Y" && data.prvcFileHldPrst) {
      const sub = data.prvcFileHldPrst as Partial<DocClassSubDetail>;
      const excludedFields = new Set<keyof DocClassSubDetail>([
        "docClsfNo",
        "prvcFileHldPrstNo",
        "hldPrdMmCnt",
        "infoMnbdDsagClctSttBssExpln",
        "rrnoClctYn",
        "spiHldYn",
        "spiIndivAgrnYn",
        "uiiHldYn",
        "uiiIndivAgreYn",
        "prvcEvlTrgtYn",
        "prvcCnsgnCtrtYn",
        "prvcCnsgnFactIndctYn",
        "prpsExclUtztnPvsnYn",
        "prvcPrcsCnsgnBzentyNmCn",
        "prpsExclUtztnPvsnBssExpln",
      ]);

      if (isBlank(sub.deptNm)) {
        ctx.addIssue({
          code: "custom",
          message: REQUIRED_MESSAGE,
          path: ["deptNm"],
        });
      }

      (Object.keys(sub) as (keyof DocClassSubDetail)[]).forEach((field) => {
        if (excludedFields.has(field)) return;
        if (isBlank(sub[field])) {
          ctx.addIssue({
            code: "custom",
            message: REQUIRED_MESSAGE,
            path: [String(field)],
          });
        }
      });

      if (
        sub.infoMnbdAgreYn !== "Y" &&
        isBlank(sub.infoMnbdDsagClctSttBssExpln)
      ) {
        ctx.addIssue({
          code: "custom",
          message: REQUIRED_MESSAGE,
          path: ["infoMnbdDsagClctSttBssExpln"],
        });
      }

      if (
        String(sub.hldPrdDfyrs) === "0" &&
        isBlank(String(sub.hldPrdMmCnt ?? ""))
      ) {
        ctx.addIssue({
          code: "custom",
          message: REQUIRED_MESSAGE,
          path: ["hldPrdMmCnt"],
        });
      }
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
