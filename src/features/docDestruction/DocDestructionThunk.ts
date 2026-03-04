import { createAsyncThunk } from "@reduxjs/toolkit";
import { z } from "zod";
import https from "@/api/axiosInstance";
import {
  selectDocDestructionDetailApiPath,
  selectDocDestructionListApiPath,
} from "@/api/docDestruction/DocDestructionApiPaths";
import type { DocDestruction, SearchValues } from "@/types/docDestruction";
import {
  docDestructionDetailSchema,
  docDestructionListRowSchema,
  docDestructionListSchema,
  type DocDestructionDetailRaw,
  type DocDestructionListRowRaw,
} from "./DocDestructionValidator";

export interface DocDestructionListPayload {
  rows: DocDestruction[];
  rowCount: number;
}

export type DocDestructionDetailPayload = Record<string, any>;

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
    collectDateLabel,
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
>("docDestruction/list", async (params, { rejectWithValue }) => {
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

    return {
      rows: parsed.data.list.map(normalizeDocDestructionRow),
      rowCount: parsed.data.total,
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
