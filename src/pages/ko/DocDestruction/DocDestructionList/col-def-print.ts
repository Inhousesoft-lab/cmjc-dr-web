export const listDefs = [
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
    valueFormatter: (params: any) => {
      return params.value === "Y" ? "문서" : "파일";
    },
  },
  {
    headerName: "등록일자",
    field: "regDt",
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) => {
      return formatYYMMDD(params.value.split("T")[0].replaceAll("-", ""));
    },
  },
  {
    headerName: "파기일자",
    field: "dstrcAprvDt",
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) => {
      if (params.value == null || params.value == "") return "-";
      return formatYYMMDD(params.value.split("T")[0].replaceAll("-", "")) + ")";
    },
  },
  {
    headerName: "폐기사유",
    field: "rsn",
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) => {
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
    valueFormatter: (params: any) => {
      return params.value;
    },
  },
  {
    headerName: "개인정보처리담당자",
    field: "prvcDstrcAutzrId",
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) => {
      return params.value;
    },
  },

  // {
  //     headerName: "문서분류",
  //     field: "docSclsfNm",
  //     cellStyle: { textAlign: "center" },
  //     valueFormatter: (params:any) => {
  //       return (
  //         params.data.docLclsfNm +
  //         ">" +
  //         params.data.docMclsfNm +
  //         ">" +
  //         params.data.docSclsfNm
  //       );
  //     },
  //   },
  // {
  //   headerName: "문서번호",
  //   field: "docNo",
  //   cellStyle: { textAlign: "center" },
  // },
  // {
  //   headerName: "문서제목",
  //   field: "docTtl",
  //   cellStyle: { textAlign: "center" },
  // },
  // {
  //   headerName: "개인정보",
  //   field: "prvcInclYn",
  //   valueFormatter: (params:any) => {
  //     const v = params.value;
  //     if (v === "Y") return "포함";
  //     if (v === "N") return "미포함";
  //     return ""; // null/undefined 대비
  //   },
  //   cellStyle: (params:any) => {
  //     const isIncluded = params.value === "Y";
  //     return {
  //       textAlign: "center",
  //       color: isIncluded ? "red" : "",
  //       fontWeight: isIncluded ? "600" : "400",
  //     };
  //   },
  // },
  // {
  //   headerName: "수집일자\n(보존연한)",
  //   field: "clctYmd",
  //   cellStyle: { textAlign: "center" },
  //   valueFormatter: (params:any) => {
  //     const v = formatYYMMDD(params.value);
  //     let nextVal = "\n";
  //     if( !params.data.hldPrdDfyrs ) {
  //       nextVal += "(보존연한 미정의)";
  //     }else if (params.data.hldPrdDfyrs === "0") {
  //       nextVal += "(" + params.hldPrdMmCnt + "개월)";
  //     } else if (
  //       params.data.hldPrdDfyrs === "90" ||
  //       params.data.hldPrdDfyrs === "99"
  //     ) {
  //       nextVal += params.data.hldPrdDfyrs === "90" ? "(반영구)" : "(영구)";
  //     } else {
  //       nextVal += "(" + params.data.hldPrdDfyrs + "년)";
  //     }

  //     return v + nextVal;
  //   },
  // },
  // {
  //   headerName: "파기일자",
  //   field: "dstrcAprvDt",
  //   cellStyle: { textAlign: "center" },
  //   valueFormatter: (params:any) => {
  //     if(params.value == null || params.value == "") return "-";
  //     return formatYYMMDD(params.value.split("T")[0].replaceAll("-", "")) + ")";
  //   },
  // },
  // {
  //   headerName: "폐기사유",
  //   field: "rsn",
  //   cellStyle: { textAlign: "center" },
  //   valueFormatter: (params:any) => {
  //     return params.value ;
  //   },
  // },
  // {
  //   headerName: "처리담당자(신청일자)",
  //   field: "rgtrId",
  //   cellStyle: { textAlign: "center" },
  //   valueFormatter: (params:any) => {
  //     if(params.value == null || params.data.dstrcAplyDt == null || params.data.dstrcAplyDt == "") return "-";

  //     return params.value + "(" + formatYYMMDD(params.data.dstrcAplyDt.split("T")[0].replaceAll("-", "")) + ")";
  //   },
  // },
  // {
  //   headerName: "승인담당자(승인일자)",
  //   field: "dstrcAprvDt",
  //   cellStyle: { textAlign: "center" },
  //   valueFormatter: (params:any) => {
  //     if(params.value == null || params.data.dstrcAprvDt == null) return "-";
  //     return formatYYMMDD(params.value.split("T")[0].replaceAll("-", ""));
  //   },
  // },
];
