import { createAsyncThunk } from '@reduxjs/toolkit'
import https from '@/api/axiosInstance'
import { selectAuthrtMenuRoleListApiPath, getAuthrtMenuRoleApiPath, insertAuthrtMenuRoleApiPath, updateAuthrtMenuRoleApiPath, saveAuthrtMenuRoleApiPath, deleteAuthrtMenuRoleApiPath } from '@/api/auth/AuthrtMenuRoleApiPaths'
import { mockAuthrtMenuRoleList, AuthrtMenuRolePVO, AuthrtMenuRoleRVO, AuthrtMenuRoleListPVO, AuthrtMenuRoleListRVO, AuthrtMenuRoleDVO  } from './AuthrtMenuRoleTypes'

/**
 * 대국민포털_권한메뉴롤기본 정보 목록 조회 
 */
export const selectAuthrtMenuRoleList = createAsyncThunk<AuthrtMenuRoleListRVO, AuthrtMenuRoleListPVO | undefined>(
  '/auth/selectAuthrtMenuRoleList',
  async (params: AuthrtMenuRoleListPVO = {}) => {
    try {
      const res = await https.post(selectAuthrtMenuRoleListApiPath(), params);

      // ✅ 여기서 “서버 응답”을 표준 형태로 맞춰서 return
      const payload = res.data;

      // 서버가 AuthrtMenuRole[] 형식으로 주므로 AuthrtMenuRoleListRVO 형식으로 데이터 구조 재조정 
      return {
        list: Array.isArray(payload) ? payload : [],
        totalCount: Array.isArray(payload) ? payload.length : 0
      } as AuthrtMenuRoleListRVO;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("AuthrtMenuRoleThunks selectAuthrtMenuRoleList mockAuthrtMenuRoleList=",mockAuthrtMenuRoleList);
      const filtered = mockAuthrtMenuRoleList.filter((n) => {
        //if (!params.searchWrd) return true;
        //const v = (params.searchCnd === 'content' ? n.content : n.title) || '';
        //return v.includes(params.searchWrd);
        return true; // edit !! 
      });

      const result: AuthrtMenuRoleListRVO = { list: filtered as AuthrtMenuRoleRVO[], totalCount: filtered.length }
      return result;
    }
  }
)

/**
 * 대국민포털_권한메뉴롤기본 정보 조회 
 */
export const getAuthrtMenuRole = createAsyncThunk<AuthrtMenuRoleRVO, AuthrtMenuRolePVO | undefined>(
  '/auth/getAuthrtMenuRole',
  async (params: AuthrtMenuRolePVO = {}) => {
    try {
      const res = await https.post(getAuthrtMenuRoleApiPath(), params);

      const payload = res.data;

      // 서버가 AuthrtMenuRoleRVO 형식으로 단 건 데이터를 반환함. 
      return payload;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("AuthrtMenuRoleThunks getAuthrtMenuRole mockAuthrtMenuRoleList=",mockAuthrtMenuRoleList);
      return (mockAuthrtMenuRoleList).find((n) => 
        String(n.roleCd) === String(params.roleCd) &&
        String(n.authrtCd) === String(params.authrtCd)
      ) || null;
    }
  }
)

/**
 * 대국민포털_권한메뉴롤기본 입력 
 */
export const insertAuthrtMenuRole = createAsyncThunk<number, AuthrtMenuRolePVO>(
  '/auth/insertAuthrtMenuRole',
  async (params: AuthrtMenuRolePVO) => {
    try {
      const res = await https.post(insertAuthrtMenuRoleApiPath(), params);

      const insertCnt = res.data;

      // 입력된 건수 반환함. 
      return insertCnt;
    }
    catch (e) {
      console.log("AuthrtMenuRoleThunks insertAuthrtMenuRole");
      return -1;
    }
  }
)

/**
 * 대국민포털_권한메뉴롤기본 수정 
 */
export const updateAuthrtMenuRole = createAsyncThunk<number, AuthrtMenuRolePVO>(
  '/auth/updateAuthrtMenuRole',
  async (params: AuthrtMenuRolePVO) => {
    try {
      const res = await https.post(updateAuthrtMenuRoleApiPath(), params);

      const updateCnt = res.data;

      // 수정된 건수 반환함. 
      return updateCnt;
    }
    catch (e) {
      console.log("AuthrtMenuRoleThunks updateAuthrtMenuRole");
      return -1;
    }
  }
)

/**
 * 대국민포털_권한메뉴롤기본 저장 
 */
export const saveAuthrtMenuRole = createAsyncThunk<number, AuthrtMenuRolePVO>(
  '/auth/saveAuthrtMenuRole',
  async (params: AuthrtMenuRolePVO) => {
    try {
      const res = await https.post(saveAuthrtMenuRoleApiPath(), params);

      const saveCnt = res.data;

      // 저장된 건수 반환함. 
      return saveCnt;
    }
    catch (e) {
      console.log("AuthrtMenuRoleThunks saveAuthrtMenuRole error!!");
      return -1;
    }
  }
)

/**
 * 대국민포털_권한메뉴롤기본 삭제 
 */
export const deleteAuthrtMenuRole = createAsyncThunk<number, AuthrtMenuRoleDVO>(
  '/auth/deleteAuthrtMenuRole',
  async (params: AuthrtMenuRoleDVO) => {
    try {
      const res = await https.post(deleteAuthrtMenuRoleApiPath(), params);

      const deleteCnt = res.data;

      // 삭제된 건수 반환함. 
      return deleteCnt;
    }
    catch (e) {
      console.log("AuthrtMenuRoleThunks deleteAuthrtMenuRole error!!");
      return -1;
    }
  }
)

