import { createSlice } from "@reduxjs/toolkit";
import { createDigitalDoc, fetchDigitalDocList } from "./DigitalDocThunk";
import type { DigitalDoc } from "@/types/digitalDoc";

export interface DigitalDocListState {
  rows: DigitalDoc[];
  rowCount: number;
  loading: boolean;
  saving: boolean;
  saveSuccess: boolean;
  error: string | null;
  saveError: string | null;
}

const initialState: DigitalDocListState = {
  rows: [],
  rowCount: 0,
  loading: false,
  saving: false,
  saveSuccess: false,
  error: null,
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
