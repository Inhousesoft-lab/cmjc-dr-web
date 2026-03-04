import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

const selectHoldingInstitutionListState = (state: RootState) =>
  state.holdingInstitutionList;

export const selectHoldingInstitutionRows = createSelector(
  [selectHoldingInstitutionListState],
  (s) => s.rows,
);

export const selectHoldingInstitutionRowCount = createSelector(
  [selectHoldingInstitutionListState],
  (s) => s.rowCount,
);

export const selectHoldingInstitutionLoading = createSelector(
  [selectHoldingInstitutionListState],
  (s) => s.loading,
);

export const selectHoldingInstitutionError = createSelector(
  [selectHoldingInstitutionListState],
  (s) => s.error,
);
