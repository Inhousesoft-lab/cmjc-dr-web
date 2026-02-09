/**
 * 대국민포털_팝업기본 조회 목업 정보 
 */
export const mockPopupList = [
  {
    /** 순번 */
    no: 1,

    /** 팝업제목 */
    popupTtl: 'XXX',

    /** 팝업게시시작일자 */
    popupPstgBgngYmd: '2026-01-23',

    /** 팝업게시종료일자 */
    popupPstgEndYmd: '2026-01-23',

    /** 팝업연결주소 */
    popupLnkgAddr: 'XXX',

    /** 팝업게시여부 */
    popupPstgYn: 'XXX',

    /** 팝업새창여부 */
    popupNpagYn: 'XXX',

    /** 팝업설명 */
    popupExpln: 'XXX',

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
 * 대국민포털_팝업기본 조회/입력/수정/저장 파라메터 정보 
 */
export interface PopupPVO {
  /** 팝업제목 */
  popupTtl?: string

  /** 팝업게시시작일자 */
  popupPstgBgngYmd?: string

  /** 팝업게시종료일자 */
  popupPstgEndYmd?: string

  /** 팝업연결주소 */
  popupLnkgAddr?: string

  /** 팝업게시여부 */
  popupPstgYn?: string

  /** 팝업새창여부 */
  popupNpagYn?: string

  /** 팝업설명 */
  popupExpln?: string

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
 * 대국민포털_팝업기본 정보 
 */
export interface PopupRVO {
  /** 순번 */
  no?: 1

  /** 팝업제목 */
  popupTtl?: string

  /** 팝업게시시작일자 */
  popupPstgBgngYmd?: string

  /** 팝업게시종료일자 */
  popupPstgEndYmd?: string

  /** 팝업연결주소 */
  popupLnkgAddr?: string

  /** 팝업게시여부 */
  popupPstgYn?: string

  /** 팝업새창여부 */
  popupNpagYn?: string

  /** 팝업설명 */
  popupExpln?: string

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
 * 대국민포털_팝업기본 목록 조회용 파라메터 정보 
 */
export interface PopupListPVO {
  /** 팝업제목 */
  popupTtl?: string

  /** 팝업게시시작일자 */
  popupPstgBgngYmd?: string

  /** 팝업게시종료일자 */
  popupPstgEndYmd?: string

  /** 팝업연결주소 */
  popupLnkgAddr?: string

  /** 팝업게시여부 */
  popupPstgYn?: string

  /** 팝업새창여부 */
  popupNpagYn?: string

  /** 팝업설명 */
  popupExpln?: string

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
 * 대국민포털_팝업기본 정보 목록 
 */
export interface PopupListRVO {
  list: PopupRVO[]
  totalCount: number
}

/**
 * 대국민포털_팝업기본 삭제 파라메터 정보 
 */
export interface PopupDVO {
}

