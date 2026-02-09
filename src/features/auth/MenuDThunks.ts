import { createAsyncThunk } from '@reduxjs/toolkit'
import https from '@/api/axiosInstance'
import { selectMenuDListApiPath, getMenuDApiPath, insertMenuDApiPath, updateMenuDApiPath, saveMenuDApiPath, deleteMenuDApiPath } from '@/api/auth/MenuDApiPaths'
import { mockMenuDList, MenuDPVO, MenuDRVO, MenuDListPVO, MenuDListRVO, MenuDDVO  } from './MenuDTypes'

/**
 * 대국민포털_메뉴상세 정보 목록 조회 
 */
export const selectMenuDList = createAsyncThunk<MenuDListRVO, MenuDListPVO | undefined>(
  '/auth/selectMenuDList',
  async (params: MenuDListPVO = {}) => {
    try {
      const res = await https.post(selectMenuDListApiPath(), params);

      // ✅ 여기서 “서버 응답”을 표준 형태로 맞춰서 return
      const payload = res.data;

      // 서버가 MenuD[] 형식으로 주므로 MenuDListRVO 형식으로 데이터 구조 재조정 
      return {
        list: Array.isArray(payload) ? payload : [],
        totalCount: Array.isArray(payload) ? payload.length : 0
      } as MenuDListRVO;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("MenuDThunks selectMenuDList mockMenuDList=",mockMenuDList);
      const filtered = mockMenuDList.filter((n) => {
        //if (!params.searchWrd) return true;
        //const v = (params.searchCnd === 'content' ? n.content : n.title) || '';
        //return v.includes(params.searchWrd);
        return true; // edit !! 
      });

      const result: MenuDListRVO = { list: filtered as MenuDRVO[], totalCount: filtered.length }
      return result;
    }
  }
)

/**
 * 대국민포털_메뉴상세 정보 조회 
 */
export const getMenuD = createAsyncThunk<MenuDRVO, MenuDPVO | undefined>(
  '/auth/getMenuD',
  async (params: MenuDPVO = {}) => {
    try {
      const res = await https.post(getMenuDApiPath(), params);

      const payload = res.data;

      // 서버가 MenuDRVO 형식으로 단 건 데이터를 반환함. 
      return payload;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("MenuDThunks getMenuD mockMenuDList=",mockMenuDList);
      return (mockMenuDList).find((n) => 
      ) || null;
    }
  }
)

/**
 * 대국민포털_메뉴상세 입력 
 */
export const insertMenuD = createAsyncThunk<number, MenuDPVO>(
  '/auth/insertMenuD',
  async (params: MenuDPVO) => {
    try {
      const res = await https.post(insertMenuDApiPath(), params);

      const insertCnt = res.data;

      // 입력된 건수 반환함. 
      return insertCnt;
    }
    catch (e) {
      console.log("MenuDThunks insertMenuD");
      return -1;
    }
  }
)

/**
 * 대국민포털_메뉴상세 수정 
 */
export const updateMenuD = createAsyncThunk<number, MenuDPVO>(
  '/auth/updateMenuD',
  async (params: MenuDPVO) => {
    try {
      const res = await https.post(updateMenuDApiPath(), params);

      const updateCnt = res.data;

      // 수정된 건수 반환함. 
      return updateCnt;
    }
    catch (e) {
      console.log("MenuDThunks updateMenuD");
      return -1;
    }
  }
)

/**
 * 대국민포털_메뉴상세 저장 
 */
export const saveMenuD = createAsyncThunk<number, MenuDPVO>(
  '/auth/saveMenuD',
  async (params: MenuDPVO) => {
    try {
      const res = await https.post(saveMenuDApiPath(), params);

      const saveCnt = res.data;

      // 저장된 건수 반환함. 
      return saveCnt;
    }
    catch (e) {
      console.log("MenuDThunks saveMenuD error!!");
      return -1;
    }
  }
)

/**
 * 대국민포털_메뉴상세 삭제 
 */
export const deleteMenuD = createAsyncThunk<number, MenuDDVO>(
  '/auth/deleteMenuD',
  async (params: MenuDDVO) => {
    try {
      const res = await https.post(deleteMenuDApiPath(), params);

      const deleteCnt = res.data;

      // 삭제된 건수 반환함. 
      return deleteCnt;
    }
    catch (e) {
      console.log("MenuDThunks deleteMenuD error!!");
      return -1;
    }
  }
)

