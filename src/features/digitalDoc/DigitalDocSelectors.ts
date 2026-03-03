import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

const selectDigitalDocListState = (state: RootState) => state.digitalDocList;

export const selectDigitalDocRows = createSelector(
  [selectDigitalDocListState],
  (s) => s.rows,
);

export const selectDigitalDocRowCount = createSelector(
  [selectDigitalDocListState],
  (s) => s.rowCount,
);

export const selectDigitalDocLoading = createSelector(
  [selectDigitalDocListState],
  (s) => s.loading,
);

export const selectDigitalDocError = createSelector(
  [selectDigitalDocListState],
  (s) => s.error,
);

export const selectDigitalDocSaving = createSelector(
  [selectDigitalDocListState],
  (s) => s.saving,
);

export const selectDigitalDocSaveSuccess = createSelector(
  [selectDigitalDocListState],
  (s) => s.saveSuccess,
);

export const selectDigitalDocSaveError = createSelector(
  [selectDigitalDocListState],
  (s) => s.saveError,
);
