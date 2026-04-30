import type { Paging } from "./common";

export interface MemberSearchValues extends Paging {
  deptNo: string;
  deptNm: string;
  mbrId: string;
  mbrNm: string;
}

export interface MemberRow {
  rowNo: number;
  mbrId: string;
  mbrNm: string;
  deptNo: string;
  deptNm: string;
  jbpsNm: string;
  authrtCd: string;
  authrtNm: string;
  regDt: string;
}

export interface MemberFormValues {
  mbrId: string;
  mbrNm: string;
  deptNo: string;
  deptNm?: string;
  jbpsNm: string;
  authrtCd: string;
}

export interface DepartmentRow {
  rowNo?: number;
  deptNo: string;
  deptNm: string;
  upDeptNo?: string;
  useEn?: string;
  useYn?: string;
}
