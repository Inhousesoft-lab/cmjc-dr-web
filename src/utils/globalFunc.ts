// 날짜 형태 변경
export function formatDate(dateString: string, separator = ".") {
  if (isEmpty(dateString)) {
    return "";
  }
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);
  return `${year}${separator}${month}${separator}${day}`;
}

export function formatYYMMDD(yyyymmdd: string, separator: string = ".") {
  // 입력 유효성 검사
  if (!/^\d{8}$/.test(yyyymmdd)) {
    throw new Error("YYYYMMDD 형식이 아닙니다");
  }

  const year = yyyymmdd.slice(2, 4); // "25"
  const month = yyyymmdd.slice(4, 6); // "12"
  const day = yyyymmdd.slice(6, 8); // "05"

  return `${year}${separator}${month}${separator}${day}`;
}

// 빈 값 체크 함수
// value: 검사할 값 (모든 타입)
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  return false; // 그 외는 비어있다고 안 본다
}

// 디바운스 함수
// func: 호출할 함수, delay: 디바운스 시간 (ms)
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

// 깊은 복사 함수
// obj: 복사할 객체 (모든 타입)
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// 배열 중복 제거 함수
// arr: 중복 제거할 배열 (모든 타입)
export function uniqueArray<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }

  const safeError = error as any;
  return (
    safeError.displayMessage ||
    safeError.data?.message ||
    safeError.data?.data?.message ||
    safeError.response?.data?.data?.message ||
    safeError.response?.data?.message ||
    safeError.response?.data?.result?.errors?.message ||
    safeError.message ||
    "알 수 없는 오류가 발생했습니다."
  );
}

function normalizeComparableDate(value: string): string {
  return value.replace(/[^0-9]/g, "");
}

export function isDateRangeInvalid(fromValue: string, toValue: string): boolean {
  if (isEmpty(fromValue) || isEmpty(toValue)) {
    return false;
  }

  const normalizedFrom = normalizeComparableDate(fromValue);
  const normalizedTo = normalizeComparableDate(toValue);

  if (normalizedFrom.length !== 8 || normalizedTo.length !== 8) {
    return false;
  }

  return normalizedTo < normalizedFrom;
}

(globalThis as any).formatDate = formatDate;
(globalThis as any).formatYYMMDD = formatYYMMDD;
(globalThis as any).isEmpty = isEmpty;
(globalThis as any).debounce = debounce;
(globalThis as any).deepClone = deepClone;
(globalThis as any).uniqueArray = uniqueArray;
(globalThis as any).getErrorMessage = getErrorMessage;
(globalThis as any).isDateRangeInvalid = isDateRangeInvalid;
