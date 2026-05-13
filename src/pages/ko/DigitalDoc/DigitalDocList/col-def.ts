import type { ColDef } from "ag-grid-community";
import type { DigitalDoc } from "@/types/digitalDoc";
import { formatDateDash } from "@/utils/formater";

export const listDefs: ColDef<DigitalDoc>[] = [
  {
    headerName: "번호",
    field: "rowNo",
    width: 72,
    minWidth: 72,
    maxWidth: 72,
    flex: 0,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "문서분류",
    field: "docSclsfNm",
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) => {
      return (
        params.data.docLclsfNm +
        ">" +
        params.data.docMclsfNm +
        ">" +
        params.data.docSclsfNm
      );
    },
  },
  {
    headerName: "문서번호",
    field: "docNo",
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "문서제목",
    field: "docTtl",
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "수집일자",
    field: "clctYmd",
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) => formatDateDash(params.value),
  },
  {
    headerName: "종료일자",
    field: "endYmd",
    valueGetter: (params: any) => params.data?.endYmd ?? "",
    width: 118,
    minWidth: 118,
    maxWidth: 118,
    flex: 0,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) => formatDateDash(params?.value),
  },
  {
    headerName: "등록자(부서)",
    field: "rgtrId",
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) => {
      const rgtrId = params?.data?.rgtrNm ?? params?.value ?? "-";
      const deptNm = params?.data?.deptNm ?? params?.data?.deptId ?? "-";
      return `${rgtrId}(${deptNm})`;
    },
  },
  {
    headerName: "등록일자",
    field: "regDt",
    width: 118,
    minWidth: 118,
    maxWidth: 118,
    flex: 0,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) => {
      return formatDateDash(params?.value);
    },
  },
];
