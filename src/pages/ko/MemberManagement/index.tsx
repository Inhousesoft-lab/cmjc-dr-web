import React from "react";
import { Box, Button, Grid, IconButton, Stack, TextField } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import type { ColDef } from "ag-grid-community";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import AgGridContainer from "@/components/grid/AgGridContainer";
import GridField from "@/components/common/GridField";
import https from "@/api/axiosInstance";
import { selectDepartmentListApiPath } from "@/api/member/MemberApiPaths";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { isDrAdminUser } from "@/features/auth/authAccess";
import { fetchMemberList } from "@/features/member/MemberThunk";
import {
  selectMemberError,
  selectMemberLoading,
  selectMemberRowCount,
  selectMemberRows,
} from "@/features/member/MemberSelectors";
import type { DepartmentRow, MemberRow, MemberSearchValues } from "@/types/member";
import { getLangFromPathname, langPath } from "@/routes/lang";
import useNotifications from "@/hooks/useNotifications";
import { getErrorMessage } from "@/utils/globalFunc";
import DepartmentTreeDialog from "./DepartmentTreeDialog";
import { listDefs } from "./col-def";

const INITIAL_SEARCH_PARAMS: MemberSearchValues = {
  deptNo: "",
  deptNm: "",
  mbrId: "",
  mbrNm: "",
  pageNum: 1,
  pageSize: 10,
};

const LIST_KEYS = ["list", "rows", "items", "content"] as const;

const toStr = (value: unknown) => (value == null ? "" : String(value));

const isRecord = (value: unknown): value is Record<string, any> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const pickArray = (payload: any): any[] => {
  const roots = [
    payload,
    payload?.data,
    payload?.result,
    payload?.data?.data,
    payload?.result?.data,
  ];

  for (const root of roots) {
    if (Array.isArray(root)) return root;
    if (!isRecord(root)) continue;
    for (const key of LIST_KEYS) {
      if (Array.isArray(root[key])) return root[key];
    }
  }

  return [];
};

const normalizeDepartments = (payload: any): DepartmentRow[] =>
  pickArray(payload)
    .map((item) => ({
      rowNo: Number(item?.rowNo ?? item?.row_no ?? 0),
      deptNo: toStr(item?.deptNo ?? item?.dept_no),
      deptNm: toStr(item?.deptNm ?? item?.dept_nm),
      upDeptNo: toStr(item?.upDeptNo ?? item?.up_dept_no),
      useEn: toStr(item?.useEn ?? item?.use_en),
      useYn: toStr(item?.useYn ?? item?.use_yn),
    }))
    .filter((item) => item.deptNo && item.deptNm);

export default function MemberManagement() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const notifications = useNotifications();
  const curLang = getLangFromPathname(location.pathname);
  const user = useAppSelector((state) => state.auth.user);
  const rows = useAppSelector(selectMemberRows);
  const rowCount = useAppSelector(selectMemberRowCount);
  const isLoading = useAppSelector(selectMemberLoading);
  const listError = useAppSelector(selectMemberError);
  const [columnDefs] = React.useState<ColDef<MemberRow>[]>(listDefs);
  const [searchParams, setSearchParams] =
    React.useState<MemberSearchValues>(INITIAL_SEARCH_PARAMS);
  const [departments, setDepartments] = React.useState<DepartmentRow[]>([]);
  const [departmentDialogOpen, setDepartmentDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isDrAdminUser(user)) return;
    dispatch(fetchMemberList(INITIAL_SEARCH_PARAMS));
  }, [dispatch, user]);

  React.useEffect(() => {
    if (!isDrAdminUser(user)) return;

    let canceled = false;
    const fetchDepartments = async () => {
      try {
        const res = await https.get(selectDepartmentListApiPath(), {
          params: {
            useEn: "Y",
            pageNum: 1,
            pageSize: 1000,
          },
        });
        if (!canceled) {
          setDepartments(normalizeDepartments((res as any)?.data ?? {}));
        }
      } catch (error) {
        if (!canceled) {
          notifications.show(getErrorMessage(error), {
            severity: "error",
            autoHideDuration: 3000,
          });
        }
      }
    };

    fetchDepartments();

    return () => {
      canceled = true;
    };
  }, [notifications, user]);

  React.useEffect(() => {
    if (!listError) return;
    notifications.show(listError, {
      severity: "error",
      autoHideDuration: 3000,
    });
  }, [listError, notifications]);

  if (!isDrAdminUser(user)) {
    return <Navigate to={`/${curLang}`} replace />;
  }

  const handleSearch = () => {
    const nextParams = { ...searchParams, pageNum: 1 };
    setSearchParams(nextParams);
    dispatch(fetchMemberList(nextParams));
  };

  const handleResetSearchValues = () => {
    const resetParams = { ...INITIAL_SEARCH_PARAMS };
    setSearchParams(resetParams);
    dispatch(fetchMemberList(resetParams));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch();
  };

  const handleCreateClick = () => {
    navigate(langPath("members/create", curLang));
  };

  const handleRowClick = (row: MemberRow) => {
    if (!row.mbrId) return;
    navigate(langPath(`members/${encodeURIComponent(row.mbrId)}`, curLang));
  };

  const handleDepartmentSelect = (department: DepartmentRow) => {
    setSearchParams((prev) => ({
      ...prev,
      deptNo: department.deptNo,
      deptNm: department.deptNm,
    }));
  };

  return (
    <div>
      <Stack
        component="form"
        direction="row"
        className="search-area"
        mb={2}
        onSubmit={handleSubmit}
      >
        <Grid container spacing={0} className="table-view-grid">
          <GridField
            item={4}
            label="부서"
            value={
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <TextField
                  fullWidth
                  size="small"
                  placeholder="부서"
                  value={searchParams.deptNm}
                  InputProps={{ readOnly: true }}
                  onClick={() => setDepartmentDialogOpen(true)}
                />
                <IconButton
                  type="button"
                  aria-label="부서 조회"
                  onClick={() => setDepartmentDialogOpen(true)}
                  sx={{ width: 40, height: 40, flexShrink: 0 }}
                >
                  <SearchIcon />
                </IconButton>
              </Stack>
            }
          />
          <GridField
            item={4}
            label="ID"
            value={
              <TextField
                fullWidth
                size="small"
                placeholder="검색어"
                value={searchParams.mbrId}
                onChange={(event) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    mbrId: event.target.value,
                  }))
                }
              />
            }
          />
          <GridField
            item={4}
            label="이름"
            value={
              <TextField
                fullWidth
                size="small"
                placeholder="검색어"
                value={searchParams.mbrNm}
                onChange={(event) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    mbrNm: event.target.value,
                  }))
                }
              />
            }
          />
        </Grid>
        <Box className="table-view-actions">
          <Stack spacing={1} alignItems="center">
            <Button type="submit" variant="contained" onClick={handleSearch}>
              조회
            </Button>
            <IconButton
              aria-label="검색조건 초기화"
              onClick={handleResetSearchValues}
              sx={{ width: 40, height: 40, p: 1 }}
            >
              <RefreshIcon fontSize="medium" />
            </IconButton>
          </Stack>
        </Box>
      </Stack>

      <AgGridContainer<MemberRow>
        actionButtons={[{ label: "등록", onClick: handleCreateClick }]}
        isLoading={isLoading}
        enableRowSelection={false}
        colDefs={columnDefs}
        rowData={rows}
        pageNum={searchParams.pageNum}
        pageSize={searchParams.pageSize}
        count={rowCount}
        onRowClick={handleRowClick}
        onPageChange={({ pageNum: nextPage, pageSize: nextSize }) => {
          const nextParams = {
            ...searchParams,
            pageNum: nextPage,
            pageSize: nextSize,
          };
          setSearchParams(nextParams);
          dispatch(fetchMemberList(nextParams));
        }}
      />

      <DepartmentTreeDialog
        open={departmentDialogOpen}
        departments={departments}
        selectedDeptNo={searchParams.deptNo}
        onClose={() => setDepartmentDialogOpen(false)}
        onSelect={handleDepartmentSelect}
      />
    </div>
  );
}
