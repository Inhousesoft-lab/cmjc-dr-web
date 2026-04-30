import { createSlice } from "@reduxjs/toolkit";
import type { MemberRow } from "@/types/member";
import { fetchMemberList } from "./MemberThunk";

export interface MemberListState {
  rows: MemberRow[];
  rowCount: number;
  loading: boolean;
  currentListRequestId: string | null;
  currentListParamsKey: string | null;
  error: string | null;
}

const initialState: MemberListState = {
  rows: [],
  rowCount: 0,
  loading: false,
  currentListRequestId: null,
  currentListParamsKey: null,
  error: null,
};

const memberSlice = createSlice({
  name: "memberList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMemberList.pending, (state, action) => {
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
      .addCase(fetchMemberList.fulfilled, (state, action) => {
        if (state.currentListRequestId !== action.meta.requestId) return;

        state.loading = false;
        state.currentListRequestId = null;
        state.rows = action.payload.rows;
        state.rowCount = action.payload.rowCount;
        state.error = null;
      })
      .addCase(fetchMemberList.rejected, (state, action) => {
        if (state.currentListRequestId !== action.meta.requestId) return;

        state.loading = false;
        state.currentListRequestId = null;
        state.rows = [];
        state.rowCount = 0;
        state.error = action.payload || action.error.message || "회원 목록 조회 실패";
      });
  },
});

export default memberSlice.reducer;
