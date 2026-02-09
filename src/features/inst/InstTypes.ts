import type { Paging } from "@/features/com/CommonTypes";

export interface InstitutionSearch extends Paging {
  instNm?: string; // 기관명
}

export interface InstitutionVO {
  rowNo?: string;
  brno?: string;
  instNm?: string;
}
