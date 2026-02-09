import { createAsyncThunk } from '@reduxjs/toolkit'
import https from '@/api/axiosInstance'
import { selectExprtTaskListApiPath, getExprtTaskApiPath, insertExprtTaskApiPath, updateExprtTaskApiPath, saveExprtTaskApiPath, deleteExprtTaskApiPath } from '@/api/exprt/ExprtTaskApiPaths'
import { mockExprtTaskList, ExprtTaskPVO, ExprtTaskRVO, ExprtTaskListPVO, ExprtTaskListRVO, ExprtTaskDVO  } from './ExprtTaskTypes'

/**
 * 대국민포털_전문가업무기본 정보 목록 조회 
 */
export const selectExprtTaskList = createAsyncThunk<ExprtTaskListRVO, ExprtTaskListPVO | undefined>(
  '/exprt/selectExprtTaskList',
  async (params: ExprtTaskListPVO = {}) => {
    try {
      const res = await https.post(selectExprtTaskListApiPath(), params);

      // ✅ 여기서 “서버 응답”을 표준 형태로 맞춰서 return
      const payload = res.data;

      // 서버가 ExprtTask[] 형식으로 주므로 ExprtTaskListRVO 형식으로 데이터 구조 재조정 
      return {
        list: Array.isArray(payload) ? payload : [],
        totalCount: Array.isArray(payload) ? payload.length : 0
      } as ExprtTaskListRVO;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("ExprtTaskThunks selectExprtTaskList mockExprtTaskList=",mockExprtTaskList);
      const filtered = mockExprtTaskList.filter((n) => {
        //if (!params.searchWrd) return true;
        //const v = (params.searchCnd === 'content' ? n.content : n.title) || '';
        //return v.includes(params.searchWrd);
        return true; // edit !! 
      });

      const result: ExprtTaskListRVO = { list: filtered as ExprtTaskRVO[], totalCount: filtered.length }
      return result;
    }
  }
)

/**
 * 대국민포털_전문가업무기본 정보 조회 
 */
export const getExprtTask = createAsyncThunk<ExprtTaskRVO, ExprtTaskPVO | undefined>(
  '/exprt/getExprtTask',
  async (params: ExprtTaskPVO = {}) => {
    try {
      const res = await https.post(getExprtTaskApiPath(), params);

      const payload = res.data;

      // 서버가 ExprtTaskRVO 형식으로 단 건 데이터를 반환함. 
      return payload;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("ExprtTaskThunks getExprtTask mockExprtTaskList=",mockExprtTaskList);
      return (mockExprtTaskList).find((n) => 
      ) || null;
    }
  }
)

/**
 * 대국민포털_전문가업무기본 입력 
 */
export const insertExprtTask = createAsyncThunk<number, ExprtTaskPVO>(
  '/exprt/insertExprtTask',
  async (params: ExprtTaskPVO) => {
    try {
      const res = await https.post(insertExprtTaskApiPath(), params);

      const insertCnt = res.data;

      // 입력된 건수 반환함. 
      return insertCnt;
    }
    catch (e) {
      console.log("ExprtTaskThunks insertExprtTask");
      return -1;
    }
  }
)

/**
 * 대국민포털_전문가업무기본 수정 
 */
export const updateExprtTask = createAsyncThunk<number, ExprtTaskPVO>(
  '/exprt/updateExprtTask',
  async (params: ExprtTaskPVO) => {
    try {
      const res = await https.post(updateExprtTaskApiPath(), params);

      const updateCnt = res.data;

      // 수정된 건수 반환함. 
      return updateCnt;
    }
    catch (e) {
      console.log("ExprtTaskThunks updateExprtTask");
      return -1;
    }
  }
)

/**
 * 대국민포털_전문가업무기본 저장 
 */
export const saveExprtTask = createAsyncThunk<number, ExprtTaskPVO>(
  '/exprt/saveExprtTask',
  async (params: ExprtTaskPVO) => {
    try {
      const res = await https.post(saveExprtTaskApiPath(), params);

      const saveCnt = res.data;

      // 저장된 건수 반환함. 
      return saveCnt;
    }
    catch (e) {
      console.log("ExprtTaskThunks saveExprtTask error!!");
      return -1;
    }
  }
)

/**
 * 대국민포털_전문가업무기본 삭제 
 */
export const deleteExprtTask = createAsyncThunk<number, ExprtTaskDVO>(
  '/exprt/deleteExprtTask',
  async (params: ExprtTaskDVO) => {
    try {
      const res = await https.post(deleteExprtTaskApiPath(), params);

      const deleteCnt = res.data;

      // 삭제된 건수 반환함. 
      return deleteCnt;
    }
    catch (e) {
      console.log("ExprtTaskThunks deleteExprtTask error!!");
      return -1;
    }
  }
)

