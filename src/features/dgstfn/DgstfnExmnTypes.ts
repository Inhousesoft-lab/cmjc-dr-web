/**
 * 대국민포털_만족도조사기본 조회 목업 정보 
 */
export const mockDgstfnExmnList = [
  {
    /** 순번 */
    no: 1,

    /** 만족도점수 */
    dgstfnScr: -1,

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
 * 대국민포털_만족도조사기본 조회/입력/수정/저장 파라메터 정보 
 */
export interface DgstfnExmnPVO {
  /** 만족도점수 */
  dgstfnScr?: number

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
 * 대국민포털_만족도조사기본 정보 
 */
export interface DgstfnExmnRVO {
  /** 순번 */
  no?: 1

  /** 만족도점수 */
  dgstfnScr?: number

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
 * 대국민포털_만족도조사기본 목록 조회용 파라메터 정보 
 */
export interface DgstfnExmnListPVO {
  /** 만족도점수 */
  dgstfnScr?: number

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
 * 대국민포털_만족도조사기본 정보 목록 
 */
export interface DgstfnExmnListRVO {
  list: DgstfnExmnRVO[]
  totalCount: number
}

/**
 * 대국민포털_만족도조사기본 삭제 파라메터 정보 
 */
export interface DgstfnExmnDVO {
}

