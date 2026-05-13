/**
 * 전자문서
 */
//  목록 조회
export const selectEDocListApiPath = () => "/api/dr/electronicdocument/search";

// 상세 조회
export const selectEDocDetailApiPath = (eldocNo: string) => `/api/dr/electronicdocument/${eldocNo}`;

// 등록
export const insertEDocApiPath = () => "/api/dr/electronicdocument/add";

// 임시 등록
export const insertEDocTempApiPath = () => "/api/dr/electronicdocument/temp/add";

// 수정
export const updateEDocApiPath = () => "/api/dr/electronicdocument/update";

// 삭제
export const deleteEDocApiPath = () => "/api/dr/electronicdocument/delete";

// 이력 조회
export const selectEDocHistoryApiPath = (eldocNo: string) => `/api/dr/electronicdocument/${eldocNo}/history`;

/**
 * 공람
 */
// 공람 조회
export const selectEDocAuthrtListApiPath = (eldocNo: string) => `/api/dr/electronicdocument/${eldocNo}/inqauthrt`;

// 공람 등록
export const insertEDocAuthrtApiPath = (eldocNo: string) => `/api/dr/electronicdocument/${eldocNo}/inqauthrt`;

// 공람 삭제
export const deleteEDocAuthrtApiPath = (eldocNo: string, inqAuthrtNo: string) => `/api/dr/electronicdocument/${eldocNo}/inqauthrt/${inqAuthrtNo}/soft-delete`;

// 공람 이력 조회
export const selectEDocAuthrtHistoryApiPath = (eldocNo: string) => `/api/dr/electronicdocument/${eldocNo}/inqauthrt/history`;
