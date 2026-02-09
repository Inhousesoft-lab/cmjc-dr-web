/**
 * 대국민포털_개인정보접근이력기본 조회 목업 정보 
 */
export const mockPrvcAcsHstryList = [
  {
    /** 순번 */
    no: 1,

    /** 조회기준일자 */
    inqCrtrYmd: '2026-01-23',

    /** 서비스코드 */
    srvcCd: 'XXX',

    /** 메뉴일련번호 */
    menuSn: 'XXX',

    /** 메소드명 */
    methodsNm: 'XXX',

    /** 조회정보 */
    inqInfo: 'XXX',

    /** 요청자아이디 */
    rqstrId: 'XXX',

    /** 요청자IP주소 */
    rqstrIpAddr: 'XXX',

    /** 조회조건 */
    inqCnd: 'XXX',

    /** 조회전문 */
    inqTelgm: 'XXX',

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
 * 대국민포털_개인정보접근이력기본 조회/입력/수정/저장 파라메터 정보 
 */
export interface PrvcAcsHstryPVO {
  /** 조회기준일자 */
  inqCrtrYmd?: string

  /** 서비스코드 */
  srvcCd?: string

  /** 메뉴일련번호 */
  menuSn?: string

  /** 메소드명 */
  methodsNm?: string

  /** 조회정보 */
  inqInfo?: string

  /** 요청자아이디 */
  rqstrId?: string

  /** 요청자IP주소 */
  rqstrIpAddr?: string

  /** 조회조건 */
  inqCnd?: string

  /** 조회전문 */
  inqTelgm?: string

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
 * 대국민포털_개인정보접근이력기본 정보 
 */
export interface PrvcAcsHstryRVO {
  /** 순번 */
  no?: 1

  /** 조회기준일자 */
  inqCrtrYmd?: string

  /** 서비스코드 */
  srvcCd?: string

  /** 메뉴일련번호 */
  menuSn?: string

  /** 메소드명 */
  methodsNm?: string

  /** 조회정보 */
  inqInfo?: string

  /** 요청자아이디 */
  rqstrId?: string

  /** 요청자IP주소 */
  rqstrIpAddr?: string

  /** 조회조건 */
  inqCnd?: string

  /** 조회전문 */
  inqTelgm?: string

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
 * 대국민포털_개인정보접근이력기본 목록 조회용 파라메터 정보 
 */
export interface PrvcAcsHstryListPVO {
  /** 조회기준일자 */
  inqCrtrYmd?: string

  /** 서비스코드 */
  srvcCd?: string

  /** 메뉴일련번호 */
  menuSn?: string

  /** 메소드명 */
  methodsNm?: string

  /** 조회정보 */
  inqInfo?: string

  /** 요청자아이디 */
  rqstrId?: string

  /** 요청자IP주소 */
  rqstrIpAddr?: string

  /** 조회조건 */
  inqCnd?: string

  /** 조회전문 */
  inqTelgm?: string

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
 * 대국민포털_개인정보접근이력기본 정보 목록 
 */
export interface PrvcAcsHstryListRVO {
  list: PrvcAcsHstryRVO[]
  totalCount: number
}

/**
 * 대국민포털_개인정보접근이력기본 삭제 파라메터 정보 
 */
export interface PrvcAcsHstryDVO {
}

