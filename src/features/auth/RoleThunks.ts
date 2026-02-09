import { createAsyncThunk } from '@reduxjs/toolkit'
import https from '@/api/axiosInstance'
import { selectRoleListApiPath, getRoleApiPath, insertRoleApiPath, updateRoleApiPath, saveRoleApiPath, deleteRoleApiPath } from '@/api/auth/RoleApiPaths'
import { mockRoleList, RolePVO, RoleRVO, RoleListPVO, RoleListRVO, RoleDVO  } from './RoleTypes'

/**
 * 대국민포털_역할기본 정보 목록 조회 
 */
export const selectRoleList = createAsyncThunk<RoleListRVO, RoleListPVO | undefined>(
  '/auth/selectRoleList',
  async (params: RoleListPVO = {}) => {
    try {
      const res = await https.post(selectRoleListApiPath(), params);

      // ✅ 여기서 “서버 응답”을 표준 형태로 맞춰서 return
      const payload = res.data;

      // 서버가 Role[] 형식으로 주므로 RoleListRVO 형식으로 데이터 구조 재조정 
      return {
        list: Array.isArray(payload) ? payload : [],
        totalCount: Array.isArray(payload) ? payload.length : 0
      } as RoleListRVO;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("RoleThunks selectRoleList mockRoleList=",mockRoleList);
      const filtered = mockRoleList.filter((n) => {
        //if (!params.searchWrd) return true;
        //const v = (params.searchCnd === 'content' ? n.content : n.title) || '';
        //return v.includes(params.searchWrd);
        return true; // edit !! 
      });

      const result: RoleListRVO = { list: filtered as RoleRVO[], totalCount: filtered.length }
      return result;
    }
  }
)

/**
 * 대국민포털_역할기본 정보 조회 
 */
export const getRole = createAsyncThunk<RoleRVO, RolePVO | undefined>(
  '/auth/getRole',
  async (params: RolePVO = {}) => {
    try {
      const res = await https.post(getRoleApiPath(), params);

      const payload = res.data;

      // 서버가 RoleRVO 형식으로 단 건 데이터를 반환함. 
      return payload;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("RoleThunks getRole mockRoleList=",mockRoleList);
      return (mockRoleList).find((n) => 
        String(n.roleCd) === String(params.roleCd)
      ) || null;
    }
  }
)

/**
 * 대국민포털_역할기본 입력 
 */
export const insertRole = createAsyncThunk<number, RolePVO>(
  '/auth/insertRole',
  async (params: RolePVO) => {
    try {
      const res = await https.post(insertRoleApiPath(), params);

      const insertCnt = res.data;

      // 입력된 건수 반환함. 
      return insertCnt;
    }
    catch (e) {
      console.log("RoleThunks insertRole");
      return -1;
    }
  }
)

/**
 * 대국민포털_역할기본 수정 
 */
export const updateRole = createAsyncThunk<number, RolePVO>(
  '/auth/updateRole',
  async (params: RolePVO) => {
    try {
      const res = await https.post(updateRoleApiPath(), params);

      const updateCnt = res.data;

      // 수정된 건수 반환함. 
      return updateCnt;
    }
    catch (e) {
      console.log("RoleThunks updateRole");
      return -1;
    }
  }
)

/**
 * 대국민포털_역할기본 저장 
 */
export const saveRole = createAsyncThunk<number, RolePVO>(
  '/auth/saveRole',
  async (params: RolePVO) => {
    try {
      const res = await https.post(saveRoleApiPath(), params);

      const saveCnt = res.data;

      // 저장된 건수 반환함. 
      return saveCnt;
    }
    catch (e) {
      console.log("RoleThunks saveRole error!!");
      return -1;
    }
  }
)

/**
 * 대국민포털_역할기본 삭제 
 */
export const deleteRole = createAsyncThunk<number, RoleDVO>(
  '/auth/deleteRole',
  async (params: RoleDVO) => {
    try {
      const res = await https.post(deleteRoleApiPath(), params);

      const deleteCnt = res.data;

      // 삭제된 건수 반환함. 
      return deleteCnt;
    }
    catch (e) {
      console.log("RoleThunks deleteRole error!!");
      return -1;
    }
  }
)

