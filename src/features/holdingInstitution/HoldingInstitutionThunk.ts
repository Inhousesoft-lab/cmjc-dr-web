import { createAsyncThunk } from "@reduxjs/toolkit";
import https from "@/api/axiosInstance";
import { selectHoldingInstitutionListApiPath } from "@/api/holdingInstitution/HoldingInstitutionApiPaths";
import {
  holdingInstitutionSearchValidator,
  holdingInstitutionListSchema,
  holdingInstitutionRowSchema,
} from "./HoldingInstitutionValidator";
import type { HoldingInstitution, SearchValues } from "@/types/holdingInstitution";
import type { RootState } from "@/app/store";
import { getErrorMessage } from "@/utils/globalFunc";

export interface HoldingInstitutionListPayload {
  rows: HoldingInstitution[];
  rowCount: number;
}

const toListParamsKey = (params: Partial<SearchValues> | undefined) =>
  JSON.stringify(params ?? {});

const toStr = (value: unknown): string => (value == null ? "" : String(value));
const isObj = (v: unknown): v is Record<string, any> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const LIST_KEYS = ["list", "rows", "items", "content"] as const;
const TOTAL_KEYS = ["total", "totalCount", "rowCount", "count"] as const;

const pickArray = (root: any): any[] | null => {
  if (Array.isArray(root)) return root;
  if (!isObj(root)) return null;
  for (const key of LIST_KEYS) {
    const val = root[key];
    if (Array.isArray(val)) return val;
  }
  return null;
};

const pickTotal = (root: any): number | null => {
  if (!isObj(root)) return null;
  for (const key of TOTAL_KEYS) {
    const val = root[key];
    if (Number.isFinite(Number(val))) return Number(val);
  }
  const pageTotal = root?.page?.totalElements;
  if (Number.isFinite(Number(pageTotal))) return Number(pageTotal);
  const paginationTotal = root?.pagination?.total;
  if (Number.isFinite(Number(paginationTotal))) return Number(paginationTotal);
  return null;
};

const extractListAndTotal = (payload: any): { list: any[]; total: number | null } => {
  const roots = [
    payload,
    payload?.data,
    payload?.result,
    payload?.data?.data,
    payload?.result?.data,
  ];

  let list: any[] = [];
  let total: number | null = null;

  for (const root of roots) {
    const arr = pickArray(root);
    if (arr && list.length === 0) list = arr;
    if (total == null) total = pickTotal(root);
    if (list.length > 0 && total != null) break;
  }

  return { list, total };
};

const mapHoldingInstitutionRow = (item: any): HoldingInstitution => {
  const docClsf = item?.docClsf ?? {};

  return {
    rowNo: Number(item?.rowNo ?? 0),
    eldocNo: toStr(item?.eldocNo),
    docClsfNo: toStr(item?.docClsfNo ?? docClsf?.docClsfNo),
    docNo: toStr(item?.docNo),
    docTtl: toStr(item?.docTtl),
    clctYmd: toStr(item?.clctYmd),
    endYmd: toStr(item?.endYmd),
    addExpln: toStr(item?.addExpln),
    deptId: toStr(item?.deptId),
    deptNm: toStr(item?.deptNm),
    dstrcPrcsPrstCd: toStr(item?.dstrcPrcsPrstCd),
    dstrcAplyDt: toStr(item?.dstrcAplyDt),
    dstrcAplcntId: toStr(item?.dstrcAplcntId),
    rsn: toStr(item?.rsn),
    dstrcAprvDt: toStr(item?.dstrcAprvDt),
    dstrcAutzrId: toStr(item?.dstrcAutzrId),
    regDt: toStr(item?.regDt),
    rgtrId: toStr(item?.rgtrId),
    rgtrNm: toStr(item?.rgtrNm),
    mdfcnDt: toStr(item?.mdfcnDt),
    mdfrId: toStr(item?.mdfrId),
    docSclsfNo: toStr(item?.docSclsfNo ?? docClsf?.docSclsfNo),
    docSclsfNm: toStr(item?.docSclsfNm ?? docClsf?.docSclsfNm),
    docMclsfNo: toStr(item?.docMclsfNo ?? docClsf?.docMclsfNo),
    docLclsfNo: toStr(item?.docLclsfNo ?? docClsf?.docLclsfNo),
    docLclsfNm: toStr(item?.docLclsfNm ?? docClsf?.docLclsfNm),
    docMclsfNm: toStr(item?.docMclsfNm ?? docClsf?.docMclsfNm),
  };
};

export const fetchHoldingInstitutionList = createAsyncThunk<
  HoldingInstitutionListPayload,
  Partial<SearchValues> | undefined,
  { rejectValue: string }
>(
  "holdingInstitution/list",
  async (params, { rejectWithValue }) => {
    try {
      const validatedSearch = holdingInstitutionSearchValidator(params ?? {});
      if (!validatedSearch.success) {
        return rejectWithValue(
          validatedSearch.issues[0]?.message ?? "검색 조건을 다시 확인해 주세요.",
        );
      }

      const rawParams = { ...(validatedSearch.data ?? params ?? {}) } as Record<string, unknown>;
      const requestParams = Object.fromEntries(
        Object.entries(rawParams).filter(([key, value]) => {
          if (key === "pageNum" || key === "pageSize") return true;
          if (value == null) return false;
          if (typeof value === "string") return value.trim() !== "";
          return true;
        }),
      );

      const res = await https.get(selectHoldingInstitutionListApiPath(), {
        params: requestParams,
      });

      const payload = (res as any)?.data ?? {};
      const directParsed = holdingInstitutionListSchema.safeParse(
        (res as any)?.data?.data ?? payload,
      );
      if (directParsed.success) {
        const rows =
          directParsed.data.list.length > 0
            ? directParsed.data.list
            : directParsed.data.rows;
        const rowCount =
          directParsed.data.total ??
          directParsed.data.totalCount ??
          directParsed.data.rowCount ??
          rows.length;

        return {
          rows: rows.map(mapHoldingInstitutionRow),
          rowCount,
        };
      }

      const { list: rawList, total: extractedTotal } = extractListAndTotal(payload);
      if (!Array.isArray(rawList)) {
        return rejectWithValue("문서 목록 응답 형식이 올바르지 않습니다.");
      }

      const normalizedRows = rawList.map((row) => {
        const parsedRow = holdingInstitutionRowSchema.safeParse(row);
        return parsedRow.success ? parsedRow.data : row;
      });

      return {
        rows: normalizedRows.map(mapHoldingInstitutionRow),
        rowCount: extractedTotal ?? normalizedRows.length,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState;
      const s = state.holdingInstitutionList;
      const nextKey = toListParamsKey(params);
      if (s.loading && s.currentListParamsKey === nextKey) return false;
      return true;
    },
  },
);
