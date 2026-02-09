export const columnDefs: any[] = [
  {
    headerName: "번호",
    field: "rowNo",
    width: 80,
    flex: 0,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "개인정보 파일명",
    field: "docTtl",
    cellStyle: { textAlign: "center" },
  },

  {
    headerName: "종류",
    field: "eldocYn",
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: { value: string }) => {
      return params.value === "Y" ? "문서" : "파일";
    },
  },
  {
    headerName: "등록일자",
    field: "regDt",
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: { value: string }) => {
      if (params.value == null || params.value == "") return "-";
      return formatYYMMDD(params.value?.split("T")[0].replaceAll("-", ""));
    },
  },
  {
    headerName: "파기일자",
    field: "dstrcAprvDt",
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: { value: string }) => {
      if (params.value == null || params.value == "") return "-";
      return formatYYMMDD(params.value?.split("T")[0].replaceAll("-", "")) + ")";
    },
  },
  {
    headerName: "폐기사유",
    field: "rsn",
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: { value: string }) => {
      return params.value;
    },
  },
  {
    headerName: "처리담당자",
    field: "rgtrId",
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "처리부서장",
    field: "dstrcAutzrId",
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: { value: string }) => {
      return params.value;
    },
  },
  {
    headerName: "개인정보처리담당자",
    field: "prvcDstrcAutzrId",
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: { value: string }) => {
      return params.value;
    },
  },
];
