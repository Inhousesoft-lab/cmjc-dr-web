export const selectMemberListApiPath = () => "/api/dr/members";

export const selectMemberApiPath = (mbrId: string) =>
  `/api/dr/members/${encodeURIComponent(mbrId)}`;

export const checkMemberIdDuplicateApiPath = (mbrId: string) =>
  `/api/dr/members/${encodeURIComponent(mbrId)}/duplicate`;

export const createMemberApiPath = () => "/api/dr/members";

export const updateMemberApiPath = (mbrId: string) =>
  `/api/dr/members/${encodeURIComponent(mbrId)}`;

export const selectDepartmentListApiPath = () => "/api/dr/departments";

export const createDepartmentApiPath = () => "/api/dr/departments";

export const updateDepartmentApiPath = (deptNo: string) =>
  `/api/dr/departments/${encodeURIComponent(deptNo)}`;
