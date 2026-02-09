/**
 * 공통_공통코드기본 조회 목업 정보 
 */
export const mockComCdList = [
  {
    /** 순번 */
    no: 1,

    /** 공통코드 */
    comCd: 'XXX',

  }
]

/**
 * 공통_공통코드기본 조회/입력/수정/저장 파라메터 정보 
 */
export interface ComCdPVO {
  /** 공통코드 */
  comCd?: string

}

/**
 * 공통_공통코드기본 정보 
 */
export interface ComCdRVO {
  /** 순번 */
  no?: 1

  /** 공통코드 */
  comCd?: string

}

/**
 * 공통_공통코드기본 목록 조회용 파라메터 정보 
 */
export interface ComCdListPVO {
  /** 공통코드 */
  comCd?: string

}

/**
 * 공통_공통코드기본 정보 목록 
 */
export interface ComCdListRVO {
  list: ComCdRVO[]
  totalCount: number
}

/**
 * 공통_공통코드기본 삭제 파라메터 정보 
 */
export interface ComCdDVO {
  /** 공통코드 */
  comCd: string

}

