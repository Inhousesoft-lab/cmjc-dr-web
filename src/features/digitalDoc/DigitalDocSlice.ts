import { createSlice } from "@reduxjs/toolkit";
import {
  createDigitalDocAuthrt,
  createDigitalDoc,
  deleteDigitalDocAuthrt,
  extractDigitalDocFirstPageOcr,
  fetchDigitalDocAuthrtHistoryList,
  fetchDigitalDocAuthrtList,
  fetchDigitalDocDialogDetail,
  fetchDigitalDocDetail,
  fetchDigitalDocHistoryList,
  fetchDigitalDocList,
  updateDigitalDoc,
} from "./DigitalDocThunk";
import type {
  DigitalAuthrt,
  DigitalAuthrtHistory,
  DigitalDoc,
  DigitalDocCreateResult,
  DigitalDocFirstPageOcrResult,
  DigitalDocHistory,
} from "@/types/digitalDoc";

export interface DigitalDocListState {
  rows: DigitalDoc[];
  authrtRows: DigitalAuthrt[];
  authrtHistoryRows: DigitalAuthrtHistory[];
  docHistoryRows: DigitalDocHistory[];
  detail: DigitalDoc | null;
  dialogDetail: DigitalDoc | null;
  lastCreateResult: DigitalDocCreateResult | null;
  firstPageOcrResult: DigitalDocFirstPageOcrResult | null;
  rowCount: number;
  loading: boolean;
  currentListRequestId: string | null;
  currentListParamsKey: string | null;
  authrtLoading: boolean;
  authrtSaving: boolean;
  authrtHistoryLoading: boolean;
  docHistoryLoading: boolean;
  detailLoading: boolean;
  dialogDetailLoading: boolean;
  saving: boolean;
  firstPageOcrLoading: boolean;
  saveSuccess: boolean;
  updateSuccess: boolean;
  error: string | null;
  authrtError: string | null;
  authrtSaveError: string | null;
  authrtHistoryError: string | null;
  docHistoryError: string | null;
  detailError: string | null;
  dialogDetailError: string | null;
  saveError: string | null;
  updateError: string | null;
  firstPageOcrError: string | null;
}

const initialState: DigitalDocListState = {
  rows: [],
  authrtRows: [],
  authrtHistoryRows: [],
  docHistoryRows: [],
  detail: null,
  dialogDetail: null,
  lastCreateResult: null,
  firstPageOcrResult: null,
  rowCount: 0,
  loading: false,
  currentListRequestId: null,
  currentListParamsKey: null,
  authrtLoading: false,
  authrtSaving: false,
  authrtHistoryLoading: false,
  docHistoryLoading: false,
  detailLoading: false,
  dialogDetailLoading: false,
  saving: false,
  firstPageOcrLoading: false,
  saveSuccess: false,
  updateSuccess: false,
  error: null,
  authrtError: null,
  authrtSaveError: null,
  authrtHistoryError: null,
  docHistoryError: null,
  detailError: null,
  dialogDetailError: null,
  saveError: null,
  updateError: null,
  firstPageOcrError: null,
};

const digitalDocSlice = createSlice({
  name: "digitalDocList",
  initialState,
  reducers: {
    resetDigitalDocSaveState: (state) => {
      state.saving = false;
      state.saveSuccess = false;
      state.saveError = null;
      state.updateSuccess = false;
      state.updateError = null;
      state.lastCreateResult = null;
      state.firstPageOcrResult = null;
      state.firstPageOcrError = null;
      state.firstPageOcrLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDigitalDocList.pending, (state, action) => {
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
      .addCase(fetchDigitalDocList.fulfilled, (state, action) => {
        if (state.currentListRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.currentListRequestId = null;
        state.rows = action.payload.rows;
        state.rowCount = action.payload.rowCount;
        state.error = null;
      })
      .addCase(fetchDigitalDocList.rejected, (state, action) => {
        if (state.currentListRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.currentListRequestId = null;
        state.error =
          action.payload || action.error.message || "전자문서 목록 조회 실패";
      })
      .addCase(fetchDigitalDocAuthrtList.pending, (state) => {
        state.authrtLoading = true;
        state.authrtError = null;
      })
      .addCase(fetchDigitalDocAuthrtList.fulfilled, (state, action) => {
        state.authrtLoading = false;
        state.authrtRows = action.payload;
        state.authrtError = null;
      })
      .addCase(fetchDigitalDocAuthrtList.rejected, (state, action) => {
        state.authrtLoading = false;
        state.authrtRows = [];
        state.authrtError =
          action.payload || action.error.message || "공람 목록 조회 실패";
      })
      .addCase(fetchDigitalDocAuthrtHistoryList.pending, (state) => {
        state.authrtHistoryLoading = true;
        state.authrtHistoryError = null;
      })
      .addCase(fetchDigitalDocAuthrtHistoryList.fulfilled, (state, action) => {
        state.authrtHistoryLoading = false;
        state.authrtHistoryRows = action.payload;
        state.authrtHistoryError = null;
      })
      .addCase(fetchDigitalDocAuthrtHistoryList.rejected, (state, action) => {
        state.authrtHistoryLoading = false;
        state.authrtHistoryRows = [];
        state.authrtHistoryError =
          action.payload || action.error.message || "공람 이력 조회 실패";
      })
      .addCase(createDigitalDocAuthrt.pending, (state) => {
        state.authrtSaving = true;
        state.authrtSaveError = null;
      })
      .addCase(createDigitalDocAuthrt.fulfilled, (state) => {
        state.authrtSaving = false;
        state.authrtSaveError = null;
      })
      .addCase(createDigitalDocAuthrt.rejected, (state, action) => {
        state.authrtSaving = false;
        state.authrtSaveError =
          action.payload || action.error.message || "공람 등록 실패";
      })
      .addCase(deleteDigitalDocAuthrt.pending, (state) => {
        state.authrtSaving = true;
        state.authrtSaveError = null;
      })
      .addCase(deleteDigitalDocAuthrt.fulfilled, (state) => {
        state.authrtSaving = false;
        state.authrtSaveError = null;
      })
      .addCase(deleteDigitalDocAuthrt.rejected, (state, action) => {
        state.authrtSaving = false;
        state.authrtSaveError =
          action.payload || action.error.message || "공람 삭제 실패";
      })
      .addCase(fetchDigitalDocDetail.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchDigitalDocDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detail = action.payload;
        state.detailError = null;
      })
      .addCase(fetchDigitalDocDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detail = null;
        state.detailError =
          action.payload || action.error.message || "전자문서 상세 조회 실패";
      })
      .addCase(fetchDigitalDocDialogDetail.pending, (state) => {
        state.dialogDetailLoading = true;
        state.dialogDetailError = null;
      })
      .addCase(fetchDigitalDocDialogDetail.fulfilled, (state, action) => {
        state.dialogDetailLoading = false;
        state.dialogDetail = action.payload;
        state.dialogDetailError = null;
      })
      .addCase(fetchDigitalDocDialogDetail.rejected, (state, action) => {
        state.dialogDetailLoading = false;
        state.dialogDetail = null;
        state.dialogDetailError =
          action.payload || action.error.message || "전자문서 상세 조회 실패";
      })
      .addCase(fetchDigitalDocHistoryList.pending, (state) => {
        state.docHistoryLoading = true;
        state.docHistoryError = null;
      })
      .addCase(fetchDigitalDocHistoryList.fulfilled, (state, action) => {
        state.docHistoryLoading = false;
        state.docHistoryRows = action.payload;
        state.docHistoryError = null;
      })
      .addCase(fetchDigitalDocHistoryList.rejected, (state, action) => {
        state.docHistoryLoading = false;
        state.docHistoryRows = [];
        state.docHistoryError =
          action.payload || action.error.message || "문서 이력 조회 실패";
      })
      .addCase(extractDigitalDocFirstPageOcr.pending, (state) => {
        state.firstPageOcrLoading = true;
        state.firstPageOcrResult = null;
        state.firstPageOcrError = null;
      })
      .addCase(extractDigitalDocFirstPageOcr.fulfilled, (state, action) => {
        state.firstPageOcrLoading = false;
        state.firstPageOcrResult = action.payload;
        state.firstPageOcrError = null;
      })
      .addCase(extractDigitalDocFirstPageOcr.rejected, (state, action) => {
        state.firstPageOcrLoading = false;
        state.firstPageOcrResult = null;
        state.firstPageOcrError =
          action.payload || action.error.message || "첫 페이지 OCR 처리 실패";
      })
      .addCase(createDigitalDoc.pending, (state) => {
        state.saving = true;
        state.saveSuccess = false;
        state.saveError = null;
        state.lastCreateResult = null;
      })
      .addCase(createDigitalDoc.fulfilled, (state, action) => {
        state.saving = false;
        state.saveSuccess = true;
        state.saveError = null;
        state.lastCreateResult = action.payload;
      })
      .addCase(createDigitalDoc.rejected, (state, action) => {
        state.saving = false;
        state.saveSuccess = false;
        state.saveError =
          action.payload || action.error.message || "전자문서 등록 실패";
      })
      .addCase(updateDigitalDoc.pending, (state) => {
        state.saving = true;
        state.updateSuccess = false;
        state.updateError = null;
      })
      .addCase(updateDigitalDoc.fulfilled, (state) => {
        state.saving = false;
        state.updateSuccess = true;
        state.updateError = null;
      })
      .addCase(updateDigitalDoc.rejected, (state, action) => {
        state.saving = false;
        state.updateSuccess = false;
        state.updateError =
          action.payload || action.error.message || "전자문서 수정 실패";
      });
  },
});

export const { resetDigitalDocSaveState } = digitalDocSlice.actions;
export default digitalDocSlice.reducer;
