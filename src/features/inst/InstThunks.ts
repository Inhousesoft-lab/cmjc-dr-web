import { createAsyncThunk } from '@reduxjs/toolkit'
import https from '@/api/axiosInstance'
import { selectInstListApiPath, getInstApiPath, insertInstApiPath, updateInstApiPath, saveInstApiPath, deleteInstApiPath } from '@/api/inst/InstApiPaths'
import { mockInstList, InstPVO, InstRVO, InstListPVO, InstListRVO, InstDVO  } from './InstTypes'

/**
 * 대국민포털_기관정보기본 정보 목록 조회 
 */
export const selectInstList = createAsyncThunk<InstListRVO, InstListPVO | undefined>(
  '/inst/selectInstList',
  async (params: InstListPVO = {}) => {
    try {
      const res = await https.post(selectInstListApiPath(), params);

      // ✅ 여기서 “서버 응답”을 표준 형태로 맞춰서 return
      const payload = res.data;

      // 서버가 Inst[] 형식으로 주므로 InstListRVO 형식으로 데이터 구조 재조정 
      return {
        list: Array.isArray(payload) ? payload : [],
        totalCount: Array.isArray(payload) ? payload.length : 0
      } as InstListRVO;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("InstThunks selectInstList mockInstList=",mockInstList);
      const filtered = mockInstList.filter((n) => {
        //if (!params.searchWrd) return true;
        //const v = (params.searchCnd === 'content' ? n.content : n.title) || '';
        //return v.includes(params.searchWrd);
        return true; // edit !! 
      });

      const result: InstListRVO = { list: filtered as InstRVO[], totalCount: filtered.length }
      return result;
    }
  }
)

/**
 * 대국민포털_기관정보기본 정보 조회 
 */
export const getInst = createAsyncThunk<InstRVO, InstPVO | undefined>(
  '/inst/getInst',
  async (params: InstPVO = {}) => {
    try {
      const res = await https.post(getInstApiPath(), params);

      const payload = res.data;

      // 서버가 InstRVO 형식으로 단 건 데이터를 반환함. 
      return payload;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("InstThunks getInst mockInstList=",mockInstList);
      return (mockInstList).find((n) => 
        String(n.brno) === String(params.brno)
      ) || null;
    }
  }
)

/**
 * 대국민포털_기관정보기본 입력 
 */
export const insertInst = createAsyncThunk<number, InstPVO>(
  '/inst/insertInst',
  async (params: InstPVO) => {
    try {
      const res = await https.post(insertInstApiPath(), params);

      const insertCnt = res.data;

      // 입력된 건수 반환함. 
      return insertCnt;
    }
    catch (e) {
      console.log("InstThunks insertInst");
      return -1;
    }
  }
)

/**
 * 대국민포털_기관정보기본 수정 
 */
export const updateInst = createAsyncThunk<number, InstPVO>(
  '/inst/updateInst',
  async (params: InstPVO) => {
    try {
      const res = await https.post(updateInstApiPath(), params);

      const updateCnt = res.data;

      // 수정된 건수 반환함. 
      return updateCnt;
    }
    catch (e) {
      console.log("InstThunks updateInst");
      return -1;
    }
  }
)

/**
 * 대국민포털_기관정보기본 저장 
 */
export const saveInst = createAsyncThunk<number, InstPVO>(
  '/inst/saveInst',
  async (params: InstPVO) => {
    try {
      const res = await https.post(saveInstApiPath(), params);

      const saveCnt = res.data;

      // 저장된 건수 반환함. 
      return saveCnt;
    }
    catch (e) {
      console.log("InstThunks saveInst error!!");
      return -1;
    }
  }
)

/**
 * 대국민포털_기관정보기본 삭제 
 */
export const deleteInst = createAsyncThunk<number, InstDVO>(
  '/inst/deleteInst',
  async (params: InstDVO) => {
    try {
      const res = await https.post(deleteInstApiPath(), params);

      const deleteCnt = res.data;

      // 삭제된 건수 반환함. 
      return deleteCnt;
    }
    catch (e) {
      console.log("InstThunks deleteInst error!!");
      return -1;
    }
  }
)

