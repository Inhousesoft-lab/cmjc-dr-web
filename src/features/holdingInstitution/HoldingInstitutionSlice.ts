import { createSlice } from "@reduxjs/toolkit";
import { fetchHoldingInstitutionList } from "./HoldingInstitutionThunk";
import type { HoldingInstitution } from "@/types/holdingInstitution";

export interface HoldingInstitutionListState {
  rows: HoldingInstitution[];
  rowCount: number;
  loading: boolean;
  currentListRequestId: string | null;
  currentListParamsKey: string | null;
  error: string | null;
}

const initialState: HoldingInstitutionListState = {
  rows: [],
  rowCount: 0,
  loading: false,
  currentListRequestId: null,
  currentListParamsKey: null,
  error: null,
};

const holdingInstitutionListSlice = createSlice({
  name: "holdingInstitutionList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHoldingInstitutionList.pending, (state, action) => {
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
      .addCase(fetchHoldingInstitutionList.fulfilled, (state, action) => {
        if (state.currentListRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.currentListRequestId = null;
        state.rows = action.payload.rows;
        state.rowCount = action.payload.rowCount;
        state.error = null;
      })
      .addCase(fetchHoldingInstitutionList.rejected, (state, action) => {
        if (state.currentListRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.currentListRequestId = null;
        state.error = action.payload || action.error.message || "보유기관 목록 조회 실패";
      });
  },
});

export default holdingInstitutionListSlice.reducer;
