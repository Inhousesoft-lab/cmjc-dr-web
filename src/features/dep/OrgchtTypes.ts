/**
 * 대국민포털_KIDS조직도기본 조회 목업 정보 
 */
export const mockOrgchtList = [
  {
    /** 순번 */
    no: 1,

    /** 직원번호 */
    empNo: 'XXX',

    /** 부서번호 */
    deptNo: 'XXX',

    /** 부서명 */
    deptNm: 'XXX',

    /** 직원명 */
    empNm: 'XXX',

  }
]

/**
 * 대국민포털_KIDS조직도기본 조회/입력/수정/저장 파라메터 정보 
 */
export interface OrgchtPVO {
  /** 직원번호 */
  empNo?: string

  /** 부서번호 */
  deptNo?: string

  /** 부서명 */
  deptNm?: string

  /** 직원명 */
  empNm?: string

}

/**
 * 대국민포털_KIDS조직도기본 정보 
 */
export interface OrgchtRVO {
  /** 순번 */
  no?: 1

  /** 직원번호 */
  empNo?: string

  /** 부서번호 */
  deptNo?: string

  /** 부서명 */
  deptNm?: string

  /** 직원명 */
  empNm?: string

}

/**
 * 대국민포털_KIDS조직도기본 목록 조회용 파라메터 정보 
 */
export interface OrgchtListPVO {
  /** 직원번호 */
  empNo?: string

  /** 부서번호 */
  deptNo?: string

  /** 부서명 */
  deptNm?: string

  /** 직원명 */
  empNm?: string

}

/**
 * 대국민포털_KIDS조직도기본 정보 목록 
 */
export interface OrgchtListRVO {
  list: OrgchtRVO[]
  totalCount: number
}

/**
 * 대국민포털_KIDS조직도기본 삭제 파라메터 정보 
 */
export interface OrgchtDVO {
  /** 직원번호 */
  empNo: string

}

