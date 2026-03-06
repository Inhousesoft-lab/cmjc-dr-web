import type { ColDef } from "ag-grid-community";
import type { DocDestruction } from "@/types/docDestruction";
import { formatRegDate } from "@/utils/formater";

export const listDefs: ColDef<DocDestruction>[] = [
  {
    headerName: "번호",
    field: "rowNo",
    flex: 0,
    width: 100,
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
    headerName: "개인정보",
    field: "hasPersonalInfo",
    cellStyle: (params: any) => {
      const isIncluded = params.value === "포함";
      return {
        textAlign: "center",
        color: isIncluded ? "red" : "",
        fontWeight: isIncluded ? "600" : "400",
      };
    },
  },
  {
    headerName: "수집일자\n(보존연한)",
    field: "collectDateLabel",
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "종료일자",
    field: "endDate",
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "종류",
    field: "docType",
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "등록자(부서)",
    field: "registrantDept",
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "등록일자",
    field: "regDate",
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) => formatRegDate(params?.value),
  },
];
