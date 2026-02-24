import { createSlice } from "@reduxjs/toolkit";
import { fetchDocClsfList, DOC_CLSF_ROOT_KEY } from "./DocClsfThunk";
import type { DocClsf } from "@/types/docClassification";

export interface DocClsfState {
  byParent: Record<string, DocClsf[]>;
  loadingByParent: Record<string, boolean>;
  errorByParent: Record<string, string | null>;
  requestedByParent: Record<string, boolean>;
}

const initialState: DocClsfState = {
  byParent: {},
  loadingByParent: {},
  errorByParent: {},
  requestedByParent: {},
};

const docClsfSlice = createSlice({
  name: "docClsf",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocClsfList.pending, (state, action) => {
        const parentKey = action.meta.arg?.parentDocClsfNo || DOC_CLSF_ROOT_KEY;
        state.loadingByParent[parentKey] = true;
        state.requestedByParent[parentKey] = true;
        state.errorByParent[parentKey] = null;
      })
      .addCase(fetchDocClsfList.fulfilled, (state, action) => {
        const { parentKey, list } = action.payload;
        state.byParent[parentKey] = list;
        state.loadingByParent[parentKey] = false;
        state.errorByParent[parentKey] = null;
      })
      .addCase(fetchDocClsfList.rejected, (state, action) => {
        const parentKey = action.meta.arg?.parentDocClsfNo || DOC_CLSF_ROOT_KEY;
        state.loadingByParent[parentKey] = false;
        state.errorByParent[parentKey] =
          action.payload || action.error.message || "문서 분류 조회 실패";
      });
  },
});

export default docClsfSlice.reducer;
