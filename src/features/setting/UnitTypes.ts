import { Paging } from "@/features/com/CommonTypes";

export interface UnitType {
  rowNo: number;
  unitTypeId?: string;
  unitTypeNm?: string;
  useYn?: string;
}

export interface Unit {
  rowNo: number;
  unitId?: string;
  unitTypeId?: string;
  unitTypeNm?: string;
  unitNm?: string;
  unitCnvsVlNm?: string;
}

export interface UnitTypeSearchVO extends Paging {
  unitTypeNm: string;
}

export interface UnitSearchVO extends Paging {
  unitTypeId: string;
  unitTypeNm: string;
  unitNm: string;
}
