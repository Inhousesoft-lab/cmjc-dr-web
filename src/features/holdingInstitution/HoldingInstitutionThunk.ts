import { createAsyncThunk } from "@reduxjs/toolkit";
import https from "@/api/axiosInstance";
import { selectHoldingInstitutionListApiPath } from "@/api/holdingInstitution/HoldingInstitutionApiPaths";
import { holdingInstitutionListSchema } from "./HoldingInstitutionValidator";
import type { HoldingInstitution, SearchValues } from "@/types/holdingInstitution";

export interface HoldingInstitutionListPayload {
  rows: HoldingInstitution[];
  rowCount: number;
}

export const fetchHoldingInstitutionList = createAsyncThunk<
  HoldingInstitutionListPayload,
  Partial<SearchValues> | undefined,
  { rejectValue: string }
>("holdingInstitution/list", async (params, { rejectWithValue }) => {
  try {
    const requestParams = {
      ...(params ?? {}),
    };

    const res = await https.get(selectHoldingInstitutionListApiPath(), {
      params: requestParams,
    });

    const parsed = holdingInstitutionListSchema.safeParse(
      (res as any)?.data?.data ?? (res as any)?.data ?? {},
    );

    if (!parsed.success) {
      return rejectWithValue("보유기관 목록 응답 형식이 올바르지 않습니다.");
    }

    return {
      rows: parsed.data.list as unknown as HoldingInstitution[],
      rowCount: parsed.data.total,
    };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});
