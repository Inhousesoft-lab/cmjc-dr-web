import { createAsyncThunk } from "@reduxjs/toolkit";
import https from "@/api/axiosInstance";
import { selectDocClsfList, selectLclsfList } from "@/api/clsf/DocClsf";
import type { DocClsf } from "@/types/docClassification";

export interface FetchDocClsfArg {
  parentDocClsfNo?: string;
}

export interface FetchDocClsfResult {
  parentKey: string;
  list: DocClsf[];
}

const ROOT_KEY = "__ROOT__";

export const fetchDocClsfList = createAsyncThunk<
  FetchDocClsfResult,
  FetchDocClsfArg | undefined,
  { rejectValue: string }
>("docClsf/fetchDocClsfList", async (arg, { rejectWithValue }) => {
  const parentDocClsfNo = arg?.parentDocClsfNo;
  const parentKey = parentDocClsfNo || ROOT_KEY;

  try {
    const url = parentDocClsfNo
      ? selectDocClsfList(parentDocClsfNo)
      : selectLclsfList();
    const res = await https.get(url);
    const payload = res.data;
    const candidates = [
      payload?.list,
      payload?.data?.list,
      payload?.result?.list,
      payload?.items,
      payload?.content,
      payload?.data,
      payload?.result,
      payload,
    ];
    const raw = candidates.find((v) => Array.isArray(v)) ?? [];
    const list = Array.isArray(raw) ? (raw as DocClsf[]) : [];
    return { parentKey, list };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const DOC_CLSF_ROOT_KEY = ROOT_KEY;
