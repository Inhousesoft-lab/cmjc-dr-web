import { createAsyncThunk } from '@reduxjs/toolkit'
import https from '@/api/axiosInstance'
import { selectEmpListApiPath, getEmpApiPath, insertEmpApiPath, updateEmpApiPath, saveEmpApiPath, deleteEmpApiPath } from '@/api/emp/EmpApiPaths'
import { mockEmpList, EmpPVO, EmpRVO, EmpListPVO, EmpListRVO, EmpDVO  } from './EmpTypes'

/**
 * 대국민포털_관리자정보기본 정보 목록 조회 
 */
export const selectEmpList = createAsyncThunk<EmpListRVO, EmpListPVO | undefined>(
  '/emp/selectEmpList',
  async (params: EmpListPVO = {}) => {
    try {
      const res = await https.post(selectEmpListApiPath(), params);

      // ✅ 여기서 “서버 응답”을 표준 형태로 맞춰서 return
      const payload = res.data;

      // 서버가 Emp[] 형식으로 주므로 EmpListRVO 형식으로 데이터 구조 재조정 
      return {
        list: Array.isArray(payload) ? payload : [],
        totalCount: Array.isArray(payload) ? payload.length : 0
      } as EmpListRVO;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("EmpThunks selectEmpList mockEmpList=",mockEmpList);
      const filtered = mockEmpList.filter((n) => {
        //if (!params.searchWrd) return true;
        //const v = (params.searchCnd === 'content' ? n.content : n.title) || '';
        //return v.includes(params.searchWrd);
        return true; // edit !! 
      });

      const result: EmpListRVO = { list: filtered as EmpRVO[], totalCount: filtered.length }
      return result;
    }
  }
)

/**
 * 대국민포털_관리자정보기본 정보 조회 
 */
export const getEmp = createAsyncThunk<EmpRVO, EmpPVO | undefined>(
  '/emp/getEmp',
  async (params: EmpPVO = {}) => {
    try {
      const res = await https.post(getEmpApiPath(), params);

      const payload = res.data;

      // 서버가 EmpRVO 형식으로 단 건 데이터를 반환함. 
      return payload;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("EmpThunks getEmp mockEmpList=",mockEmpList);
      return (mockEmpList).find((n) => 
        String(n.empNo) === String(params.empNo)
      ) || null;
    }
  }
)

/**
 * 대국민포털_관리자정보기본 입력 
 */
export const insertEmp = createAsyncThunk<number, EmpPVO>(
  '/emp/insertEmp',
  async (params: EmpPVO) => {
    try {
      const res = await https.post(insertEmpApiPath(), params);

      const insertCnt = res.data;

      // 입력된 건수 반환함. 
      return insertCnt;
    }
    catch (e) {
      console.log("EmpThunks insertEmp");
      return -1;
    }
  }
)

/**
 * 대국민포털_관리자정보기본 수정 
 */
export const updateEmp = createAsyncThunk<number, EmpPVO>(
  '/emp/updateEmp',
  async (params: EmpPVO) => {
    try {
      const res = await https.post(updateEmpApiPath(), params);

      const updateCnt = res.data;

      // 수정된 건수 반환함. 
      return updateCnt;
    }
    catch (e) {
      console.log("EmpThunks updateEmp");
      return -1;
    }
  }
)

/**
 * 대국민포털_관리자정보기본 저장 
 */
export const saveEmp = createAsyncThunk<number, EmpPVO>(
  '/emp/saveEmp',
  async (params: EmpPVO) => {
    try {
      const res = await https.post(saveEmpApiPath(), params);

      const saveCnt = res.data;

      // 저장된 건수 반환함. 
      return saveCnt;
    }
    catch (e) {
      console.log("EmpThunks saveEmp error!!");
      return -1;
    }
  }
)

/**
 * 대국민포털_관리자정보기본 삭제 
 */
export const deleteEmp = createAsyncThunk<number, EmpDVO>(
  '/emp/deleteEmp',
  async (params: EmpDVO) => {
    try {
      const res = await https.post(deleteEmpApiPath(), params);

      const deleteCnt = res.data;

      // 삭제된 건수 반환함. 
      return deleteCnt;
    }
    catch (e) {
      console.log("EmpThunks deleteEmp error!!");
      return -1;
    }
  }
)

