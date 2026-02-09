/**
 * 대국민포털_용어기본 조회 목업 정보 
 */
export const mockTrmList = [
  {
    /** 순번 */
    no: 1,

    /** 표준용어명 */
    stdTrmNm: 'XXX',

    /** 시스템구분명 */
    sysSeNm: 'XXX',

    /** 항목원천명 */
    artclSouNm: 'XXX',

    /** 표준용어영문약어명 */
    stdTrmEngAbbrNm: 'XXX',

    /** 속성유형명 */
    atrbTypeNm: 'XXX',

    /** 공통표준도메인명 */
    comStdDmnNm: 'XXX',

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
 * 대국민포털_용어기본 조회/입력/수정/저장 파라메터 정보 
 */
export interface TrmPVO {
  /** 표준용어명 */
  stdTrmNm?: string

  /** 시스템구분명 */
  sysSeNm?: string

  /** 항목원천명 */
  artclSouNm?: string

  /** 표준용어영문약어명 */
  stdTrmEngAbbrNm?: string

  /** 속성유형명 */
  atrbTypeNm?: string

  /** 공통표준도메인명 */
  comStdDmnNm?: string

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
 * 대국민포털_용어기본 정보 
 */
export interface TrmRVO {
  /** 순번 */
  no?: 1

  /** 표준용어명 */
  stdTrmNm?: string

  /** 시스템구분명 */
  sysSeNm?: string

  /** 항목원천명 */
  artclSouNm?: string

  /** 표준용어영문약어명 */
  stdTrmEngAbbrNm?: string

  /** 속성유형명 */
  atrbTypeNm?: string

  /** 공통표준도메인명 */
  comStdDmnNm?: string

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
 * 대국민포털_용어기본 목록 조회용 파라메터 정보 
 */
export interface TrmListPVO {
  /** 표준용어명 */
  stdTrmNm?: string

  /** 시스템구분명 */
  sysSeNm?: string

  /** 항목원천명 */
  artclSouNm?: string

  /** 표준용어영문약어명 */
  stdTrmEngAbbrNm?: string

  /** 속성유형명 */
  atrbTypeNm?: string

  /** 공통표준도메인명 */
  comStdDmnNm?: string

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
 * 대국민포털_용어기본 정보 목록 
 */
export interface TrmListRVO {
  list: TrmRVO[]
  totalCount: number
}

/**
 * 대국민포털_용어기본 삭제 파라메터 정보 
 */
export interface TrmDVO {
  /** 표준용어명 */
  stdTrmNm: string

}

