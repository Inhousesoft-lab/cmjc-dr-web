import { createAsyncThunk } from '@reduxjs/toolkit'
import https from '@/api/axiosInstance'
import { selectExprtAuthrtListApiPath, getExprtAuthrtApiPath, insertExprtAuthrtApiPath, updateExprtAuthrtApiPath, saveExprtAuthrtApiPath, deleteExprtAuthrtApiPath } from '@/api/auth/ExprtAuthrtApiPaths'
import { mockExprtAuthrtList, ExprtAuthrtPVO, ExprtAuthrtRVO, ExprtAuthrtListPVO, ExprtAuthrtListRVO, ExprtAuthrtDVO  } from './ExprtAuthrtTypes'

/**
 * 대국민포털_전문가권한기본 정보 목록 조회 
 */
export const selectExprtAuthrtList = createAsyncThunk<ExprtAuthrtListRVO, ExprtAuthrtListPVO | undefined>(
  '/auth/selectExprtAuthrtList',
  async (params: ExprtAuthrtListPVO = {}) => {
    try {
      const res = await https.post(selectExprtAuthrtListApiPath(), params);

      // ✅ 여기서 “서버 응답”을 표준 형태로 맞춰서 return
      const payload = res.data;

      // 서버가 ExprtAuthrt[] 형식으로 주므로 ExprtAuthrtListRVO 형식으로 데이터 구조 재조정 
      return {
        list: Array.isArray(payload) ? payload : [],
        totalCount: Array.isArray(payload) ? payload.length : 0
      } as ExprtAuthrtListRVO;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("ExprtAuthrtThunks selectExprtAuthrtList mockExprtAuthrtList=",mockExprtAuthrtList);
      const filtered = mockExprtAuthrtList.filter((n) => {
        //if (!params.searchWrd) return true;
        //const v = (params.searchCnd === 'content' ? n.content : n.title) || '';
        //return v.includes(params.searchWrd);
        return true; // edit !! 
      });

      const result: ExprtAuthrtListRVO = { list: filtered as ExprtAuthrtRVO[], totalCount: filtered.length }
      return result;
    }
  }
)

/**
 * 대국민포털_전문가권한기본 정보 조회 
 */
export const getExprtAuthrt = createAsyncThunk<ExprtAuthrtRVO, ExprtAuthrtPVO | undefined>(
  '/auth/getExprtAuthrt',
  async (params: ExprtAuthrtPVO = {}) => {
    try {
      const res = await https.post(getExprtAuthrtApiPath(), params);

      const payload = res.data;

      // 서버가 ExprtAuthrtRVO 형식으로 단 건 데이터를 반환함. 
      return payload;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("ExprtAuthrtThunks getExprtAuthrt mockExprtAuthrtList=",mockExprtAuthrtList);
      return (mockExprtAuthrtList).find((n) => 
        String(n.mbrNo) === String(params.mbrNo) &&
        String(n.authrtCd) === String(params.authrtCd)
      ) || null;
    }
  }
)

/**
 * 대국민포털_전문가권한기본 입력 
 */
export const insertExprtAuthrt = createAsyncThunk<number, ExprtAuthrtPVO>(
  '/auth/insertExprtAuthrt',
  async (params: ExprtAuthrtPVO) => {
    try {
      const res = await https.post(insertExprtAuthrtApiPath(), params);

      const insertCnt = res.data;

      // 입력된 건수 반환함. 
      return insertCnt;
    }
    catch (e) {
      console.log("ExprtAuthrtThunks insertExprtAuthrt");
      return -1;
    }
  }
)

/**
 * 대국민포털_전문가권한기본 수정 
 */
export const updateExprtAuthrt = createAsyncThunk<number, ExprtAuthrtPVO>(
  '/auth/updateExprtAuthrt',
  async (params: ExprtAuthrtPVO) => {
    try {
      const res = await https.post(updateExprtAuthrtApiPath(), params);

      const updateCnt = res.data;

      // 수정된 건수 반환함. 
      return updateCnt;
    }
    catch (e) {
      console.log("ExprtAuthrtThunks updateExprtAuthrt");
      return -1;
    }
  }
)

/**
 * 대국민포털_전문가권한기본 저장 
 */
export const saveExprtAuthrt = createAsyncThunk<number, ExprtAuthrtPVO>(
  '/auth/saveExprtAuthrt',
  async (params: ExprtAuthrtPVO) => {
    try {
      const res = await https.post(saveExprtAuthrtApiPath(), params);

      const saveCnt = res.data;

      // 저장된 건수 반환함. 
      return saveCnt;
    }
    catch (e) {
      console.log("ExprtAuthrtThunks saveExprtAuthrt error!!");
      return -1;
    }
  }
)

/**
 * 대국민포털_전문가권한기본 삭제 
 */
export const deleteExprtAuthrt = createAsyncThunk<number, ExprtAuthrtDVO>(
  '/auth/deleteExprtAuthrt',
  async (params: ExprtAuthrtDVO) => {
    try {
      const res = await https.post(deleteExprtAuthrtApiPath(), params);

      const deleteCnt = res.data;

      // 삭제된 건수 반환함. 
      return deleteCnt;
    }
    catch (e) {
      console.log("ExprtAuthrtThunks deleteExprtAuthrt error!!");
      return -1;
    }
  }
)

