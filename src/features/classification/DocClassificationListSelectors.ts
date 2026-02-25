import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

const selectDocClassificationListState = (state: RootState) =>
  state.docClassificationList;

export const selectDocClassificationRows = createSelector(
  [selectDocClassificationListState],
  (s) => s.rows,
);

export const selectDocClassificationRowCount = createSelector(
  [selectDocClassificationListState],
  (s) => s.rowCount,
);

export const selectDocClassificationLoading = createSelector(
  [selectDocClassificationListState],
  (s) => s.loading,
);

export const selectDocClassificationError = createSelector(
  [selectDocClassificationListState],
  (s) => s.error,
);
