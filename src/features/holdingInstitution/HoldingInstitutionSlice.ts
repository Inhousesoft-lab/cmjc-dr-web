import { createSlice } from "@reduxjs/toolkit";
import { fetchHoldingInstitutionList } from "./HoldingInstitutionThunk";
import type { HoldingInstitution } from "@/types/holdingInstitution";

export interface HoldingInstitutionListState {
  rows: HoldingInstitution[];
  rowCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: HoldingInstitutionListState = {
  rows: [],
  rowCount: 0,
  loading: false,
  error: null,
};

const holdingInstitutionListSlice = createSlice({
  name: "holdingInstitutionList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHoldingInstitutionList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHoldingInstitutionList.fulfilled, (state, action) => {
        state.loading = false;
        state.rows = action.payload.rows;
        state.rowCount = action.payload.rowCount;
        state.error = null;
      })
      .addCase(fetchHoldingInstitutionList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "보유기관 목록 조회 실패";
      });
  },
});

export default holdingInstitutionListSlice.reducer;
