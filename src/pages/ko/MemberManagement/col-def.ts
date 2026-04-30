import type { ColDef } from "ag-grid-community";
import type { MemberRow } from "@/types/member";

export const listDefs: ColDef<MemberRow>[] = [
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
    headerName: "ID",
    field: "mbrId",
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "이름",
    field: "mbrNm",
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "부서",
    field: "deptNm",
    minWidth: 180,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "직급",
    field: "jbpsNm",
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "권한",
    field: "authrtNm",
    cellStyle: (params) => ({
      textAlign: "center",
      color: params.value !== "일반" ? "#0070c9" : "",
      fontWeight: params.value !== "일반" ? "600" : "400",
    }),
  },
  {
    headerName: "등록일시",
    field: "regDt",
    minWidth: 170,
    cellStyle: { textAlign: "center" },
  },
];
