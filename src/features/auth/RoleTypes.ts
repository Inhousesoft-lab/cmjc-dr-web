/**
 * 대국민포털_역할기본 조회 목업 정보 
 */
export const mockRoleList = [
  {
    /** 순번 */
    no: 1,

    /** 역할코드 */
    roleCd: 'XXX',

    /** 역할명 */
    roleNm: 'XXX',

    /** 역할유형 */
    roleType: 'XXX',

    /** 역할설명내용 */
    roleExplnCn: 'XXX',

    /** 사용여부 */
    useYn: 'XXX',

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
 * 대국민포털_역할기본 조회/입력/수정/저장 파라메터 정보 
 */
export interface RolePVO {
  /** 역할코드 */
  roleCd?: string

  /** 역할명 */
  roleNm?: string

  /** 역할유형 */
  roleType?: string

  /** 역할설명내용 */
  roleExplnCn?: string

  /** 사용여부 */
  useYn?: string

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
 * 대국민포털_역할기본 정보 
 */
export interface RoleRVO {
  /** 순번 */
  no?: 1

  /** 역할코드 */
  roleCd?: string

  /** 역할명 */
  roleNm?: string

  /** 역할유형 */
  roleType?: string

  /** 역할설명내용 */
  roleExplnCn?: string

  /** 사용여부 */
  useYn?: string

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
 * 대국민포털_역할기본 목록 조회용 파라메터 정보 
 */
export interface RoleListPVO {
  /** 역할코드 */
  roleCd?: string

  /** 역할명 */
  roleNm?: string

  /** 역할유형 */
  roleType?: string

  /** 역할설명내용 */
  roleExplnCn?: string

  /** 사용여부 */
  useYn?: string

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
 * 대국민포털_역할기본 정보 목록 
 */
export interface RoleListRVO {
  list: RoleRVO[]
  totalCount: number
}

/**
 * 대국민포털_역할기본 삭제 파라메터 정보 
 */
export interface RoleDVO {
  /** 역할코드 */
  roleCd: string

}

