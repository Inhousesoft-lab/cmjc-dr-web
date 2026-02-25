import { createSlice } from "@reduxjs/toolkit";
import { fetchDocClassificationList } from "./DocClassificationListThunk";
import type { DocClassificationVO } from "@/types/docClassification";

export interface DocClassificationListState {
  rows: DocClassificationVO[];
  rowCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: DocClassificationListState = {
  rows: [],
  rowCount: 0,
  loading: false,
  error: null,
};

const docClassificationListSlice = createSlice({
  name: "docClassificationList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocClassificationList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocClassificationList.fulfilled, (state, action) => {
        state.loading = false;
        state.rows = action.payload.rows;
        state.rowCount = action.payload.rowCount;
        state.error = null;
      })
      .addCase(fetchDocClassificationList.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || "문서분류 목록 조회 실패";
      });
  },
});

export default docClassificationListSlice.reducer;
