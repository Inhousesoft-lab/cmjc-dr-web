export const columnDefs: any[] = [
  {
    headerName: "번호",
    field: "docClsfNo",
    width: 90,
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
    valueFormatter: (params: { value: any; }) => {
      const v = params.value;
      if (v === "Y") return "포함";
      if (v === "N") return "미포함";
      return ""; // null/undefined 대비
    },
    cellStyle: (params: { value: string; }) => {
      const isIncluded = params.value === "Y";
      return {
        textAlign: "center",
        color: isIncluded ? "red" : "",
        fontWeight: isIncluded ? "600" : "400",
      };
    },
  },
  {
    headerName: "사용유무",
    field: "useEn",
    valueFormatter: (params: { value: any; }) => {
      const v = params.value;
      if (v === "Y") return "사용";
      if (v === "N") return "사용안함";
      return ""; // null/undefined 대비
    },
    cellStyle: (params: { value: string; }) => {
      const isNotUsed = params.value === "N";
      return {
        textAlign: "center",
        color: isNotUsed ? "#0066cc" : "",
        fontWeight: isNotUsed ? "600" : "400",
      };
    },
  },
  {
    headerName: "등록자",
    field: "rgtrId",
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "등록일자",
    field: "regYmd",
    valueFormatter: (params: { value: string; }) => {
      return formatDate(params.value); // null/undefined 대비
    },

    cellStyle: { textAlign: "center" },
  },
];
