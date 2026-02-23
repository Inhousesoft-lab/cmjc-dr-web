/**
 * 목록 조회
 */
export const selectDocClassificationListApiPath = () =>
  "/api/dr/documentclassification/search";

/**
 * 상세 조회
 */
export const selectDocClassificationDetailApiPath = (docClsfNo: string) =>
  `/api/dr/documentclassification/${docClsfNo}`;

/**
 * 히스토리 조회
 */
export const selectDocClassificationHistoryApiPath = (docClsfNo: string) =>
  `/api/dr/documentclassification/${docClsfNo}/history`;

/**
 * 등록
 */
export const insertDocClassificationApiPath = () =>
  "/api/dr/documentclassification/add";

/**
 * 수정
 */
export const updateDocClassificationApiPath = () =>
  "/api/dr/documentclassification/update";

/**
 * 삭제
 */
export const deleteDocClassificationApiPath = () =>
  "/api/dr/documentclassification/delete";
