/**
 * 목록 조회
 */
export const selectDocDestructionListApiPath = () =>
  "/api/dr/docDestruction/search";

/**
 * 상세 조회
 */
// TODO: Detail data view logic
export const selectDocDestructionDetailApiPath = (eldocNo: string) =>
  `/api/dr/docDestruction/${eldocNo}`;

/**
 * 등록
 */
// TODO: create logic
export const insertDocDestructionApiPath = () => "/api/dr/docDestruction/add";

/**
 * 문서파기 신청, 승인
 */
export const updateDocDestructionApiPath = () =>
  "/api/dr/docDestruction/docPrcsPrstUpdate";

/**
 * 프린트 데이터 조회
 */
export const selectDocDestructionPrvcIncl = () =>
  "/api/dr/docDestruction/search";
