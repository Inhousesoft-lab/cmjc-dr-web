import { createAsyncThunk } from '@reduxjs/toolkit'
import https from '@/api/axiosInstance'
import { selectTaskCdListApiPath, getTaskCdApiPath, insertTaskCdApiPath, updateTaskCdApiPath, saveTaskCdApiPath, deleteTaskCdApiPath } from '@/api/task/TaskCdApiPaths'
import { mockTaskCdList, TaskCdPVO, TaskCdRVO, TaskCdListPVO, TaskCdListRVO, TaskCdDVO  } from './TaskCdTypes'

/**
 * 대국민포털_업무코드기본 정보 목록 조회 
 */
export const selectTaskCdList = createAsyncThunk<TaskCdListRVO, TaskCdListPVO | undefined>(
  '/task/selectTaskCdList',
  async (params: TaskCdListPVO = {}) => {
    try {
      const res = await https.post(selectTaskCdListApiPath(), params);

      // ✅ 여기서 “서버 응답”을 표준 형태로 맞춰서 return
      const payload = res.data;

      // 서버가 TaskCd[] 형식으로 주므로 TaskCdListRVO 형식으로 데이터 구조 재조정 
      return {
        list: Array.isArray(payload) ? payload : [],
        totalCount: Array.isArray(payload) ? payload.length : 0
      } as TaskCdListRVO;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("TaskCdThunks selectTaskCdList mockTaskCdList=",mockTaskCdList);
      const filtered = mockTaskCdList.filter((n) => {
        //if (!params.searchWrd) return true;
        //const v = (params.searchCnd === 'content' ? n.content : n.title) || '';
        //return v.includes(params.searchWrd);
        return true; // edit !! 
      });

      const result: TaskCdListRVO = { list: filtered as TaskCdRVO[], totalCount: filtered.length }
      return result;
    }
  }
)

/**
 * 대국민포털_업무코드기본 정보 조회 
 */
export const getTaskCd = createAsyncThunk<TaskCdRVO, TaskCdPVO | undefined>(
  '/task/getTaskCd',
  async (params: TaskCdPVO = {}) => {
    try {
      const res = await https.post(getTaskCdApiPath(), params);

      const payload = res.data;

      // 서버가 TaskCdRVO 형식으로 단 건 데이터를 반환함. 
      return payload;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("TaskCdThunks getTaskCd mockTaskCdList=",mockTaskCdList);
      return (mockTaskCdList).find((n) => 
        String(n.taskCd) === String(params.taskCd)
      ) || null;
    }
  }
)

/**
 * 대국민포털_업무코드기본 입력 
 */
export const insertTaskCd = createAsyncThunk<number, TaskCdPVO>(
  '/task/insertTaskCd',
  async (params: TaskCdPVO) => {
    try {
      const res = await https.post(insertTaskCdApiPath(), params);

      const insertCnt = res.data;

      // 입력된 건수 반환함. 
      return insertCnt;
    }
    catch (e) {
      console.log("TaskCdThunks insertTaskCd");
      return -1;
    }
  }
)

/**
 * 대국민포털_업무코드기본 수정 
 */
export const updateTaskCd = createAsyncThunk<number, TaskCdPVO>(
  '/task/updateTaskCd',
  async (params: TaskCdPVO) => {
    try {
      const res = await https.post(updateTaskCdApiPath(), params);

      const updateCnt = res.data;

      // 수정된 건수 반환함. 
      return updateCnt;
    }
    catch (e) {
      console.log("TaskCdThunks updateTaskCd");
      return -1;
    }
  }
)

/**
 * 대국민포털_업무코드기본 저장 
 */
export const saveTaskCd = createAsyncThunk<number, TaskCdPVO>(
  '/task/saveTaskCd',
  async (params: TaskCdPVO) => {
    try {
      const res = await https.post(saveTaskCdApiPath(), params);

      const saveCnt = res.data;

      // 저장된 건수 반환함. 
      return saveCnt;
    }
    catch (e) {
      console.log("TaskCdThunks saveTaskCd error!!");
      return -1;
    }
  }
)

/**
 * 대국민포털_업무코드기본 삭제 
 */
export const deleteTaskCd = createAsyncThunk<number, TaskCdDVO>(
  '/task/deleteTaskCd',
  async (params: TaskCdDVO) => {
    try {
      const res = await https.post(deleteTaskCdApiPath(), params);

      const deleteCnt = res.data;

      // 삭제된 건수 반환함. 
      return deleteCnt;
    }
    catch (e) {
      console.log("TaskCdThunks deleteTaskCd error!!");
      return -1;
    }
  }
)

