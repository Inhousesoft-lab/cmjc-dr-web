/**
 * 대국민포털_댓글기본 정보 목록 조회 
 */
export const selectCmntListApiPath = () => '/notice/selectCmntList'

/**
 * 대국민포털_댓글기본 정보 조회 
 */
export const getCmntApiPath = () => '/notice/getCmnt'

/**
 * 대국민포털_댓글기본 정보 입력 
 */
export const insertCmntApiPath = () => '/notice/insertCmnt'

/**
 * 대국민포털_댓글기본 정보 수정 
 */
export const updateCmntApiPath = () => '/notice/updateCmnt'

/**
 * 대국민포털_댓글기본 정보 저장 
 * 기존 데이터가 존재하지 않으면 입력하고, 존재하면 수정한다.
 */
export const saveCmntApiPath = () => '/notice/saveCmnt'

/**
 * 대국민포털_댓글기본 정보 삭제 
 */
export const deleteCmntApiPath = () => '/notice/deleteCmnt'
