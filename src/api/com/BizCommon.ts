/**
 * 대분류 조회
 */
export const selectLclsfList = () => "/api/dr/documentclassification/toplevel";

/**
 * 상세 분류 조회
 */
export const selectDocClsfList = (docClsfNo: string) =>
    `/api/dr/documentclassification/${docClsfNo}/children`;
