import type { ColDef } from "ag-grid-community";
import { formatDateDash } from "@/utils/formater";
import type { DocDestruction } from "@/types/docDestruction";

const formatText = (value: unknown) => {
  const text = String(value ?? "").trim();
  return text || "-";
};

export const listDefs: ColDef<DocDestruction>[] = [
  {
    headerName: "개인정보 파일명",
    field: "fileName",
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
    valueFormatter: (params) => formatText(params?.data?.fileNm ?? params?.value),
  },
  {
    headerName: "생성일",
    field: "clctYmd",
    minWidth: 120,
    flex: 0.9,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params) => formatDateDash(params?.value),
  },
  {
    headerName: "폐기일",
    field: "dstrcAprvDt",
    minWidth: 120,
    flex: 0.9,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params) => formatDateDash(params?.value),
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
    headerName: "처리부서장",
    field: "dstrcAutzrId",
    minWidth: 120,
    flex: 0.9,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params) => formatText(params?.value),
  },
];
