/**
 * 대국민포털_도메인기본 조회 목업 정보 
 */
export const mockDmnList = [
  {
    /** 순번 */
    no: 1,

    /** 공통표준도메인명 */
    comStdDmnNm: 'XXX',

    /** 시스템구분명 */
    sysSeNm: 'XXX',

    /** 항목원천명 */
    artclSouNm: 'XXX',

    /** 공통표준도메인분류명 */
    comStdDmnClsfNm: 'XXX',

    /** 공통표준도메인그룹명 */
    comStdDmnGroupNm: 'XXX',

    /** 공통표준도메인설명 */
    comStdDmnExpln: 'XXX',

    /** 도메인유형명 */
    dmnTypeNm: 'XXX',

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
 * 대국민포털_도메인기본 조회/입력/수정/저장 파라메터 정보 
 */
export interface DmnPVO {
  /** 공통표준도메인명 */
  comStdDmnNm?: string

  /** 시스템구분명 */
  sysSeNm?: string

  /** 항목원천명 */
  artclSouNm?: string

  /** 공통표준도메인분류명 */
  comStdDmnClsfNm?: string

  /** 공통표준도메인그룹명 */
  comStdDmnGroupNm?: string

  /** 공통표준도메인설명 */
  comStdDmnExpln?: string

  /** 도메인유형명 */
  dmnTypeNm?: string

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
 * 대국민포털_도메인기본 정보 
 */
export interface DmnRVO {
  /** 순번 */
  no?: 1

  /** 공통표준도메인명 */
  comStdDmnNm?: string

  /** 시스템구분명 */
  sysSeNm?: string

  /** 항목원천명 */
  artclSouNm?: string

  /** 공통표준도메인분류명 */
  comStdDmnClsfNm?: string

  /** 공통표준도메인그룹명 */
  comStdDmnGroupNm?: string

  /** 공통표준도메인설명 */
  comStdDmnExpln?: string

  /** 도메인유형명 */
  dmnTypeNm?: string

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
 * 대국민포털_도메인기본 목록 조회용 파라메터 정보 
 */
export interface DmnListPVO {
  /** 공통표준도메인명 */
  comStdDmnNm?: string

  /** 시스템구분명 */
  sysSeNm?: string

  /** 항목원천명 */
  artclSouNm?: string

  /** 공통표준도메인분류명 */
  comStdDmnClsfNm?: string

  /** 공통표준도메인그룹명 */
  comStdDmnGroupNm?: string

  /** 공통표준도메인설명 */
  comStdDmnExpln?: string

  /** 도메인유형명 */
  dmnTypeNm?: string

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
 * 대국민포털_도메인기본 정보 목록 
 */
export interface DmnListRVO {
  list: DmnRVO[]
  totalCount: number
}

/**
 * 대국민포털_도메인기본 삭제 파라메터 정보 
 */
export interface DmnDVO {
  /** 공통표준도메인명 */
  comStdDmnNm: string

}

