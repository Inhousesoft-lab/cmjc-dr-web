import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import { DOC_CLSF_ROOT_KEY } from "./DocClsfThunk";

const selectDocClsfState = (state: RootState) => state.docClsf;

export const selectDocClsfByParent = createSelector(
  [
    selectDocClsfState,
    (_: RootState, parentDocClsfNo?: string) =>
      parentDocClsfNo || DOC_CLSF_ROOT_KEY,
  ],
  (docClsf, parentKey) => docClsf.byParent[parentKey] ?? [],
);

export const selectDocClsfLoadingByParent = createSelector(
  [
    selectDocClsfState,
    (_: RootState, parentDocClsfNo?: string) =>
      parentDocClsfNo || DOC_CLSF_ROOT_KEY,
  ],
  (docClsf, parentKey) => !!docClsf.loadingByParent[parentKey],
);

export const selectDocClsfErrorByParent = createSelector(
  [
    selectDocClsfState,
    (_: RootState, parentDocClsfNo?: string) =>
      parentDocClsfNo || DOC_CLSF_ROOT_KEY,
  ],
  (docClsf, parentKey) => docClsf.errorByParent[parentKey] ?? null,
);

export const selectDocClsfRequestedByParent = createSelector(
  [
    selectDocClsfState,
    (_: RootState, parentDocClsfNo?: string) =>
      parentDocClsfNo || DOC_CLSF_ROOT_KEY,
  ],
  (docClsf, parentKey) => !!docClsf.requestedByParent[parentKey],
);
