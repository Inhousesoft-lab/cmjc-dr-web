/**
 * 대국민포털_권한변경이력기본 조회 목업 정보 
 */
export const mockAuthrtChgHstryList = [
  {
    /** 순번 */
    no: 1,

    /** 권한코드 */
    authrtCd: 'XXX',

    /** 메뉴일련번호 */
    menuSn: 'XXX',

    /** 적용대상유형 */
    aplcnTrgtType: 'XXX',

    /** 변경역할목록 */
    chgRoleList: 'XXX',

    /** 적용대상 */
    aplcnTrgt: 'XXX',

    /** 변경유형 */
    chgType: 'XXX',

    /** 비고 */
    rmrk: 'XXX',

    /** 등록자아이디 */
    rgtrId: 'XXX',

    /** 등록일시 */
    regDt: '2026-01-23',

    /** 등록프로그램아이디 */
    regPrgrmId: 'XXX',

    /** 수정자아이디 */
    mdfrId: 'XXX',

    /** 수정일시 */
    mdfcnDt: '2026-01-23',

    /** 수정프로그램아이디 */
    mdfcnPrgrmId: 'XXX',

  }
]

/**
 * 대국민포털_권한변경이력기본 조회/입력/수정/저장 파라메터 정보 
 */
export interface AuthrtChgHstryPVO {
  /** 권한코드 */
  authrtCd?: string

  /** 메뉴일련번호 */
  menuSn?: string

  /** 적용대상유형 */
  aplcnTrgtType?: string

  /** 변경역할목록 */
  chgRoleList?: string

  /** 적용대상 */
  aplcnTrgt?: string

  /** 변경유형 */
  chgType?: string

  /** 비고 */
  rmrk?: string

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
 * 대국민포털_권한변경이력기본 정보 
 */
export interface AuthrtChgHstryRVO {
  /** 순번 */
  no?: 1

  /** 권한코드 */
  authrtCd?: string

  /** 메뉴일련번호 */
  menuSn?: string

  /** 적용대상유형 */
  aplcnTrgtType?: string

  /** 변경역할목록 */
  chgRoleList?: string

  /** 적용대상 */
  aplcnTrgt?: string

  /** 변경유형 */
  chgType?: string

  /** 비고 */
  rmrk?: string

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
 * 대국민포털_권한변경이력기본 목록 조회용 파라메터 정보 
 */
export interface AuthrtChgHstryListPVO {
  /** 권한코드 */
  authrtCd?: string

  /** 메뉴일련번호 */
  menuSn?: string

  /** 적용대상유형 */
  aplcnTrgtType?: string

  /** 변경역할목록 */
  chgRoleList?: string

  /** 적용대상 */
  aplcnTrgt?: string

  /** 변경유형 */
  chgType?: string

  /** 비고 */
  rmrk?: string

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
 * 대국민포털_권한변경이력기본 정보 목록 
 */
export interface AuthrtChgHstryListRVO {
  list: AuthrtChgHstryRVO[]
  totalCount: number
}

/**
 * 대국민포털_권한변경이력기본 삭제 파라메터 정보 
 */
export interface AuthrtChgHstryDVO {
}

