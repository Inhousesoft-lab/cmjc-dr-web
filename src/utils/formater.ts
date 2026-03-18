export const toChar8Date = (value: string) => value.replace(/-/g, "");

export const displayDate = (value: string) => {
  if (!value) return "-";
  return formatDate(value.replaceAll("-", ""));
};

export const formatDateDash = (value: unknown) => {
  const raw = String(value ?? "").trim();
  if (!raw) return "-";

  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.length < 8) return "-";

  const yyyy = digits.slice(0, 4);
  const mm = digits.slice(4, 6);
  const dd = digits.slice(6, 8);
  return `${yyyy}-${mm}-${dd}`;
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

export const formatPeriod = (years: unknown, months: unknown) => {
  const y = String(years ?? "").trim();
  const m = String(months ?? "").trim();

  if (!y) return "-";
  if (y === "0") return `${m || "0"}개월`;
  if (y === "90") return "준영구";
  if (y === "99") return "영구";
  return `${y}년`;
};

export const formatYmd = (value: unknown) => {
  const raw = String(value ?? "").trim();
  if (!raw) return "-";

  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.length < 8) return "-";

  const yyyymmdd = digits.slice(0, 8);
  return formatYYMMDD(yyyymmdd);
};

export const formatRegDate = (value: unknown) => {
  const raw = String(value ?? "").trim();
  if (!raw) return "-";

  // ISO("2026-03-03T14:47:05.049+00:00") 또는 YYYYMMDD 모두 대응
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.length < 8) return "-";

  return formatDate(digits.slice(0, 8));
};

export const holdPeriodLabel = (
  years: number | null | undefined,
  months: number | null | undefined,
) => {
  const y = years == null ? "" : String(years);
  if (!y) return "-";
  if (y === "0") return `${months ?? 0}개월`;
  if (y === "90") return "준영구";
  if (y === "99") return "영구";
  return `${y}년`;
};

export const dateLabel = (value: string | undefined) => {
  const raw = String(value ?? "").trim();
  if (!raw) return "-";
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.length < 8) return "-";
  return formatDate(digits.slice(0, 8));
};

const toDateParts = (value: unknown) => {
  const digits = String(value ?? "").replace(/[^0-9]/g, "");
  if (digits.length < 8) return null;

  const year = Number(digits.slice(0, 4));
  const month = Number(digits.slice(4, 6));
  const day = Number(digits.slice(6, 8));

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return null;
  }

  return { year, month, day };
};

const formatDateParts = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};

export const calculateEndYmdByPeriod = (
  clctYmd: unknown,
  years: unknown,
  months: unknown,
) => {
  const base = toDateParts(clctYmd);
  const y = String(years ?? "").trim();
  const m = String(months ?? "").trim();

  if (!y || !base) return "";
  if (y === "90" || y === "99") return "99991231";

  const date = new Date(Date.UTC(base.year, base.month - 1, base.day));

  if (y !== "0") {
    date.setUTCFullYear(date.getUTCFullYear() + Number(y));
  }

  if (m) {
    date.setUTCMonth(date.getUTCMonth() + Number(m));
  }

  return formatDateParts(date);
};

export const formatCalculatedEndYmd = (
  clctYmd: unknown,
  years: unknown,
  months: unknown,
) => formatDateDash(calculateEndYmdByPeriod(clctYmd, years, months));
