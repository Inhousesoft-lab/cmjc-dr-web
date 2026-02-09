export type FormFieldValue =
  | string
  | string[]
  | number
  | boolean
  | File
  | null
  | object;

export interface SelectItem {
  label: string;
  value: string | number;
}

export interface Paging {
  page: number;
  recordCountPerPage: number;
}

export const initSelectItem: SelectItem[] = [
  {
    label: "전체",
    value: "",
  },
];
