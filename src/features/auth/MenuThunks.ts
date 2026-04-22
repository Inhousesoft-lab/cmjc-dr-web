import { createAsyncThunk } from "@reduxjs/toolkit";
import https from "@/api/axiosInstance";
import {
  selectMenuListApiPath,
  getMenuApiPath,
  insertMenuApiPath,
  updateMenuApiPath,
  saveMenuApiPath,
  deleteMenuApiPath,
} from "@/api/auth/MenuApiPaths";
import {
  mockMenuList,
  MenuPVO,
  MenuRVO,
  MenuListPVO,
  MenuListRVO,
  MenuDVO,
} from "./MenuTypes";

// ✅ RootState 타입이 프로젝트에 있으면 그걸 쓰는 게 베스트.
// 지금은 예시로 최소 형태만 잡아둠(컴파일 통과용).
type RootStateLike = {
  menu: {
    list: MenuRVO[];
    loading: boolean;
    langSeCd: string | null;
    loaded: boolean;
  };
};

/**
 * 대국민포털_메뉴기본 정보 목록 조회
 * Rest Api Result JSON
 * {
 *  "code": "0",
 *  "msg": "성공",
 *  "data": {
 *      "list": [
 *          {
 *              "menuSn": 1000,
 *              "menuNm": "주요 업무",
 *              "taskSeCd": null,
 *              "langSeCd": "ko",
 *              "menuUrlAddr": null,
 *              "upMenuSn": null,
 *              "depLevel": 1,
 *              "rootSn": 1000,
 *              "menuTypeCd": null,
 *              "path": "1000",
 *              "menuSeq": 1,
 *              "menuExpln": null,
 *              "picDeptNm": null,
 *              "picFlnm": null,
 *              "useYn": null,
 *              "rgtrId": null,
 *              "regDt": null,
 *              "regPrgrmId": null,
 *              "mdfrId": null,
 *              "mdfcnDt": null,
 *              "mdfcnPrgrmId": null
 *          },
 *          {
 *              "menuSn": 1001,
 *              "menuNm": "의약품 이상사례보고",
 *              "taskSeCd": null,
 *              "langSeCd": "ko",
 *              "menuUrlAddr": null,
 *              "upMenuSn": 1000,
 *              "depLevel": 2,
 *              "rootSn": 1000,
 *              "menuTypeCd": null,
 *              "path": "1000 > 1001",
 *              "menuSeq": 1,
 *              "menuExpln": null,
 *              "picDeptNm": null,
 *              "picFlnm": null,
 *              "useYn": null,
 *              "rgtrId": null,
 *              "regDt": null,
 *              "regPrgrmId": null,
 *              "mdfrId": null,
 *              "mdfcnDt": null,
 *              "mdfcnPrgrmId": null
 *          },
 *           ~~
 *           ~~
 *      ]
 *   }
 * }
 */
export const selectMenuList = createAsyncThunk<
  MenuListRVO,
  MenuListPVO | undefined,
  { state: RootStateLike }
>(
  "/auth/selectMenuList",
  async (params: MenuListPVO = {}) => {
    try {
      const res = await https.post(selectMenuListApiPath(), params);

      // 여기서 “서버 응답”을 표준 형태로 맞춰서 return
      const payload = res.data.data?.list;

      // 서버가 Menu[] 형식으로 주므로 MenuListRVO 형식으로 데이터 구조 재조정
      return {
        list: Array.isArray(payload) ? payload : [],
        totalCount: Array.isArray(payload) ? payload.length : 0,
      } as MenuListRVO;
    } catch (e) {
      // 서버가 없거나 에러 나면 강제로 mock 데이터 사용
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)

      const filtered = mockMenuList.filter((n) => {
        //if (!params.searchWrd) return true;
        //const v = (params.searchCnd === 'content' ? n.content : n.title) || '';
        //return v.includes(params.searchWrd);
        return true; // edit !!
      });

      const result: MenuListRVO = {
        list: filtered as MenuRVO[],
        totalCount: filtered.length,
      };
      return result;
    }
  },
  {
    /* selectMenuList Thunk 이 Redex state 의 값에 따라 호출할지 말지 결정 */
    condition: (params, { getState }) => {
      const state = getState();

      // ✅ 요청 언어(없으면 현재 저장된 언어 기준)
      const desiredLang = params?.langSeCd ?? state.menu.langSeCd ?? null;

      // ✅ 이미 같은 언어 메뉴가 로드돼 있으면 스킵
      const hasMenu = state.menu.list?.length > 0;
      const sameLang = state.menu.langSeCd === desiredLang;

      if (state.menu.loading) return false; // 중복 호출 방지

      // 조회된 메뉴 목록이 없어서 빈 배열이어도 "해당 언어로 이미 로드됨"이면 재호출 막기
      if (state.menu.loaded && sameLang) return false; // hasMenu 제거, 조회된 메뉴 목록이 없으면 []이므로 state.menu.list?.length = 0 이고, hasMenu=false가 되어서 무한 조회되는 현상 발생!!

      return true; // 호출 필요
    },
  },
);

/**
 * 대국민포털_메뉴기본 정보 조회
 */
export const getMenu = createAsyncThunk<MenuRVO, MenuPVO | undefined>(
  "/auth/getMenu",
  async (params: MenuPVO = {}) => {
    try {
      const res = await https.post(getMenuApiPath(), params);

      const payload = res.data;

      // 서버가 MenuRVO 형식으로 단 건 데이터를 반환함.
      return payload;
    } catch (e) {
      // 서버가 없거나 에러 나면 강제로 mock 데이터 사용
      // 개발/데모 환경용 fallback (백엔드 연동 시 제거 가능)

      return mockMenuList.find((n) => n) || null;
    }
  },
);

/**
 * 대국민포털_메뉴기본 입력
 */
export const insertMenu = createAsyncThunk<number, MenuPVO>(
  "/auth/insertMenu",
  async (params: MenuPVO) => {
    try {
      const res = await https.post(insertMenuApiPath(), params);

      const insertCnt = res.data;

      // 입력된 건수 반환함.
      return insertCnt;
    } catch (e) {
      return -1;
    }
  },
);

/**
 * 대국민포털_메뉴기본 수정
 */
export const updateMenu = createAsyncThunk<number, MenuPVO>(
  "/auth/updateMenu",
  async (params: MenuPVO) => {
    try {
      const res = await https.post(updateMenuApiPath(), params);

      const updateCnt = res.data;

      // 수정된 건수 반환함.
      return updateCnt;
    } catch (e) {
      return -1;
    }
  },
);

/**
 * 대국민포털_메뉴기본 저장
 */
export const saveMenu = createAsyncThunk<number, MenuPVO>(
  "/auth/saveMenu",
  async (params: MenuPVO) => {
    try {
      const res = await https.post(saveMenuApiPath(), params);

      const saveCnt = res.data;

      // 저장된 건수 반환함.
      return saveCnt;
    } catch (e) {
      return -1;
    }
  },
);

/**
 * 대국민포털_메뉴기본 삭제
 */
export const deleteMenu = createAsyncThunk<number, MenuDVO>(
  "/auth/deleteMenu",
  async (params: MenuDVO) => {
    try {
      const res = await https.post(deleteMenuApiPath(), params);

      const deleteCnt = res.data;

      // 삭제된 건수 반환함.
      return deleteCnt;
    } catch (e) {
      return -1;
    }
  },
);
