import { createAsyncThunk } from "@reduxjs/toolkit";
import https from "@/api/axiosInstance";
import {
  insertEDocApiPath,
  selectEDocListApiPath,
} from "@/api/digitalDoc/DigitalDocApiPaths";
import {
  digitalDocFormValidator,
  digitalDocListSchema,
} from "./DigitalDocValidator";
import type { DigitalDoc, SearchValues } from "@/types/digitalDoc";
import { toChar8Date } from "@/utils/formater";

export interface DigitalDocListPayload {
  rows: DigitalDoc[];
  rowCount: number;
}

export const fetchDigitalDocList = createAsyncThunk<
  DigitalDocListPayload,
  Partial<SearchValues> | undefined,
  { rejectValue: string }
>("digitalDoc/list", async (params, { rejectWithValue }) => {
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

    return {
      rows: parsed.data.list as DigitalDoc[],
      rowCount: parsed.data.total,
    };
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
  hldPrdDfyrs: string;
  hldPrdMmCnt: string;
  endYmd: string;
  addExpln: string;
  eldocYn: "Y" | "N";
  atchFileSn: string;
};

export const createDigitalDoc = createAsyncThunk<
  string,
  DigitalDocCreatePayload,
  { rejectValue: string }
>("digitalDoc/create", async (payload, { rejectWithValue }) => {
  const validated = digitalDocFormValidator(payload);
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

    const res = await https.post(insertEDocApiPath(), requestBody);
    const eldocNo = (res as any)?.data?.data?.eldocNo ?? "";
    return String(eldocNo);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});
