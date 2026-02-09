import { createAsyncThunk } from '@reduxjs/toolkit'
import https from '@/api/axiosInstance'
import { selectComCdListApiPath, getComCdApiPath, insertComCdApiPath, updateComCdApiPath, saveComCdApiPath, deleteComCdApiPath } from '@/api/com/ComCdApiPaths'
import { mockComCdList, ComCdPVO, ComCdRVO, ComCdListPVO, ComCdListRVO, ComCdDVO  } from './ComCdTypes'

/**
 * 공통_공통코드기본 정보 목록 조회 
 */
export const selectComCdList = createAsyncThunk<ComCdListRVO, ComCdListPVO | undefined>(
  '/com/selectComCdList',
  async (params: ComCdListPVO = {}) => {
    try {
      const res = await https.post(selectComCdListApiPath(), params);

      // ✅ 여기서 “서버 응답”을 표준 형태로 맞춰서 return
      const payload = res.data;

      // 서버가 ComCd[] 형식으로 주므로 ComCdListRVO 형식으로 데이터 구조 재조정 
      return {
        list: Array.isArray(payload) ? payload : [],
        totalCount: Array.isArray(payload) ? payload.length : 0
      } as ComCdListRVO;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("ComCdThunks selectComCdList mockComCdList=",mockComCdList);
      const filtered = mockComCdList.filter((n) => {
        //if (!params.searchWrd) return true;
        //const v = (params.searchCnd === 'content' ? n.content : n.title) || '';
        //return v.includes(params.searchWrd);
        return true; // edit !! 
      });

      const result: ComCdListRVO = { list: filtered as ComCdRVO[], totalCount: filtered.length }
      return result;
    }
  }
)

/**
 * 공통_공통코드기본 정보 조회 
 */
export const getComCd = createAsyncThunk<ComCdRVO, ComCdPVO | undefined>(
  '/com/getComCd',
  async (params: ComCdPVO = {}) => {
    try {
      const res = await https.post(getComCdApiPath(), params);

      const payload = res.data;

      // 서버가 ComCdRVO 형식으로 단 건 데이터를 반환함. 
      return payload;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("ComCdThunks getComCd mockComCdList=",mockComCdList);
      return (mockComCdList).find((n) => 
        String(n.comCd) === String(params.comCd)
      ) || null;
    }
  }
)

/**
 * 공통_공통코드기본 입력 
 */
export const insertComCd = createAsyncThunk<number, ComCdPVO>(
  '/com/insertComCd',
  async (params: ComCdPVO) => {
    try {
      const res = await https.post(insertComCdApiPath(), params);

      const insertCnt = res.data;

      // 입력된 건수 반환함. 
      return insertCnt;
    }
    catch (e) {
      console.log("ComCdThunks insertComCd");
      return -1;
    }
  }
)

/**
 * 공통_공통코드기본 수정 
 */
export const updateComCd = createAsyncThunk<number, ComCdPVO>(
  '/com/updateComCd',
  async (params: ComCdPVO) => {
    try {
      const res = await https.post(updateComCdApiPath(), params);

      const updateCnt = res.data;

      // 수정된 건수 반환함. 
      return updateCnt;
    }
    catch (e) {
      console.log("ComCdThunks updateComCd");
      return -1;
    }
  }
)

/**
 * 공통_공통코드기본 저장 
 */
export const saveComCd = createAsyncThunk<number, ComCdPVO>(
  '/com/saveComCd',
  async (params: ComCdPVO) => {
    try {
      const res = await https.post(saveComCdApiPath(), params);

      const saveCnt = res.data;

      // 저장된 건수 반환함. 
      return saveCnt;
    }
    catch (e) {
      console.log("ComCdThunks saveComCd error!!");
      return -1;
    }
  }
)

/**
 * 공통_공통코드기본 삭제 
 */
export const deleteComCd = createAsyncThunk<number, ComCdDVO>(
  '/com/deleteComCd',
  async (params: ComCdDVO) => {
    try {
      const res = await https.post(deleteComCdApiPath(), params);

      const deleteCnt = res.data;

      // 삭제된 건수 반환함. 
      return deleteCnt;
    }
    catch (e) {
      console.log("ComCdThunks deleteComCd error!!");
      return -1;
    }
  }
)

