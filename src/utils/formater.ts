export const toChar8Date = (value: string) => value.replace(/-/g, "");

export const displayDate = (value: string) => {
  if (!value) return "-";
  return formatDate(value.replaceAll("-", ""));
};

export const ynLabel = (
  value: string | undefined,
  yesLabel: string,
  noLabel: string,
) => (value === "Y" ? yesLabel : value === "N" ? noLabel : "-");

export const gvbkLabel = (value: string | undefined) =>
  ynLabel(value, "반환", "미반환");

export const prvcLabel = (value: string | undefined) =>
  ynLabel(value, "포함", "미포함");
