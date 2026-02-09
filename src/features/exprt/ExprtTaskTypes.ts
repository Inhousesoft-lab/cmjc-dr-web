/**
 * 대국민포털_전문가업무기본 조회 목업 정보 
 */
export const mockExprtTaskList = [
  {
    /** 순번 */
    no: 1,

    /** 회원번호 */
    mbrNo: 'XXX',

    /** 업무구분코드 */
    taskSeCd: 'XXX',

    /** 사업자등록번호 */
    brno: 'XXX',

    /** 전문가승인상태여부 */
    exprtAprvSttsYn: 'XXX',

    /** 승인처리일자 */
    aprvPrcsYmd: '2026-01-23',

    /** 반려사유 */
    rjctRsn: 'XXX',

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
 * 대국민포털_전문가업무기본 조회/입력/수정/저장 파라메터 정보 
 */
export interface ExprtTaskPVO {
  /** 회원번호 */
  mbrNo?: string

  /** 업무구분코드 */
  taskSeCd?: string

  /** 사업자등록번호 */
  brno?: string

  /** 전문가승인상태여부 */
  exprtAprvSttsYn?: string

  /** 승인처리일자 */
  aprvPrcsYmd?: string

  /** 반려사유 */
  rjctRsn?: string

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
 * 대국민포털_전문가업무기본 정보 
 */
export interface ExprtTaskRVO {
  /** 순번 */
  no?: 1

  /** 회원번호 */
  mbrNo?: string

  /** 업무구분코드 */
  taskSeCd?: string

  /** 사업자등록번호 */
  brno?: string

  /** 전문가승인상태여부 */
  exprtAprvSttsYn?: string

  /** 승인처리일자 */
  aprvPrcsYmd?: string

  /** 반려사유 */
  rjctRsn?: string

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
 * 대국민포털_전문가업무기본 목록 조회용 파라메터 정보 
 */
export interface ExprtTaskListPVO {
  /** 회원번호 */
  mbrNo?: string

  /** 업무구분코드 */
  taskSeCd?: string

  /** 사업자등록번호 */
  brno?: string

  /** 전문가승인상태여부 */
  exprtAprvSttsYn?: string

  /** 승인처리일자 */
  aprvPrcsYmd?: string

  /** 반려사유 */
  rjctRsn?: string

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
 * 대국민포털_전문가업무기본 정보 목록 
 */
export interface ExprtTaskListRVO {
  list: ExprtTaskRVO[]
  totalCount: number
}

/**
 * 대국민포털_전문가업무기본 삭제 파라메터 정보 
 */
export interface ExprtTaskDVO {
}

