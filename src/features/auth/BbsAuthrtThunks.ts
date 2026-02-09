import { createAsyncThunk } from '@reduxjs/toolkit'
import https from '@/api/axiosInstance'
import { selectBbsAuthrtListApiPath, getBbsAuthrtApiPath, insertBbsAuthrtApiPath, updateBbsAuthrtApiPath, saveBbsAuthrtApiPath, deleteBbsAuthrtApiPath } from '@/api/auth/BbsAuthrtApiPaths'
import { mockBbsAuthrtList, BbsAuthrtPVO, BbsAuthrtRVO, BbsAuthrtListPVO, BbsAuthrtListRVO, BbsAuthrtDVO  } from './BbsAuthrtTypes'

/**
 * 대국민포털_게시판권한기본 정보 목록 조회 
 */
export const selectBbsAuthrtList = createAsyncThunk<BbsAuthrtListRVO, BbsAuthrtListPVO | undefined>(
  '/auth/selectBbsAuthrtList',
  async (params: BbsAuthrtListPVO = {}) => {
    try {
      const res = await https.post(selectBbsAuthrtListApiPath(), params);

      // ✅ 여기서 “서버 응답”을 표준 형태로 맞춰서 return
      const payload = res.data;

      // 서버가 BbsAuthrt[] 형식으로 주므로 BbsAuthrtListRVO 형식으로 데이터 구조 재조정 
      return {
        list: Array.isArray(payload) ? payload : [],
        totalCount: Array.isArray(payload) ? payload.length : 0
      } as BbsAuthrtListRVO;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("BbsAuthrtThunks selectBbsAuthrtList mockBbsAuthrtList=",mockBbsAuthrtList);
      const filtered = mockBbsAuthrtList.filter((n) => {
        //if (!params.searchWrd) return true;
        //const v = (params.searchCnd === 'content' ? n.content : n.title) || '';
        //return v.includes(params.searchWrd);
        return true; // edit !! 
      });

      const result: BbsAuthrtListRVO = { list: filtered as BbsAuthrtRVO[], totalCount: filtered.length }
      return result;
    }
  }
)

/**
 * 대국민포털_게시판권한기본 정보 조회 
 */
export const getBbsAuthrt = createAsyncThunk<BbsAuthrtRVO, BbsAuthrtPVO | undefined>(
  '/auth/getBbsAuthrt',
  async (params: BbsAuthrtPVO = {}) => {
    try {
      const res = await https.post(getBbsAuthrtApiPath(), params);

      const payload = res.data;

      // 서버가 BbsAuthrtRVO 형식으로 단 건 데이터를 반환함. 
      return payload;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("BbsAuthrtThunks getBbsAuthrt mockBbsAuthrtList=",mockBbsAuthrtList);
      return (mockBbsAuthrtList).find((n) => 
        String(n.authrtCd) === String(params.authrtCd) &&
        String(n.bbsId) === String(params.bbsId)
      ) || null;
    }
  }
)

/**
 * 대국민포털_게시판권한기본 입력 
 */
export const insertBbsAuthrt = createAsyncThunk<number, BbsAuthrtPVO>(
  '/auth/insertBbsAuthrt',
  async (params: BbsAuthrtPVO) => {
    try {
      const res = await https.post(insertBbsAuthrtApiPath(), params);

      const insertCnt = res.data;

      // 입력된 건수 반환함. 
      return insertCnt;
    }
    catch (e) {
      console.log("BbsAuthrtThunks insertBbsAuthrt");
      return -1;
    }
  }
)

/**
 * 대국민포털_게시판권한기본 수정 
 */
export const updateBbsAuthrt = createAsyncThunk<number, BbsAuthrtPVO>(
  '/auth/updateBbsAuthrt',
  async (params: BbsAuthrtPVO) => {
    try {
      const res = await https.post(updateBbsAuthrtApiPath(), params);

      const updateCnt = res.data;

      // 수정된 건수 반환함. 
      return updateCnt;
    }
    catch (e) {
      console.log("BbsAuthrtThunks updateBbsAuthrt");
      return -1;
    }
  }
)

/**
 * 대국민포털_게시판권한기본 저장 
 */
export const saveBbsAuthrt = createAsyncThunk<number, BbsAuthrtPVO>(
  '/auth/saveBbsAuthrt',
  async (params: BbsAuthrtPVO) => {
    try {
      const res = await https.post(saveBbsAuthrtApiPath(), params);

      const saveCnt = res.data;

      // 저장된 건수 반환함. 
      return saveCnt;
    }
    catch (e) {
      console.log("BbsAuthrtThunks saveBbsAuthrt error!!");
      return -1;
    }
  }
)

/**
 * 대국민포털_게시판권한기본 삭제 
 */
export const deleteBbsAuthrt = createAsyncThunk<number, BbsAuthrtDVO>(
  '/auth/deleteBbsAuthrt',
  async (params: BbsAuthrtDVO) => {
    try {
      const res = await https.post(deleteBbsAuthrtApiPath(), params);

      const deleteCnt = res.data;

      // 삭제된 건수 반환함. 
      return deleteCnt;
    }
    catch (e) {
      console.log("BbsAuthrtThunks deleteBbsAuthrt error!!");
      return -1;
    }
  }
)

