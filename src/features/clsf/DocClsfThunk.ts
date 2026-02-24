import { createAsyncThunk } from "@reduxjs/toolkit";
import https from "@/api/axiosInstance";
import { selectDocClsfList, selectLclsfList } from "@/api/com/BizCommon";
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
    const list = (res.data?.list ?? res.data ?? []) as DocClsf[];
    return { parentKey, list };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const DOC_CLSF_ROOT_KEY = ROOT_KEY;
