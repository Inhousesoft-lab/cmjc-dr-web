/**
 * 대국민포털_메뉴기본 조회 목업 정보 
 */
export const mockMenuList = [
    { menuSn: 1000, menuNm: '주요 업무', upMenuSn: undefined, menuSeq: 1, menuTypeCd: 'MENU', depLevel: 1 },
    { menuSn: 1001, menuNm: '의약품 이상사례보고', upMenuSn: 1000, menuSeq: 1, menuTypeCd: 'MENU', depLevel: 2 },
    { menuSn: 1010, menuNm: '이상사례보고', upMenuSn: 1001, menuSeq: 1, menuTypeCd: 'MENU', depLevel: 3 },
    { menuSn: 1020, menuNm: '이상사례 보고란?', menuUrlAddr: '/safety/report1', upMenuSn: 1010, menuSeq: 1, menuTypeCd: 'PAGE', depLevel: 4 },
    { menuSn: 1021, menuNm: 'KAERS란?', menuUrlAddr: '/safety/report2', upMenuSn: 1010, menuSeq: 2, menuTypeCd: 'PAGE', depLevel: 4 },
    { menuSn: 1011, menuNm: '온라인 보고', upMenuSn: 1001, menuSeq: 2, menuTypeCd: 'MENU', depLevel: 3 },
    { menuSn: 1030, menuNm: '의약품이상사례', menuUrlAddr: 'https://nedrug.mfds.go.kr/CCCBA03F010/getReport', upMenuSn: 1011, menuSeq: 1, menuTypeCd: 'PAGE', depLevel: 4 },
    { menuSn: 1031, menuNm: '의약외품(생리대 등)', menuUrlAddr: 'https://nedrug.mfds.go.kr/CCCBA03F010/getReportQuasiDrug', upMenuSn: 1011, menuSeq: 2, menuTypeCd: 'PAGE', depLevel: 4 },
    { menuSn: 1012, menuNm: '오프라인 보고', menuUrlAddr: '/safety/report5', upMenuSn: 1001, menuSeq: 3, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 1013, menuNm: '이상사례보고자료실', menuUrlAddr: '/safety/report6', upMenuSn: 1001, menuSeq: 4, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 1014, menuNm: '온라인보고방법 안내', menuUrlAddr: '/safety/report7', upMenuSn: 1001, menuSeq: 5, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 1002, menuNm: '의약품 부작용 보고 자료', upMenuSn: 1000, menuSeq: 2, menuTypeCd: 'MENU', depLevel: 2 },
    { menuSn: 1040, menuNm: '의약품 부작용 보고1', upMenuSn: 1002, menuSeq: 1, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 1041, menuNm: '의약품 부작용 보고2', upMenuSn: 1002, menuSeq: 2, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 1042, menuNm: '의약품 부작용 보고3', upMenuSn: 1002, menuSeq: 3, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 1003, menuNm: '의약품 안전관리', upMenuSn: 1000, menuSeq: 3, menuTypeCd: 'MENU', depLevel: 2 },
    { menuSn: 1050, menuNm: '약물감시용어', upMenuSn: 1003, menuSeq: 1, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 1051, menuNm: '부작용 인과관계규명', upMenuSn: 1003, menuSeq: 2, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 1052, menuNm: '유관기관', upMenuSn: 1003, menuSeq: 3, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 1004, menuNm: '의약품.의료정보.연계분석', upMenuSn: 1000, menuSeq: 4, menuTypeCd: 'MENU', depLevel: 2 },
    { menuSn: 1060, menuNm: '의약품.의료정보.연계분석1', upMenuSn: 1004, menuSeq: 1, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 1061, menuNm: '의약품.의료정보.연계분석2', upMenuSn: 1004, menuSeq: 2, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 1062, menuNm: '의약품.의료정보.연계분석3', upMenuSn: 1004, menuSeq: 3, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 1005, menuNm: 'DUR 정보', upMenuSn: 1000, menuSeq: 5, menuTypeCd: 'MENU', depLevel: 2 },
    { menuSn: 1070, menuNm: 'DUR 이해', upMenuSn: 1005, menuSeq: 1, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 1071, menuNm: 'DUR 정보검색방', upMenuSn: 1005, menuSeq: 2, menuTypeCd: 'MENU', depLevel: 3 },
    { menuSn: 1080, menuNm: 'DUR 통합검색', upMenuSn: 1071, menuSeq: 1, menuTypeCd: 'PAGE', depLevel: 4 },
    { menuSn: 1081, menuNm: '병용금기', upMenuSn: 1071, menuSeq: 2, menuTypeCd: 'PAGE', depLevel: 4 },
    { menuSn: 1082, menuNm: '특정연령대금기', upMenuSn: 1071, menuSeq: 3, menuTypeCd: 'PAGE', depLevel: 4 },
    { menuSn: 1083, menuNm: '임부금기', upMenuSn: 1071, menuSeq: 4, menuTypeCd: 'PAGE', depLevel: 4 },
    { menuSn: 1084, menuNm: '효능군중복주의', upMenuSn: 1071, menuSeq: 5, menuTypeCd: 'PAGE', depLevel: 4 },
    { menuSn: 1085, menuNm: '용량주의', upMenuSn: 1071, menuSeq: 6, menuTypeCd: 'PAGE', depLevel: 4 },
    { menuSn: 1086, menuNm: '투여기간주의', upMenuSn: 1071, menuSeq: 7, menuTypeCd: 'PAGE', depLevel: 4 },
    { menuSn: 1087, menuNm: '노인주의', upMenuSn: 1071, menuSeq: 8, menuTypeCd: 'PAGE', depLevel: 4 },
    { menuSn: 1088, menuNm: '수유부주의', upMenuSn: 1071, menuSeq: 9, menuTypeCd: 'PAGE', depLevel: 4 },
    { menuSn: 1072, menuNm: '의약품 적정사용 정보방', upMenuSn: 1005, menuSeq: 3, menuTypeCd: 'MENU', depLevel: 3 },
    { menuSn: 1090, menuNm: '노인 적정사용정보집', upMenuSn: 1072, menuSeq: 1, menuTypeCd: 'PAGE', depLevel: 4 },
    { menuSn: 1091, menuNm: '소아 적정사용정보집', upMenuSn: 1072, menuSeq: 2, menuTypeCd: 'PAGE', depLevel: 4 },
    { menuSn: 1092, menuNm: '임부 적정사용정보집', upMenuSn: 1072, menuSeq: 3, menuTypeCd: 'PAGE', depLevel: 4 },
    { menuSn: 1093, menuNm: '간질환 적정사용정보집', upMenuSn: 1072, menuSeq: 4, menuTypeCd: 'PAGE', depLevel: 4 },
    { menuSn: 1094, menuNm: '신질환 적정사용정보집', upMenuSn: 1072, menuSeq: 5, menuTypeCd: 'PAGE', depLevel: 4 },
    { menuSn: 1073, menuNm: 'DUR 게시판', menuUrlAddr: '/dur/notice', upMenuSn: 1005, menuSeq: 4, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 1074, menuNm: 'DUR 제안', menuUrlAddr: '/dur/proposal', upMenuSn: 1005, menuSeq: 5, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 1006, menuNm: '부작용 피해구제', upMenuSn: 1000, menuSeq: 6, menuTypeCd: 'MENU', depLevel: 2 },
    { menuSn: 1110, menuNm: '제도소개', upMenuSn: 1006, menuSeq: 1, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 1111, menuNm: '피해구제 신청', upMenuSn: 1006, menuSeq: 2, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 1112, menuNm: '뉴스/소식', upMenuSn: 1006, menuSeq: 3, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 1113, menuNm: '자주하는 질문', menuUrlAddr: 'https://nedrug.mfds.go.kr', upMenuSn: 1006, menuSeq: 4, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 1007, menuNm: '임상시험안전지원', upMenuSn: 1000, menuSeq: 7, menuTypeCd: 'MENU', depLevel: 2 },
    { menuSn: 1120, menuNm: '임상시험안전지원기관', upMenuSn: 1007, menuSeq: 1, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 1121, menuNm: '협약 안내', upMenuSn: 1007, menuSeq: 2, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 1122, menuNm: '중앙IRB신청', upMenuSn: 1007, menuSeq: 3, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 1123, menuNm: '임상시험헬프데스크', upMenuSn: 1007, menuSeq: 4, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 1124, menuNm: '공지사항', upMenuSn: 1007, menuSeq: 5, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 1125, menuNm: '자료실', upMenuSn: 1007, menuSeq: 6, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 1100, menuNm: '정보공개', upMenuSn: undefined, menuSeq: 2, menuTypeCd: 'MENU', depLevel: 1 },
    { menuSn: 2000, menuNm: '정보공개', upMenuSn: 1100, menuSeq: 1, menuTypeCd: 'MENU', depLevel: 2 },
    { menuSn: 2010, menuNm: '업무처리절차', upMenuSn: 2000, menuSeq: 1, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 2011, menuNm: '정보공개 청구', menuUrlAddr: 'https://open.go.kr', upMenuSn: 2000, menuSeq: 2, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 2012, menuNm: '임직원국외출장', upMenuSn: 2000, menuSeq: 3, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 2013, menuNm: '원장 업무추진비 집행내역', upMenuSn: 2000, menuSeq: 4, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 2001, menuNm: '공공데이터 개방', upMenuSn: 1100, menuSeq: 2, menuTypeCd: 'PAGE', depLevel: 2 },
    { menuSn: 2002, menuNm: '경영공시', upMenuSn: 1100, menuSeq: 3, menuTypeCd: 'MENU', depLevel: 2 },
    { menuSn: 2020, menuNm: '부패행위 징계현황', upMenuSn: 2002, menuSeq: 1, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 2021, menuNm: '징계기준', upMenuSn: 2002, menuSeq: 2, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 2022, menuNm: '징계현황', upMenuSn: 2002, menuSeq: 3, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 2003, menuNm: '사업실명제', upMenuSn: 1100, menuSeq: 4, menuTypeCd: 'PAGE', depLevel: 2 },
    { menuSn: 1200, menuNm: '기관소식', upMenuSn: undefined, menuSeq: 3, menuTypeCd: 'MENU', depLevel: 1 },
    { menuSn: 3000, menuNm: '공지사항', menuUrlAddr: '/notice', upMenuSn: 1200, menuSeq: 1, menuTypeCd: 'PAGE', depLevel: 2 },
    { menuSn: 3001, menuNm: '채용게시판', upMenuSn: 1200, menuSeq: 2, menuTypeCd: 'PAGE', depLevel: 2 },
    { menuSn: 3002, menuNm: 'FAQ', upMenuSn: 1200, menuSeq: 3, menuTypeCd: 'PAGE', depLevel: 2 },
    { menuSn: 3003, menuNm: '국민신문고', upMenuSn: 1200, menuSeq: 4, menuTypeCd: 'PAGE', depLevel: 2 },
    { menuSn: 3004, menuNm: '보도자료', upMenuSn: 1200, menuSeq: 5, menuTypeCd: 'PAGE', depLevel: 2 },
    { menuSn: 3005, menuNm: '뉴스레터', upMenuSn: 1200, menuSeq: 6, menuTypeCd: 'MENU', depLevel: 2 },
    { menuSn: 3010, menuNm: '첨단바이오 포커스', menuUrlAddr: 'https://ltfu.mfds.go.kr', upMenuSn: 3005, menuSeq: 1, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 3011, menuNm: '마약류 안전정보지', upMenuSn: 3005, menuSeq: 2, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 3012, menuNm: '리플릿', upMenuSn: 3005, menuSeq: 3, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 3006, menuNm: '카드뉴스', upMenuSn: 1200, menuSeq: 7, menuTypeCd: 'PAGE', depLevel: 2 },
    { menuSn: 3007, menuNm: '동영상', upMenuSn: 1200, menuSeq: 8, menuTypeCd: 'PAGE', depLevel: 2 },
    { menuSn: 3008, menuNm: '자료실', upMenuSn: 1200, menuSeq: 9, menuTypeCd: 'PAGE', depLevel: 2 },
    { menuSn: 1300, menuNm: '기관소개', upMenuSn: undefined, menuSeq: 4, menuTypeCd: 'MENU', depLevel: 1 },
    { menuSn: 4000, menuNm: '기관장 인사말', upMenuSn: 1300, menuSeq: 1, menuTypeCd: 'PAGE', depLevel: 2 },
    { menuSn: 4001, menuNm: '역대 기관장', upMenuSn: 1300, menuSeq: 2, menuTypeCd: 'PAGE', depLevel: 2 },
    { menuSn: 4002, menuNm: '연혁', upMenuSn: 1300, menuSeq: 3, menuTypeCd: 'PAGE', depLevel: 2 },
    { menuSn: 4003, menuNm: '비전 및 목표', upMenuSn: 1300, menuSeq: 4, menuTypeCd: 'PAGE', depLevel: 2 },
    { menuSn: 4004, menuNm: '조직도', upMenuSn: 1300, menuSeq: 5, menuTypeCd: 'PAGE', depLevel: 2 },
    { menuSn: 4005, menuNm: '설립근거 및 관련법령', upMenuSn: 1300, menuSeq: 6, menuTypeCd: 'PAGE', depLevel: 2 },
    { menuSn: 4006, menuNm: '고객헌장', upMenuSn: 1300, menuSeq: 7, menuTypeCd: 'PAGE', depLevel: 2 },
    { menuSn: 4007, menuNm: '우리원동정', upMenuSn: 1300, menuSeq: 8, menuTypeCd: 'PAGE', depLevel: 2 },
    { menuSn: 4008, menuNm: 'CI소개', upMenuSn: 1300, menuSeq: 9, menuTypeCd: 'PAGE', depLevel: 2 },
    { menuSn: 4009, menuNm: '윤리경영', upMenuSn: 1300, menuSeq: 10, menuTypeCd: 'MENU', depLevel: 2 },
    { menuSn: 4012, menuNm: '클린신고센터', upMenuSn: 4009, menuSeq: 1, menuTypeCd: 'PAGE', depLevel: 3 },
    { menuSn: 4010, menuNm: '캐릭터소개', upMenuSn: 1300, menuSeq: 11, menuTypeCd: 'PAGE', depLevel: 2 },
    { menuSn: 4011, menuNm: '오시는 길', menuUrlAddr: 'https://www.drugsafe.or.kr/iwt/ds/ko/introduction/EgovLocation.do', upMenuSn: 1300, menuSeq: 12, menuTypeCd: 'PAGE', depLevel: 2 }
]

/**
 * 대국민포털_메뉴기본 조회/입력/수정/저장 파라메터 정보 
 */
export interface MenuPVO {
  /** 메뉴명 */
  menuNm?: string

  /** 업무구분코드 */
  taskSeCd?: string

  /** 메뉴유형코드 */
  menuTypeCd?: string

  /** 메뉴순서 */
  menuSeq?: number

  /** 메뉴설명 */
  menuExpln?: string

  /** 언어구분코드 */
  langSeCd?: string

  /** 담당자부서명 */
  picDeptNm?: string

  /** 담당자성명 */
  picFlnm?: string

  /** 사용여부 */
  useYn?: string

  /** 등록자아이디 */
  rgtrId?: string

  /** 등록일시 */
  regDt?: string

  /** 등록프로그램아이디 */
  regPrgrmId?: string

  /** 수정자아이디 */
  mdfrId?: string

  /** 수정일시 */
  mdfcnDt?: string

  /** 수정프로그램아이디 */
  mdfcnPrgrmId?: string
}

/**
 * 대국민포털_메뉴기본 정보 
 */
export interface MenuRVO {
  /** 순번 */
  no?: 1

  /** 메뉴일련번호 */
  menuSn?: number

  /** 메뉴명 */
  menuNm?: string

  /** 업무구분코드 */
  taskSeCd?: string

  /** 언어구분코드 */
  langSeCd?: string

  /**  메뉴URL주소(UI의 Router에서의 메뉴경로 ex) /dur/proposal ) */
  menuUrlAddr?: string

  /** 상위메뉴일련번호 */
  upMenuSn?: number

  /** 메뉴레벨(1 - root menu, 2 - second menu, 3 - third menu) */
  depLevel?: number

  /** Root 메뉴일련번호 */
  rootSn?: number

  /** 메뉴유형코드(MENU - 메뉴, PAGE - 화면(LEAF MENU)) */
  menuTypeCd?: string

  /** 메뉴 경로( '>' 구분 ex)4 > 12, 4 > 12 > 14 ) */
  path?: string

  /** 메뉴순서 */
  menuSeq?: number

  /** 메뉴설명 */
  menuExpln?: string

  /** 담당자부서명 */
  picDeptNm?: string

  /** 담당자성명 */
  picFlnm?: string

  /** 사용여부 */
  useYn?: string

  /** 등록자아이디 */
  rgtrId?: string

  /** 등록일시 */
  regDt?: string

  /** 등록프로그램아이디 */
  regPrgrmId?: string

  /** 수정자아이디 */
  mdfrId?: string

  /** 수정일시 */
  mdfcnDt?: string

  /** 수정프로그램아이디 */
  mdfcnPrgrmId?: string

}

/**
 * 대국민포털_메뉴기본 목록 조회용 파라메터 정보 
 */
export interface MenuListPVO {
  /** 언어구분코드 */
  langSeCd?: string

  /**  메뉴URL주소(UI의 Router에서의 메뉴경로 ex) /dur/proposal ) */
  menuUrlAddr?: string
}

/**
 * 대국민포털_메뉴기본 정보 목록 
 */
export interface MenuListRVO {
  list: MenuRVO[]
  totalCount: number
}

/**
 * 대국민포털_메뉴기본 삭제 파라메터 정보 
 */
export interface MenuDVO {
}

