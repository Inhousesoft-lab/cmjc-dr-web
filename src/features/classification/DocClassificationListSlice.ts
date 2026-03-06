import { createSlice } from "@reduxjs/toolkit";
import {
  deleteDocClassification,
  fetchDocClassificationDetail,
  fetchDocClassificationList,
} from "./DocClassificationListThunk";
import type { DocClassDetail, DocClassificationVO } from "@/types/docClassification";

export interface DocClassificationListState {
  rows: DocClassificationVO[];
  detail: DocClassDetail | null;
  rowCount: number;
  loading: boolean;
  detailLoading: boolean;
  deleteLoading: boolean;
  error: string | null;
  detailError: string | null;
  deleteError: string | null;
}

const initialState: DocClassificationListState = {
  rows: [],
  detail: null,
  rowCount: 0,
  loading: false,
  detailLoading: false,
  deleteLoading: false,
  error: null,
  detailError: null,
  deleteError: null,
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
      })
      .addCase(fetchDocClassificationDetail.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchDocClassificationDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detail = action.payload;
        state.detailError = null;
      })
      .addCase(fetchDocClassificationDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detail = null;
        state.detailError =
          action.payload || action.error.message || "문서분류 상세 조회 실패";
      })
      .addCase(deleteDocClassification.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteDocClassification.fulfilled, (state) => {
        state.deleteLoading = false;
        state.deleteError = null;
        state.detail = null;
      })
      .addCase(deleteDocClassification.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError =
          action.payload || action.error.message || "문서분류 삭제 실패";
      });
  },
});

export default docClassificationListSlice.reducer;
