import { createAsyncThunk } from "@reduxjs/toolkit";
import https from "@/api/axiosInstance";
import {
  selectHoldingInstitutionListApiPath,
  updateHoldingInstitutionHldprdApiPath,
  updateHoldingInstitutionHldprdallApiPath,
} from "@/api/holdingInstitution/HoldingInstitutionApiPaths";
import {
  holdingInstitutionHldprdAllUpdateValidator,
  holdingInstitutionHldprdUpdateValidator,
  holdingInstitutionListSchema,
  holdingInstitutionRowSchema,
} from "./HoldingInstitutionValidator";
import type { HoldingInstitution, SearchValues } from "@/types/holdingInstitution";
import type { RootState } from "@/app/store";
import { calculateEndYmdByPeriod } from "@/utils/formater";

export interface HoldingInstitutionListPayload {
  rows: HoldingInstitution[];
  rowCount: number;
}

const toListParamsKey = (params: Partial<SearchValues> | undefined) =>
  JSON.stringify(params ?? {});

export interface HoldingInstitutionHldprdUpdatePayload {
  eldocNos: string[];
}

export interface HoldingInstitutionHldprdAllUpdatePayload {
  docLclsfNo: string;
  docMclsfNo: string;
  docSclsfNo: string;
  docNo: string;
  docTtl: string;
  infoMnbdAgreYn: string;
  hldPrdDfyrs: number | string;
  hldPrdChangedOnly: boolean;
  fromClctYmd: string;
  toClctYmd: string;
  fromEndYmd: string;
  toEndYmd: string;
}

const toStr = (value: unknown): string => (value == null ? "" : String(value));
const isObj = (v: unknown): v is Record<string, any> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const LIST_KEYS = ["list", "rows", "items", "content"] as const;
const TOTAL_KEYS = ["total", "totalCount", "count"] as const;

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
  const prvcFileHldPrst = docClsf?.prvcFileHldPrst ?? {};
  const changedHldPrdDfyrs = toStr(
    item?.hldPrdDfyrsAfterChanged ?? prvcFileHldPrst?.hldPrdDfyrs,
  );
  const changedHldPrdMmCnt = toStr(
    item?.hldPrdMmCntAfterChanged ?? prvcFileHldPrst?.hldPrdMmCnt,
  );
  const endYmdAfterChanged =
    toStr(item?.endYmdAfterChanged) ||
    calculateEndYmdByPeriod(item?.clctYmd, changedHldPrdDfyrs, changedHldPrdMmCnt);

  return {
    rowNo: Number(item?.rowNo ?? 0),
    eldocNo: toStr(item?.eldocNo),
    docClsfNo: toStr(item?.docClsfNo ?? docClsf?.docClsfNo),
    docNo: toStr(item?.docNo),
    unqNo: toStr(item?.unqNo),
    docTtl: toStr(item?.docTtl),
    clctYmd: toStr(item?.clctYmd),
    hldPrdDfyrs: toStr(item?.hldPrdDfyrs),
    hldPrdMmCnt: toStr(item?.hldPrdMmCnt),
    endYmd: toStr(item?.endYmd),
    prvcInclYn: toStr(item?.prvcInclYn),
    gvbkYn: toStr(item?.gvbkYn),
    addExpln: toStr(item?.addExpln),
    eldocYn: toStr(item?.eldocYn),
    atchFileSn: toStr(item?.atchFileSn),
    deptId: toStr(item?.deptId),
    deptNm: toStr(item?.deptNm),
    dstrcPrcsPrstCd: toStr(item?.dstrcPrcsPrstCd),
    dstrcAplyDt: toStr(item?.dstrcAplyDt),
    dstrcAplcntId: toStr(item?.dstrcAplcntId),
    rsn: toStr(item?.rsn),
    dstrcAprvDt: toStr(item?.dstrcAprvDt),
    dstrcAutzrId: toStr(item?.dstrcAutzrId),
    prvcDstrcAprvDt: toStr(item?.prvcDstrcAprvDt),
    prvcDstrcAutzrId: toStr(item?.prvcDstrcAutzrId),
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
    endYmdAfterChanged,
    docClsf: {
      rowNo: Number(docClsf?.rowNo ?? 0),
      docClsfNo: toStr(docClsf?.docClsfNo),
      docClsfSeCd: toStr(docClsf?.docClsfSeCd),
      docClsfNm: toStr(docClsf?.docClsfNm),
      upDocClsfNo: toStr(docClsf?.upDocClsfNo),
      docLclsfNo: toStr(docClsf?.docLclsfNo),
      docMclsfNo: toStr(docClsf?.docMclsfNo),
      docSclsfNo: toStr(docClsf?.docSclsfNo),
      docLclsfNm: toStr(docClsf?.docLclsfNm),
      docMclsfNm: toStr(docClsf?.docMclsfNm),
      docSclsfNm: toStr(docClsf?.docSclsfNm),
      prvcInclYn: toStr(docClsf?.prvcInclYn),
      useEn: toStr(docClsf?.useEn),
      regDt: toStr(docClsf?.regDt),
      rgtrId: toStr(docClsf?.rgtrId),
      rgtrNm: toStr(docClsf?.rgtrNm),
      mdfcnDt: toStr(docClsf?.mdfcnDt),
      mdfrId: toStr(docClsf?.mdfrId),
      prvcFileHldPrst: {
        docClsfNo: toStr(prvcFileHldPrst?.docClsfNo),
        prvcFileHldPrstNo: toStr(prvcFileHldPrst?.prvcFileHldPrstNo),
        deptNm: toStr(prvcFileHldPrst?.deptNm),
        fileNm: toStr(prvcFileHldPrst?.fileNm),
        hldPrpsExpln: toStr(prvcFileHldPrst?.hldPrpsExpln),
        clctSttBssExpln: toStr(prvcFileHldPrst?.clctSttBssExpln),
        useDeptNm: toStr(prvcFileHldPrst?.useDeptNm),
        prvcPrcsMthdExpln: toStr(prvcFileHldPrst?.prvcPrcsMthdExpln),
        hldPrdDfyrs: toStr(prvcFileHldPrst?.hldPrdDfyrs),
        hldPrdMmCnt: toStr(prvcFileHldPrst?.hldPrdMmCnt),
        infoMnbdPrvcMttr: toStr(prvcFileHldPrst?.infoMnbdPrvcMttr),
        sttyAgtPrvcMttr: toStr(prvcFileHldPrst?.sttyAgtPrvcMttr),
        rrnoClctYn: toStr(prvcFileHldPrst?.rrnoClctYn),
        rrnoClctSttBssExpln: toStr(prvcFileHldPrst?.rrnoClctSttBssExpln),
        infoMnbdAgreYn: toStr(prvcFileHldPrst?.infoMnbdAgreYn),
        infoMnbdDsagClctSttBssExpln: toStr(
          prvcFileHldPrst?.infoMnbdDsagClctSttBssExpln,
        ),
        spiHldYn: toStr(prvcFileHldPrst?.spiHldYn),
        spiIndivAgrnYn: toStr(prvcFileHldPrst?.spiIndivAgrnYn),
        spiHldSttBssExpln: toStr(prvcFileHldPrst?.spiHldSttBssExpln),
        uiiHldYn: toStr(prvcFileHldPrst?.uiiHldYn),
        uiiIndivAgreYn: toStr(prvcFileHldPrst?.uiiIndivAgreYn),
        uiiHldSttBssExpln: toStr(prvcFileHldPrst?.uiiHldSttBssExpln),
        prvcEvlTrgtYn: toStr(prvcFileHldPrst?.prvcEvlTrgtYn),
        hndlPicNm: toStr(prvcFileHldPrst?.hndlPicNm),
        tdptySplrcpNmCn: toStr(prvcFileHldPrst?.tdptySplrcpNmCn),
        tdptyPvsnBssExpln: toStr(prvcFileHldPrst?.tdptyPvsnBssExpln),
        tdptyPvsnMttr: toStr(prvcFileHldPrst?.tdptyPvsnMttr),
        prvcPrcsCnsgnBzentyNmCn: toStr(
          prvcFileHldPrst?.prvcPrcsCnsgnBzentyNmCn,
        ),
        prvcCnsgnCtrtYn: toStr(prvcFileHldPrst?.prvcCnsgnCtrtYn),
        prvcCnsgnFactIndctYn: toStr(prvcFileHldPrst?.prvcCnsgnFactIndctYn),
        prpsExclUtztnPvsnYn: toStr(prvcFileHldPrst?.prpsExclUtztnPvsnYn),
        prpsExclUtztnPvsnBssExpln: toStr(
          prvcFileHldPrst?.prpsExclUtztnPvsnBssExpln,
        ),
        regDt: toStr(prvcFileHldPrst?.regDt),
        rgtrId: toStr(prvcFileHldPrst?.rgtrId),
        mdfcnDt: toStr(prvcFileHldPrst?.mdfcnDt),
        mdfrId: toStr(prvcFileHldPrst?.mdfrId),
      },
    },
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
    const rawParams = { ...(params ?? {}) } as Record<string, unknown>;
    const requestParams = Object.fromEntries(
      Object.entries(rawParams).filter(([key, value]) => {
        if (key === "pageNum" || key === "pageSize") return true;
        if (value == null) return false;
        if (typeof value === "string") return value.trim() !== "";
        if (typeof value === "boolean") return value; // false는 미선택으로 간주
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
      return {
        rows: directParsed.data.list.map(mapHoldingInstitutionRow),
        rowCount: directParsed.data.total,
      };
    }

    const { list: rawList, total: extractedTotal } = extractListAndTotal(payload);
    if (!Array.isArray(rawList)) {
      return rejectWithValue("보유기관 목록 응답 형식이 올바르지 않습니다.");
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

export const updateHoldingInstitutionHldprd = createAsyncThunk<
  number,
  HoldingInstitutionHldprdUpdatePayload,
  { rejectValue: string }
>("holdingInstitution/updateHldprd", async (payload, { rejectWithValue }) => {
  const validated = holdingInstitutionHldprdUpdateValidator(payload);
  if (!validated.success) {
    const firstIssue = validated.issues[0];
    return rejectWithValue(
      firstIssue?.message ?? "보유기간 변경 요청값이 올바르지 않습니다.",
    );
  }

  try {
    await https.post(updateHoldingInstitutionHldprdApiPath(), validated.data);
    return 1;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateHoldingInstitutionHldprdAll = createAsyncThunk<
  number,
  HoldingInstitutionHldprdAllUpdatePayload,
  { rejectValue: string }
>("holdingInstitution/updateHldprdAll", async (payload, { rejectWithValue }) => {
  const validated = holdingInstitutionHldprdAllUpdateValidator(payload);
  if (!validated.success) {
    const firstIssue = validated.issues[0];
    return rejectWithValue(
      firstIssue?.message ?? "보유기간 일괄 변경 요청값이 올바르지 않습니다.",
    );
  }

  try {
    await https.post(updateHoldingInstitutionHldprdallApiPath(), validated.data);
    return 1;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});
