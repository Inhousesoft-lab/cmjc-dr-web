/**
 * 대국민포털_게시판기본 정보 목록 조회 
 */
export const selectBbsListApiPath = () => '/notice/selectBbsList'

/**
 * 대국민포털_게시판기본 정보 조회 
 */
export const getBbsApiPath = () => '/notice/getBbs'

/**
 * 대국민포털_게시판기본 정보 입력 
 */
export const insertBbsApiPath = () => '/notice/insertBbs'

/**
 * 대국민포털_게시판기본 정보 수정 
 */
export const updateBbsApiPath = () => '/notice/updateBbs'

/**
 * 대국민포털_게시판기본 정보 저장 
 * 기존 데이터가 존재하지 않으면 입력하고, 존재하면 수정한다.
 */
export const saveBbsApiPath = () => '/notice/saveBbs'

/**
 * 대국민포털_게시판기본 정보 삭제 
 */
export const deleteBbsApiPath = () => '/notice/deleteBbs'
