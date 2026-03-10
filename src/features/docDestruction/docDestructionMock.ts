import type {
  DocDestruction,
  DocDestructionDetail,
  DocDestructionUpdate,
  SearchValues,
} from "@/types/docDestruction";

const MOCK_FLAG_KEY = "docDestruction.mock.enabled";
const MOCK_ROWS_KEY = "docDestruction.mock.rows";

type MockDocDestructionRecord = DocDestruction & {
  docLclsfNo?: string;
  docMclsfNo?: string;
  docSclsfNo?: string;
  docClsfNm?: string;
  docTtl?: string;
  docType?: string;
  deptId?: string;
  prvcInclYn?: string;
  endYmd?: string;
};

const defaultMockRows: MockDocDestructionRecord[] = [
  {
    rowNo: 1,
    eldocNo: "MOCK-APRV-01",
    docCategory: "민원 서류",
    docNo: "DOC-2026-0001",
    docTitle: "파기 승인 테스트 문서 A",
    hasPersonalInfo: "미포함",
    clctYmd: "20260301",
    hldPrdDfyrs: "1",
    hldPrdMmCnt: "0",
    collectDateLabel: "20260301(1년)",
    dstrcAprvDt: "",
    rsn: "보존기간 만료",
    dstrcPrcsPrstCd: "01",
    dstrcAplcntId: "tester.req",
    dstrcAplyDt: "20260307",
    dstrcAutzrId: "",
    prvcDstrcAutzrId: "",
    endDate: "20260308",
    docType: "전자문서",
    registrantDept: "개발팀",
    regDate: "20260301",
    docLclsfNo: "L01",
    docMclsfNo: "M01",
    docSclsfNo: "S01",
    docClsfNm: "민원 서류",
    docTtl: "파기 승인 테스트 문서 A",
    deptId: "DEV",
    prvcInclYn: "N",
    endYmd: "20260308",
  },
  {
    rowNo: 2,
    eldocNo: "MOCK-APRV-03",
    docCategory: "개인정보 파일",
    docNo: "DOC-2026-0002",
    docTitle: "파기 승인 테스트 문서 B",
    hasPersonalInfo: "포함",
    clctYmd: "20260302",
    hldPrdDfyrs: "3",
    hldPrdMmCnt: "0",
    collectDateLabel: "20260302(3년)",
    dstrcAprvDt: "20260308",
    rsn: "개인정보 파기 승인 대기",
    dstrcPrcsPrstCd: "03",
    dstrcAplcntId: "tester.req",
    dstrcAplyDt: "20260307",
    dstrcAutzrId: "dept.manager",
    prvcDstrcAutzrId: "",
    endDate: "20260308",
    docType: "전자문서",
    registrantDept: "보안팀",
    regDate: "20260302",
    docLclsfNo: "L02",
    docMclsfNo: "M01",
    docSclsfNo: "S02",
    docClsfNm: "개인정보 파일",
    docTtl: "파기 승인 테스트 문서 B",
    deptId: "SEC",
    prvcInclYn: "Y",
    endYmd: "20260308",
  },
];

const canUseBrowserStorage = () =>
  typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";

const cloneRows = (rows: MockDocDestructionRecord[]) =>
  rows.map((row, index) => ({
    ...row,
    rowNo: index + 1,
  }));

const persistMockFlagFromQuery = () => {
  if (!canUseBrowserStorage()) return;
  const params = new URLSearchParams(window.location.search);
  const value = params.get("docDestructionMock");
  if (value === "1") {
    window.sessionStorage.setItem(MOCK_FLAG_KEY, "true");
  }
  if (value === "0") {
    window.sessionStorage.removeItem(MOCK_FLAG_KEY);
    window.sessionStorage.removeItem(MOCK_ROWS_KEY);
  }
};

export const isDocDestructionMockEnabled = () => {
  if (!canUseBrowserStorage()) return false;
  persistMockFlagFromQuery();
  return window.sessionStorage.getItem(MOCK_FLAG_KEY) === "true";
};

const readMockRows = () => {
  if (!canUseBrowserStorage()) {
    return cloneRows(defaultMockRows);
  }

  const raw = window.sessionStorage.getItem(MOCK_ROWS_KEY);
  if (!raw) {
    const seeded = cloneRows(defaultMockRows);
    window.sessionStorage.setItem(MOCK_ROWS_KEY, JSON.stringify(seeded));
    return seeded;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("Invalid mock rows");
    return cloneRows(parsed as MockDocDestructionRecord[]);
  } catch {
    const seeded = cloneRows(defaultMockRows);
    window.sessionStorage.setItem(MOCK_ROWS_KEY, JSON.stringify(seeded));
    return seeded;
  }
};

const writeMockRows = (rows: MockDocDestructionRecord[]) => {
  if (!canUseBrowserStorage()) return;
  window.sessionStorage.setItem(MOCK_ROWS_KEY, JSON.stringify(cloneRows(rows)));
};

const filterRows = (
  rows: MockDocDestructionRecord[],
  params: Partial<SearchValues> | undefined,
) => {
  const reqCd = params?.reqCd ?? "";

  return rows.filter((row) => {
    if (reqCd === "APRV" && !["01", "03"].includes(row.dstrcPrcsPrstCd)) {
      return false;
    }
    if (reqCd === "APLY" && row.dstrcPrcsPrstCd !== "00") {
      return false;
    }
    if (params?.docNo && !row.docNo.includes(params.docNo)) {
      return false;
    }
    if (params?.docTtl && !row.docTitle.includes(params.docTtl)) {
      return false;
    }
    if (params?.docLclsfNo && row.docLclsfNo !== params.docLclsfNo) {
      return false;
    }
    if (params?.docMclsfNo && row.docMclsfNo !== params.docMclsfNo) {
      return false;
    }
    if (params?.docSclsfNo && row.docSclsfNo !== params.docSclsfNo) {
      return false;
    }
    if (
      params?.prvcInclYn &&
      reqCd !== "APRV" &&
      params.prvcInclYn !== row.prvcInclYn
    ) {
      return false;
    }
    if (params?.fromEndYmd && row.endDate < params.fromEndYmd) {
      return false;
    }
    if (params?.toEndYmd && row.endDate > params.toEndYmd) {
      return false;
    }
    return true;
  });
};

export const getMockDocDestructionList = (
  params: Partial<SearchValues> | undefined,
) => {
  const rows = filterRows(readMockRows(), params);
  const pageNum = Math.max(1, params?.pageNum ?? 1);
  const pageSize = Math.max(1, params?.pageSize ?? (rows.length || 10));
  const start = (pageNum - 1) * pageSize;
  const pagedRows = rows.slice(start, start + pageSize);

  return {
    rows: pagedRows,
    rowCount: rows.length,
  };
};

export const getMockDocDestructionDetail = (eldocNo: string) => {
  const row = readMockRows().find((item) => item.eldocNo === eldocNo);
  if (!row) {
    throw new Error("테스트용 파기 문서를 찾을 수 없습니다.");
  }

  return {
    ...row,
    docClsfNm: row.docClsfNm || row.docCategory,
    docTtl: row.docTtl || row.docTitle,
    dstrcAprvDt: row.dstrcAprvDt,
    endYmd: row.endYmd || row.endDate,
    prvcInclYn: row.prvcInclYn || (row.hasPersonalInfo === "포함" ? "Y" : "N"),
    eldocYn: row.docType,
    collectDateLabel: row.collectDateLabel,
  };
};

export const updateMockDocDestruction = (payload: DocDestructionUpdate) => {
  const rows = readMockRows();
  const requestedIds = new Set(
    payload.docs.map((doc: DocDestructionDetail) => doc.eldocNo),
  );

  const updatedRows = rows.map((row) => {
    if (!requestedIds.has(row.eldocNo)) return row;

    if (payload.reqCd === "APRV01" && row.dstrcPrcsPrstCd === "01") {
      return {
        ...row,
        dstrcPrcsPrstCd: "02",
        dstrcAprvDt: "20260309",
        dstrcAutzrId: "mock.approver",
      };
    }

    if (payload.reqCd === "APRV02" && row.dstrcPrcsPrstCd === "03") {
      return {
        ...row,
        dstrcPrcsPrstCd: "04",
        dstrcAprvDt: "20260309",
        prvcDstrcAutzrId: "mock.privacy.approver",
      };
    }

    return row;
  });

  writeMockRows(updatedRows);
};
