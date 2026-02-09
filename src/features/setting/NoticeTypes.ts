import { Paging } from "@/features/com/CommonTypes";

export interface NoticeSearchVO extends Paging {
  ntcMttrTtlNm?: string;
  aplcnTrgtCd?: string;
  aplcnPrdBgngDt?: string;
  aplcnPrdEndDt?: string;
  rgtrNm?: string;
}

/**
 * 공지사항
 */
export interface NoticeVO {
  rowNo?: number;
  ntcMttrId?: string;
  ntcMttrTtlNm?: string;
  ntcMttrCn?: string;
  aplcnTrgtCd?: string;
  aplcnPrdBgngDt?: string;
  aplcnPrdEndDt?: string;
  atchFileRprsId?: string;
  regDt?: string;
  rgtrNm?: string;
}
