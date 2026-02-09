/**
 * 대국민포털_전문가정보기본 조회 목업 정보 
 */
export const mockExprtInfoList = [
  {
    /** 순번 */
    no: 1,

    /** 회원번호 */
    mbrNo: 'XXX',

    /** 사업자등록번호 */
    brno: 'XXX',

    /** 전문가소속기관암호화이메일 */
    exprtOgdpInstEncptEml: 'XXX',

    /** 전문가재직여부 */
    exprtHdofYn: 'XXX',

    /** 전문가승인상태여부 */
    exprtAprvSttsYn: 'XXX',

    /** 승인처리일자 */
    aprvPrcsYmd: '2026-01-23',

    /** 반려사유 */
    rjctRsn: 'XXX',

    /** 첨부파일아이디 */
    atchFileId: 'XXX',

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
 * 대국민포털_전문가정보기본 조회/입력/수정/저장 파라메터 정보 
 */
export interface ExprtInfoPVO {
  /** 회원번호 */
  mbrNo?: string

  /** 사업자등록번호 */
  brno?: string

  /** 전문가소속기관암호화이메일 */
  exprtOgdpInstEncptEml?: string

  /** 전문가재직여부 */
  exprtHdofYn?: string

  /** 전문가승인상태여부 */
  exprtAprvSttsYn?: string

  /** 승인처리일자 */
  aprvPrcsYmd?: string

  /** 반려사유 */
  rjctRsn?: string

  /** 첨부파일아이디 */
  atchFileId?: string

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
 * 대국민포털_전문가정보기본 정보 
 */
export interface ExprtInfoRVO {
  /** 순번 */
  no?: 1

  /** 회원번호 */
  mbrNo?: string

  /** 사업자등록번호 */
  brno?: string

  /** 전문가소속기관암호화이메일 */
  exprtOgdpInstEncptEml?: string

  /** 전문가재직여부 */
  exprtHdofYn?: string

  /** 전문가승인상태여부 */
  exprtAprvSttsYn?: string

  /** 승인처리일자 */
  aprvPrcsYmd?: string

  /** 반려사유 */
  rjctRsn?: string

  /** 첨부파일아이디 */
  atchFileId?: string

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
 * 대국민포털_전문가정보기본 목록 조회용 파라메터 정보 
 */
export interface ExprtInfoListPVO {
  /** 회원번호 */
  mbrNo?: string

  /** 사업자등록번호 */
  brno?: string

  /** 전문가소속기관암호화이메일 */
  exprtOgdpInstEncptEml?: string

  /** 전문가재직여부 */
  exprtHdofYn?: string

  /** 전문가승인상태여부 */
  exprtAprvSttsYn?: string

  /** 승인처리일자 */
  aprvPrcsYmd?: string

  /** 반려사유 */
  rjctRsn?: string

  /** 첨부파일아이디 */
  atchFileId?: string

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
 * 대국민포털_전문가정보기본 정보 목록 
 */
export interface ExprtInfoListRVO {
  list: ExprtInfoRVO[]
  totalCount: number
}

/**
 * 대국민포털_전문가정보기본 삭제 파라메터 정보 
 */
export interface ExprtInfoDVO {
  /** 회원번호 */
  mbrNo: string

}

