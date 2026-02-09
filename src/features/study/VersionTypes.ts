import { Paging } from "../com/CommonTypes";

// 버전 검색 모델
export interface VersionSearch extends Paging {
  asmtVerCnt?: string; // 과제버전수
  asmtClsfCd?: string; // 과제분류코드
  asmtTypeCd?: string; // 과제유형코드
  asmtVerSttsCd?: string; // 과제버전상태코드
}

// 버전 리스트 모델
export interface VersionList {
  rowNo?: string; // Row No
  asmtVerHstryId?: string; // 과제버전이력아이디
  asmtVerCnt?: string; // 과제버전수 ("1.0" 형태)
  verYmd?: string; // 버전일자 ("2025-01-01" 형태)
  asmtClsfCd?: string; // 과제분류코드
  asmtTypeCd?: string; // 과제유형코드
  atchFileId?: string; // 첨부파일아이디
  asmtVerSttsCd?: string; // 과제버전상태코드
  regDt?: string; // 생성일 ("2025-01-02T10:20:30" 형태)
  aprvDt?: string | null; // 승인일시 (없을 수 있음)
}

// 버전 상세 모델
export interface VersionDetail {
  asmtId?: string; // 과제아이디
  asmtDtlId?: string; // 과제상세아이디
  asmtVerHstryId?: string; // 과제버전이력아이디
  asmtNoNm?: string; // 과제번호명
  asmtVerCnt?: number; // 과제버전수 (BigDecimal → number)
  asmtVerSttsCd?: string; // 과제버전상태코드
  asmtClsfCd?: string; // 과제분류코드
  asmtTypeCd?: string; // 과제유형코드
  verYmd?: string; // 버전일자 (LocalDate → string)
  atchFileId?: string; // 첨부파일아이디
}
