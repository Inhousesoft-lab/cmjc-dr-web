import { DocClassDetail, DocClassSubDetail } from "@/types/docClassification";

type ValidationResult = {
  issues: { message: string; path: string[] }[];
};

export function docClassificationvalidator(
  data: Partial<DocClassDetail>,
): ValidationResult {
  let issues: ValidationResult["issues"] = [];

  if (data.docClsfSeCd === "L" && isEmpty(data.docLclsfNm)) {
    issues = [...issues, { message: "필수 입니다.", path: ["docLclsfNm"] }];
  }

  if (data.docClsfSeCd === "M" && isEmpty(data.docLclsfNo)) {
    issues = [...issues, { message: "필수 입니다.", path: ["docLclsfNo"] }];
  }

  if (data.docClsfSeCd === "M" && isEmpty(data.docMclsfNm)) {
    issues = [...issues, { message: "필수 입니다.", path: ["docMclsfNm"] }];
  }

  if (data.docClsfSeCd === "S" && isEmpty(data.docLclsfNo)) {
    issues = [...issues, { message: "필수 입니다.", path: ["docLclsfNo"] }];
  }

  if (data.docClsfSeCd === "S" && isEmpty(data.docMclsfNo)) {
    issues = [...issues, { message: "필수 입니다.", path: ["docMclsfNo"] }];
  }

  if (data.docClsfSeCd === "S" && isEmpty(data.docSclsfNm)) {
    issues = [...issues, { message: "필수 입니다.", path: ["docSclsfNm"] }];
  }

  // ▼ 여기부터 하위(개인정보 상세) 필수 체크
  if (data.prvcInclYn === "Y" && data.prvcFileHldPrst) {
    const sub = data.prvcFileHldPrst;
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
    ]);

    // 공통 필수: 예외를 뺀 모든 서브필드
    if (isEmpty(sub.deptNm)) {
      issues = [...issues, { message: "필수 입니다.", path: ["deptNm"] }];
    }
    (Object.keys(sub) as (keyof DocClassSubDetail)[]).forEach((field) => {
      if (excludedFields.has(field)) {
        return;
      }
      if (isEmpty(sub[field])) {
        issues = [...issues, { message: "필수 입니다.", path: [String(field)] }];
      }
    });

    // 예: 동의가 아닌 경우에만 법령근거 필수
    if (
      sub.infoMnbdAgreYn !== "Y" &&
      isEmpty(sub.infoMnbdDsagClctSttBssExpln)
    ) {
      issues = [
        ...issues,
        {
          message: "필수 입니다.",
          path: ["infoMnbdDsagClctSttBssExpln"],
        },
      ];
    }

    // 예: 보유기간이 직접입력(0)일 때 월 필수
    if (String(sub.hldPrdDfyrs) === "0" && isEmpty(String(sub.hldPrdMmCnt))) {
      issues = [...issues, { message: "필수 입니다.", path: ["hldPrdMmCnt"] }];
    }
  }
  return { issues };
}
