import { formatDateDash } from "@/utils/formater";

export const listDefs = [
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
    headerName: "대분류",
    field: "docLclsfNm",
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "중분류",
    field: "docMclsfNm",
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "소분류",
    field: "docSclsfNm",
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "개인정보 포함유무",
    field: "prvcInclYn",
    width: 152,
    minWidth: 152,
    maxWidth: 152,
    flex: 0,
    valueFormatter: (params: { value: string }) => {
      const value = params.value;
      if (value === "Y") return "포함";
      if (value === "N") return "미포함";
      return "";
    },
    cellStyle: (params: { value: string }) => ({
      textAlign: "center",
      color: params.value === "Y" ? "red" : "",
      fontWeight: params.value === "Y" ? "600" : "400",
    }),
  },
  {
    headerName: "사용유무",
    field: "useEn",
    width: 94,
    minWidth: 94,
    maxWidth: 94,
    flex: 0,
    valueFormatter: (params: { value: string }) => {
      const value = params.value;
      if (value === "Y") return "사용";
      if (value === "N") return "사용안함";
      return "";
    },
    cellStyle: (params: { value: string }) => ({
      textAlign: "center",
      color: params.value === "N" ? "#0066cc" : "",
      fontWeight: params.value === "N" ? "600" : "400",
    }),
  },
  {
    headerName: "등록자",
    field: "rgtrId",
    valueFormatter: (params: { data?: { rgtrNm?: string; rgtrId?: string } }) =>
      params?.data?.rgtrNm ?? params?.data?.rgtrId ?? "-",
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "등록일자",
    field: "regDt",
    valueFormatter: (params: { value: string }) => formatDateDash(params.value),
    cellStyle: { textAlign: "center" },
  },
];
