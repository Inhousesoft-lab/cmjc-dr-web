import type { ColDef } from "ag-grid-community";

export const columnDefs: ColDef<any>[] = [
  {
    headerName: "번호",
    field: "rowNo",
    width: 60,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "문서분류",
    field: "docCategory",
    width: 150,
  },
  {
    headerName: "문서번호",
    field: "docNo",
    width: 150,
  },
  {
    headerName: "문서제목",
    field: "docTitle",
    width: 200,
  },
  {
    headerName: "정보주체 동의여부",
    field: "consentYn",
    width: 200,
  },
  {
    headerName: "수집시작일",
    field: "collectDate",
    width: 150,
  },
  {
    headerName: "보유기간",
    field: "prevRetentionPeriod",
    width: 150,
  },
  {
    headerName: "종료일자",
    field: "prevEndDate",
    width: 150,
  },
  {
    headerName: "보유기간",
    field: "newRetentionPeriod",
    width: 150,
  },
  {
    headerName: "종료일자",
    field: "newEndDate",
    width: 150,
  },
  {
    headerName: "등록자",
    field: "registrantDept",
    width: 150,
  },
  {
    headerName: "등록일자",
    field: "regDate",
    width: 150,
  },
];
