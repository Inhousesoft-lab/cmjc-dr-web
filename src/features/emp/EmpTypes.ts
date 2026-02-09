import { Paging } from "../com/CommonTypes";

/**
 * 대국민포털_관리자정보기본 조회 목업 정보
 */
export const mockEmpList = [
  {
    /** 순번 */
    no: 1,

    /** 직원번호 */
    empNo: "XXX",

    /** 관리자암호화비밀번호 */
    mngrEnpswd: "XXX",

    /** 임시비밀번호여부 */
    tmprPswdYn: "XXX",

    /** 비밀번호오류횟수 */
    pswdErrNmtm: -1,

    /** 이전암호화비밀번호 */
    bfrEnpswd: "XXX",

    /** 등록자아이디 */
    rgtrId: "XXX",

    /** 등록일시 */
    regDt: "2026-01-23",

    /** 등록프로그램아이디 */
    regPrgrmId: "XXX",

    /** 수정자아이디 */
    mdfrId: "XXX",

    /** 수정일시 */
    mdfcnDt: "2026-01-23",

    /** 수정프로그램아이디 */
    mdfcnPrgrmId: "XXX",
  },
];

/**
 * 대국민포털_관리자정보기본 조회/입력/수정/저장 파라메터 정보
 */
export interface EmpPVO {
  /** 직원번호 */
  empNo?: string;

  /** 관리자암호화비밀번호 */
  mngrEnpswd?: string;

  /** 임시비밀번호여부 */
  tmprPswdYn?: string;

  /** 비밀번호오류횟수 */
  pswdErrNmtm?: number;

  /** 이전암호화비밀번호 */
  bfrEnpswd?: string;

  /** 등록자아이디 */
  rgtrId?: string;

  /** 등록일시 */
  regDt?: string;

  /** 등록프로그램아이디 */
  regPrgrmId?: string;

  /** 수정자아이디 */
  mdfrId?: string;

  /** 수정일시 */
  mdfcnDt?: string;

  /** 수정프로그램아이디 */
  mdfcnPrgrmId?: string;
}

/**
 * 대국민포털_관리자정보기본 정보
 */
export interface EmpRVO {
  /** 순번 */
  no?: 1;

  /** 직원번호 */
  empNo?: string;

  /** 관리자암호화비밀번호 */
  mngrEnpswd?: string;

  /** 임시비밀번호여부 */
  tmprPswdYn?: string;

  /** 비밀번호오류횟수 */
  pswdErrNmtm?: number;

  /** 이전암호화비밀번호 */
  bfrEnpswd?: string;

  /** 등록자아이디 */
  rgtrId?: string;

  /** 등록일시 */
  regDt?: string;

  /** 등록프로그램아이디 */
  regPrgrmId?: string;

  /** 수정자아이디 */
  mdfrId?: string;

  /** 수정일시 */
  mdfcnDt?: string;

  /** 수정프로그램아이디 */
  mdfcnPrgrmId?: string;
}

/**
 * 대국민포털_관리자정보기본 목록 조회용 파라메터 정보
 */
export interface EmpListPVO {
  /** 직원번호 */
  empNo?: string;

  /** 관리자암호화비밀번호 */
  mngrEnpswd?: string;

  /** 임시비밀번호여부 */
  tmprPswdYn?: string;

  /** 비밀번호오류횟수 */
  pswdErrNmtm?: number;

  /** 이전암호화비밀번호 */
  bfrEnpswd?: string;

  /** 등록자아이디 */
  rgtrId?: string;

  /** 등록일시 */
  regDt?: string;

  /** 등록프로그램아이디 */
  regPrgrmId?: string;

  /** 수정자아이디 */
  mdfrId?: string;

  /** 수정일시 */
  mdfcnDt?: string;

  /** 수정프로그램아이디 */
  mdfcnPrgrmId?: string;
}

/**
 * 대국민포털_관리자정보기본 정보 목록
 */
export interface EmpListRVO {
  list: EmpRVO[];
  totalCount: number;
}

/**
 * 대국민포털_관리자정보기본 삭제 파라메터 정보
 */
export interface EmpDVO {
  /** 직원번호 */
  empNo: string;
}

// TODO 위 내용은 삭제 예정

/**
 * 연구자 팝업 조회용
 */
export interface EmpSearch extends Paging {
  mbrNm?: string; // 회원명
  instNm?: string; // 기관명
}

export interface EmpVO {
  mbrNo: string;
  mbrId: string;
  mbrNm: string;
  brno: string;
  instNm: string;
}
