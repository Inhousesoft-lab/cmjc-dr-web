import { createAsyncThunk } from '@reduxjs/toolkit'
import https from '@/api/axiosInstance'
import { selectExprtInfoListApiPath, getExprtInfoApiPath, insertExprtInfoApiPath, updateExprtInfoApiPath, saveExprtInfoApiPath, deleteExprtInfoApiPath } from '@/api/exprt/ExprtInfoApiPaths'
import { mockExprtInfoList, ExprtInfoPVO, ExprtInfoRVO, ExprtInfoListPVO, ExprtInfoListRVO, ExprtInfoDVO  } from './ExprtInfoTypes'

/**
 * 대국민포털_전문가정보기본 정보 목록 조회 
 */
export const selectExprtInfoList = createAsyncThunk<ExprtInfoListRVO, ExprtInfoListPVO | undefined>(
  '/exprt/selectExprtInfoList',
  async (params: ExprtInfoListPVO = {}) => {
    try {
      const res = await https.post(selectExprtInfoListApiPath(), params);

      // ✅ 여기서 “서버 응답”을 표준 형태로 맞춰서 return
      const payload = res.data;

      // 서버가 ExprtInfo[] 형식으로 주므로 ExprtInfoListRVO 형식으로 데이터 구조 재조정 
      return {
        list: Array.isArray(payload) ? payload : [],
        totalCount: Array.isArray(payload) ? payload.length : 0
      } as ExprtInfoListRVO;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("ExprtInfoThunks selectExprtInfoList mockExprtInfoList=",mockExprtInfoList);
      const filtered = mockExprtInfoList.filter((n) => {
        //if (!params.searchWrd) return true;
        //const v = (params.searchCnd === 'content' ? n.content : n.title) || '';
        //return v.includes(params.searchWrd);
        return true; // edit !! 
      });

      const result: ExprtInfoListRVO = { list: filtered as ExprtInfoRVO[], totalCount: filtered.length }
      return result;
    }
  }
)

/**
 * 대국민포털_전문가정보기본 정보 조회 
 */
export const getExprtInfo = createAsyncThunk<ExprtInfoRVO, ExprtInfoPVO | undefined>(
  '/exprt/getExprtInfo',
  async (params: ExprtInfoPVO = {}) => {
    try {
      const res = await https.post(getExprtInfoApiPath(), params);

      const payload = res.data;

      // 서버가 ExprtInfoRVO 형식으로 단 건 데이터를 반환함. 
      return payload;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("ExprtInfoThunks getExprtInfo mockExprtInfoList=",mockExprtInfoList);
      return (mockExprtInfoList).find((n) => 
        String(n.mbrNo) === String(params.mbrNo)
      ) || null;
    }
  }
)

/**
 * 대국민포털_전문가정보기본 입력 
 */
export const insertExprtInfo = createAsyncThunk<number, ExprtInfoPVO>(
  '/exprt/insertExprtInfo',
  async (params: ExprtInfoPVO) => {
    try {
      const res = await https.post(insertExprtInfoApiPath(), params);

      const insertCnt = res.data;

      // 입력된 건수 반환함. 
      return insertCnt;
    }
    catch (e) {
      console.log("ExprtInfoThunks insertExprtInfo");
      return -1;
    }
  }
)

/**
 * 대국민포털_전문가정보기본 수정 
 */
export const updateExprtInfo = createAsyncThunk<number, ExprtInfoPVO>(
  '/exprt/updateExprtInfo',
  async (params: ExprtInfoPVO) => {
    try {
      const res = await https.post(updateExprtInfoApiPath(), params);

      const updateCnt = res.data;

      // 수정된 건수 반환함. 
      return updateCnt;
    }
    catch (e) {
      console.log("ExprtInfoThunks updateExprtInfo");
      return -1;
    }
  }
)

/**
 * 대국민포털_전문가정보기본 저장 
 */
export const saveExprtInfo = createAsyncThunk<number, ExprtInfoPVO>(
  '/exprt/saveExprtInfo',
  async (params: ExprtInfoPVO) => {
    try {
      const res = await https.post(saveExprtInfoApiPath(), params);

      const saveCnt = res.data;

      // 저장된 건수 반환함. 
      return saveCnt;
    }
    catch (e) {
      console.log("ExprtInfoThunks saveExprtInfo error!!");
      return -1;
    }
  }
)

/**
 * 대국민포털_전문가정보기본 삭제 
 */
export const deleteExprtInfo = createAsyncThunk<number, ExprtInfoDVO>(
  '/exprt/deleteExprtInfo',
  async (params: ExprtInfoDVO) => {
    try {
      const res = await https.post(deleteExprtInfoApiPath(), params);

      const deleteCnt = res.data;

      // 삭제된 건수 반환함. 
      return deleteCnt;
    }
    catch (e) {
      console.log("ExprtInfoThunks deleteExprtInfo error!!");
      return -1;
    }
  }
)

