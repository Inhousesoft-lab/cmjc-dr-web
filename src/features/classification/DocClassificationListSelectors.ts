import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

const selectDocClassificationListState = (state: RootState) =>
  state.docClassificationList;

export const selectDocClassificationRows = createSelector(
  [selectDocClassificationListState],
  (s) => s.rows,
);

export const selectDocClassificationDetail = createSelector(
  [selectDocClassificationListState],
  (s) => s.detail,
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

export const selectDocClassificationDetailLoading = createSelector(
  [selectDocClassificationListState],
  (s) => s.detailLoading,
);

export const selectDocClassificationDetailError = createSelector(
  [selectDocClassificationListState],
  (s) => s.detailError,
);

export const selectDocClassificationDeleteLoading = createSelector(
  [selectDocClassificationListState],
  (s) => s.deleteLoading,
);

export const selectDocClassificationDeleteError = createSelector(
  [selectDocClassificationListState],
  (s) => s.deleteError,
);
