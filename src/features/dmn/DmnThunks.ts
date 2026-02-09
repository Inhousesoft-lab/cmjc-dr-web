import { createAsyncThunk } from '@reduxjs/toolkit'
import https from '@/api/axiosInstance'
import { selectDmnListApiPath, getDmnApiPath, insertDmnApiPath, updateDmnApiPath, saveDmnApiPath, deleteDmnApiPath } from '@/api/dmn/DmnApiPaths'
import { mockDmnList, DmnPVO, DmnRVO, DmnListPVO, DmnListRVO, DmnDVO  } from './DmnTypes'

/**
 * 대국민포털_도메인기본 정보 목록 조회 
 */
export const selectDmnList = createAsyncThunk<DmnListRVO, DmnListPVO | undefined>(
  '/dmn/selectDmnList',
  async (params: DmnListPVO = {}) => {
    try {
      const res = await https.post(selectDmnListApiPath(), params);

      // ✅ 여기서 “서버 응답”을 표준 형태로 맞춰서 return
      const payload = res.data;

      // 서버가 Dmn[] 형식으로 주므로 DmnListRVO 형식으로 데이터 구조 재조정 
      return {
        list: Array.isArray(payload) ? payload : [],
        totalCount: Array.isArray(payload) ? payload.length : 0
      } as DmnListRVO;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("DmnThunks selectDmnList mockDmnList=",mockDmnList);
      const filtered = mockDmnList.filter((n) => {
        //if (!params.searchWrd) return true;
        //const v = (params.searchCnd === 'content' ? n.content : n.title) || '';
        //return v.includes(params.searchWrd);
        return true; // edit !! 
      });

      const result: DmnListRVO = { list: filtered as DmnRVO[], totalCount: filtered.length }
      return result;
    }
  }
)

/**
 * 대국민포털_도메인기본 정보 조회 
 */
export const getDmn = createAsyncThunk<DmnRVO, DmnPVO | undefined>(
  '/dmn/getDmn',
  async (params: DmnPVO = {}) => {
    try {
      const res = await https.post(getDmnApiPath(), params);

      const payload = res.data;

      // 서버가 DmnRVO 형식으로 단 건 데이터를 반환함. 
      return payload;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("DmnThunks getDmn mockDmnList=",mockDmnList);
      return (mockDmnList).find((n) => 
        String(n.comStdDmnNm) === String(params.comStdDmnNm)
      ) || null;
    }
  }
)

/**
 * 대국민포털_도메인기본 입력 
 */
export const insertDmn = createAsyncThunk<number, DmnPVO>(
  '/dmn/insertDmn',
  async (params: DmnPVO) => {
    try {
      const res = await https.post(insertDmnApiPath(), params);

      const insertCnt = res.data;

      // 입력된 건수 반환함. 
      return insertCnt;
    }
    catch (e) {
      console.log("DmnThunks insertDmn");
      return -1;
    }
  }
)

/**
 * 대국민포털_도메인기본 수정 
 */
export const updateDmn = createAsyncThunk<number, DmnPVO>(
  '/dmn/updateDmn',
  async (params: DmnPVO) => {
    try {
      const res = await https.post(updateDmnApiPath(), params);

      const updateCnt = res.data;

      // 수정된 건수 반환함. 
      return updateCnt;
    }
    catch (e) {
      console.log("DmnThunks updateDmn");
      return -1;
    }
  }
)

/**
 * 대국민포털_도메인기본 저장 
 */
export const saveDmn = createAsyncThunk<number, DmnPVO>(
  '/dmn/saveDmn',
  async (params: DmnPVO) => {
    try {
      const res = await https.post(saveDmnApiPath(), params);

      const saveCnt = res.data;

      // 저장된 건수 반환함. 
      return saveCnt;
    }
    catch (e) {
      console.log("DmnThunks saveDmn error!!");
      return -1;
    }
  }
)

/**
 * 대국민포털_도메인기본 삭제 
 */
export const deleteDmn = createAsyncThunk<number, DmnDVO>(
  '/dmn/deleteDmn',
  async (params: DmnDVO) => {
    try {
      const res = await https.post(deleteDmnApiPath(), params);

      const deleteCnt = res.data;

      // 삭제된 건수 반환함. 
      return deleteCnt;
    }
    catch (e) {
      console.log("DmnThunks deleteDmn error!!");
      return -1;
    }
  }
)

