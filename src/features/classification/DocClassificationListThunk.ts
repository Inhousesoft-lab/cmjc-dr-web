import { createAsyncThunk } from "@reduxjs/toolkit";
import https from "@/api/axiosInstance";
import { selectDocClassificationListApiPath } from "@/api/docClassification/DocClassificationApiPaths";
import type {
  DocClassificationSearch,
  DocClassificationVO,
} from "@/types/docClassification";

export interface DocClassificationListPayload {
  rows: DocClassificationVO[];
  rowCount: number;
}

export const fetchDocClassificationList = createAsyncThunk<
  DocClassificationListPayload,
  DocClassificationSearch | undefined,
  { rejectValue: string }
>("docClassification/list", async (params, { rejectWithValue }) => {
  try {
    const res = await https.get(selectDocClassificationListApiPath(), {
      params: params ?? {},
    });

    return {
      rows: (res.data?.list ?? []) as DocClassificationVO[],
      rowCount: Number(res.data?.total ?? 0),
    };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});
