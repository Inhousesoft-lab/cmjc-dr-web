import type { ColDef } from "ag-grid-community";
import type { DigitalDoc } from "@/types/digitalDoc";
import { formatDateDash } from "@/utils/formater";

export const listDefs: ColDef<DigitalDoc>[] = [
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
    field: "docSclsfNm",
    cellStyle: { textAlign: "center" },
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
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "문서제목",
    field: "docTtl",
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "개인정보",
    field: "prvcInclYn",
    width: 88,
    minWidth: 88,
    maxWidth: 88,
    flex: 0,
    valueFormatter: (params: any) => {
      const v = params.value;
      if (v === "Y") return "포함";
      if (v === "N") return "미포함";
      return ""; // null/undefined 대비
    },
    cellStyle: (params: any) => {
      const isIncluded = params.value === "Y";
      return {
        textAlign: "center",
        color: isIncluded ? "red" : "",
        fontWeight: isIncluded ? "600" : "400",
      };
    },
  },
  {
    headerName: "수집일자\n(보존연한)",
    field: "clctYmd",
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) => {
      const v = formatDateDash(params.value);

      let nextVal = "\n";
      if (params.data.hldPrdDfyrs === "0") {
        nextVal += "(" + params.data.hldPrdMmCnt + "개월)";
      } else if (
        params.data.hldPrdDfyrs === "90" ||
        params.data.hldPrdDfyrs === "99"
      ) {
        nextVal += params.data.hldPrdDfyrs === "90" ? "(반영구)" : "(영구)";
      } else {
        nextVal += "(" + params.data.hldPrdDfyrs + "년)";
      }

      return v + nextVal;
    },
  },
  {
    headerName: "종료일자",
    field: "endYmd",
    width: 118,
    minWidth: 118,
    maxWidth: 118,
    flex: 0,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) => {
      return formatDateDash(params.value);
    },
  },
  {
    headerName: "종류",
    field: "eldocYn",
    width: 72,
    minWidth: 72,
    maxWidth: 72,
    flex: 0,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) => {
      return params.value === "Y" ? "문서" : "파일";
    },
  },
  {
    headerName: "등록자(부서)",
    field: "rgtrId",
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) => {
      const rgtrId = params?.value ?? "-";
      const deptNm = params?.data?.deptNm ?? params?.data?.deptId ?? "-";
      return `${rgtrId}(${deptNm})`;
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
    valueFormatter: (params: any) => {
      return formatDateDash(params?.value);
    },
  },
];
