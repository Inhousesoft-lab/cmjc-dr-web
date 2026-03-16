/**
 * 문서분류
 */
// 목록 조회
export const selectDocClassificationListApiPath = () => "/api/dr/documentclassification/search";

// 상세 조회
export const selectDocClassificationDetailApiPath = (docClsfNo: string) => `/api/dr/documentclassification/${docClsfNo}`;

// 하위분류 조회
export const selectocClassificationDChidrenApiPath = (eldocNo: string) => `/api/dr/documentclassification/${eldocNo}/chidren`;

// 이력 조회
export const selectDocClassificationHistoryApiPath = (docClsfNo: string) => `/api/dr/documentclassification/${docClsfNo}/history`;

// 등록
export const insertDocClassificationApiPath = () => "/api/dr/documentclassification/add";

// 수정
export const updateDocClassificationApiPath = () => "/api/dr/documentclassification/update";

// 삭제 전 연결 전자문서 확인
export const checkDocClassificationDeleteApiPath = (docClsfNo: string) => `/api/dr/documentclassification/${docClsfNo}/delete-check`;

// 삭제
export const deleteDocClassificationApiPath = (docClsfNo: string) => `/api/dr/documentclassification/${docClsfNo}/delete`;

// 문서분류 사용안함
export const addDocClassificationUnuseApiPath = (docClsfNo: string) => `/api/dr/documentclassification/${docClsfNo}/unuse`;
