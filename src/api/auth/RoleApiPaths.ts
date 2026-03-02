/**
 * 대국민포털_역할기본 정보 목록 조회 
 */
export const selectRoleListApiPath = () => '/auth/selectRoleList'

/**
 * 대국민포털_역할기본 정보 조회 
 */
export const getRoleApiPath = () => '/auth/getRole'

/**
 * 대국민포털_역할기본 정보 입력 
 */
export const insertRoleApiPath = () => '/auth/insertRole'

/**
 * 대국민포털_역할기본 정보 수정 
 */
export const updateRoleApiPath = () => '/auth/updateRole'

/**
 * 대국민포털_역할기본 정보 저장 
 * 기존 데이터가 존재하지 않으면 입력하고, 존재하면 수정한다.
 */
export const saveRoleApiPath = () => '/auth/saveRole'

/**
 * 대국민포털_역할기본 정보 삭제 
 */
export const deleteRoleApiPath = () => '/auth/deleteRole'
