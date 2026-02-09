import { createAsyncThunk } from '@reduxjs/toolkit'
import https from '@/api/axiosInstance'
import { selectPrvcAcsHstryListApiPath, getPrvcAcsHstryApiPath, insertPrvcAcsHstryApiPath, updatePrvcAcsHstryApiPath, savePrvcAcsHstryApiPath, deletePrvcAcsHstryApiPath } from '@/api/hstry/PrvcAcsHstryApiPaths'
import { mockPrvcAcsHstryList, PrvcAcsHstryPVO, PrvcAcsHstryRVO, PrvcAcsHstryListPVO, PrvcAcsHstryListRVO, PrvcAcsHstryDVO  } from './PrvcAcsHstryTypes'

/**
 * 대국민포털_개인정보접근이력기본 정보 목록 조회 
 */
export const selectPrvcAcsHstryList = createAsyncThunk<PrvcAcsHstryListRVO, PrvcAcsHstryListPVO | undefined>(
  '/hstry/selectPrvcAcsHstryList',
  async (params: PrvcAcsHstryListPVO = {}) => {
    try {
      const res = await https.post(selectPrvcAcsHstryListApiPath(), params);

      // ✅ 여기서 “서버 응답”을 표준 형태로 맞춰서 return
      const payload = res.data;

      // 서버가 PrvcAcsHstry[] 형식으로 주므로 PrvcAcsHstryListRVO 형식으로 데이터 구조 재조정 
      return {
        list: Array.isArray(payload) ? payload : [],
        totalCount: Array.isArray(payload) ? payload.length : 0
      } as PrvcAcsHstryListRVO;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("PrvcAcsHstryThunks selectPrvcAcsHstryList mockPrvcAcsHstryList=",mockPrvcAcsHstryList);
      const filtered = mockPrvcAcsHstryList.filter((n) => {
        //if (!params.searchWrd) return true;
        //const v = (params.searchCnd === 'content' ? n.content : n.title) || '';
        //return v.includes(params.searchWrd);
        return true; // edit !! 
      });

      const result: PrvcAcsHstryListRVO = { list: filtered as PrvcAcsHstryRVO[], totalCount: filtered.length }
      return result;
    }
  }
)

/**
 * 대국민포털_개인정보접근이력기본 정보 조회 
 */
export const getPrvcAcsHstry = createAsyncThunk<PrvcAcsHstryRVO, PrvcAcsHstryPVO | undefined>(
  '/hstry/getPrvcAcsHstry',
  async (params: PrvcAcsHstryPVO = {}) => {
    try {
      const res = await https.post(getPrvcAcsHstryApiPath(), params);

      const payload = res.data;

      // 서버가 PrvcAcsHstryRVO 형식으로 단 건 데이터를 반환함. 
      return payload;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("PrvcAcsHstryThunks getPrvcAcsHstry mockPrvcAcsHstryList=",mockPrvcAcsHstryList);
      return (mockPrvcAcsHstryList).find((n) => 
      ) || null;
    }
  }
)

/**
 * 대국민포털_개인정보접근이력기본 입력 
 */
export const insertPrvcAcsHstry = createAsyncThunk<number, PrvcAcsHstryPVO>(
  '/hstry/insertPrvcAcsHstry',
  async (params: PrvcAcsHstryPVO) => {
    try {
      const res = await https.post(insertPrvcAcsHstryApiPath(), params);

      const insertCnt = res.data;

      // 입력된 건수 반환함. 
      return insertCnt;
    }
    catch (e) {
      console.log("PrvcAcsHstryThunks insertPrvcAcsHstry");
      return -1;
    }
  }
)

/**
 * 대국민포털_개인정보접근이력기본 수정 
 */
export const updatePrvcAcsHstry = createAsyncThunk<number, PrvcAcsHstryPVO>(
  '/hstry/updatePrvcAcsHstry',
  async (params: PrvcAcsHstryPVO) => {
    try {
      const res = await https.post(updatePrvcAcsHstryApiPath(), params);

      const updateCnt = res.data;

      // 수정된 건수 반환함. 
      return updateCnt;
    }
    catch (e) {
      console.log("PrvcAcsHstryThunks updatePrvcAcsHstry");
      return -1;
    }
  }
)

/**
 * 대국민포털_개인정보접근이력기본 저장 
 */
export const savePrvcAcsHstry = createAsyncThunk<number, PrvcAcsHstryPVO>(
  '/hstry/savePrvcAcsHstry',
  async (params: PrvcAcsHstryPVO) => {
    try {
      const res = await https.post(savePrvcAcsHstryApiPath(), params);

      const saveCnt = res.data;

      // 저장된 건수 반환함. 
      return saveCnt;
    }
    catch (e) {
      console.log("PrvcAcsHstryThunks savePrvcAcsHstry error!!");
      return -1;
    }
  }
)

/**
 * 대국민포털_개인정보접근이력기본 삭제 
 */
export const deletePrvcAcsHstry = createAsyncThunk<number, PrvcAcsHstryDVO>(
  '/hstry/deletePrvcAcsHstry',
  async (params: PrvcAcsHstryDVO) => {
    try {
      const res = await https.post(deletePrvcAcsHstryApiPath(), params);

      const deleteCnt = res.data;

      // 삭제된 건수 반환함. 
      return deleteCnt;
    }
    catch (e) {
      console.log("PrvcAcsHstryThunks deletePrvcAcsHstry error!!");
      return -1;
    }
  }
)

