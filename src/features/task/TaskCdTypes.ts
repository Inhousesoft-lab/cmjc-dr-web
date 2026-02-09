/**
 * 대국민포털_업무코드기본 조회 목업 정보 
 */
export const mockTaskCdList = [
  {
    /** 순번 */
    no: 1,

    /** 업무코드 */
    taskCd: 'XXX',

    /** 업무코드명 */
    taskCdNm: 'XXX',

    /** 상위업무코드 */
    upTaskCd: 'XXX',

    /** 업무코드값 */
    taskCdVl: 'XXX',

    /** 업무코드설명 */
    taskCdExpln: 'XXX',

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
 * 대국민포털_업무코드기본 조회/입력/수정/저장 파라메터 정보 
 */
export interface TaskCdPVO {
  /** 업무코드 */
  taskCd?: string

  /** 업무코드명 */
  taskCdNm?: string

  /** 상위업무코드 */
  upTaskCd?: string

  /** 업무코드값 */
  taskCdVl?: string

  /** 업무코드설명 */
  taskCdExpln?: string

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
 * 대국민포털_업무코드기본 정보 
 */
export interface TaskCdRVO {
  /** 순번 */
  no?: 1

  /** 업무코드 */
  taskCd?: string

  /** 업무코드명 */
  taskCdNm?: string

  /** 상위업무코드 */
  upTaskCd?: string

  /** 업무코드값 */
  taskCdVl?: string

  /** 업무코드설명 */
  taskCdExpln?: string

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
 * 대국민포털_업무코드기본 목록 조회용 파라메터 정보 
 */
export interface TaskCdListPVO {
  /** 업무코드 */
  taskCd?: string

  /** 업무코드명 */
  taskCdNm?: string

  /** 상위업무코드 */
  upTaskCd?: string

  /** 업무코드값 */
  taskCdVl?: string

  /** 업무코드설명 */
  taskCdExpln?: string

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
 * 대국민포털_업무코드기본 정보 목록 
 */
export interface TaskCdListRVO {
  list: TaskCdRVO[]
  totalCount: number
}

/**
 * 대국민포털_업무코드기본 삭제 파라메터 정보 
 */
export interface TaskCdDVO {
  /** 업무코드 */
  taskCd: string

}

