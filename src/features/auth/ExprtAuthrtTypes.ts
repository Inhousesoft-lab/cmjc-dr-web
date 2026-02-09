/**
 * 대국민포털_전문가권한기본 조회 목업 정보 
 */
export const mockExprtAuthrtList = [
  {
    /** 순번 */
    no: 1,

    /** 회원번호 */
    mbrNo: 'XXX',

    /** 권한코드 */
    authrtCd: 'XXX',

    /** 사용여부 */
    useYn: 'XXX',

    /** 전문가권한비고 */
    exprtAuthrtRmrk: 'XXX',

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
 * 대국민포털_전문가권한기본 조회/입력/수정/저장 파라메터 정보 
 */
export interface ExprtAuthrtPVO {
  /** 회원번호 */
  mbrNo?: string

  /** 권한코드 */
  authrtCd?: string

  /** 사용여부 */
  useYn?: string

  /** 전문가권한비고 */
  exprtAuthrtRmrk?: string

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
 * 대국민포털_전문가권한기본 정보 
 */
export interface ExprtAuthrtRVO {
  /** 순번 */
  no?: 1

  /** 회원번호 */
  mbrNo?: string

  /** 권한코드 */
  authrtCd?: string

  /** 사용여부 */
  useYn?: string

  /** 전문가권한비고 */
  exprtAuthrtRmrk?: string

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
 * 대국민포털_전문가권한기본 목록 조회용 파라메터 정보 
 */
export interface ExprtAuthrtListPVO {
  /** 회원번호 */
  mbrNo?: string

  /** 권한코드 */
  authrtCd?: string

  /** 사용여부 */
  useYn?: string

  /** 전문가권한비고 */
  exprtAuthrtRmrk?: string

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
 * 대국민포털_전문가권한기본 정보 목록 
 */
export interface ExprtAuthrtListRVO {
  list: ExprtAuthrtRVO[]
  totalCount: number
}

/**
 * 대국민포털_전문가권한기본 삭제 파라메터 정보 
 */
export interface ExprtAuthrtDVO {
  /** 회원번호 */
  mbrNo: string

  /** 권한코드 */
  authrtCd: string

}

