import { createAsyncThunk } from '@reduxjs/toolkit'
import https from '@/api/axiosInstance'
import { selectPopupListApiPath, getPopupApiPath, insertPopupApiPath, updatePopupApiPath, savePopupApiPath, deletePopupApiPath } from '@/api/popup/PopupApiPaths'
import { mockPopupList, PopupPVO, PopupRVO, PopupListPVO, PopupListRVO, PopupDVO  } from './PopupTypes'

/**
 * 대국민포털_팝업기본 정보 목록 조회 
 */
export const selectPopupList = createAsyncThunk<PopupListRVO, PopupListPVO | undefined>(
  '/popup/selectPopupList',
  async (params: PopupListPVO = {}) => {
    try {
      const res = await https.post(selectPopupListApiPath(), params);

      // ✅ 여기서 “서버 응답”을 표준 형태로 맞춰서 return
      const payload = res.data;

      // 서버가 Popup[] 형식으로 주므로 PopupListRVO 형식으로 데이터 구조 재조정 
      return {
        list: Array.isArray(payload) ? payload : [],
        totalCount: Array.isArray(payload) ? payload.length : 0
      } as PopupListRVO;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("PopupThunks selectPopupList mockPopupList=",mockPopupList);
      const filtered = mockPopupList.filter((n) => {
        //if (!params.searchWrd) return true;
        //const v = (params.searchCnd === 'content' ? n.content : n.title) || '';
        //return v.includes(params.searchWrd);
        return true; // edit !! 
      });

      const result: PopupListRVO = { list: filtered as PopupRVO[], totalCount: filtered.length }
      return result;
    }
  }
)

/**
 * 대국민포털_팝업기본 정보 조회 
 */
export const getPopup = createAsyncThunk<PopupRVO, PopupPVO | undefined>(
  '/popup/getPopup',
  async (params: PopupPVO = {}) => {
    try {
      const res = await https.post(getPopupApiPath(), params);

      const payload = res.data;

      // 서버가 PopupRVO 형식으로 단 건 데이터를 반환함. 
      return payload;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("PopupThunks getPopup mockPopupList=",mockPopupList);
      return (mockPopupList).find((n) => 
      ) || null;
    }
  }
)

/**
 * 대국민포털_팝업기본 입력 
 */
export const insertPopup = createAsyncThunk<number, PopupPVO>(
  '/popup/insertPopup',
  async (params: PopupPVO) => {
    try {
      const res = await https.post(insertPopupApiPath(), params);

      const insertCnt = res.data;

      // 입력된 건수 반환함. 
      return insertCnt;
    }
    catch (e) {
      console.log("PopupThunks insertPopup");
      return -1;
    }
  }
)

/**
 * 대국민포털_팝업기본 수정 
 */
export const updatePopup = createAsyncThunk<number, PopupPVO>(
  '/popup/updatePopup',
  async (params: PopupPVO) => {
    try {
      const res = await https.post(updatePopupApiPath(), params);

      const updateCnt = res.data;

      // 수정된 건수 반환함. 
      return updateCnt;
    }
    catch (e) {
      console.log("PopupThunks updatePopup");
      return -1;
    }
  }
)

/**
 * 대국민포털_팝업기본 저장 
 */
export const savePopup = createAsyncThunk<number, PopupPVO>(
  '/popup/savePopup',
  async (params: PopupPVO) => {
    try {
      const res = await https.post(savePopupApiPath(), params);

      const saveCnt = res.data;

      // 저장된 건수 반환함. 
      return saveCnt;
    }
    catch (e) {
      console.log("PopupThunks savePopup error!!");
      return -1;
    }
  }
)

/**
 * 대국민포털_팝업기본 삭제 
 */
export const deletePopup = createAsyncThunk<number, PopupDVO>(
  '/popup/deletePopup',
  async (params: PopupDVO) => {
    try {
      const res = await https.post(deletePopupApiPath(), params);

      const deleteCnt = res.data;

      // 삭제된 건수 반환함. 
      return deleteCnt;
    }
    catch (e) {
      console.log("PopupThunks deletePopup error!!");
      return -1;
    }
  }
)

