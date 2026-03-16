import { createSlice } from "@reduxjs/toolkit";
import {
  deleteDocClassification,
  fetchDocClassificationDetail,
  fetchDocClassificationList,
  unuseDocClassification,
} from "./DocClassificationListThunk";
import type { DocClassDetail, DocClassificationVO } from "@/types/docClassification";

export interface DocClassificationListState {
  rows: DocClassificationVO[];
  detail: DocClassDetail | null;
  rowCount: number;
  loading: boolean;
  currentListRequestId: string | null;
  currentListParamsKey: string | null;
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
  currentListRequestId: null,
  currentListParamsKey: null,
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
      .addCase(fetchDocClassificationList.pending, (state, action) => {
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
      .addCase(fetchDocClassificationList.fulfilled, (state, action) => {
        if (state.currentListRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.currentListRequestId = null;
        state.rows = action.payload.rows;
        state.rowCount = action.payload.rowCount;
        state.error = null;
      })
      .addCase(fetchDocClassificationList.rejected, (state, action) => {
        if (state.currentListRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.currentListRequestId = null;
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
      })
      .addCase(unuseDocClassification.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(unuseDocClassification.fulfilled, (state) => {
        state.deleteLoading = false;
        state.deleteError = null;
        if (state.detail) {
          state.detail = {
            ...state.detail,
            useEn: "N",
          };
        }
      })
      .addCase(unuseDocClassification.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError =
          action.payload || action.error.message || "문서분류 사용안함 처리 실패";
      });
  },
});

export default docClassificationListSlice.reducer;
