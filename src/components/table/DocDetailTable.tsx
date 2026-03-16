import { Grid, TextField } from "@mui/material";
import GridField from "../common/GridField";
import UploadFiles from "../file/UploadFiles";
import {
  formatDateDash,
  gvbkLabel,
  holdPeriodLabel,
  prvcLabel,
} from "@/utils/formater";
import type { DigitalDoc, DigitalDocHistory } from "@/types/digitalDoc";

interface DocDetailTableProps {
  eldocNo: string;
  detail: DigitalDoc | DigitalDocHistory | null;
  docNo?: string;
  docTtl?: string;
  editable?: boolean;
  showAttachments?: boolean;
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
  const clctLabel = detail?.endYmd
    ? `${formatDateDash(detail.endYmd)}${holdLabel !== "-" ? ` (${holdLabel})` : ""}`
    : "-";
  const mappedGvbkLabel = gvbkLabel(detail?.gvbkYn);
  const mappedPrvcLabel = prvcLabel(detail?.prvcInclYn);

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
      <GridField label="개인정보" value={mappedPrvcLabel} />
      <GridField label="반환여부" value={mappedGvbkLabel} />
      <GridField item={12} label="비고" value={detail?.addExpln || "-"} />
      {showAttachments && (
        <GridField
          label="첨부파일"
          value={eldocNo ? <UploadFiles taskSeTrgtId={eldocNo} readOnly /> : "-"}
        />
      )}
    </Grid>
  );
}
