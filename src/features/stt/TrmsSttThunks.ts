import { createAsyncThunk } from '@reduxjs/toolkit'
import https from '@/api/axiosInstance'
import { selectTrmsSttListApiPath, getTrmsSttApiPath, insertTrmsSttApiPath, updateTrmsSttApiPath, saveTrmsSttApiPath, deleteTrmsSttApiPath } from '@/api/stt/TrmsSttApiPaths'
import { mockTrmsSttList, TrmsSttPVO, TrmsSttRVO, TrmsSttListPVO, TrmsSttListRVO, TrmsSttDVO  } from './TrmsSttTypes'

/**
 * 대국민포털_약관법령기본 정보 목록 조회 
 */
export const selectTrmsSttList = createAsyncThunk<TrmsSttListRVO, TrmsSttListPVO | undefined>(
  '/stt/selectTrmsSttList',
  async (params: TrmsSttListPVO = {}) => {
    try {
      const res = await https.post(selectTrmsSttListApiPath(), params);

      // ✅ 여기서 “서버 응답”을 표준 형태로 맞춰서 return
      const payload = res.data;

      // 서버가 TrmsStt[] 형식으로 주므로 TrmsSttListRVO 형식으로 데이터 구조 재조정 
      return {
        list: Array.isArray(payload) ? payload : [],
        totalCount: Array.isArray(payload) ? payload.length : 0
      } as TrmsSttListRVO;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("TrmsSttThunks selectTrmsSttList mockTrmsSttList=",mockTrmsSttList);
      const filtered = mockTrmsSttList.filter((n) => {
        //if (!params.searchWrd) return true;
        //const v = (params.searchCnd === 'content' ? n.content : n.title) || '';
        //return v.includes(params.searchWrd);
        return true; // edit !! 
      });

      const result: TrmsSttListRVO = { list: filtered as TrmsSttRVO[], totalCount: filtered.length }
      return result;
    }
  }
)

/**
 * 대국민포털_약관법령기본 정보 조회 
 */
export const getTrmsStt = createAsyncThunk<TrmsSttRVO, TrmsSttPVO | undefined>(
  '/stt/getTrmsStt',
  async (params: TrmsSttPVO = {}) => {
    try {
      const res = await https.post(getTrmsSttApiPath(), params);

      const payload = res.data;

      // 서버가 TrmsSttRVO 형식으로 단 건 데이터를 반환함. 
      return payload;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("TrmsSttThunks getTrmsStt mockTrmsSttList=",mockTrmsSttList);
      return (mockTrmsSttList).find((n) => 
      ) || null;
    }
  }
)

/**
 * 대국민포털_약관법령기본 입력 
 */
export const insertTrmsStt = createAsyncThunk<number, TrmsSttPVO>(
  '/stt/insertTrmsStt',
  async (params: TrmsSttPVO) => {
    try {
      const res = await https.post(insertTrmsSttApiPath(), params);

      const insertCnt = res.data;

      // 입력된 건수 반환함. 
      return insertCnt;
    }
    catch (e) {
      console.log("TrmsSttThunks insertTrmsStt");
      return -1;
    }
  }
)

/**
 * 대국민포털_약관법령기본 수정 
 */
export const updateTrmsStt = createAsyncThunk<number, TrmsSttPVO>(
  '/stt/updateTrmsStt',
  async (params: TrmsSttPVO) => {
    try {
      const res = await https.post(updateTrmsSttApiPath(), params);

      const updateCnt = res.data;

      // 수정된 건수 반환함. 
      return updateCnt;
    }
    catch (e) {
      console.log("TrmsSttThunks updateTrmsStt");
      return -1;
    }
  }
)

/**
 * 대국민포털_약관법령기본 저장 
 */
export const saveTrmsStt = createAsyncThunk<number, TrmsSttPVO>(
  '/stt/saveTrmsStt',
  async (params: TrmsSttPVO) => {
    try {
      const res = await https.post(saveTrmsSttApiPath(), params);

      const saveCnt = res.data;

      // 저장된 건수 반환함. 
      return saveCnt;
    }
    catch (e) {
      console.log("TrmsSttThunks saveTrmsStt error!!");
      return -1;
    }
  }
)

/**
 * 대국민포털_약관법령기본 삭제 
 */
export const deleteTrmsStt = createAsyncThunk<number, TrmsSttDVO>(
  '/stt/deleteTrmsStt',
  async (params: TrmsSttDVO) => {
    try {
      const res = await https.post(deleteTrmsSttApiPath(), params);

      const deleteCnt = res.data;

      // 삭제된 건수 반환함. 
      return deleteCnt;
    }
    catch (e) {
      console.log("TrmsSttThunks deleteTrmsStt error!!");
      return -1;
    }
  }
)

