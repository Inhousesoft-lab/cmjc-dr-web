import { createAsyncThunk } from '@reduxjs/toolkit'
import https from '@/api/axiosInstance'
import { selectInstTaskListApiPath, getInstTaskApiPath, insertInstTaskApiPath, updateInstTaskApiPath, saveInstTaskApiPath, deleteInstTaskApiPath } from '@/api/inst/InstTaskApiPaths'
import { mockInstTaskList, InstTaskPVO, InstTaskRVO, InstTaskListPVO, InstTaskListRVO, InstTaskDVO  } from './InstTaskTypes'

/**
 * 대국민포털_기관업무기본 정보 목록 조회 
 */
export const selectInstTaskList = createAsyncThunk<InstTaskListRVO, InstTaskListPVO | undefined>(
  '/inst/selectInstTaskList',
  async (params: InstTaskListPVO = {}) => {
    try {
      const res = await https.post(selectInstTaskListApiPath(), params);

      // ✅ 여기서 “서버 응답”을 표준 형태로 맞춰서 return
      const payload = res.data;

      // 서버가 InstTask[] 형식으로 주므로 InstTaskListRVO 형식으로 데이터 구조 재조정 
      return {
        list: Array.isArray(payload) ? payload : [],
        totalCount: Array.isArray(payload) ? payload.length : 0
      } as InstTaskListRVO;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("InstTaskThunks selectInstTaskList mockInstTaskList=",mockInstTaskList);
      const filtered = mockInstTaskList.filter((n) => {
        //if (!params.searchWrd) return true;
        //const v = (params.searchCnd === 'content' ? n.content : n.title) || '';
        //return v.includes(params.searchWrd);
        return true; // edit !! 
      });

      const result: InstTaskListRVO = { list: filtered as InstTaskRVO[], totalCount: filtered.length }
      return result;
    }
  }
)

/**
 * 대국민포털_기관업무기본 정보 조회 
 */
export const getInstTask = createAsyncThunk<InstTaskRVO, InstTaskPVO | undefined>(
  '/inst/getInstTask',
  async (params: InstTaskPVO = {}) => {
    try {
      const res = await https.post(getInstTaskApiPath(), params);

      const payload = res.data;

      // 서버가 InstTaskRVO 형식으로 단 건 데이터를 반환함. 
      return payload;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("InstTaskThunks getInstTask mockInstTaskList=",mockInstTaskList);
      return (mockInstTaskList).find((n) => 
        String(n.taskSeCd) === String(params.taskSeCd) &&
        String(n.brno) === String(params.brno)
      ) || null;
    }
  }
)

/**
 * 대국민포털_기관업무기본 입력 
 */
export const insertInstTask = createAsyncThunk<number, InstTaskPVO>(
  '/inst/insertInstTask',
  async (params: InstTaskPVO) => {
    try {
      const res = await https.post(insertInstTaskApiPath(), params);

      const insertCnt = res.data;

      // 입력된 건수 반환함. 
      return insertCnt;
    }
    catch (e) {
      console.log("InstTaskThunks insertInstTask");
      return -1;
    }
  }
)

/**
 * 대국민포털_기관업무기본 수정 
 */
export const updateInstTask = createAsyncThunk<number, InstTaskPVO>(
  '/inst/updateInstTask',
  async (params: InstTaskPVO) => {
    try {
      const res = await https.post(updateInstTaskApiPath(), params);

      const updateCnt = res.data;

      // 수정된 건수 반환함. 
      return updateCnt;
    }
    catch (e) {
      console.log("InstTaskThunks updateInstTask");
      return -1;
    }
  }
)

/**
 * 대국민포털_기관업무기본 저장 
 */
export const saveInstTask = createAsyncThunk<number, InstTaskPVO>(
  '/inst/saveInstTask',
  async (params: InstTaskPVO) => {
    try {
      const res = await https.post(saveInstTaskApiPath(), params);

      const saveCnt = res.data;

      // 저장된 건수 반환함. 
      return saveCnt;
    }
    catch (e) {
      console.log("InstTaskThunks saveInstTask error!!");
      return -1;
    }
  }
)

/**
 * 대국민포털_기관업무기본 삭제 
 */
export const deleteInstTask = createAsyncThunk<number, InstTaskDVO>(
  '/inst/deleteInstTask',
  async (params: InstTaskDVO) => {
    try {
      const res = await https.post(deleteInstTaskApiPath(), params);

      const deleteCnt = res.data;

      // 삭제된 건수 반환함. 
      return deleteCnt;
    }
    catch (e) {
      console.log("InstTaskThunks deleteInstTask error!!");
      return -1;
    }
  }
)

