import { createAsyncThunk } from "@reduxjs/toolkit";
import https from "@/api/axiosInstance";
import { selectMemberListApiPath } from "@/api/member/MemberApiPaths";
import type { RootState } from "@/app/store";
import type { MemberRow, MemberSearchValues } from "@/types/member";

export interface MemberListPayload {
  rows: MemberRow[];
  rowCount: number;
}

const LIST_KEYS = ["list", "rows", "items", "content"] as const;
const TOTAL_KEYS = ["total", "totalCount", "count", "rowCount"] as const;

const toListParamsKey = (params: Partial<MemberSearchValues> | undefined) =>
  JSON.stringify(params ?? {});

const toStr = (value: unknown): string => (value == null ? "" : String(value));

const isRecord = (value: unknown): value is Record<string, any> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const pickArray = (root: unknown): any[] | null => {
  if (Array.isArray(root)) return root;
  if (!isRecord(root)) return null;

  for (const key of LIST_KEYS) {
    if (Array.isArray(root[key])) return root[key];
  }
  return null;
};

const pickTotal = (root: unknown): number | null => {
  if (!isRecord(root)) return null;

  for (const key of TOTAL_KEYS) {
    const value = Number(root[key]);
    if (Number.isFinite(value)) return value;
  }

  const pageTotal = Number(root.page?.totalElements);
  if (Number.isFinite(pageTotal)) return pageTotal;

  return null;
};

const extractListAndTotal = (payload: any) => {
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
    const foundList = pickArray(root);
    if (foundList && list.length === 0) list = foundList;

    const foundTotal = pickTotal(root);
    if (total == null && foundTotal != null) total = foundTotal;

    if (list.length > 0 && total != null) break;
  }

  return { list, total: total ?? list.length };
};

const authorityLabel = (authrtCd: string, authrtNm: string) => {
  if (authrtNm) return authrtNm;

  if (authrtCd === "ADMIN") return "관리자";
  if (authrtCd === "CANCEL_ADMIN") return "파기관리자";
  return "일반";
};

const normalizeDateTime = (value: unknown) => {
  const raw = toStr(value).trim();
  if (!raw) return "";

  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.length >= 14) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)} ${digits.slice(8, 10)}:${digits.slice(10, 12)}:${digits.slice(12, 14)}`;
  }

  if (raw.includes("T")) {
    return raw.replace("T", " ").slice(0, 19);
  }

  return raw;
};

const mapMemberRow = (item: any, index: number): MemberRow => {
  const authrtCd = toStr(item?.authrtCd ?? item?.authrt_cd);
  const authrtNm = toStr(item?.authrtNm ?? item?.authrt_nm);

  return {
    rowNo: Number(item?.rowNo ?? item?.row_no ?? index + 1),
    mbrId: toStr(item?.mbrId ?? item?.mbr_id ?? item?.userId ?? item?.id),
    mbrNm: toStr(item?.mbrNm ?? item?.mbr_nm ?? item?.userNm ?? item?.name),
    deptNo: toStr(item?.deptNo ?? item?.dept_no ?? item?.deptId),
    deptNm: toStr(item?.deptNm ?? item?.dept_nm ?? item?.instNm),
    jbpsNm: toStr(item?.jbpsNm ?? item?.jbps_nm ?? item?.jbgdNm ?? item?.positionNm),
    authrtCd,
    authrtNm: authorityLabel(authrtCd, authrtNm),
    regDt: normalizeDateTime(item?.regDt ?? item?.reg_dt ?? item?.createdAt),
  };
};

export const fetchMemberList = createAsyncThunk<
  MemberListPayload,
  Partial<MemberSearchValues> | undefined,
  { rejectValue: string }
>(
  "member/list",
  async (params, { rejectWithValue }) => {
    try {
      const requestParams = Object.fromEntries(
        Object.entries(params ?? {}).filter(([key, value]) => {
          if (key === "pageNum" || key === "pageSize") return true;
          if (value == null) return false;
          return String(value).trim() !== "";
        }),
      );

      const res = await https.get(selectMemberListApiPath(), {
        params: requestParams,
      });
      const { list, total } = extractListAndTotal((res as any)?.data ?? {});

      return {
        rows: list.map(mapMemberRow),
        rowCount: total,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState;
      const s = state.memberList;
      const nextKey = toListParamsKey(params);
      if (s.loading && s.currentListParamsKey === nextKey) return false;
      return true;
    },
  },
);
