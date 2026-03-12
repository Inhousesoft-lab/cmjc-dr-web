import type { ColDef } from "ag-grid-community";
import type { DocDestruction } from "@/types/docDestruction";
import { formatDateDash, formatPeriod } from "@/utils/formater";

const formatActorWithDate = (actor: unknown, date: unknown) => {
  const actorLabel = String(actor ?? "").trim();
  const dateLabel = formatDateDash(date);

  if (!actorLabel && dateLabel === "-") return "-";
  if (!actorLabel) return "-";
  if (dateLabel === "-") return actorLabel;
  return `${actorLabel}(${dateLabel})`;
};

export const listDefs: ColDef<DocDestruction>[] = [
  {
    headerName: "번호",
    field: "rowNo",
    flex: 0,
    width: 72,
    minWidth: 72,
    maxWidth: 72,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "문서분류",
    field: "docCategory",
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "문서번호",
    field: "docNo",
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "문서제목",
    field: "docTitle",
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "수집일자\n(보존연한)",
    field: "collectDateLabel",
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) => {
      const ymd = formatDateDash(params?.data?.clctYmd);
      const period = formatPeriod(params?.data?.hldPrdDfyrs, params?.data?.hldPrdMmCnt);
      if (ymd === "-" && period === "-") return "-";
      if (period === "-") return ymd;
      if (ymd === "-") return `(${period})`;
      return `${ymd}(${period})`;
    },
  },
  {
    headerName: "파기일자",
    field: "dstrcAprvDt",
    width: 118,
    minWidth: 118,
    maxWidth: 118,
    flex: 0,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) => {
      const prstCd = String(params?.data?.dstrcPrcsPrstCd ?? "");
      if (prstCd !== "02" && prstCd !== "04") return "-";
      return formatDateDash(params?.value);
    },
  },
  {
    headerName: "폐기사유",
    field: "rsn",
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) => params?.value || "-",
  },
  {
    headerName: "처리담당자\n(신청일자)",
    field: "dstrcAplcntId",
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) =>
      formatActorWithDate(params?.value, params?.data?.dstrcAplyDt),
  },
  {
    headerName: "처리부서장\n(승인일자)",
    field: "dstrcAutzrId",
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) =>
      formatActorWithDate(params?.value, params?.data?.dstrcAprvDt),
  },
  {
    headerName: "개인정보 담당자",
    field: "prvcDstrcAutzrId",
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) => params?.value || "-",
  },
];
