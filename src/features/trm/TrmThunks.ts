import { createAsyncThunk } from '@reduxjs/toolkit'
import https from '@/api/axiosInstance'
import { selectTrmListApiPath, getTrmApiPath, insertTrmApiPath, updateTrmApiPath, saveTrmApiPath, deleteTrmApiPath } from '@/api/trm/TrmApiPaths'
import { mockTrmList, TrmPVO, TrmRVO, TrmListPVO, TrmListRVO, TrmDVO  } from './TrmTypes'

/**
 * 대국민포털_용어기본 정보 목록 조회 
 */
export const selectTrmList = createAsyncThunk<TrmListRVO, TrmListPVO | undefined>(
  '/trm/selectTrmList',
  async (params: TrmListPVO = {}) => {
    try {
      const res = await https.post(selectTrmListApiPath(), params);

      // ✅ 여기서 “서버 응답”을 표준 형태로 맞춰서 return
      const payload = res.data;

      // 서버가 Trm[] 형식으로 주므로 TrmListRVO 형식으로 데이터 구조 재조정 
      return {
        list: Array.isArray(payload) ? payload : [],
        totalCount: Array.isArray(payload) ? payload.length : 0
      } as TrmListRVO;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("TrmThunks selectTrmList mockTrmList=",mockTrmList);
      const filtered = mockTrmList.filter((n) => {
        //if (!params.searchWrd) return true;
        //const v = (params.searchCnd === 'content' ? n.content : n.title) || '';
        //return v.includes(params.searchWrd);
        return true; // edit !! 
      });

      const result: TrmListRVO = { list: filtered as TrmRVO[], totalCount: filtered.length }
      return result;
    }
  }
)

/**
 * 대국민포털_용어기본 정보 조회 
 */
export const getTrm = createAsyncThunk<TrmRVO, TrmPVO | undefined>(
  '/trm/getTrm',
  async (params: TrmPVO = {}) => {
    try {
      const res = await https.post(getTrmApiPath(), params);

      const payload = res.data;

      // 서버가 TrmRVO 형식으로 단 건 데이터를 반환함. 
      return payload;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("TrmThunks getTrm mockTrmList=",mockTrmList);
      return (mockTrmList).find((n) => 
        String(n.stdTrmNm) === String(params.stdTrmNm)
      ) || null;
    }
  }
)

/**
 * 대국민포털_용어기본 입력 
 */
export const insertTrm = createAsyncThunk<number, TrmPVO>(
  '/trm/insertTrm',
  async (params: TrmPVO) => {
    try {
      const res = await https.post(insertTrmApiPath(), params);

      const insertCnt = res.data;

      // 입력된 건수 반환함. 
      return insertCnt;
    }
    catch (e) {
      console.log("TrmThunks insertTrm");
      return -1;
    }
  }
)

/**
 * 대국민포털_용어기본 수정 
 */
export const updateTrm = createAsyncThunk<number, TrmPVO>(
  '/trm/updateTrm',
  async (params: TrmPVO) => {
    try {
      const res = await https.post(updateTrmApiPath(), params);

      const updateCnt = res.data;

      // 수정된 건수 반환함. 
      return updateCnt;
    }
    catch (e) {
      console.log("TrmThunks updateTrm");
      return -1;
    }
  }
)

/**
 * 대국민포털_용어기본 저장 
 */
export const saveTrm = createAsyncThunk<number, TrmPVO>(
  '/trm/saveTrm',
  async (params: TrmPVO) => {
    try {
      const res = await https.post(saveTrmApiPath(), params);

      const saveCnt = res.data;

      // 저장된 건수 반환함. 
      return saveCnt;
    }
    catch (e) {
      console.log("TrmThunks saveTrm error!!");
      return -1;
    }
  }
)

/**
 * 대국민포털_용어기본 삭제 
 */
export const deleteTrm = createAsyncThunk<number, TrmDVO>(
  '/trm/deleteTrm',
  async (params: TrmDVO) => {
    try {
      const res = await https.post(deleteTrmApiPath(), params);

      const deleteCnt = res.data;

      // 삭제된 건수 반환함. 
      return deleteCnt;
    }
    catch (e) {
      console.log("TrmThunks deleteTrm error!!");
      return -1;
    }
  }
)

