/**
 * 대국민포털_단어기본 조회 목업 정보 
 */
export const mockWordList = [
  {
    /** 순번 */
    no: 1,

    /** 공통표준단어명 */
    comStdWordNm: 'XXX',

    /** 시스템구분명 */
    sysSeNm: 'XXX',

    /** 항목원천명 */
    artclSouNm: 'XXX',

    /** 공통표준단어영문약어명 */
    comStdWordEngAbbrNm: 'XXX',

    /** 공통표준단어영문명 */
    comStdWordEngNm: 'XXX',

    /** 공통표준단어설명 */
    comStdWordExpln: 'XXX',

    /** 형식단어여부 */
    frmWordYn: 'XXX',

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
 * 대국민포털_단어기본 조회/입력/수정/저장 파라메터 정보 
 */
export interface WordPVO {
  /** 공통표준단어명 */
  comStdWordNm?: string

  /** 시스템구분명 */
  sysSeNm?: string

  /** 항목원천명 */
  artclSouNm?: string

  /** 공통표준단어영문약어명 */
  comStdWordEngAbbrNm?: string

  /** 공통표준단어영문명 */
  comStdWordEngNm?: string

  /** 공통표준단어설명 */
  comStdWordExpln?: string

  /** 형식단어여부 */
  frmWordYn?: string

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
 * 대국민포털_단어기본 정보 
 */
export interface WordRVO {
  /** 순번 */
  no?: 1

  /** 공통표준단어명 */
  comStdWordNm?: string

  /** 시스템구분명 */
  sysSeNm?: string

  /** 항목원천명 */
  artclSouNm?: string

  /** 공통표준단어영문약어명 */
  comStdWordEngAbbrNm?: string

  /** 공통표준단어영문명 */
  comStdWordEngNm?: string

  /** 공통표준단어설명 */
  comStdWordExpln?: string

  /** 형식단어여부 */
  frmWordYn?: string

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
 * 대국민포털_단어기본 목록 조회용 파라메터 정보 
 */
export interface WordListPVO {
  /** 공통표준단어명 */
  comStdWordNm?: string

  /** 시스템구분명 */
  sysSeNm?: string

  /** 항목원천명 */
  artclSouNm?: string

  /** 공통표준단어영문약어명 */
  comStdWordEngAbbrNm?: string

  /** 공통표준단어영문명 */
  comStdWordEngNm?: string

  /** 공통표준단어설명 */
  comStdWordExpln?: string

  /** 형식단어여부 */
  frmWordYn?: string

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
 * 대국민포털_단어기본 정보 목록 
 */
export interface WordListRVO {
  list: WordRVO[]
  totalCount: number
}

/**
 * 대국민포털_단어기본 삭제 파라메터 정보 
 */
export interface WordDVO {
  /** 공통표준단어명 */
  comStdWordNm: string

}

