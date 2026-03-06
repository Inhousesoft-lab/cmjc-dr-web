import { formatDateDash, formatPeriod } from "@/utils/formater";

export const listDefs = [
  {
    headerName: "번호",
    field: "rowNo",
    width: 70,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "문서분류",
    field: "docClsfNm",
    width: 260,
    valueFormatter: (params: any) => {
      const l = params?.data?.docLclsfNm ?? "";
      const m = params?.data?.docMclsfNm ?? "";
      const s = params?.data?.docSclsfNm ?? "";
      const parts = [l, m, s].filter(Boolean);
      return parts.length > 0 ? parts.join(" > ") : "-";
    },
  },
  {
    headerName: "문서번호",
    field: "docNo",
    width: 130,
  },
  {
    headerName: "문서제목",
    field: "docTtl",
    width: 220,
  },
  {
    headerName: "정보주체 동의여부",
    field: "docClsf.prvcFileHldPrst.infoMnbdAgreYn",
    width: 170,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) => {
      const yn = params?.data?.docClsf?.prvcFileHldPrst?.infoMnbdAgreYn;
      if (yn === "Y") return "동의";
      if (yn === "N") return "비동의";
      return "-";
    },
  },
  {
    headerName: "수집일자",
    field: "clctYmd",
    width: 120,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) => formatDateDash(params?.value),
  },
  {
    headerName: "변경 전",
    cellStyle: { textAlign: "center" },
    children: [
      {
        headerName: "보유기간",
        field: "hldPrdDfyrs",
        width: 110,
        cellStyle: { textAlign: "center" },
        valueFormatter: (params: any) =>
          formatPeriod(params?.data?.hldPrdDfyrs, params?.data?.hldPrdMmCnt),
      },
      {
        headerName: "종료일자",
        field: "endYmd",
        width: 120,
        cellStyle: { textAlign: "center" },
        valueFormatter: (params: any) => formatDateDash(params?.value),
      },
    ],
  },
  {
    headerName: "변경 후",
    cellStyle: { textAlign: "center" },
    children: [
      {
        headerName: "보유기간",
        field: "docClsf.prvcFileHldPrst.hldPrdDfyrs",
        width: 110,
        cellStyle: { textAlign: "center" },
        valueFormatter: (params: any) =>
          formatPeriod(
            params?.data?.docClsf?.prvcFileHldPrst?.hldPrdDfyrs,
            params?.data?.docClsf?.prvcFileHldPrst?.hldPrdMmCnt,
          ),
      },
      {
        headerName: "종료일자",
        field: "endYmdAfterChanged",
        width: 120,
        cellStyle: { textAlign: "center" },
        valueFormatter: (params: any) => formatDateDash(params?.value),
      },
    ],
  },
  {
    headerName: "등록자(부서)",
    field: "rgtrId",
    width: 150,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) => {
      const rgtrId = params?.data?.rgtrId ?? "-";
      const deptId = params?.data?.deptId ?? "-";
      return `${rgtrId} (${deptId})`;
    },
  },
  {
    headerName: "등록일자",
    field: "regDt",
    width: 120,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) => formatDateDash(params?.value),
  },
];
