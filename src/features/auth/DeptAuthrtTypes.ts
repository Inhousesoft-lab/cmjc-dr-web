/**
 * 대국민포털_부서권한기본 조회 목업 정보 
 */
export const mockDeptAuthrtList = [
  {
    /** 순번 */
    no: 1,

    /** 부서번호 */
    deptNo: 'XXX',

    /** 권한코드 */
    authrtCd: 'XXX',

    /** 부서권한비고 */
    deptAuthrtRmrk: 'XXX',

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
 * 대국민포털_부서권한기본 조회/입력/수정/저장 파라메터 정보 
 */
export interface DeptAuthrtPVO {
  /** 부서번호 */
  deptNo?: string

  /** 권한코드 */
  authrtCd?: string

  /** 부서권한비고 */
  deptAuthrtRmrk?: string

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
 * 대국민포털_부서권한기본 정보 
 */
export interface DeptAuthrtRVO {
  /** 순번 */
  no?: 1

  /** 부서번호 */
  deptNo?: string

  /** 권한코드 */
  authrtCd?: string

  /** 부서권한비고 */
  deptAuthrtRmrk?: string

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
 * 대국민포털_부서권한기본 목록 조회용 파라메터 정보 
 */
export interface DeptAuthrtListPVO {
  /** 부서번호 */
  deptNo?: string

  /** 권한코드 */
  authrtCd?: string

  /** 부서권한비고 */
  deptAuthrtRmrk?: string

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
 * 대국민포털_부서권한기본 정보 목록 
 */
export interface DeptAuthrtListRVO {
  list: DeptAuthrtRVO[]
  totalCount: number
}

/**
 * 대국민포털_부서권한기본 삭제 파라메터 정보 
 */
export interface DeptAuthrtDVO {
  /** 부서번호 */
  deptNo: string

  /** 권한코드 */
  authrtCd: string

}

