export const listDefs = [
  {
    headerName: "번호",
    field: "rowNo",
    width: 40,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "문서분류",
    field: "docSclsfNm",
    width: 150,
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
    width: 150,
  },
  {
    headerName: "문서제목",
    field: "docTtl",
    width: 200,
  },
  {
    headerName: "정보주체 동의여부",
    field: "docClsf.prvcFileHldPrst.infoMnbdAgreYn",
    width: 200,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) => {
      return params.value === "Y" ? "동의" : "비동의";
    },
  },
  {
    headerName: "수집일자",
    field: "clctYmd",
    width: 150,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "변경 전",
    cellStyle: { textAlign: "center" },
    children: [
      {
        headerName: "보유기간",
        field: "hldPrdDfyrs",
        width: 150,
        cellStyle: { textAlign: "center" },
        valueFormatter: (params: any) => {
          const hldPrdDfyrs = params.value;
          if (String(hldPrdDfyrs) === "0")
            return `${params.data.hldPrdMmCnt || "0"}개월`;
          if (String(hldPrdDfyrs) === "90") return "반영구";
          if (String(hldPrdDfyrs) === "99") return "영구";
          return `${hldPrdDfyrs || "0"}년`;
        },
      },
      {
        headerName: "종료일자",
        field: "endYmd",
        width: 150,
        cellStyle: { textAlign: "center" },
        valueFormatter: (params: any) => {
          return formatYYMMDD(params.value);
        },
      },
    ],
  },
  {
    headerName: "변경 전",
    cellStyle: { textAlign: "center" },
    children: [
      {
        headerName: "보유기간",
        field: "docClsf.prvcFileHldPrst.hldPrdDfyrs",
        width: 150,
        cellStyle: { textAlign: "center" },
        valueFormatter: (params: any) => {
          const hldPrdDfyrs = params.value;
          if (String(hldPrdDfyrs) === "0")
            return `${
              params.data.docClsf.prvcFileHldPrst.hldPrdMmCnt || "0"
            }개월`;
          if (String(hldPrdDfyrs) === "90") return "반영구";
          if (String(hldPrdDfyrs) === "99") return "영구";
          return `${hldPrdDfyrs || "0"}년`;
        },
      },
      {
        headerName: "종료일자",
        field: "endYmdAfterChanged",
        width: 150,
        cellStyle: { textAlign: "center" },
        valueFormatter: (params: any) => {
          return formatYYMMDD(params.value);
        },
      },
    ],
  },
  {
    headerName: "등록자(부서)",
    field: "rgtrId",
    width: 150,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "등록일자",
    field: "regDt",
    width: 150,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) => {
      return formatDate(params.value.replaceAll("-", "")); // null/undefined 대비
    },
  },
];
