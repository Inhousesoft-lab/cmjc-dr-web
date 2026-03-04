import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

const selectDocDestructionState = (state: RootState) => state.docDestructionList;

export const selectDocDestructionRows = createSelector(
  [selectDocDestructionState],
  (s) => s.rows,
);

export const selectDocDestructionDetail = createSelector(
  [selectDocDestructionState],
  (s) => s.detail,
);

export const selectDocDestructionRowCount = createSelector(
  [selectDocDestructionState],
  (s) => s.rowCount,
);

export const selectDocDestructionLoading = createSelector(
  [selectDocDestructionState],
  (s) => s.loading,
);

export const selectDocDestructionError = createSelector(
  [selectDocDestructionState],
  (s) => s.error,
);

export const selectDocDestructionDetailLoading = createSelector(
  [selectDocDestructionState],
  (s) => s.detailLoading,
);

export const selectDocDestructionDetailError = createSelector(
  [selectDocDestructionState],
  (s) => s.detailError,
);
