import { createAsyncThunk } from "@reduxjs/toolkit";
import { z } from "zod";
import https from "@/api/axiosInstance";
import {
  selectDocDestructionDetailApiPath,
  selectDocDestructionListApiPath,
  updateDocDestructionApiPath,
} from "@/api/docDestruction/DocDestructionApiPaths";
import type {
  DocDestruction,
  DocDestructionUpdate,
  SearchValues,
} from "@/types/docDestruction";
import {
  docDestructionDetailSchema,
  docDestructionListRowSchema,
  docDestructionListSchema,
  type DocDestructionDetailRaw,
  type DocDestructionListRowRaw,
} from "./DocDestructionValidator";
import { getErrorMessage } from "@/utils/globalFunc";
import type { RootState } from "@/app/store";

export interface DocDestructionListPayload {
  rows: DocDestruction[];
  rowCount: number;
}

export type DocDestructionDetailPayload = Record<string, any>;

const toListParamsKey = (params: Partial<SearchValues> | undefined) =>
  JSON.stringify(params ?? {});

const getPersonalInfoLabel = (value: string) => {
  if (value === "Y") return "포함";
  if (value === "N") return "미포함";
  return value;
};

const getHoldingPeriodLabel = (years: string, months: string) => {
  const yearText = years ? `${years}년` : "";
  const monthText = months ? `${months}개월` : "";
  return `${yearText}${monthText}`.trim();
};

const normalizeDocDestructionRow = (
  raw: DocDestructionListRowRaw,
  index: number,
): DocDestruction => {
  const personalInfo = raw.hasPersonalInfo || getPersonalInfoLabel(raw.prvcInclYn);
  const holdingPeriod = getHoldingPeriodLabel(raw.hldPrdDfyrs, raw.hldPrdMmCnt);
  const collectDateLabel =
    raw.collectDateLabel || (raw.clctYmd ? `${raw.clctYmd}${holdingPeriod ? `(${holdingPeriod})` : ""}` : "");

  return {
    rowNo: raw.rowNo || index + 1,
    eldocNo: raw.eldocNo,
    docCategory: raw.docCategory || raw.docClsfNm,
    docNo: raw.docNo,
    docTitle: raw.docTitle || raw.docTtl,
    hasPersonalInfo: personalInfo,
    clctYmd: raw.clctYmd,
    hldPrdDfyrs: raw.hldPrdDfyrs,
    hldPrdMmCnt: raw.hldPrdMmCnt,
    collectDateLabel,
    dstrcAprvDt: raw.dstrcAprvDt || raw.dstrcAprvYmd,
    rsn: raw.rsn,
    dstrcPrcsPrstCd: raw.dstrcPrcsPrstCd,
    dstrcAplcntId: raw.dstrcAplcntId || raw.rgtrId,
    dstrcAplyDt: raw.dstrcAplyDt,
    dstrcAutzrId: raw.dstrcAutzrId,
    prvcDstrcAutzrId: raw.prvcDstrcAutzrId,
    endDate: raw.endDate || raw.endYmd,
    docType: raw.docType || raw.eldocYn,
    registrantDept: raw.registrantDept || raw.deptNm || raw.rgtrId,
    regDate: raw.regDate || raw.regDt,
  };
};

export const fetchDocDestructionList = createAsyncThunk<
  DocDestructionListPayload,
  Partial<SearchValues> | undefined,
  { rejectValue: string }
>(
  "docDestruction/list",
  async (params, { rejectWithValue }) => {
  try {
    const requestParams = {
      ...(params ?? {}),
    };

    const res = await https.get(selectDocDestructionListApiPath(), {
      params: requestParams,
    });

    const payload = (res as any)?.data?.data ?? (res as any)?.data ?? {};

    if (Array.isArray(payload)) {
      const parsedRows = z.array(docDestructionListRowSchema).safeParse(payload);
      if (!parsedRows.success) {
        return rejectWithValue("파기문서 목록 응답 형식이 올바르지 않습니다.");
      }

      return {
        rows: parsedRows.data.map(normalizeDocDestructionRow),
        rowCount: parsedRows.data.length,
      };
    }

    const parsed = docDestructionListSchema.safeParse(payload);
    if (!parsed.success) {
      return rejectWithValue("파기문서 목록 응답 형식이 올바르지 않습니다.");
    }

    const rows =
      parsed.data.list.length > 0 ? parsed.data.list : parsed.data.rows;
    const rowCount =
      parsed.data.total ?? parsed.data.totalCount ?? parsed.data.rowCount ?? 0;

    return {
      rows: rows.map(normalizeDocDestructionRow),
      rowCount,
    };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const normalizeDocDestructionDetail = (
  raw: DocDestructionDetailRaw,
): DocDestructionDetailPayload => {
  const personalInfo = raw.hasPersonalInfo || getPersonalInfoLabel(raw.prvcInclYn);
  const holdingPeriod = getHoldingPeriodLabel(raw.hldPrdDfyrs, raw.hldPrdMmCnt);
  const collectDateLabel =
    raw.collectDateLabel || (raw.clctYmd ? `${raw.clctYmd}${holdingPeriod ? `(${holdingPeriod})` : ""}` : "");

  return {
    ...raw,
    docClsfNm: raw.docClsfNm || raw.docCategory,
    docTtl: raw.docTtl || raw.docTitle,
    dstrcAprvDt: raw.dstrcAprvDt || raw.dstrcAprvYmd,
    endYmd: raw.endYmd || raw.endDate,
    prvcInclYn: personalInfo,
    eldocYn: raw.eldocYn || raw.docType,
    collectDateLabel,
  };
};

export const fetchDocDestructionDetail = createAsyncThunk<
  DocDestructionDetailPayload,
  string,
  { rejectValue: string }
>("docDestruction/detail", async (eldocNo, { rejectWithValue }) => {
  try {
    const res = await https.get(selectDocDestructionDetailApiPath(eldocNo));
    const payload = (res as any)?.data?.data ?? (res as any)?.data ?? {};
    const parsed = docDestructionDetailSchema.safeParse(payload);

    if (!parsed.success) {
      return rejectWithValue("파기문서 상세 응답 형식이 올바르지 않습니다.");
    }

    return normalizeDocDestructionDetail(parsed.data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateDocDestruction = createAsyncThunk<
  void,
  DocDestructionUpdate,
  { rejectValue: string }
>("docDestruction/update", async (payload, { rejectWithValue }) => {
  try {
    const requestBody = {
      ...payload,
      docs: payload.docs.map((doc) => ({
        eldocNo: doc.eldocNo,
      })),
    };
    const res = await https.post(updateDocDestructionApiPath(), requestBody);
    const body = (res as any)?.data ?? {};
    const resultMsg = String(
      body?.resultMsg ?? body?.data?.resultMsg ?? body?.result?.resultMsg ?? "",
    ).trim();
    const resultCode = String(
      body?.resultCode ?? body?.data?.resultCode ?? body?.result?.resultCode ?? "",
    ).trim();

    // 일부 API는 HTTP 200에서도 업무 실패(resultMsg=success.common.fail)를 반환함
    if (resultMsg === "success.common.fail") {
      if (resultCode === "PASSWORD_ERROR") {
        return rejectWithValue("비밀번호가 일치하지 않습니다.");
      }
      return rejectWithValue("요청 처리에 실패했습니다.");
    }
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState;
      const s = state.docDestructionList;
      const nextKey = toListParamsKey(params);
      // 동일 파라미터로 로딩 중인 중복 호출 차단
      if (s.loading && s.currentListParamsKey === nextKey) {
        return false;
      }
      return true;
    },
  },
);
