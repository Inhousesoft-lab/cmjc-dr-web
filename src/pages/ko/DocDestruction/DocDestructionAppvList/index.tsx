import { Alert, Box, Button, Grid, IconButton, Stack, TextField } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { MuiDatePickerFt } from "@/components/elements/MuiDatePickerFt";

import AgGridContainer from "@/components/grid/AgGridContainer";
import { listDefs } from "./col-def";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import MuiSelect from "@/components/elements/MuiSelect";
import { useLocation, useNavigate } from "react-router";
import useNotifications from "@/hooks/useNotifications";
import { DocDestruction } from "@/types/docDestruction";
import { ColDef } from "ag-grid-community";
import GridField from "@/components/common/GridField";
import { useDocClsfOptions } from "@/hooks/useDocClsfOptions";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchDocDestructionList } from "@/features/docDestruction/DocDestructionThunk";
import {
  selectDocDestructionError,
  selectDocDestructionLoading,
  selectDocDestructionRowCount,
  selectDocDestructionRows,
} from "@/features/docDestruction/DocDestructionSelectors";
import type { SearchValues } from "@/types/docDestruction";
import { getLangFromPathname, langPath } from "@/routes/lang";
import DocDestructionAppvButton from "@/components/actionButtons/DocDestructionAppvButton";
import { isDocDestructionMockEnabled } from "@/features/docDestruction/docDestructionMock";
import { isDateRangeInvalid } from "@/utils/globalFunc";

const buildSearchValues = (): SearchValues => ({
  reqCd: "APRV",
  docLclsfNo: "",
  docMclsfNo: "",
  docSclsfNo: "",
  docNo: "",
  docTtl: "",
  docClsfNm: "",
  fromEndYmd: "",
  toEndYmd: "",
  fromDstrcAplyYmd: "",
  toDstrcAplyYmd: "",
  fromDstrcAprvYmd: "",
  toDstrcAprvYmd: "",
  pageNum: 1,
  pageSize: 10,
});

export default function DocDestructionList() {
  const dateRangeErrorMessage = "종료일은 시작일보다 빠를 수 없습니다.";
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const notifications = useNotifications();
  const curLang = getLangFromPathname(location.pathname);
  const initialSearchValues = React.useMemo(() => buildSearchValues(), []);

  const printAreaRef = useRef<HTMLDivElement | null>(null);

  const restoredState = (
    location.state as { restoreListState?: SearchValues } | null
  )?.restoreListState;

  const [docLclsfNo, setDocLclsfNo] = useState(
    restoredState?.docLclsfNo ?? initialSearchValues.docLclsfNo,
  );
  const [docMclsfNo, setDocMclsfNo] = useState(
    restoredState?.docMclsfNo ?? initialSearchValues.docMclsfNo,
  );
  const [docSclsfNo, setDocSclsfNo] = useState(
    restoredState?.docSclsfNo ?? initialSearchValues.docSclsfNo,
  );
  const [docNo, setDocNo] = useState(
    restoredState?.docNo ?? initialSearchValues.docNo,
  );
  const [docTtl, setDocTtl] = useState(
    restoredState?.docTtl ?? initialSearchValues.docTtl,
  );
  const [fromEndYmd, setFromEndYmd] = useState(
    restoredState?.fromEndYmd ?? initialSearchValues.fromEndYmd,
  );
  const [toEndYmd, setToEndYmd] = useState(
    restoredState?.toEndYmd ?? initialSearchValues.toEndYmd,
  );
  const [pageNum, setPageNum] = useState(
    restoredState?.pageNum ?? initialSearchValues.pageNum,
  );
  const [pageSize, setPageSize] = useState(
    restoredState?.pageSize ?? initialSearchValues.pageSize,
  );
  const [dateRangeError, setDateRangeError] = useState("");
  const { lclsfList, mclsfList, sclsfList } = useDocClsfOptions(
    docLclsfNo,
    docMclsfNo,
  );

  const [columnDefs] = React.useState<ColDef<DocDestruction>[]>(listDefs);

  const rows = useAppSelector(selectDocDestructionRows);
  const rowCount = useAppSelector(selectDocDestructionRowCount);
  const isLoading = useAppSelector(selectDocDestructionLoading);
  const listError = useAppSelector(selectDocDestructionError);

  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const mockEnabled = isDocDestructionMockEnabled();

  const handleSelectionChange = useCallback((rows: any[]) => {
    setSelectedRows(rows);
  }, []);

  const searchValues = useMemo(
    () => ({
      ...initialSearchValues,
      docLclsfNo,
      docMclsfNo,
      docSclsfNo,
      docNo,
      docTtl,
      fromEndYmd,
      toEndYmd,
      pageNum,
      pageSize,
    }),
    [
      docLclsfNo,
      docMclsfNo,
      docNo,
      docSclsfNo,
      docTtl,
      fromEndYmd,
      initialSearchValues,
      pageNum,
      pageSize,
      toEndYmd,
    ],
  );

  const handleAppvSuccess = useCallback(() => {
    dispatch(fetchDocDestructionList(searchValues));
  }, [dispatch, searchValues]);

  const loadData = () => {
    if (isDateRangeInvalid(fromEndYmd, toEndYmd)) {
      setDateRangeError(dateRangeErrorMessage);
      return;
    }
    const nextParams = { ...searchValues, pageNum: 1 };
    setPageNum(1);
    dispatch(fetchDocDestructionList(nextParams));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loadData();
  };

  const handleRefresh = () => {
    setDocLclsfNo(initialSearchValues.docLclsfNo);
    setDocMclsfNo(initialSearchValues.docMclsfNo);
    setDocSclsfNo(initialSearchValues.docSclsfNo);
    setDocNo(initialSearchValues.docNo);
    setDocTtl(initialSearchValues.docTtl);
    setFromEndYmd(initialSearchValues.fromEndYmd);
    setToEndYmd(initialSearchValues.toEndYmd);
    setDateRangeError("");
    setPageNum(initialSearchValues.pageNum);
    setPageSize(initialSearchValues.pageSize);
    dispatch(
      fetchDocDestructionList({
        ...initialSearchValues,
      }),
    );
  };

  useEffect(() => {
    dispatch(
      fetchDocDestructionList({
        ...searchValues,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (!listError) return;
    notifications.show(listError, {
      severity: "error",
      autoHideDuration: 3000,
    });
  }, [listError, notifications]);

  useEffect(() => {
    setDateRangeError(isDateRangeInvalid(fromEndYmd, toEndYmd) ? dateRangeErrorMessage : "");
  }, [dateRangeErrorMessage, fromEndYmd, toEndYmd]);

  const handleRowClick = (row: DocDestruction) => {
    if (!row.eldocNo) return;
    navigate(langPath(`docDestruction/${row.eldocNo}`, curLang), {
      state: {
        sourceListPath: "destruction/appvList",
        listState: searchValues,
      },
    });
  };

  return (
    <div>
      {mockEnabled ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          테스트용 mock 승인 목록이 표시 중입니다. 실제 권한 없이 승인 화면과 승인 처리 흐름을 검증할 수 있습니다.
        </Alert>
      ) : null}
      <Stack
        component="form"
        direction="row"
        className="search-area"
        mb={2}
        onSubmit={handleSubmit}
      >
        <Grid container spacing={0} className="table-view-grid">
          {/* 1행 */}
          <GridField
            item={4}
            label="대분류"
            value={
              <MuiSelect
                id="docLclsfNo"
                items={lclsfList}
                value={docLclsfNo}
                onChange={(e) => {
                  setDocLclsfNo(e.target.value);
                  setDocMclsfNo("");
                  setDocSclsfNo("");
                }}
              />
            }
          />
          <GridField
            item={4}
            label="중분류"
            value={
              <MuiSelect
                id="docMclsfNo"
                items={mclsfList}
                value={docMclsfNo}
                onChange={(e) => {
                  setDocMclsfNo(e.target.value);
                  setDocSclsfNo("");
                }}
              />
            }
          />
          <GridField
            item={4}
            label="소분류"
            value={
              <MuiSelect
                id="docSclsfNo"
                items={sclsfList}
                value={docSclsfNo}
                onChange={(e) => setDocSclsfNo(e.target.value)}
              />
            }
          />
          {/* 2행 */}
          <GridField
            item={12}
            label="종료일자"
            labelSize={{ xs: 4, sm: 1 }}
            valueSize={{ xs: 8, sm: 11 }}
            value={
              <div className="filter-range">
                <MuiDatePickerFt
                  value={fromEndYmd}
                  onChange={setFromEndYmd}
                  error={Boolean(dateRangeError)}
                  helperText={dateRangeError}
                />
                <span className="filter-range-sep">-</span>{" "}
                <MuiDatePickerFt
                  value={toEndYmd}
                  onChange={setToEndYmd}
                  error={Boolean(dateRangeError)}
                  helperText={dateRangeError}
                />
              </div>
            }
          />
          {/* 3행 */}
          <GridField
            item={4}
            label="문서번호"
            value={
              <TextField
                name="docNo"
                fullWidth
                size="small"
                placeholder="문서번호"
                value={docNo}
                onChange={(e) => setDocNo(e.target.value)}
              />
            }
          />
          <GridField
            item={4}
            label="문서제목"
            value={
              <TextField
                name="docTtl"
                fullWidth
                size="small"
                placeholder="문서제목"
                value={docTtl}
                onChange={(e) => setDocTtl(e.target.value)}
              />
            }
          />
          <GridField item={4} label="" value={null} blank />
        </Grid>
        <Box
          className="table-view-actions"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button type="submit" variant="contained" onClick={loadData}>
            조회
          </Button>
          <IconButton
            aria-label="검색 초기화 및 새로고침"
            onClick={handleRefresh}
            sx={{ width: 40, height: 40, p: 1 }}
          >
            <RefreshIcon fontSize="medium" />
          </IconButton>
        </Box>
      </Stack>
      <div className="btn_wrapper">
        <DocDestructionAppvButton
          selectedRows={selectedRows}
          onSuccess={handleAppvSuccess}
        />
      </div>

      <Box ref={printAreaRef} sx={{ width: "100%" }}>
        <AgGridContainer
          isLoading={isLoading}
          enableRowSelection={true}
          colDefs={columnDefs}
          rowData={rows}
          pageNum={pageNum}
          pageSize={pageSize}
          count={rowCount}
          onRowClick={handleRowClick}
          onSelectionChange={handleSelectionChange}
          onPageChange={({ pageNum: nextPage, pageSize: nextSize }) => {
            setPageNum(nextPage);
            setPageSize(nextSize);
            dispatch(
              fetchDocDestructionList({
                ...searchValues,
                pageNum: nextPage,
                pageSize: nextSize,
              }),
            );
          }}
        />
      </Box>
    </div>
  );
}
