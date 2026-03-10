/**
 * 문서열람(외부)
 */
export const selectExternalViewListApiPath = () =>
  "/api/dr/external-view/documents";

export const selectExternalViewDetailApiPath = (eldocNo: string) =>
  `/api/dr/external-view/documents/${eldocNo}`;

export const downloadExternalViewFileApiPath = (eldocNo: string) =>
  `/api/dr/external-view/documents/${eldocNo}/file`;
