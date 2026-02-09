/**
 * 공통_첨부파일기본 조회 목업 정보 
 */
export const mockAtchList = [
  {
    /** 순번 */
    no: 1,

    /** 메뉴유형 */
    menuType: 'XXX',

    /** 첨부파일업로드시간 */
    atchFileUldHr: '2026-01-23',

    /** 첨부파일사용여부 */
    atchFileUseYn: 'XXX',

    /** 첨부파일경로 */
    atchFilePath: 'XXX',

    /** 첨부파일명 */
    atchFileNm: 'XXX',

    /** 첨부파일확장자명 */
    atchFileExtnNm: 'XXX',

    /** 첨부파일내용 */
    atchFileCn: 'XXX',

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
 * 공통_첨부파일기본 조회/입력/수정/저장 파라메터 정보 
 */
export interface AtchPVO {
  /** 메뉴유형 */
  menuType?: string

  /** 첨부파일업로드시간 */
  atchFileUldHr?: string

  /** 첨부파일사용여부 */
  atchFileUseYn?: string

  /** 첨부파일경로 */
  atchFilePath?: string

  /** 첨부파일명 */
  atchFileNm?: string

  /** 첨부파일확장자명 */
  atchFileExtnNm?: string

  /** 첨부파일내용 */
  atchFileCn?: string

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
 * 공통_첨부파일기본 정보 
 */
export interface AtchRVO {
  /** 순번 */
  no?: 1

  /** 메뉴유형 */
  menuType?: string

  /** 첨부파일업로드시간 */
  atchFileUldHr?: string

  /** 첨부파일사용여부 */
  atchFileUseYn?: string

  /** 첨부파일경로 */
  atchFilePath?: string

  /** 첨부파일명 */
  atchFileNm?: string

  /** 첨부파일확장자명 */
  atchFileExtnNm?: string

  /** 첨부파일내용 */
  atchFileCn?: string

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
 * 공통_첨부파일기본 목록 조회용 파라메터 정보 
 */
export interface AtchListPVO {
  /** 메뉴유형 */
  menuType?: string

  /** 첨부파일업로드시간 */
  atchFileUldHr?: string

  /** 첨부파일사용여부 */
  atchFileUseYn?: string

  /** 첨부파일경로 */
  atchFilePath?: string

  /** 첨부파일명 */
  atchFileNm?: string

  /** 첨부파일확장자명 */
  atchFileExtnNm?: string

  /** 첨부파일내용 */
  atchFileCn?: string

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
 * 공통_첨부파일기본 정보 목록 
 */
export interface AtchListRVO {
  list: AtchRVO[]
  totalCount: number
}

/**
 * 공통_첨부파일기본 삭제 파라메터 정보 
 */
export interface AtchDVO {
}

