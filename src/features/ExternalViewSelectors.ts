import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

const selectExternalViewState = (state: RootState) => state.externalView;

export const selectExternalViewRows = createSelector(
  [selectExternalViewState],
  (s) => s.rows,
);

export const selectExternalViewRowCount = createSelector(
  [selectExternalViewState],
  (s) => s.rowCount,
);

export const selectExternalViewLoading = createSelector(
  [selectExternalViewState],
  (s) => s.loading,
);

export const selectExternalViewError = createSelector(
  [selectExternalViewState],
  (s) => s.error,
);

export const selectExternalViewDetail = createSelector(
  [selectExternalViewState],
  (s) => s.detail,
);

export const selectExternalViewDetailLoading = createSelector(
  [selectExternalViewState],
  (s) => s.detailLoading,
);

export const selectExternalViewDetailError = createSelector(
  [selectExternalViewState],
  (s) => s.detailError,
);

export const selectExternalViewFileLoading = createSelector(
  [selectExternalViewState],
  (s) => s.fileLoading,
);

export const selectExternalViewFileError = createSelector(
  [selectExternalViewState],
  (s) => s.fileError,
);
