import { createSlice } from "@reduxjs/toolkit";
import {
  createDigitalDocAuthrt,
  createDigitalDoc,
  fetchDigitalDocAuthrtList,
  fetchDigitalDocDetail,
  fetchDigitalDocList,
} from "./DigitalDocThunk";
import type { DigitalAuthrt, DigitalDoc } from "@/types/digitalDoc";

export interface DigitalDocListState {
  rows: DigitalDoc[];
  authrtRows: DigitalAuthrt[];
  detail: DigitalDoc | null;
  rowCount: number;
  loading: boolean;
  authrtLoading: boolean;
  authrtSaving: boolean;
  detailLoading: boolean;
  saving: boolean;
  saveSuccess: boolean;
  error: string | null;
  authrtError: string | null;
  authrtSaveError: string | null;
  detailError: string | null;
  saveError: string | null;
}

const initialState: DigitalDocListState = {
  rows: [],
  authrtRows: [],
  detail: null,
  rowCount: 0,
  loading: false,
  authrtLoading: false,
  authrtSaving: false,
  detailLoading: false,
  saving: false,
  saveSuccess: false,
  error: null,
  authrtError: null,
  authrtSaveError: null,
  detailError: null,
  saveError: null,
};

const digitalDocSlice = createSlice({
  name: "digitalDocList",
  initialState,
  reducers: {
    resetDigitalDocSaveState: (state) => {
      state.saving = false;
      state.saveSuccess = false;
      state.saveError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDigitalDocList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDigitalDocList.fulfilled, (state, action) => {
        state.loading = false;
        state.rows = action.payload.rows;
        state.rowCount = action.payload.rowCount;
        state.error = null;
      })
      .addCase(fetchDigitalDocList.rejected, (state, action) => {
        state.loading = false;
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
      .addCase(createDigitalDoc.pending, (state) => {
        state.saving = true;
        state.saveSuccess = false;
        state.saveError = null;
      })
      .addCase(createDigitalDoc.fulfilled, (state) => {
        state.saving = false;
        state.saveSuccess = true;
        state.saveError = null;
      })
      .addCase(createDigitalDoc.rejected, (state, action) => {
        state.saving = false;
        state.saveSuccess = false;
        state.saveError =
          action.payload || action.error.message || "전자문서 등록 실패";
      });
  },
});

export const { resetDigitalDocSaveState } = digitalDocSlice.actions;
export default digitalDocSlice.reducer;
