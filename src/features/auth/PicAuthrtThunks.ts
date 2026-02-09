import { createAsyncThunk } from '@reduxjs/toolkit'
import https from '@/api/axiosInstance'
import { selectPicAuthrtListApiPath, getPicAuthrtApiPath, insertPicAuthrtApiPath, updatePicAuthrtApiPath, savePicAuthrtApiPath, deletePicAuthrtApiPath } from '@/api/auth/PicAuthrtApiPaths'
import { mockPicAuthrtList, PicAuthrtPVO, PicAuthrtRVO, PicAuthrtListPVO, PicAuthrtListRVO, PicAuthrtDVO  } from './PicAuthrtTypes'

/**
 * 대국민포털_담당자권한기본 정보 목록 조회 
 */
export const selectPicAuthrtList = createAsyncThunk<PicAuthrtListRVO, PicAuthrtListPVO | undefined>(
  '/auth/selectPicAuthrtList',
  async (params: PicAuthrtListPVO = {}) => {
    try {
      const res = await https.post(selectPicAuthrtListApiPath(), params);

      // ✅ 여기서 “서버 응답”을 표준 형태로 맞춰서 return
      const payload = res.data;

      // 서버가 PicAuthrt[] 형식으로 주므로 PicAuthrtListRVO 형식으로 데이터 구조 재조정 
      return {
        list: Array.isArray(payload) ? payload : [],
        totalCount: Array.isArray(payload) ? payload.length : 0
      } as PicAuthrtListRVO;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("PicAuthrtThunks selectPicAuthrtList mockPicAuthrtList=",mockPicAuthrtList);
      const filtered = mockPicAuthrtList.filter((n) => {
        //if (!params.searchWrd) return true;
        //const v = (params.searchCnd === 'content' ? n.content : n.title) || '';
        //return v.includes(params.searchWrd);
        return true; // edit !! 
      });

      const result: PicAuthrtListRVO = { list: filtered as PicAuthrtRVO[], totalCount: filtered.length }
      return result;
    }
  }
)

/**
 * 대국민포털_담당자권한기본 정보 조회 
 */
export const getPicAuthrt = createAsyncThunk<PicAuthrtRVO, PicAuthrtPVO | undefined>(
  '/auth/getPicAuthrt',
  async (params: PicAuthrtPVO = {}) => {
    try {
      const res = await https.post(getPicAuthrtApiPath(), params);

      const payload = res.data;

      // 서버가 PicAuthrtRVO 형식으로 단 건 데이터를 반환함. 
      return payload;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("PicAuthrtThunks getPicAuthrt mockPicAuthrtList=",mockPicAuthrtList);
      return (mockPicAuthrtList).find((n) => 
        String(n.authrtCd) === String(params.authrtCd) &&
        String(n.empNo) === String(params.empNo)
      ) || null;
    }
  }
)

/**
 * 대국민포털_담당자권한기본 입력 
 */
export const insertPicAuthrt = createAsyncThunk<number, PicAuthrtPVO>(
  '/auth/insertPicAuthrt',
  async (params: PicAuthrtPVO) => {
    try {
      const res = await https.post(insertPicAuthrtApiPath(), params);

      const insertCnt = res.data;

      // 입력된 건수 반환함. 
      return insertCnt;
    }
    catch (e) {
      console.log("PicAuthrtThunks insertPicAuthrt");
      return -1;
    }
  }
)

/**
 * 대국민포털_담당자권한기본 수정 
 */
export const updatePicAuthrt = createAsyncThunk<number, PicAuthrtPVO>(
  '/auth/updatePicAuthrt',
  async (params: PicAuthrtPVO) => {
    try {
      const res = await https.post(updatePicAuthrtApiPath(), params);

      const updateCnt = res.data;

      // 수정된 건수 반환함. 
      return updateCnt;
    }
    catch (e) {
      console.log("PicAuthrtThunks updatePicAuthrt");
      return -1;
    }
  }
)

/**
 * 대국민포털_담당자권한기본 저장 
 */
export const savePicAuthrt = createAsyncThunk<number, PicAuthrtPVO>(
  '/auth/savePicAuthrt',
  async (params: PicAuthrtPVO) => {
    try {
      const res = await https.post(savePicAuthrtApiPath(), params);

      const saveCnt = res.data;

      // 저장된 건수 반환함. 
      return saveCnt;
    }
    catch (e) {
      console.log("PicAuthrtThunks savePicAuthrt error!!");
      return -1;
    }
  }
)

/**
 * 대국민포털_담당자권한기본 삭제 
 */
export const deletePicAuthrt = createAsyncThunk<number, PicAuthrtDVO>(
  '/auth/deletePicAuthrt',
  async (params: PicAuthrtDVO) => {
    try {
      const res = await https.post(deletePicAuthrtApiPath(), params);

      const deleteCnt = res.data;

      // 삭제된 건수 반환함. 
      return deleteCnt;
    }
    catch (e) {
      console.log("PicAuthrtThunks deletePicAuthrt error!!");
      return -1;
    }
  }
)

