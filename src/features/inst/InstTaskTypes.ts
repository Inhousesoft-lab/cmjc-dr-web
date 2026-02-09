/**
 * 대국민포털_기관업무기본 조회 목업 정보 
 */
export const mockInstTaskList = [
  {
    /** 순번 */
    no: 1,

    /** 사업자등록번호 */
    brno: 'XXX',

    /** 업무구분코드 */
    taskSeCd: 'XXX',

    /** 회원아이디 */
    mbrId: 'XXX',

    /** 사용여부 */
    useYn: 'XXX',

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
 * 대국민포털_기관업무기본 조회/입력/수정/저장 파라메터 정보 
 */
export interface InstTaskPVO {
  /** 사업자등록번호 */
  brno?: string

  /** 업무구분코드 */
  taskSeCd?: string

  /** 회원아이디 */
  mbrId?: string

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
 * 대국민포털_기관업무기본 정보 
 */
export interface InstTaskRVO {
  /** 순번 */
  no?: 1

  /** 사업자등록번호 */
  brno?: string

  /** 업무구분코드 */
  taskSeCd?: string

  /** 회원아이디 */
  mbrId?: string

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
 * 대국민포털_기관업무기본 목록 조회용 파라메터 정보 
 */
export interface InstTaskListPVO {
  /** 사업자등록번호 */
  brno?: string

  /** 업무구분코드 */
  taskSeCd?: string

  /** 회원아이디 */
  mbrId?: string

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
 * 대국민포털_기관업무기본 정보 목록 
 */
export interface InstTaskListRVO {
  list: InstTaskRVO[]
  totalCount: number
}

/**
 * 대국민포털_기관업무기본 삭제 파라메터 정보 
 */
export interface InstTaskDVO {
  /** 사업자등록번호 */
  brno: string

  /** 업무구분코드 */
  taskSeCd: string

}

