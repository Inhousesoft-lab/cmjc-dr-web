import { createAsyncThunk } from '@reduxjs/toolkit'
import https from '@/api/axiosInstance'
import { selectWordListApiPath, getWordApiPath, insertWordApiPath, updateWordApiPath, saveWordApiPath, deleteWordApiPath } from '@/api/word/WordApiPaths'
import { mockWordList, WordPVO, WordRVO, WordListPVO, WordListRVO, WordDVO  } from './WordTypes'

/**
 * 대국민포털_단어기본 정보 목록 조회 
 */
export const selectWordList = createAsyncThunk<WordListRVO, WordListPVO | undefined>(
  '/word/selectWordList',
  async (params: WordListPVO = {}) => {
    try {
      const res = await https.post(selectWordListApiPath(), params);

      // ✅ 여기서 “서버 응답”을 표준 형태로 맞춰서 return
      const payload = res.data;

      // 서버가 Word[] 형식으로 주므로 WordListRVO 형식으로 데이터 구조 재조정 
      return {
        list: Array.isArray(payload) ? payload : [],
        totalCount: Array.isArray(payload) ? payload.length : 0
      } as WordListRVO;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("WordThunks selectWordList mockWordList=",mockWordList);
      const filtered = mockWordList.filter((n) => {
        //if (!params.searchWrd) return true;
        //const v = (params.searchCnd === 'content' ? n.content : n.title) || '';
        //return v.includes(params.searchWrd);
        return true; // edit !! 
      });

      const result: WordListRVO = { list: filtered as WordRVO[], totalCount: filtered.length }
      return result;
    }
  }
)

/**
 * 대국민포털_단어기본 정보 조회 
 */
export const getWord = createAsyncThunk<WordRVO, WordPVO | undefined>(
  '/word/getWord',
  async (params: WordPVO = {}) => {
    try {
      const res = await https.post(getWordApiPath(), params);

      const payload = res.data;

      // 서버가 WordRVO 형식으로 단 건 데이터를 반환함. 
      return payload;
    }
    // 서버가 없거나 에러 나면 강제로 mock 데이터 사용 
    catch (e) {
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)
      console.log("WordThunks getWord mockWordList=",mockWordList);
      return (mockWordList).find((n) => 
        String(n.comStdWordNm) === String(params.comStdWordNm)
      ) || null;
    }
  }
)

/**
 * 대국민포털_단어기본 입력 
 */
export const insertWord = createAsyncThunk<number, WordPVO>(
  '/word/insertWord',
  async (params: WordPVO) => {
    try {
      const res = await https.post(insertWordApiPath(), params);

      const insertCnt = res.data;

      // 입력된 건수 반환함. 
      return insertCnt;
    }
    catch (e) {
      console.log("WordThunks insertWord");
      return -1;
    }
  }
)

/**
 * 대국민포털_단어기본 수정 
 */
export const updateWord = createAsyncThunk<number, WordPVO>(
  '/word/updateWord',
  async (params: WordPVO) => {
    try {
      const res = await https.post(updateWordApiPath(), params);

      const updateCnt = res.data;

      // 수정된 건수 반환함. 
      return updateCnt;
    }
    catch (e) {
      console.log("WordThunks updateWord");
      return -1;
    }
  }
)

/**
 * 대국민포털_단어기본 저장 
 */
export const saveWord = createAsyncThunk<number, WordPVO>(
  '/word/saveWord',
  async (params: WordPVO) => {
    try {
      const res = await https.post(saveWordApiPath(), params);

      const saveCnt = res.data;

      // 저장된 건수 반환함. 
      return saveCnt;
    }
    catch (e) {
      console.log("WordThunks saveWord error!!");
      return -1;
    }
  }
)

/**
 * 대국민포털_단어기본 삭제 
 */
export const deleteWord = createAsyncThunk<number, WordDVO>(
  '/word/deleteWord',
  async (params: WordDVO) => {
    try {
      const res = await https.post(deleteWordApiPath(), params);

      const deleteCnt = res.data;

      // 삭제된 건수 반환함. 
      return deleteCnt;
    }
    catch (e) {
      console.log("WordThunks deleteWord error!!");
      return -1;
    }
  }
)

