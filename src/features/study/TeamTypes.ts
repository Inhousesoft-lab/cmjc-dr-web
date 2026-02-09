import type { Paging } from "@/features/com/CommonTypes";

// 과제 연구자/담당자 정보
export interface Researchers {
  asmtStngPicDtlId?: string; // 과제설정담당자상세아이디
  asmtStngPicId?: string; // 과제설정담당자아이디
  asmtStngPicNm?: string; // 과제설정담당자명
  picRoleId?: string; // 담당자역할아이디
  ptcpInstId?: string; // 참여기관아이디
  ptcpInstNm?: string; // 참여기관명
  useYn?: string; // 사용여부
}

// 과제 참여기관/연구자
export interface Team {
  ptcpInstDtlId?: string; // 참여기관상세아이디
  instId?: string; // 참여기관아이디
  instNm?: string; // 기관명
  goalRschTrprCnt?: number | null; // 목표연구대상자수
  researchers?: Researchers[]; // 연구자 목록
}

// 기관 추가 팝업 검색
export interface InstSearch extends Paging {
  instNm?: string; // 기관명
  excludeParticipantAsmtId?: string; // 제외할 참여기관 과제아이디
}

// 기관 추가 팝업 결과 목록
export interface InstList {
  rowNo?: string;
  brno?: string;
  instNm?: string;
  goalRschTrprCnt?: number;
  action?: string;
}

// 연구자 추가 조회 팝업 검색
export interface MbrSearch extends Paging {
  mbrNm?: string; // 연구자명
  brno?: string; // 기관번호
  instNm?: string; // 기관명
  researcherScopeAsmtId?: string; // 제외할 참여기관 과제아이디
}

// 연구자 추가 팝업 결과 목록
export interface MbrList {
  mbrNo?: string; // 연구자번호
  mbrId?: string; // 연구자아이디
  mbrNm?: string; // 연구자명
  brno?: string; // 기관번호
  instNm?: string; // 기관명
  role?: string;
  action?: string;
}
