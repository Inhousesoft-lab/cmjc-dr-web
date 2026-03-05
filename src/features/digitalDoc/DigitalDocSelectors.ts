import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

const selectDigitalDocListState = (state: RootState) => state.digitalDocList;

export const selectDigitalDocRows = createSelector(
  [selectDigitalDocListState],
  (s) => s.rows,
);

export const selectDigitalDocAuthrtRows = createSelector(
  [selectDigitalDocListState],
  (s) => s.authrtRows,
);

export const selectDigitalDocDetail = createSelector(
  [selectDigitalDocListState],
  (s) => s.detail,
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

export const selectDigitalDocAuthrtLoading = createSelector(
  [selectDigitalDocListState],
  (s) => s.authrtLoading,
);

export const selectDigitalDocAuthrtSaving = createSelector(
  [selectDigitalDocListState],
  (s) => s.authrtSaving,
);

export const selectDigitalDocAuthrtError = createSelector(
  [selectDigitalDocListState],
  (s) => s.authrtError,
);

export const selectDigitalDocAuthrtSaveError = createSelector(
  [selectDigitalDocListState],
  (s) => s.authrtSaveError,
);

export const selectDigitalDocDetailLoading = createSelector(
  [selectDigitalDocListState],
  (s) => s.detailLoading,
);

export const selectDigitalDocDetailError = createSelector(
  [selectDigitalDocListState],
  (s) => s.detailError,
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

export const selectDigitalDocUpdating = createSelector(
  [selectDigitalDocListState],
  (s) => s.saving,
);

export const selectDigitalDocUpdateSuccess = createSelector(
  [selectDigitalDocListState],
  (s) => s.updateSuccess,
);

export const selectDigitalDocUpdateError = createSelector(
  [selectDigitalDocListState],
  (s) => s.updateError,
);
