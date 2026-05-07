import type { ColDef } from "ag-grid-community";
import type { DocDestruction } from "@/types/docDestruction";

const formatText = (value: unknown) => {
  const text = String(value ?? "").trim();
  return text || "-";
};

const formatDateTime = (value: unknown) => {
  const text = String(value ?? "").trim();
  if (!text) return "-";

  if (/^\d{14}$/.test(text)) {
    return `${text.slice(0, 4)}-${text.slice(4, 6)}-${text.slice(6, 8)} ${text.slice(8, 10)}:${text.slice(10, 12)}:${text.slice(12, 14)}`;
  }
  if (/^\d{8}$/.test(text)) {
    return `${text.slice(0, 4)}-${text.slice(4, 6)}-${text.slice(6, 8)} 00:00:00`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return `${text} 00:00:00`;
  }
  const isoLike = text.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
  if (isoLike) {
    return `${isoLike[1]} ${isoLike[2]}:${isoLike[3]}:${isoLike[4]}`;
  }
  return text;
};

const formatDate = (value: unknown) => {
  const text = String(value ?? "").trim();
  if (!text) return "-";

  if (/^\d{14}$/.test(text)) {
    return `${text.slice(0, 4)}-${text.slice(4, 6)}-${text.slice(6, 8)}`;
  }
  if (/^\d{8}$/.test(text)) {
    return `${text.slice(0, 4)}-${text.slice(4, 6)}-${text.slice(6, 8)}`;
  }
  if (/^\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}:\d{2})?$/.test(text)) {
    return text.slice(0, 10);
  }
  return text;
};

export const listDefs: ColDef<DocDestruction>[] = [
  {
    headerName: "개인정보 파일명",
    field: "docTitle",
    minWidth: 180,
    flex: 1.4,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params) => formatText(params?.value),
  },
  {
    headerName: "자료의 종류",
    field: "dataTypeLabel",
    minWidth: 180,
    flex: 1.2,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params) => formatText(params?.data?.fileNm),
  },
  {
    headerName: "생성일",
    field: "clctYmd",
    minWidth: 120,
    flex: 0.9,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params) => formatDate(params?.value),
  },
  {
    headerName: "폐기일",
    field: "dstrcAprvDt",
    minWidth: 160,
    flex: 1.1,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params) => formatDateTime(params?.value),
  },
  {
    headerName: "폐기사유",
    field: "rsn",
    minWidth: 200,
    flex: 1.4,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params) => formatText(params?.value),
  },
  {
    headerName: "처리담당자",
    field: "dstrcAplcntId",
    minWidth: 120,
    flex: 0.9,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params) => formatText(params?.value),
  },
  {
    headerName: "처리 부사장",
    field: "dstrcAutzrId",
    minWidth: 120,
    flex: 0.9,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params) =>
      formatText(params?.data?.dstrcAutzrId ?? params?.value),
  },
];
