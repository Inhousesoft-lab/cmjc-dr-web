import { createSlice } from "@reduxjs/toolkit";
import {
  fetchExternalViewDetail,
  fetchExternalViewFile,
  fetchExternalViewList,
} from "./ExternalViewThunk";
import type { ExternalViewDocument } from "@/types/externalView";

export interface ExternalViewState {
  rows: ExternalViewDocument[];
  rowCount: number;
  detail: ExternalViewDocument | null;
  loading: boolean;
  detailLoading: boolean;
  fileLoading: boolean;
  error: string | null;
  detailError: string | null;
  fileError: string | null;
  currentListRequestId: string | null;
  currentListParamsKey: string | null;
}

const initialState: ExternalViewState = {
  rows: [],
  rowCount: 0,
  detail: null,
  loading: false,
  detailLoading: false,
  fileLoading: false,
  error: null,
  detailError: null,
  fileError: null,
  currentListRequestId: null,
  currentListParamsKey: null,
};

const externalViewSlice = createSlice({
  name: "externalView",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExternalViewList.pending, (state, action) => {
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
      .addCase(fetchExternalViewList.fulfilled, (state, action) => {
        if (state.currentListRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.currentListRequestId = null;
        state.rows = action.payload.rows;
        state.rowCount = action.payload.rowCount;
        state.error = null;
      })
      .addCase(fetchExternalViewList.rejected, (state, action) => {
        if (state.currentListRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.currentListRequestId = null;
        state.error =
          action.payload || action.error.message || "외부 문서열람 목록 조회 실패";
      })
      .addCase(fetchExternalViewDetail.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchExternalViewDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detail = action.payload;
        state.detailError = null;
      })
      .addCase(fetchExternalViewDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detail = null;
        state.detailError =
          action.payload || action.error.message || "외부 문서열람 상세 조회 실패";
      })
      .addCase(fetchExternalViewFile.pending, (state) => {
        state.fileLoading = true;
        state.fileError = null;
      })
      .addCase(fetchExternalViewFile.fulfilled, (state) => {
        state.fileLoading = false;
        state.fileError = null;
      })
      .addCase(fetchExternalViewFile.rejected, (state, action) => {
        state.fileLoading = false;
        state.fileError =
          action.payload || action.error.message || "외부 문서 파일 조회 실패";
      });
  },
});

export default externalViewSlice.reducer;
