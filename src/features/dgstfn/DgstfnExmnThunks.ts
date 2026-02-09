import { createAsyncThunk } from '@reduxjs/toolkit'
import https from '@/api/axiosInstance'
import { selectDgstfnExmnListApiPath, getDgstfnExmnApiPath, insertDgstfnExmnApiPath, updateDgstfnExmnApiPath, saveDgstfnExmnApiPath, deleteDgstfnExmnApiPath } from '@/api/dgstfn/DgstfnExmnApiPaths'
import { mockDgstfnExmnList, DgstfnExmnPVO, DgstfnExmnRVO, DgstfnExmnListPVO, DgstfnExmnListRVO, DgstfnExmnDVO  } from './DgstfnExmnTypes'

/**
 * 대국민포털_만족도조사기본 정보 목록 조회 
 */
export const selectDgstfnExmnList = createAsyncThunk<DgstfnExmnListRVO, DgstfnExmnListPVO | undefined>(
  '/dgstfn/selectDgstfnExmnList',
  async (params: DgstfnExmnListPVO = {}) => {
    try {
      const res = await https.post(selectDgstfnExmnListApiPath(), params);

      // ✅ 여기서 “서버 응답”을 표준 형태로 맞춰서 return
      const payload = res.data;

      // 서버가 DgstfnExmn[] 형식으로 주므로 DgstfnExmnListRVO 형식으로 데이터 구조 재조정 
      return {
        list: Array.isArray(payload) ? payload : [],
        totalCount: Array.isArray(payload) ? payload.length : 0
      } as DgstfnExmnListRVO;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("DgstfnExmnThunks selectDgstfnExmnList mockDgstfnExmnList=",mockDgstfnExmnList);
      const filtered = mockDgstfnExmnList.filter((n) => {
        //if (!params.searchWrd) return true;
        //const v = (params.searchCnd === 'content' ? n.content : n.title) || '';
        //return v.includes(params.searchWrd);
        return true; // edit !! 
      });

      const result: DgstfnExmnListRVO = { list: filtered as DgstfnExmnRVO[], totalCount: filtered.length }
      return result;
    }
  }
)

/**
 * 대국민포털_만족도조사기본 정보 조회 
 */
export const getDgstfnExmn = createAsyncThunk<DgstfnExmnRVO, DgstfnExmnPVO | undefined>(
  '/dgstfn/getDgstfnExmn',
  async (params: DgstfnExmnPVO = {}) => {
    try {
      const res = await https.post(getDgstfnExmnApiPath(), params);

      const payload = res.data;

      // 서버가 DgstfnExmnRVO 형식으로 단 건 데이터를 반환함. 
      return payload;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("DgstfnExmnThunks getDgstfnExmn mockDgstfnExmnList=",mockDgstfnExmnList);
      return (mockDgstfnExmnList).find((n) => 
      ) || null;
    }
  }
)

/**
 * 대국민포털_만족도조사기본 입력 
 */
export const insertDgstfnExmn = createAsyncThunk<number, DgstfnExmnPVO>(
  '/dgstfn/insertDgstfnExmn',
  async (params: DgstfnExmnPVO) => {
    try {
      const res = await https.post(insertDgstfnExmnApiPath(), params);

      const insertCnt = res.data;

      // 입력된 건수 반환함. 
      return insertCnt;
    }
    catch (e) {
      console.log("DgstfnExmnThunks insertDgstfnExmn");
      return -1;
    }
  }
)

/**
 * 대국민포털_만족도조사기본 수정 
 */
export const updateDgstfnExmn = createAsyncThunk<number, DgstfnExmnPVO>(
  '/dgstfn/updateDgstfnExmn',
  async (params: DgstfnExmnPVO) => {
    try {
      const res = await https.post(updateDgstfnExmnApiPath(), params);

      const updateCnt = res.data;

      // 수정된 건수 반환함. 
      return updateCnt;
    }
    catch (e) {
      console.log("DgstfnExmnThunks updateDgstfnExmn");
      return -1;
    }
  }
)

/**
 * 대국민포털_만족도조사기본 저장 
 */
export const saveDgstfnExmn = createAsyncThunk<number, DgstfnExmnPVO>(
  '/dgstfn/saveDgstfnExmn',
  async (params: DgstfnExmnPVO) => {
    try {
      const res = await https.post(saveDgstfnExmnApiPath(), params);

      const saveCnt = res.data;

      // 저장된 건수 반환함. 
      return saveCnt;
    }
    catch (e) {
      console.log("DgstfnExmnThunks saveDgstfnExmn error!!");
      return -1;
    }
  }
)

/**
 * 대국민포털_만족도조사기본 삭제 
 */
export const deleteDgstfnExmn = createAsyncThunk<number, DgstfnExmnDVO>(
  '/dgstfn/deleteDgstfnExmn',
  async (params: DgstfnExmnDVO) => {
    try {
      const res = await https.post(deleteDgstfnExmnApiPath(), params);

      const deleteCnt = res.data;

      // 삭제된 건수 반환함. 
      return deleteCnt;
    }
    catch (e) {
      console.log("DgstfnExmnThunks deleteDgstfnExmn error!!");
      return -1;
    }
  }
)

