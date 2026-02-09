export {};

declare global {
  // 날짜 포맷 변환 함수
  function formatDate(dateString: string, separator?: string): string;

  function formatYYMMDD(dateString: string, separator?: string): string;

  // 빈 값 체크 함수
  function isEmpty<T>(value: unknown): boolean;

  // 디바운스 함수
  function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number,
  ): (...args: Parameters<T>) => void;

  // 깊은 복사 함수
  function deepClone<T>(obj: T): T;

  // 배열 중복 제거 함수
  function uniqueArray<T>(arr: T[]): T[];

  // 👇 에러 메시지 핸들러 추가!
  function getErrorMessage(error: unknown): string;

  interface Window {
    // Any-ID SDK에서 주입하는 전역
    AnyidC?: {
      LOAD_MODULE?: (opts: {
        cfg: string;
        txId: string;
        tag: string;
        lvl: number;
        bypass?: number;
        toggle?: boolean;
        theme?: string;
        redirect_uri?: string;
        success?: (data: any) => void;
        fail?: (err: any) => void;
        log?: (data: any) => void;
        // 필요하면 옵션 추가
        [key: string]: any;
      }) => void;
      [key: string]: any;
    };

    anyidAdaptor?: {
      success: (
        data: { ssob?: string } | null | undefined,
      ) => void | Promise<void>;
    };
  }
}
