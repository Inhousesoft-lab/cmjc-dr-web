import { Grid, TextField } from "@mui/material";
import GridField from "../common/GridField";
import UploadFiles from "../file/UploadFiles";
import {
  formatCalculatedEndYmd,
  formatDateDash,
  holdPeriodLabel,
} from "@/utils/formater";
import type { DigitalDoc, DigitalDocHistory } from "@/types/digitalDoc";

interface DocDetailTableProps {
  eldocNo: string;
  detail: DigitalDoc | DigitalDocHistory | null;
  docNo?: string;
  docTtl?: string;
  editable?: boolean;
  showAttachments?: boolean;
  attachmentsContent?: React.ReactNode;
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
  const holdLabel = holdPeriodLabel(
    detail?.hldPrdDfyrs ?? "",
    detail?.hldPrdMmCnt ?? "",
  );
  const endDateLabel = formatCalculatedEndYmd(
    detail?.clctYmd ?? "",
    detail?.hldPrdDfyrs ?? "",
    detail?.hldPrdMmCnt ?? "",
  );
  const clctLabel = endDateLabel !== "-"
    ? `${endDateLabel}${holdLabel !== "-" ? ` (${holdLabel})` : ""}`
    : "-";
  const showDownloadReason = String((detail as any)?.actCn ?? "").includes(
    "다운로드",
  );
  const downloadReasonLabel = showDownloadReason ? "다운로드 사유" : "";
  const downloadReasonValue = showDownloadReason ? detail?.rsn || "-" : "";

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
      <GridField label="수집일자" value={formatDateDash(detail?.clctYmd ?? "")} />
      <GridField label="종료일자" value={clctLabel} />
      <GridField item={6} label="비고" value={detail?.addExpln || "-"} />
      <GridField
        item={6}
        label={downloadReasonLabel}
        value={downloadReasonValue}
        blankLabel={!showDownloadReason}
      />
      {showAttachments && (
        <>
          <GridField
            label="첨부파일"
            value={
              attachmentsContent ??
              (eldocNo ? (
                <UploadFiles
                  taskSeTrgtId={eldocNo}
                  readOnly
                  requireDownloadReason
                />
              ) : (
                "-"
              ))
            }
          />
          <GridField item={6} label="" value="" blankLabel blank />
        </>
      )}
    </Grid>
  );
}
