import type { ColDef } from "ag-grid-community";
import type { DocDestruction } from "@/types/docDestruction";
import {
  formatCalculatedEndYmd,
  formatDateDash,
  formatPeriod,
} from "@/utils/formater";

export const listDefs: ColDef<DocDestruction>[] = [
  {
    headerName: "번호",
    field: "rowNo",
    flex: 0,
    width: 72,
    minWidth: 72,
    maxWidth: 72,
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
    headerName: "수집일자\n(보존연한)",
    field: "collectDateLabel",
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) => {
      const ymd = formatDateDash(params?.data?.clctYmd);
      const period = formatPeriod(
        params?.data?.hldPrdDfyrs,
        params?.data?.hldPrdMmCnt,
      );
      if (ymd === "-" && period === "-") return "-";
      if (period === "-") return ymd;
      if (ymd === "-") return `(${period})`;
      return `${ymd}(${period})`;
    },
  },
  {
    headerName: "종료일자",
    field: "endDate",
    width: 118,
    minWidth: 118,
    maxWidth: 118,
    flex: 0,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) =>
      formatCalculatedEndYmd(
        params?.data?.clctYmd,
        params?.data?.hldPrdDfyrs,
        params?.data?.hldPrdMmCnt,
      ),
  },
  {
    headerName: "등록자(부서)",
    field: "registrantDept",
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "등록일자",
    field: "regDate",
    width: 118,
    minWidth: 118,
    maxWidth: 118,
    flex: 0,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) => formatDateDash(params?.value),
  },
];
