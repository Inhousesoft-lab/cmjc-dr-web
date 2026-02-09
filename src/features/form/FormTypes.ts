/**
 * 대국민포털_양식기본 조회 목업 정보 
 */
export const mockFormList = [
  {
    /** 순번 */
    no: 1,

    /** 업무코드 */
    taskCd: 'XXX',

    /** 양식명 */
    formNm: 'XXX',

    /** 양식경로 */
    formPath: 'XXX',

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
 * 대국민포털_양식기본 조회/입력/수정/저장 파라메터 정보 
 */
export interface FormPVO {
  /** 업무코드 */
  taskCd?: string

  /** 양식명 */
  formNm?: string

  /** 양식경로 */
  formPath?: string

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
 * 대국민포털_양식기본 정보 
 */
export interface FormRVO {
  /** 순번 */
  no?: 1

  /** 업무코드 */
  taskCd?: string

  /** 양식명 */
  formNm?: string

  /** 양식경로 */
  formPath?: string

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
 * 대국민포털_양식기본 목록 조회용 파라메터 정보 
 */
export interface FormListPVO {
  /** 업무코드 */
  taskCd?: string

  /** 양식명 */
  formNm?: string

  /** 양식경로 */
  formPath?: string

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
 * 대국민포털_양식기본 정보 목록 
 */
export interface FormListRVO {
  list: FormRVO[]
  totalCount: number
}

/**
 * 대국민포털_양식기본 삭제 파라메터 정보 
 */
export interface FormDVO {
}

