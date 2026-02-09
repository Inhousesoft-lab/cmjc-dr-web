import { createAsyncThunk } from '@reduxjs/toolkit'
import https from '@/api/axiosInstance'
import { selectOrgchtListApiPath, getOrgchtApiPath, insertOrgchtApiPath, updateOrgchtApiPath, saveOrgchtApiPath, deleteOrgchtApiPath } from '@/api/dep/OrgchtApiPaths'
import { mockOrgchtList, OrgchtPVO, OrgchtRVO, OrgchtListPVO, OrgchtListRVO, OrgchtDVO  } from './OrgchtTypes'

/**
 * 대국민포털_KIDS조직도기본 정보 목록 조회 
 */
export const selectOrgchtList = createAsyncThunk<OrgchtListRVO, OrgchtListPVO | undefined>(
  '/dep/selectOrgchtList',
  async (params: OrgchtListPVO = {}) => {
    try {
      const res = await https.post(selectOrgchtListApiPath(), params);

      // ✅ 여기서 “서버 응답”을 표준 형태로 맞춰서 return
      const payload = res.data;

      // 서버가 Orgcht[] 형식으로 주므로 OrgchtListRVO 형식으로 데이터 구조 재조정 
      return {
        list: Array.isArray(payload) ? payload : [],
        totalCount: Array.isArray(payload) ? payload.length : 0
      } as OrgchtListRVO;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("OrgchtThunks selectOrgchtList mockOrgchtList=",mockOrgchtList);
      const filtered = mockOrgchtList.filter((n) => {
        //if (!params.searchWrd) return true;
        //const v = (params.searchCnd === 'content' ? n.content : n.title) || '';
        //return v.includes(params.searchWrd);
        return true; // edit !! 
      });

      const result: OrgchtListRVO = { list: filtered as OrgchtRVO[], totalCount: filtered.length }
      return result;
    }
  }
)

/**
 * 대국민포털_KIDS조직도기본 정보 조회 
 */
export const getOrgcht = createAsyncThunk<OrgchtRVO, OrgchtPVO | undefined>(
  '/dep/getOrgcht',
  async (params: OrgchtPVO = {}) => {
    try {
      const res = await https.post(getOrgchtApiPath(), params);

      const payload = res.data;

      // 서버가 OrgchtRVO 형식으로 단 건 데이터를 반환함. 
      return payload;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("OrgchtThunks getOrgcht mockOrgchtList=",mockOrgchtList);
      return (mockOrgchtList).find((n) => 
        String(n.empNo) === String(params.empNo)
      ) || null;
    }
  }
)

/**
 * 대국민포털_KIDS조직도기본 입력 
 */
export const insertOrgcht = createAsyncThunk<number, OrgchtPVO>(
  '/dep/insertOrgcht',
  async (params: OrgchtPVO) => {
    try {
      const res = await https.post(insertOrgchtApiPath(), params);

      const insertCnt = res.data;

      // 입력된 건수 반환함. 
      return insertCnt;
    }
    catch (e) {
      console.log("OrgchtThunks insertOrgcht");
      return -1;
    }
  }
)

/**
 * 대국민포털_KIDS조직도기본 수정 
 */
export const updateOrgcht = createAsyncThunk<number, OrgchtPVO>(
  '/dep/updateOrgcht',
  async (params: OrgchtPVO) => {
    try {
      const res = await https.post(updateOrgchtApiPath(), params);

      const updateCnt = res.data;

      // 수정된 건수 반환함. 
      return updateCnt;
    }
    catch (e) {
      console.log("OrgchtThunks updateOrgcht");
      return -1;
    }
  }
)

/**
 * 대국민포털_KIDS조직도기본 저장 
 */
export const saveOrgcht = createAsyncThunk<number, OrgchtPVO>(
  '/dep/saveOrgcht',
  async (params: OrgchtPVO) => {
    try {
      const res = await https.post(saveOrgchtApiPath(), params);

      const saveCnt = res.data;

      // 저장된 건수 반환함. 
      return saveCnt;
    }
    catch (e) {
      console.log("OrgchtThunks saveOrgcht error!!");
      return -1;
    }
  }
)

/**
 * 대국민포털_KIDS조직도기본 삭제 
 */
export const deleteOrgcht = createAsyncThunk<number, OrgchtDVO>(
  '/dep/deleteOrgcht',
  async (params: OrgchtDVO) => {
    try {
      const res = await https.post(deleteOrgchtApiPath(), params);

      const deleteCnt = res.data;

      // 삭제된 건수 반환함. 
      return deleteCnt;
    }
    catch (e) {
      console.log("OrgchtThunks deleteOrgcht error!!");
      return -1;
    }
  }
)

