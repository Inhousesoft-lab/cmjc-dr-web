import { createAsyncThunk } from "@reduxjs/toolkit";
import https from "@/api/axiosInstance";
import {
  deleteDocClassificationApiPath,
  selectDocClassificationDetailApiPath,
  selectDocClassificationListApiPath,
} from "@/api/docClassification/DocClassificationApiPaths";
import { z } from "zod";
import type {
  DocClassDetail,
  DocClassificationSearch,
  DocClassificationVO,
} from "@/types/docClassification";
import type { RootState } from "@/app/store";

export interface DocClassificationListPayload {
  rows: DocClassificationVO[];
  rowCount: number;
}

const toListParamsKey = (params: DocClassificationSearch | undefined) =>
  JSON.stringify(params ?? {});

const stringField = z.preprocess((v) => (v == null ? "" : String(v)), z.string());

const docClassificationRowSchema = z.looseObject({
    rowNo: z
      .preprocess((v) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
      }, z.number())
      .optional()
      .default(0),
    docClsfNo: stringField,
    docClsfSeCd: stringField,
    docClsfNm: stringField,
    upDocClsfNo: stringField,
    docLclsfNo: stringField,
    docMclsfNo: stringField,
    docSclsfNo: stringField,
    docLclsfNm: stringField,
    docMclsfNm: stringField,
    docSclsfNm: stringField,
    prvcInclYn: stringField,
    useEn: stringField,
    regDt: stringField,
    rgtrId: stringField,
    rgtrNm: stringField,
    mdfcnDt: stringField,
    mdfrId: stringField,
  });

const docClassificationListSchema = z.looseObject({
  list: z.array(docClassificationRowSchema).optional().default([]),
  rows: z.array(docClassificationRowSchema).optional().default([]),
  total: z
    .preprocess((v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    }, z.number())
    .optional(),
  totalCount: z
    .preprocess((v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    }, z.number())
    .optional(),
  rowCount: z
    .preprocess((v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    }, z.number())
    .optional(),
});

const nullableStringField = z.preprocess(
  (v) => (v == null ? "" : String(v)),
  z.string(),
);

const numberLikeField = z.preprocess((v) => {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}, z.number().nullable());

const prvcFileHldPrstSchema = z
  .looseObject({
    deptNm: stringField,
    fileNm: stringField,
    hldPrpsExpln: stringField,
    clctSttBssExpln: stringField,
    useDeptNm: stringField,
    prvcPrcsMthdExpln: stringField,
    hldPrdDfyrs: numberLikeField,
    hldPrdMmCnt: numberLikeField,
    infoMnbdPrvcMttr: stringField,
    sttyAgtPrvcMttr: stringField,
    rrnoClctYn: stringField,
    rrnoClctSttBssExpln: stringField,
    infoMnbdAgreYn: stringField,
    infoMnbdDsagClctSttBssExpln: stringField,
    spiHldYn: stringField,
    spiIndivAgrnYn: stringField,
    spiHldSttBssExpln: stringField,
    uiiHldYn: stringField,
    uiiIndivAgreYn: stringField,
    uiiHldSttBssExpln: stringField,
    prvcEvlTrgtYn: stringField,
    hndlPicNm: stringField,
    tdptySplrcpNmCn: stringField,
    tdptyPvsnBssExpln: stringField,
    tdptyPvsnMttr: stringField,
    prvcPrcsCnsgnBzentyNmCn: stringField,
    prvcCnsgnCtrtYn: stringField,
    prvcCnsgnFactIndctYn: stringField,
    prpsExclUtztnPvsnYn: stringField,
    prpsExclUtztnPvsnBssExpln: stringField,
  })
  .partial();

const docClassificationDetailSchema = z.looseObject({
  docClsfNo: stringField,
  docClsfSeCd: stringField,
  docClsfNm: stringField,
  upDocClsfNo: nullableStringField,
  docLclsfNo: stringField,
  docMclsfNo: stringField,
  docSclsfNo: stringField,
  docLclsfNm: stringField,
  docMclsfNm: stringField,
  docSclsfNm: stringField,
  prvcInclYn: stringField,
  useEn: stringField,
  regDt: stringField,
  rgtrId: stringField,
  rgtrNm: stringField,
  mdfcnDt: stringField,
  mdfrId: stringField,
  prvcFileHldPrst: z
    .preprocess((v) => (v == null ? {} : v), prvcFileHldPrstSchema)
    .optional()
    .default({}),
});

export const fetchDocClassificationList = createAsyncThunk<
  DocClassificationListPayload,
  DocClassificationSearch | undefined,
  { rejectValue: string }
>(
  "docClassification/list",
  async (params, { rejectWithValue }) => {
  try {
    const requestParams = {
      ...(params ?? {}),
    };

    const res = await https.get(selectDocClassificationListApiPath(), {
      params: requestParams,
    });

    const parsed = docClassificationListSchema.safeParse(
      (res as any)?.data?.data ?? (res as any)?.data ?? {},
    );

    if (!parsed.success) {
      return rejectWithValue("문서분류 목록 응답 형식이 올바르지 않습니다.");
    }

    const rows =
      parsed.data.list.length > 0 ? parsed.data.list : parsed.data.rows;
    const rowCount =
      parsed.data.total ?? parsed.data.totalCount ?? parsed.data.rowCount ?? 0;

    return {
      rows: rows as DocClassificationVO[],
      rowCount,
    };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState;
      const s = state.docClassificationList;
      const nextKey = toListParamsKey(params);
      if (s.loading && s.currentListParamsKey === nextKey) return false;
      return true;
    },
  },
);

export const fetchDocClassificationDetail = createAsyncThunk<
  DocClassDetail,
  string,
  { rejectValue: string }
>("docClassification/detail", async (docClsfNo, { rejectWithValue }) => {
  try {
    const res = await https.get(selectDocClassificationDetailApiPath(docClsfNo));
    const payload = (res as any)?.data?.data ?? (res as any)?.data ?? {};
    const parsed = docClassificationDetailSchema.safeParse(payload);

    if (!parsed.success) {
      return rejectWithValue("문서분류 상세 응답 형식이 올바르지 않습니다.");
    }

    return parsed.data as unknown as DocClassDetail;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const deleteDocClassification = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("docClassification/delete", async (docClsfNo, { rejectWithValue }) => {
  try {
    await https.delete(deleteDocClassificationApiPath(docClsfNo));
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});
