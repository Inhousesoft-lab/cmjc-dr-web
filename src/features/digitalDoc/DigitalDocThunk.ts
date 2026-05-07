import { createAsyncThunk } from "@reduxjs/toolkit";
import { z } from "zod";
import https from "@/api/axiosInstance";
import {
  deleteEDocAuthrtApiPath,
  insertEDocApiPath,
  insertEDocAuthrtApiPath,
  selectEDocAuthrtHistoryApiPath,
  selectEDocAuthrtListApiPath,
  selectEDocDetailApiPath,
  selectEDocHistoryApiPath,
  selectEDocListApiPath,
  updateEDocApiPath,
} from "@/api/digitalDoc/DigitalDocApiPaths";
import {
  digitalAuthrtCreateValidator,
  digitalAuthrtHistoryListSchema,
  digitalAuthrtHistoryRowSchema,
  digitalAuthrtListSchema,
  digitalAuthrtRowSchema,
  digitalDocFormValidator,
  digitalDocHistoryListSchema,
  digitalDocHistoryRowSchema,
  digitalDocListSchema,
  digitalDocRowSchema,
  digitalDocUpdateValidator,
} from "./DigitalDocValidator";
import type {
  DigitalAuthrt,
  DigitalAuthrtHistory,
  DigitalDoc,
  DigitalDocHistory,
  SearchValues,
} from "@/types/digitalDoc";
import { toChar8Date } from "@/utils/formater";
import type { RootState } from "@/app/store";

export interface DigitalDocListPayload {
  rows: DigitalDoc[];
  rowCount: number;
}

const toListParamsKey = (params: Partial<SearchValues> | undefined) =>
  JSON.stringify(params ?? {});

export const fetchDigitalDocList = createAsyncThunk<
  DigitalDocListPayload,
  Partial<SearchValues> | undefined,
  { rejectValue: string }
>(
  "digitalDoc/list",
  async (params, { rejectWithValue }) => {
  try {
    const requestParams = {
      ...(params ?? {}),
    };

    const res = await https.get(selectEDocListApiPath(), {
      params: requestParams,
    });

    const parsed = digitalDocListSchema.safeParse(
      (res as any)?.data?.data ?? (res as any)?.data ?? {},
    );

    if (!parsed.success) {
      return rejectWithValue("전자문서 목록 응답 형식이 올바르지 않습니다.");
    }

    const rows =
      parsed.data.list.length > 0 ? parsed.data.list : parsed.data.rows;
    const rowCount =
      parsed.data.total ?? parsed.data.totalCount ?? parsed.data.rowCount ?? 0;

    return {
      rows: rows as DigitalDoc[],
      rowCount,
    };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState;
      const s = state.digitalDocList;
      const nextKey = toListParamsKey(params);
      if (s.loading && s.currentListParamsKey === nextKey) return false;
      return true;
    },
  },
);

export const fetchDigitalDocDetail = createAsyncThunk<
  DigitalDoc,
  string,
  { rejectValue: string }
>("digitalDoc/detail", async (eldocNo, { rejectWithValue }) => {
  try {
    const res = await https.get(selectEDocDetailApiPath(eldocNo));
    const payload = (res as any)?.data?.data ?? (res as any)?.data ?? {};
    const parsed = digitalDocRowSchema.safeParse(payload);

    if (!parsed.success) {
      return rejectWithValue("전자문서 상세 응답 형식이 올바르지 않습니다.");
    }

    return parsed.data as DigitalDoc;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchDigitalDocDialogDetail = createAsyncThunk<
  DigitalDoc,
  string,
  { rejectValue: string }
>("digitalDoc/dialogDetail", async (eldocNo, { rejectWithValue }) => {
  try {
    const res = await https.get(selectEDocDetailApiPath(eldocNo));
    const payload = (res as any)?.data?.data ?? (res as any)?.data ?? {};
    const parsed = digitalDocRowSchema.safeParse(payload);

    if (!parsed.success) {
      return rejectWithValue("전자문서 상세 응답 형식이 올바르지 않습니다.");
    }

    return parsed.data as DigitalDoc;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchDigitalDocHistoryList = createAsyncThunk<
  DigitalDocHistory[],
  string,
  { rejectValue: string }
>("digitalDoc/historyList", async (eldocNo, { rejectWithValue }) => {
  try {
    const res = await https.get(selectEDocHistoryApiPath(eldocNo), {
      params: {
        pageNum: 1,
        pageSize: 10,
      },
    });
    const payload = (res as any)?.data?.data ?? (res as any)?.data ?? {};

    if (Array.isArray(payload)) {
      const parsedRows = z.array(digitalDocHistoryRowSchema).safeParse(payload);
      if (!parsedRows.success) {
        return rejectWithValue("문서 이력 응답 형식이 올바르지 않습니다.");
      }
      return parsedRows.data as DigitalDocHistory[];
    }

    const parsed = digitalDocHistoryListSchema.safeParse(payload);
    if (!parsed.success) {
      return rejectWithValue("문서 이력 응답 형식이 올바르지 않습니다.");
    }

    return parsed.data.list as DigitalDocHistory[];
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchDigitalDocAuthrtList = createAsyncThunk<
  DigitalAuthrt[],
  string,
  { rejectValue: string }
>("digitalDoc/authrtList", async (eldocNo, { rejectWithValue }) => {
  try {
    const res = await https.get(selectEDocAuthrtListApiPath(eldocNo));
    const payload = (res as any)?.data?.data ?? (res as any)?.data ?? {};

    if (Array.isArray(payload)) {
      const parsedRows = z.array(digitalAuthrtRowSchema).safeParse(payload);
      if (!parsedRows.success) {
        return rejectWithValue("공람 목록 응답 형식이 올바르지 않습니다.");
      }
      return parsedRows.data as DigitalAuthrt[];
    }

    const parsed = digitalAuthrtListSchema.safeParse(payload);
    if (!parsed.success) {
      return rejectWithValue("공람 목록 응답 형식이 올바르지 않습니다.");
    }

    return parsed.data.list as DigitalAuthrt[];
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchDigitalDocAuthrtHistoryList = createAsyncThunk<
  DigitalAuthrtHistory[],
  string,
  { rejectValue: string }
>("digitalDoc/authrtHistoryList", async (eldocNo, { rejectWithValue }) => {
  try {
    const res = await https.get(selectEDocAuthrtHistoryApiPath(eldocNo));
    const payload = (res as any)?.data?.data ?? (res as any)?.data ?? {};

    if (Array.isArray(payload)) {
      const parsedRows = z.array(digitalAuthrtHistoryRowSchema).safeParse(payload);
      if (!parsedRows.success) {
        return rejectWithValue("공람 이력 응답 형식이 올바르지 않습니다.");
      }
      return parsedRows.data as DigitalAuthrtHistory[];
    }

    const parsed = digitalAuthrtHistoryListSchema.safeParse(payload);
    if (!parsed.success) {
      return rejectWithValue("공람 이력 응답 형식이 올바르지 않습니다.");
    }

    return parsed.data.list as DigitalAuthrtHistory[];
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export type DigitalDocAuthrtCreatePayload = {
  eldocNo: string;
  deptId: string;
};

export type DigitalDocAuthrtDeletePayload = {
  eldocNo: string;
  inqAuthrtNo: string;
};

export const createDigitalDocAuthrt = createAsyncThunk<
  number,
  DigitalDocAuthrtCreatePayload,
  { rejectValue: string }
>("digitalDoc/authrtCreate", async (payload, { rejectWithValue }) => {
  const { eldocNo, deptId } = payload;
  const validated = digitalAuthrtCreateValidator({ deptId });
  if (!validated.success) {
    const firstIssue = validated.issues[0];
    return rejectWithValue(firstIssue?.message ?? "공람자 입력값이 올바르지 않습니다.");
  }

  try {
    await https.post(insertEDocAuthrtApiPath(eldocNo), validated.data);
    return 1;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const deleteDigitalDocAuthrt = createAsyncThunk<
  number,
  DigitalDocAuthrtDeletePayload,
  { rejectValue: string }
>("digitalDoc/authrtDelete", async (payload, { rejectWithValue }) => {
  const { eldocNo, inqAuthrtNo } = payload;

  if (!eldocNo || !inqAuthrtNo) {
    return rejectWithValue("삭제할 공람 정보가 없습니다.");
  }

  try {
    await https.post(deleteEDocAuthrtApiPath(eldocNo, inqAuthrtNo));
    return 1;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export type DigitalDocCreatePayload = {
  docLclsfNo: string;
  docMclsfNo: string;
  docSclsfNo: string;
  docClsfNo: string;
  docNo: string;
  docTtl: string;
  clctYmd: string;
  hldPrdDfyrs: string | number;
  hldPrdMmCnt: string;
  endYmd: string;
  addExpln: string;
  uploadFiles?: File[];
};

export const createDigitalDoc = createAsyncThunk<
  string,
  DigitalDocCreatePayload,
  { rejectValue: string }
>("digitalDoc/create", async (payload, { rejectWithValue }) => {
  const { uploadFiles = [], ...formPayload } = payload;
  const validated = digitalDocFormValidator(formPayload);
  if (!validated.success) {
    const firstIssue = validated.issues[0];
    return rejectWithValue(
      firstIssue?.message ?? "입력값 검증에 실패했습니다.",
    );
  }

  try {
    const requestBody = {
      ...validated.data,
      clctYmd: toChar8Date(validated.data.clctYmd),
      endYmd: toChar8Date(validated.data.endYmd),
    };

    const formData = new FormData();
    formData.append(
      "data",
      new Blob([JSON.stringify(requestBody)], { type: "application/json" }),
    );
    uploadFiles.forEach((file) => {
      formData.append("uploadFiles", file);
    });

    const res = await https.post(insertEDocApiPath(), formData);
    const eldocNo = (res as any)?.data?.data?.eldocNo ?? "";
    return String(eldocNo);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export type DigitalDocUpdatePayload = {
  eldocNo: string;
  docClsfNo: string;
  docNo: string;
  docTtl: string;
  clctYmd: string;
  hldPrdDfyrs: string | number;
  hldPrdMmCnt: string;
  endYmd: string;
  addExpln: string;
  uploadFiles?: File[];
};

export const updateDigitalDoc = createAsyncThunk<
  number,
  DigitalDocUpdatePayload,
  { rejectValue: string }
>("digitalDoc/update", async (payload, { rejectWithValue }) => {
  const { uploadFiles = [], ...formPayload } = payload;
  const validated = digitalDocUpdateValidator(formPayload);
  if (!validated.success) {
    const firstIssue = validated.issues[0];
    return rejectWithValue(
      firstIssue?.message ?? "수정 입력값 검증에 실패했습니다.",
    );
  }

  try {
    const requestBody = {
      ...validated.data,
      clctYmd: toChar8Date(validated.data.clctYmd),
      endYmd: toChar8Date(validated.data.endYmd),
    };

    if (uploadFiles.length > 0) {
      const formData = new FormData();
      formData.append(
        "data",
        new Blob([JSON.stringify(requestBody)], { type: "application/json" }),
      );
      uploadFiles.forEach((file) => {
        formData.append("uploadFiles", file);
      });

      await https.post(updateEDocApiPath(), formData);
      return 1;
    }

    await https.post(updateEDocApiPath(), requestBody);
    return 1;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});
