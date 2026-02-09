import { createAsyncThunk } from '@reduxjs/toolkit'
import https from '@/api/axiosInstance'
import { selectAuthrtChgHstryListApiPath, getAuthrtChgHstryApiPath, insertAuthrtChgHstryApiPath, updateAuthrtChgHstryApiPath, saveAuthrtChgHstryApiPath, deleteAuthrtChgHstryApiPath } from '@/api/auth/AuthrtChgHstryApiPaths'
import { mockAuthrtChgHstryList, AuthrtChgHstryPVO, AuthrtChgHstryRVO, AuthrtChgHstryListPVO, AuthrtChgHstryListRVO, AuthrtChgHstryDVO  } from './AuthrtChgHstryTypes'

/**
 * 대국민포털_권한변경이력기본 정보 목록 조회 
 */
export const selectAuthrtChgHstryList = createAsyncThunk<AuthrtChgHstryListRVO, AuthrtChgHstryListPVO | undefined>(
  '/auth/selectAuthrtChgHstryList',
  async (params: AuthrtChgHstryListPVO = {}) => {
    try {
      const res = await https.post(selectAuthrtChgHstryListApiPath(), params);

      // ✅ 여기서 “서버 응답”을 표준 형태로 맞춰서 return
      const payload = res.data;

      // 서버가 AuthrtChgHstry[] 형식으로 주므로 AuthrtChgHstryListRVO 형식으로 데이터 구조 재조정 
      return {
        list: Array.isArray(payload) ? payload : [],
        totalCount: Array.isArray(payload) ? payload.length : 0
      } as AuthrtChgHstryListRVO;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("AuthrtChgHstryThunks selectAuthrtChgHstryList mockAuthrtChgHstryList=",mockAuthrtChgHstryList);
      const filtered = mockAuthrtChgHstryList.filter((n) => {
        //if (!params.searchWrd) return true;
        //const v = (params.searchCnd === 'content' ? n.content : n.title) || '';
        //return v.includes(params.searchWrd);
        return true; // edit !! 
      });

      const result: AuthrtChgHstryListRVO = { list: filtered as AuthrtChgHstryRVO[], totalCount: filtered.length }
      return result;
    }
  }
)

/**
 * 대국민포털_권한변경이력기본 정보 조회 
 */
export const getAuthrtChgHstry = createAsyncThunk<AuthrtChgHstryRVO, AuthrtChgHstryPVO | undefined>(
  '/auth/getAuthrtChgHstry',
  async (params: AuthrtChgHstryPVO = {}) => {
    try {
      const res = await https.post(getAuthrtChgHstryApiPath(), params);

      const payload = res.data;

      // 서버가 AuthrtChgHstryRVO 형식으로 단 건 데이터를 반환함. 
      return payload;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("AuthrtChgHstryThunks getAuthrtChgHstry mockAuthrtChgHstryList=",mockAuthrtChgHstryList);
      return (mockAuthrtChgHstryList).find((n) => 
      ) || null;
    }
  }
)

/**
 * 대국민포털_권한변경이력기본 입력 
 */
export const insertAuthrtChgHstry = createAsyncThunk<number, AuthrtChgHstryPVO>(
  '/auth/insertAuthrtChgHstry',
  async (params: AuthrtChgHstryPVO) => {
    try {
      const res = await https.post(insertAuthrtChgHstryApiPath(), params);

      const insertCnt = res.data;

      // 입력된 건수 반환함. 
      return insertCnt;
    }
    catch (e) {
      console.log("AuthrtChgHstryThunks insertAuthrtChgHstry");
      return -1;
    }
  }
)

/**
 * 대국민포털_권한변경이력기본 수정 
 */
export const updateAuthrtChgHstry = createAsyncThunk<number, AuthrtChgHstryPVO>(
  '/auth/updateAuthrtChgHstry',
  async (params: AuthrtChgHstryPVO) => {
    try {
      const res = await https.post(updateAuthrtChgHstryApiPath(), params);

      const updateCnt = res.data;

      // 수정된 건수 반환함. 
      return updateCnt;
    }
    catch (e) {
      console.log("AuthrtChgHstryThunks updateAuthrtChgHstry");
      return -1;
    }
  }
)

/**
 * 대국민포털_권한변경이력기본 저장 
 */
export const saveAuthrtChgHstry = createAsyncThunk<number, AuthrtChgHstryPVO>(
  '/auth/saveAuthrtChgHstry',
  async (params: AuthrtChgHstryPVO) => {
    try {
      const res = await https.post(saveAuthrtChgHstryApiPath(), params);

      const saveCnt = res.data;

      // 저장된 건수 반환함. 
      return saveCnt;
    }
    catch (e) {
      console.log("AuthrtChgHstryThunks saveAuthrtChgHstry error!!");
      return -1;
    }
  }
)

/**
 * 대국민포털_권한변경이력기본 삭제 
 */
export const deleteAuthrtChgHstry = createAsyncThunk<number, AuthrtChgHstryDVO>(
  '/auth/deleteAuthrtChgHstry',
  async (params: AuthrtChgHstryDVO) => {
    try {
      const res = await https.post(deleteAuthrtChgHstryApiPath(), params);

      const deleteCnt = res.data;

      // 삭제된 건수 반환함. 
      return deleteCnt;
    }
    catch (e) {
      console.log("AuthrtChgHstryThunks deleteAuthrtChgHstry error!!");
      return -1;
    }
  }
)

