/**
 * 대국민포털_권한기본 조회 목업 정보 
 */
export const mockAuthrtList = [
  {
    /** 순번 */
    no: 1,

    /** 권한코드 */
    authrtCd: 'XXX',

    /** 업무구분코드 */
    taskSeCd: 'XXX',

    /** 권한명 */
    authrtNm: 'XXX',

    /** 권한유형 */
    authrtType: 'XXX',

    /** 권한설명 */
    authrtExpln: 'XXX',

    /** 사용여부 */
    useYn: 'XXX',

    /** 작성자부서명 */
    wrtrDeptNm: 'XXX',

    /** 수정자부서명 */
    mdfrDeptNm: 'XXX',

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
 * 대국민포털_권한기본 조회/입력/수정/저장 파라메터 정보 
 */
export interface AuthrtPVO {
  /** 권한코드 */
  authrtCd?: string

  /** 업무구분코드 */
  taskSeCd?: string

  /** 권한명 */
  authrtNm?: string

  /** 권한유형 */
  authrtType?: string

  /** 권한설명 */
  authrtExpln?: string

  /** 사용여부 */
  useYn?: string

  /** 작성자부서명 */
  wrtrDeptNm?: string

  /** 수정자부서명 */
  mdfrDeptNm?: string

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
 * 대국민포털_권한기본 정보 
 */
export interface AuthrtRVO {
  /** 순번 */
  no?: 1

  /** 권한코드 */
  authrtCd?: string

  /** 업무구분코드 */
  taskSeCd?: string

  /** 권한명 */
  authrtNm?: string

  /** 권한유형 */
  authrtType?: string

  /** 권한설명 */
  authrtExpln?: string

  /** 사용여부 */
  useYn?: string

  /** 작성자부서명 */
  wrtrDeptNm?: string

  /** 수정자부서명 */
  mdfrDeptNm?: string

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
 * 대국민포털_권한기본 목록 조회용 파라메터 정보 
 */
export interface AuthrtListPVO {
  /** 권한코드 */
  authrtCd?: string

  /** 업무구분코드 */
  taskSeCd?: string

  /** 권한명 */
  authrtNm?: string

  /** 권한유형 */
  authrtType?: string

  /** 권한설명 */
  authrtExpln?: string

  /** 사용여부 */
  useYn?: string

  /** 작성자부서명 */
  wrtrDeptNm?: string

  /** 수정자부서명 */
  mdfrDeptNm?: string

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
 * 대국민포털_권한기본 정보 목록 
 */
export interface AuthrtListRVO {
  list: AuthrtRVO[]
  totalCount: number
}

/**
 * 대국민포털_권한기본 삭제 파라메터 정보 
 */
export interface AuthrtDVO {
  /** 권한코드 */
  authrtCd: string

}

