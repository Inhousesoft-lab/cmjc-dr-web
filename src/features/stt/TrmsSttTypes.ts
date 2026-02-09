/**
 * 대국민포털_약관법령기본 조회 목업 정보 
 */
export const mockTrmsSttList = [
  {
    /** 순번 */
    no: 1,

    /** 약관법령코드 */
    trmsSttCd: 'XXX',

    /** 약관법령적용일 */
    trmsSttAplcnDay: 'XXX',

    /** 약관법령종료일 */
    trmsSttEndDay: 'XXX',

    /** 약관법령내용 */
    trmsSttCn: 'XXX',

    /** 첨부파일아이디 */
    atchFileId: 'XXX',

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
 * 대국민포털_약관법령기본 조회/입력/수정/저장 파라메터 정보 
 */
export interface TrmsSttPVO {
  /** 약관법령코드 */
  trmsSttCd?: string

  /** 약관법령적용일 */
  trmsSttAplcnDay?: string

  /** 약관법령종료일 */
  trmsSttEndDay?: string

  /** 약관법령내용 */
  trmsSttCn?: string

  /** 첨부파일아이디 */
  atchFileId?: string

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
 * 대국민포털_약관법령기본 정보 
 */
export interface TrmsSttRVO {
  /** 순번 */
  no?: 1

  /** 약관법령코드 */
  trmsSttCd?: string

  /** 약관법령적용일 */
  trmsSttAplcnDay?: string

  /** 약관법령종료일 */
  trmsSttEndDay?: string

  /** 약관법령내용 */
  trmsSttCn?: string

  /** 첨부파일아이디 */
  atchFileId?: string

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
 * 대국민포털_약관법령기본 목록 조회용 파라메터 정보 
 */
export interface TrmsSttListPVO {
  /** 약관법령코드 */
  trmsSttCd?: string

  /** 약관법령적용일 */
  trmsSttAplcnDay?: string

  /** 약관법령종료일 */
  trmsSttEndDay?: string

  /** 약관법령내용 */
  trmsSttCn?: string

  /** 첨부파일아이디 */
  atchFileId?: string

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
 * 대국민포털_약관법령기본 정보 목록 
 */
export interface TrmsSttListRVO {
  list: TrmsSttRVO[]
  totalCount: number
}

/**
 * 대국민포털_약관법령기본 삭제 파라메터 정보 
 */
export interface TrmsSttDVO {
}

