import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

const selectMemberListState = (state: RootState) => state.memberList;

export const selectMemberRows = createSelector(
  [selectMemberListState],
  (s) => s.rows,
);

export const selectMemberRowCount = createSelector(
  [selectMemberListState],
  (s) => s.rowCount,
);

export const selectMemberLoading = createSelector(
  [selectMemberListState],
  (s) => s.loading,
);

export const selectMemberError = createSelector(
  [selectMemberListState],
  (s) => s.error,
);
