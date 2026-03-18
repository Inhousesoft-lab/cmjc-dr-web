/**
 * 문서열람(외부)
 */
export const selectExternalViewListApiPath = () =>
  "/api/dr/external-view/documents";

export const selectExternalViewDetailApiPath = (eldocNo: string) =>
  `/api/dr/external-view/documents/${eldocNo}`;

export const downloadExternalViewFileApiPath = (eldocNo: string, filename?: string) => {
  const path = `/api/dr/external-view/documents/${eldocNo}/file`;
  if (!filename) return path;

  const params = new URLSearchParams({
    filename,
  });

  return `${path}?${params.toString()}`;
};
