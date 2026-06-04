import type React from "react";
import { Grid, TextField } from "@mui/material";
import GridField from "../common/GridField";
import UploadFiles from "../file/UploadFiles";
import { formatDateDash } from "@/utils/formater";
import type {
  DigitalDoc,
  DigitalDocCustomArticle,
  DigitalDocHistory,
} from "@/types/digitalDoc";

const getCustomArticles = (
  detail: DigitalDoc | DigitalDocHistory | null,
): DigitalDocCustomArticle[] => {
  if (!detail || !("customArticles" in detail)) {
    return [];
  }

  return detail.customArticles ?? [];
};

interface DocDetailTableProps {
  eldocNo: string;
  detail: DigitalDoc | DigitalDocHistory | null;
  docNo?: string;
  docTtl?: string;
  editable?: boolean;
  showAttachments?: boolean;
  attachmentsContent?: React.ReactNode;
  clctYmdContent?: React.ReactNode;
  endYmdContent?: React.ReactNode;
  addExplnContent?: React.ReactNode;
  onDocNoChange?: (value: string) => void;
  onDocTtlChange?: (value: string) => void;
}

export default function DocDetailTable({
  eldocNo,
  detail,
  docNo,
  docTtl,
  editable = false,
  showAttachments = true,
  attachmentsContent,
  clctYmdContent,
  endYmdContent,
  addExplnContent,
  onDocNoChange,
  onDocTtlChange,
}: DocDetailTableProps) {
  const classification = [
    detail?.docLclsfNm,
    detail?.docMclsfNm,
    detail?.docSclsfNm,
  ]
    .filter(Boolean)
    .join(" > ");
  const endDateLabel = formatDateDash(detail?.endYmd ?? "");
  const showDownloadReason = String((detail as any)?.actCn ?? "").includes(
    "다운로드",
  );
  const downloadReasonLabel = showDownloadReason ? "다운로드 사유" : "";
  const downloadReasonValue = showDownloadReason ? detail?.rsn || "-" : "";
  const customArticles = getCustomArticles(detail);

  return (
    <Grid container spacing={0} className="table-view-grid">
      <GridField item={12} label="문서분류" value={classification || "-"} />
      <GridField
        label="문서번호"
        value={
          editable ? (
            <TextField
              fullWidth
              size="small"
              value={docNo ?? detail?.docNo ?? ""}
              onChange={(e) => onDocNoChange?.(e.target.value)}
              placeholder="문서번호"
            />
          ) : (
            detail?.docNo || "-"
          )
        }
      />
      <GridField label="기본권한" value={detail?.deptNm || detail?.deptId || "-"} />
      <GridField
        item={12}
        label="문서제목"
        value={
          editable ? (
            <TextField
              fullWidth
              size="small"
              value={docTtl ?? detail?.docTtl ?? ""}
              onChange={(e) => onDocTtlChange?.(e.target.value)}
              placeholder="문서제목"
            />
          ) : (
            detail?.docTtl || "-"
          )
        }
      />
      <GridField
        label="수집일자"
        value={
          editable && clctYmdContent
            ? clctYmdContent
            : formatDateDash(detail?.clctYmd ?? "")
        }
      />
      <GridField
        label="종료일자"
        value={editable && endYmdContent ? endYmdContent : endDateLabel}
      />
      {showDownloadReason && (
        <GridField
          item={12}
          label={downloadReasonLabel}
          value={downloadReasonValue}
        />
      )}
      <GridField
        item={12}
        label="비고"
        value={
          editable && addExplnContent
            ? addExplnContent
            : detail?.addExpln || "-"
        }
      />
      {showAttachments && (
        <>
          <GridField
            item={12}
            label="첨부파일"
            value={
              attachmentsContent ??
              (eldocNo ? (
                <UploadFiles
                  taskSeTrgtId={eldocNo}
                  readOnly={!editable}
                  requireDownloadReason={!editable}
                />
              ) : (
                "-"
              ))
            }
          />
        </>
      )}
      {customArticles.map((article, index) => (
        <GridField
          key={`${article.articleId || "custom"}-${index}`}
          item={12}
          label={article.articleNm || article.articleId || "추가항목"}
          value={
            <span className="table-view__custom-value">
              {article.articleCn ?? ""}
            </span>
          }
        />
      ))}
    </Grid>
  );
}
