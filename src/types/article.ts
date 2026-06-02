export type ArticleUseYn = "Y" | "N";
export type ArticleSystemYn = "Y" | "N";

export interface ArticleRow {
  clientId: string;
  articleNo: string;
  articleNm: string;
  articleSeq: number;
  useYn: ArticleUseYn;
  systemYn: ArticleSystemYn;
  isNew?: boolean;
  isDirty?: boolean;
}
