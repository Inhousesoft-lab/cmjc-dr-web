/**
 * 파기문서
 */
// 파기문서 목록 조회
export const selectDocDestructionListApiPath = () => "/api/dr/docDestruction/search";

// 상세 조회
export const selectDocDestructionDetailApiPath = (eldocNo: string) => `/api/dr/docDestruction/${eldocNo}`;

// 문서이력 조회
export const selectDocDestructionHistoryApiPath = (eldocNo: string) => `/api/dr/docDestruction/${eldocNo}/history`;

// 문서파기 신청 및 승인
export const updateDocDestructionApiPath = () => "/api/dr/docDestruction/docPrcsPrstUpdate";

/**
 * 공람
 */
// 공람 목록 조회
export const selectDocDestructionInqauthrtListApiPath = (eldocNo: string) => `/api/dr/docDestruction/${eldocNo}/inqauthrt`;

// 공람 등록
export const insertDocDestructionInqauthrtApiPath = (eldocNo: string) => `/api/dr/docDestruction/${eldocNo}/inqauthrt`;

// 공람 삭제
export const deleteDocDestructionInqauthrtApiPath = (eldocNo: string, inqAuthrtNo: string) => `/api/dr/docDestruction/${eldocNo}/inqauthrt/${inqAuthrtNo}/soft-delete`;

// 공람 이력 조회
export const selectDocDestructionInqauthrtHistoryApiPath = (eldocNo: string) => `/api/dr/docDestruction/${eldocNo}/inqauthrt/history`;
