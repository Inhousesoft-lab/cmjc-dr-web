import { createAsyncThunk } from '@reduxjs/toolkit'
import https from '@/api/axiosInstance'
import { selectAuthrtListApiPath, getAuthrtApiPath, insertAuthrtApiPath, updateAuthrtApiPath, saveAuthrtApiPath, deleteAuthrtApiPath } from '@/api/auth/AuthrtApiPaths'
import { mockAuthrtList, AuthrtPVO, AuthrtRVO, AuthrtListPVO, AuthrtListRVO, AuthrtDVO  } from './AuthrtTypes'

/**
 * 대국민포털_권한기본 정보 목록 조회 
 */
export const selectAuthrtList = createAsyncThunk<AuthrtListRVO, AuthrtListPVO | undefined>(
  '/auth/selectAuthrtList',
  async (params: AuthrtListPVO = {}) => {
    try {
      const res = await https.post(selectAuthrtListApiPath(), params);

      // ✅ 여기서 “서버 응답”을 표준 형태로 맞춰서 return
      const payload = res.data;

      // 서버가 Authrt[] 형식으로 주므로 AuthrtListRVO 형식으로 데이터 구조 재조정 
      return {
        list: Array.isArray(payload) ? payload : [],
        totalCount: Array.isArray(payload) ? payload.length : 0
      } as AuthrtListRVO;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("AuthrtThunks selectAuthrtList mockAuthrtList=",mockAuthrtList);
      const filtered = mockAuthrtList.filter((n) => {
        //if (!params.searchWrd) return true;
        //const v = (params.searchCnd === 'content' ? n.content : n.title) || '';
        //return v.includes(params.searchWrd);
        return true; // edit !! 
      });

      const result: AuthrtListRVO = { list: filtered as AuthrtRVO[], totalCount: filtered.length }
      return result;
    }
  }
)

/**
 * 대국민포털_권한기본 정보 조회 
 */
export const getAuthrt = createAsyncThunk<AuthrtRVO, AuthrtPVO | undefined>(
  '/auth/getAuthrt',
  async (params: AuthrtPVO = {}) => {
    try {
      const res = await https.post(getAuthrtApiPath(), params);

      const payload = res.data;

      // 서버가 AuthrtRVO 형식으로 단 건 데이터를 반환함. 
      return payload;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("AuthrtThunks getAuthrt mockAuthrtList=",mockAuthrtList);
      return (mockAuthrtList).find((n) => 
        String(n.authrtCd) === String(params.authrtCd)
      ) || null;
    }
  }
)

/**
 * 대국민포털_권한기본 입력 
 */
export const insertAuthrt = createAsyncThunk<number, AuthrtPVO>(
  '/auth/insertAuthrt',
  async (params: AuthrtPVO) => {
    try {
      const res = await https.post(insertAuthrtApiPath(), params);

      const insertCnt = res.data;

      // 입력된 건수 반환함. 
      return insertCnt;
    }
    catch (e) {
      console.log("AuthrtThunks insertAuthrt");
      return -1;
    }
  }
)

/**
 * 대국민포털_권한기본 수정 
 */
export const updateAuthrt = createAsyncThunk<number, AuthrtPVO>(
  '/auth/updateAuthrt',
  async (params: AuthrtPVO) => {
    try {
      const res = await https.post(updateAuthrtApiPath(), params);

      const updateCnt = res.data;

      // 수정된 건수 반환함. 
      return updateCnt;
    }
    catch (e) {
      console.log("AuthrtThunks updateAuthrt");
      return -1;
    }
  }
)

/**
 * 대국민포털_권한기본 저장 
 */
export const saveAuthrt = createAsyncThunk<number, AuthrtPVO>(
  '/auth/saveAuthrt',
  async (params: AuthrtPVO) => {
    try {
      const res = await https.post(saveAuthrtApiPath(), params);

      const saveCnt = res.data;

      // 저장된 건수 반환함. 
      return saveCnt;
    }
    catch (e) {
      console.log("AuthrtThunks saveAuthrt error!!");
      return -1;
    }
  }
)

/**
 * 대국민포털_권한기본 삭제 
 */
export const deleteAuthrt = createAsyncThunk<number, AuthrtDVO>(
  '/auth/deleteAuthrt',
  async (params: AuthrtDVO) => {
    try {
      const res = await https.post(deleteAuthrtApiPath(), params);

      const deleteCnt = res.data;

      // 삭제된 건수 반환함. 
      return deleteCnt;
    }
    catch (e) {
      console.log("AuthrtThunks deleteAuthrt error!!");
      return -1;
    }
  }
)

