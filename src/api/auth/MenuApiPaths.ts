/**
 * 대국민포털_메뉴기본 정보 목록 조회 
 */
export const selectMenuListApiPath = () => '/auth/selectMenuList'

/**
 * 대국민포털_메뉴기본 정보 조회 
 */
export const getMenuApiPath = () => '/auth/getMenu'

/**
 * 대국민포털_메뉴기본 정보 입력 
 */
export const insertMenuApiPath = () => '/auth/insertMenu'

/**
 * 대국민포털_메뉴기본 정보 수정 
 */
export const updateMenuApiPath = () => '/auth/updateMenu'

/**
 * 대국민포털_메뉴기본 정보 저장 
 * 기존 데이터가 존재하지 않으면 입력하고, 존재하면 수정한다.
 */
export const saveMenuApiPath = () => '/auth/saveMenu'

/**
 * 대국민포털_메뉴기본 정보 삭제 
 */
export const deleteMenuApiPath = () => '/auth/deleteMenu'
