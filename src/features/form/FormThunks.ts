import { createAsyncThunk } from '@reduxjs/toolkit'
import https from '@/api/axiosInstance'
import { selectFormListApiPath, getFormApiPath, insertFormApiPath, updateFormApiPath, saveFormApiPath, deleteFormApiPath } from '@/api/form/FormApiPaths'
import { mockFormList, FormPVO, FormRVO, FormListPVO, FormListRVO, FormDVO  } from './FormTypes'

/**
 * 대국민포털_양식기본 정보 목록 조회 
 */
export const selectFormList = createAsyncThunk<FormListRVO, FormListPVO | undefined>(
  '/form/selectFormList',
  async (params: FormListPVO = {}) => {
    try {
      const res = await https.post(selectFormListApiPath(), params);

      // ✅ 여기서 “서버 응답”을 표준 형태로 맞춰서 return
      const payload = res.data;

      // 서버가 Form[] 형식으로 주므로 FormListRVO 형식으로 데이터 구조 재조정 
      return {
        list: Array.isArray(payload) ? payload : [],
        totalCount: Array.isArray(payload) ? payload.length : 0
      } as FormListRVO;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("FormThunks selectFormList mockFormList=",mockFormList);
      const filtered = mockFormList.filter((n) => {
        //if (!params.searchWrd) return true;
        //const v = (params.searchCnd === 'content' ? n.content : n.title) || '';
        //return v.includes(params.searchWrd);
        return true; // edit !! 
      });

      const result: FormListRVO = { list: filtered as FormRVO[], totalCount: filtered.length }
      return result;
    }
  }
)

/**
 * 대국민포털_양식기본 정보 조회 
 */
export const getForm = createAsyncThunk<FormRVO, FormPVO | undefined>(
  '/form/getForm',
  async (params: FormPVO = {}) => {
    try {
      const res = await https.post(getFormApiPath(), params);

      const payload = res.data;

      // 서버가 FormRVO 형식으로 단 건 데이터를 반환함. 
      return payload;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("FormThunks getForm mockFormList=",mockFormList);
      return (mockFormList).find((n) => 
      ) || null;
    }
  }
)

/**
 * 대국민포털_양식기본 입력 
 */
export const insertForm = createAsyncThunk<number, FormPVO>(
  '/form/insertForm',
  async (params: FormPVO) => {
    try {
      const res = await https.post(insertFormApiPath(), params);

      const insertCnt = res.data;

      // 입력된 건수 반환함. 
      return insertCnt;
    }
    catch (e) {
      console.log("FormThunks insertForm");
      return -1;
    }
  }
)

/**
 * 대국민포털_양식기본 수정 
 */
export const updateForm = createAsyncThunk<number, FormPVO>(
  '/form/updateForm',
  async (params: FormPVO) => {
    try {
      const res = await https.post(updateFormApiPath(), params);

      const updateCnt = res.data;

      // 수정된 건수 반환함. 
      return updateCnt;
    }
    catch (e) {
      console.log("FormThunks updateForm");
      return -1;
    }
  }
)

/**
 * 대국민포털_양식기본 저장 
 */
export const saveForm = createAsyncThunk<number, FormPVO>(
  '/form/saveForm',
  async (params: FormPVO) => {
    try {
      const res = await https.post(saveFormApiPath(), params);

      const saveCnt = res.data;

      // 저장된 건수 반환함. 
      return saveCnt;
    }
    catch (e) {
      console.log("FormThunks saveForm error!!");
      return -1;
    }
  }
)

/**
 * 대국민포털_양식기본 삭제 
 */
export const deleteForm = createAsyncThunk<number, FormDVO>(
  '/form/deleteForm',
  async (params: FormDVO) => {
    try {
      const res = await https.post(deleteFormApiPath(), params);

      const deleteCnt = res.data;

      // 삭제된 건수 반환함. 
      return deleteCnt;
    }
    catch (e) {
      console.log("FormThunks deleteForm error!!");
      return -1;
    }
  }
)

