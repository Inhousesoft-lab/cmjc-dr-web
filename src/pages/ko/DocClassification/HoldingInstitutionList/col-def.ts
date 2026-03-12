import React from "react";
import { formatDateDash, formatPeriod } from "@/utils/formater";

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
    headerName: "문서분류",
    field: "docClsfNm",
    minWidth: 240,
    flex: 2.2,
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
    minWidth: 130,
    flex: 1.1,
  },
  {
    headerName: "문서제목",
    field: "docTtl",
    minWidth: 200,
    flex: 1.6,
  },
  {
    headerName: "정보주체 동의여부",
    field: "docClsf.prvcFileHldPrst.infoMnbdAgreYn",
    width: 112,
    minWidth: 112,
    maxWidth: 112,
    flex: 0,
    headerComponent: () =>
      React.createElement(
        "span",
        null,
        "정보주체",
        React.createElement("br"),
        "동의여부",
      ),
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
    width: 118,
    minWidth: 118,
    maxWidth: 118,
    flex: 0,
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
        width: 104,
        minWidth: 104,
        maxWidth: 104,
        flex: 0,
        cellStyle: { textAlign: "center" },
        valueFormatter: (params: any) =>
          formatPeriod(params?.data?.hldPrdDfyrs, params?.data?.hldPrdMmCnt),
      },
      {
        headerName: "종료일자",
        field: "endYmd",
        width: 118,
        minWidth: 118,
        maxWidth: 118,
        flex: 0,
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
        width: 104,
        minWidth: 104,
        maxWidth: 104,
        flex: 0,
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
        width: 118,
        minWidth: 118,
        maxWidth: 118,
        flex: 0,
        cellStyle: { textAlign: "center" },
        valueFormatter: (params: any) => formatDateDash(params?.value),
      },
    ],
  },
  {
    headerName: "등록자(부서)",
    field: "rgtrId",
    minWidth: 160,
    flex: 1.3,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) => {
      const rgtrId = params?.data?.rgtrNm ?? params?.data?.rgtrId ?? "-";
      const deptNm = params?.data?.deptNm?.trim() || "-";
      return `${rgtrId} (${deptNm})`;
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
    valueFormatter: (params: any) => formatDateDash(params?.value),
  },
];
