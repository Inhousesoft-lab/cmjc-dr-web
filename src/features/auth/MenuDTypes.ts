/**
 * 대국민포털_메뉴상세 조회 목업 정보 
 */
export const mockMenuDList = [
  {
    /** 순번 */
    no: 1,

    /** 메뉴URL주소 */
    menuUrlAddr: 'XXX',

    /** 메뉴새창명 */
    menuNpagNm: 'XXX',

    /** 개인정보포함여부 */
    prvcInclYn: 'XXX',

    /** 만족도조사여부 */
    dgstfnExmnYn: 'XXX',

    /** 메뉴노출여부 */
    menuExpsrYn: 'XXX',

    /** 부서정보노출여부 */
    deptInfoExpsrYn: 'XXX',

    /** 담당자정보노출여부 */
    picInfoExpsrYn: 'XXX',

    /** 메뉴공공누리저작권유형코드 */
    menuKoglCprgtTypeCd: 'XXX',

    /** 메뉴담당자아이디 */
    menuPicId: 'XXX',

    /** 메뉴담당부서번호 */
    menuTkcgDeptNo: 'XXX',

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
 * 대국민포털_메뉴상세 조회/입력/수정/저장 파라메터 정보 
 */
export interface MenuDPVO {
  /** 메뉴URL주소 */
  menuUrlAddr?: string

  /** 메뉴새창명 */
  menuNpagNm?: string

  /** 개인정보포함여부 */
  prvcInclYn?: string

  /** 만족도조사여부 */
  dgstfnExmnYn?: string

  /** 메뉴노출여부 */
  menuExpsrYn?: string

  /** 부서정보노출여부 */
  deptInfoExpsrYn?: string

  /** 담당자정보노출여부 */
  picInfoExpsrYn?: string

  /** 메뉴공공누리저작권유형코드 */
  menuKoglCprgtTypeCd?: string

  /** 메뉴담당자아이디 */
  menuPicId?: string

  /** 메뉴담당부서번호 */
  menuTkcgDeptNo?: string

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
 * 대국민포털_메뉴상세 정보 
 */
export interface MenuDRVO {
  /** 순번 */
  no?: 1

  /** 메뉴URL주소 */
  menuUrlAddr?: string

  /** 메뉴새창명 */
  menuNpagNm?: string

  /** 개인정보포함여부 */
  prvcInclYn?: string

  /** 만족도조사여부 */
  dgstfnExmnYn?: string

  /** 메뉴노출여부 */
  menuExpsrYn?: string

  /** 부서정보노출여부 */
  deptInfoExpsrYn?: string

  /** 담당자정보노출여부 */
  picInfoExpsrYn?: string

  /** 메뉴공공누리저작권유형코드 */
  menuKoglCprgtTypeCd?: string

  /** 메뉴담당자아이디 */
  menuPicId?: string

  /** 메뉴담당부서번호 */
  menuTkcgDeptNo?: string

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
 * 대국민포털_메뉴상세 목록 조회용 파라메터 정보 
 */
export interface MenuDListPVO {
  /** 메뉴URL주소 */
  menuUrlAddr?: string

  /** 메뉴새창명 */
  menuNpagNm?: string

  /** 개인정보포함여부 */
  prvcInclYn?: string

  /** 만족도조사여부 */
  dgstfnExmnYn?: string

  /** 메뉴노출여부 */
  menuExpsrYn?: string

  /** 부서정보노출여부 */
  deptInfoExpsrYn?: string

  /** 담당자정보노출여부 */
  picInfoExpsrYn?: string

  /** 메뉴공공누리저작권유형코드 */
  menuKoglCprgtTypeCd?: string

  /** 메뉴담당자아이디 */
  menuPicId?: string

  /** 메뉴담당부서번호 */
  menuTkcgDeptNo?: string

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
 * 대국민포털_메뉴상세 정보 목록 
 */
export interface MenuDListRVO {
  list: MenuDRVO[]
  totalCount: number
}

/**
 * 대국민포털_메뉴상세 삭제 파라메터 정보 
 */
export interface MenuDDVO {
}

