import { createAsyncThunk } from '@reduxjs/toolkit'
import https from '@/api/axiosInstance'
import { selectDeptAuthrtListApiPath, getDeptAuthrtApiPath, insertDeptAuthrtApiPath, updateDeptAuthrtApiPath, saveDeptAuthrtApiPath, deleteDeptAuthrtApiPath } from '@/api/auth/DeptAuthrtApiPaths'
import { mockDeptAuthrtList, DeptAuthrtPVO, DeptAuthrtRVO, DeptAuthrtListPVO, DeptAuthrtListRVO, DeptAuthrtDVO  } from './DeptAuthrtTypes'

/**
 * 대국민포털_부서권한기본 정보 목록 조회 
 */
export const selectDeptAuthrtList = createAsyncThunk<DeptAuthrtListRVO, DeptAuthrtListPVO | undefined>(
  '/auth/selectDeptAuthrtList',
  async (params: DeptAuthrtListPVO = {}) => {
    try {
      const res = await https.post(selectDeptAuthrtListApiPath(), params);

      // ✅ 여기서 “서버 응답”을 표준 형태로 맞춰서 return
      const payload = res.data;

      // 서버가 DeptAuthrt[] 형식으로 주므로 DeptAuthrtListRVO 형식으로 데이터 구조 재조정 
      return {
        list: Array.isArray(payload) ? payload : [],
        totalCount: Array.isArray(payload) ? payload.length : 0
      } as DeptAuthrtListRVO;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("DeptAuthrtThunks selectDeptAuthrtList mockDeptAuthrtList=",mockDeptAuthrtList);
      const filtered = mockDeptAuthrtList.filter((n) => {
        //if (!params.searchWrd) return true;
        //const v = (params.searchCnd === 'content' ? n.content : n.title) || '';
        //return v.includes(params.searchWrd);
        return true; // edit !! 
      });

      const result: DeptAuthrtListRVO = { list: filtered as DeptAuthrtRVO[], totalCount: filtered.length }
      return result;
    }
  }
)

/**
 * 대국민포털_부서권한기본 정보 조회 
 */
export const getDeptAuthrt = createAsyncThunk<DeptAuthrtRVO, DeptAuthrtPVO | undefined>(
  '/auth/getDeptAuthrt',
  async (params: DeptAuthrtPVO = {}) => {
    try {
      const res = await https.post(getDeptAuthrtApiPath(), params);

      const payload = res.data;

      // 서버가 DeptAuthrtRVO 형식으로 단 건 데이터를 반환함. 
      return payload;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("DeptAuthrtThunks getDeptAuthrt mockDeptAuthrtList=",mockDeptAuthrtList);
      return (mockDeptAuthrtList).find((n) => 
        String(n.authrtCd) === String(params.authrtCd) &&
        String(n.deptNo) === String(params.deptNo)
      ) || null;
    }
  }
)

/**
 * 대국민포털_부서권한기본 입력 
 */
export const insertDeptAuthrt = createAsyncThunk<number, DeptAuthrtPVO>(
  '/auth/insertDeptAuthrt',
  async (params: DeptAuthrtPVO) => {
    try {
      const res = await https.post(insertDeptAuthrtApiPath(), params);

      const insertCnt = res.data;

      // 입력된 건수 반환함. 
      return insertCnt;
    }
    catch (e) {
      console.log("DeptAuthrtThunks insertDeptAuthrt");
      return -1;
    }
  }
)

/**
 * 대국민포털_부서권한기본 수정 
 */
export const updateDeptAuthrt = createAsyncThunk<number, DeptAuthrtPVO>(
  '/auth/updateDeptAuthrt',
  async (params: DeptAuthrtPVO) => {
    try {
      const res = await https.post(updateDeptAuthrtApiPath(), params);

      const updateCnt = res.data;

      // 수정된 건수 반환함. 
      return updateCnt;
    }
    catch (e) {
      console.log("DeptAuthrtThunks updateDeptAuthrt");
      return -1;
    }
  }
)

/**
 * 대국민포털_부서권한기본 저장 
 */
export const saveDeptAuthrt = createAsyncThunk<number, DeptAuthrtPVO>(
  '/auth/saveDeptAuthrt',
  async (params: DeptAuthrtPVO) => {
    try {
      const res = await https.post(saveDeptAuthrtApiPath(), params);

      const saveCnt = res.data;

      // 저장된 건수 반환함. 
      return saveCnt;
    }
    catch (e) {
      console.log("DeptAuthrtThunks saveDeptAuthrt error!!");
      return -1;
    }
  }
)

/**
 * 대국민포털_부서권한기본 삭제 
 */
export const deleteDeptAuthrt = createAsyncThunk<number, DeptAuthrtDVO>(
  '/auth/deleteDeptAuthrt',
  async (params: DeptAuthrtDVO) => {
    try {
      const res = await https.post(deleteDeptAuthrtApiPath(), params);

      const deleteCnt = res.data;

      // 삭제된 건수 반환함. 
      return deleteCnt;
    }
    catch (e) {
      console.log("DeptAuthrtThunks deleteDeptAuthrt error!!");
      return -1;
    }
  }
)

