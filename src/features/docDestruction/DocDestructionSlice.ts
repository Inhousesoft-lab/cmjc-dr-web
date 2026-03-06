import { createSlice } from "@reduxjs/toolkit";
import {
  fetchDocDestructionDetail,
  fetchDocDestructionList,
  type DocDestructionDetailPayload,
} from "./DocDestructionThunk";
import type { DocDestruction } from "@/types/docDestruction";

export interface DocDestructionListState {
  rows: DocDestruction[];
  detail: DocDestructionDetailPayload | null;
  rowCount: number;
  loading: boolean;
  currentListRequestId: string | null;
  currentListParamsKey: string | null;
  detailLoading: boolean;
  error: string | null;
  detailError: string | null;
}

const initialState: DocDestructionListState = {
  rows: [],
  detail: null,
  rowCount: 0,
  loading: false,
  currentListRequestId: null,
  currentListParamsKey: null,
  detailLoading: false,
  error: null,
  detailError: null,
};

const docDestructionSlice = createSlice({
  name: "docDestructionList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocDestructionList.pending, (state, action) => {
        const nextParamsKey = JSON.stringify(action.meta.arg ?? {});
        const isDifferentQuery =
          state.currentListParamsKey !== null &&
          state.currentListParamsKey !== nextParamsKey;
        if (isDifferentQuery) {
          state.rows = [];
          state.rowCount = 0;
        }
        state.loading = true;
        state.currentListRequestId = action.meta.requestId;
        state.currentListParamsKey = nextParamsKey;
        state.error = null;
      })
      .addCase(fetchDocDestructionList.fulfilled, (state, action) => {
        if (state.currentListRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.currentListRequestId = null;
        state.rows = action.payload.rows;
        state.rowCount = action.payload.rowCount;
        state.error = null;
      })
      .addCase(fetchDocDestructionList.rejected, (state, action) => {
        if (state.currentListRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.currentListRequestId = null;
        state.error = action.payload || action.error.message || "파기문서 목록 조회 실패";
      })
      .addCase(fetchDocDestructionDetail.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchDocDestructionDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detail = action.payload;
        state.detailError = null;
      })
      .addCase(fetchDocDestructionDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detail = null;
        state.detailError = action.payload || action.error.message || "파기문서 상세 조회 실패";
      });
  },
});

export default docDestructionSlice.reducer;
