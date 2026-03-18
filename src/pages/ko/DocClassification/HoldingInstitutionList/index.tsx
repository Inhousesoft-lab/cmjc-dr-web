import React from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { ColDef } from "ag-grid-community";
import { useSearchParams } from "react-router-dom";
import { listDefs } from "./col-def";
import { useDialogs } from "@/hooks/useDialogs/useDialogs";
import useNotifications from "@/hooks/useNotifications";
import { MuiDatePickerFt } from "@/components/elements/MuiDatePickerFt";
import AgGridContainer from "@/components/grid/AgGridContainer";
import MuiSelect from "@/components/elements/MuiSelect";
import GridField from "@/components/common/GridField";
import { useDocClsfOptions } from "@/hooks/useDocClsfOptions";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  fetchHoldingInstitutionList,
  updateHoldingInstitutionHldprd,
  updateHoldingInstitutionHldprdAll,
} from "@/features/holdingInstitution/HoldingInstitutionThunk";
import {
  selectHoldingInstitutionError,
  selectHoldingInstitutionLoading,
  selectHoldingInstitutionRowCount,
  selectHoldingInstitutionRows,
} from "@/features/holdingInstitution/HoldingInstitutionSelectors";
import type { HoldingInstitution, SearchValues } from "@/types/holdingInstitution";

const INITIAL_SEARCH_PARAMS: SearchValues = {
  fromClctYmd: "",
  toClctYmd: "",
  fromEndYmd: "",
  toEndYmd: "",
  docLclsfNo: "",
  docMclsfNo: "",
  docSclsfNo: "",
  docNo: "",
  docTtl: "",
  infoMnbdAgreYn: "",
  hldPrdDfyrs: "",
  hldPrdChangedOnly: false,
  pageNum: 1,
  pageSize: 10,
};

const toBool = (value: string | null) =>
  value === "true" || value === "Y" || value === "1";

const buildInitialSearchParams = (
  queryParams: URLSearchParams,
): SearchValues => ({
  ...INITIAL_SEARCH_PARAMS,
  fromClctYmd: queryParams.get("fromClctYmd") ?? INITIAL_SEARCH_PARAMS.fromClctYmd,
  toClctYmd: queryParams.get("toClctYmd") ?? INITIAL_SEARCH_PARAMS.toClctYmd,
  fromEndYmd: queryParams.get("fromEndYmd") ?? INITIAL_SEARCH_PARAMS.fromEndYmd,
  toEndYmd: queryParams.get("toEndYmd") ?? INITIAL_SEARCH_PARAMS.toEndYmd,
  docLclsfNo: queryParams.get("docLclsfNo") ?? INITIAL_SEARCH_PARAMS.docLclsfNo,
  docMclsfNo: queryParams.get("docMclsfNo") ?? INITIAL_SEARCH_PARAMS.docMclsfNo,
  docSclsfNo: queryParams.get("docSclsfNo") ?? INITIAL_SEARCH_PARAMS.docSclsfNo,
  docNo: queryParams.get("docNo") ?? INITIAL_SEARCH_PARAMS.docNo,
  docTtl: queryParams.get("docTtl") ?? INITIAL_SEARCH_PARAMS.docTtl,
  infoMnbdAgreYn:
    queryParams.get("infoMnbdAgreYn") ?? INITIAL_SEARCH_PARAMS.infoMnbdAgreYn,
  hldPrdDfyrs: queryParams.get("hldPrdDfyrs") ?? INITIAL_SEARCH_PARAMS.hldPrdDfyrs,
  hldPrdChangedOnly: toBool(queryParams.get("hldPrdChangedOnly")),
  pageNum: Number(queryParams.get("pageNum") || INITIAL_SEARCH_PARAMS.pageNum),
  pageSize: Number(queryParams.get("pageSize") || INITIAL_SEARCH_PARAMS.pageSize),
});

const HOLD_PERIOD_ITEMS = [
  { name: "전체", code: "" },
  { name: "1년", code: "1" },
  { name: "3년", code: "3" },
  { name: "5년", code: "5" },
  { name: "10년", code: "10" },
  { name: "30년", code: "30" },
  { name: "준영구", code: "90" },
  { name: "영구", code: "99" },
  { name: "직접입력", code: "0" },
];

export default function HoldingInstitutionList() {
  const dispatch = useAppDispatch();
  const notifications = useNotifications();
  const dialogs = useDialogs();
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const initialSearchParams = React.useMemo(
    () => buildInitialSearchParams(urlSearchParams),
    [urlSearchParams],
  );

  const [columnDefs] = React.useState<ColDef[]>(listDefs);
  const [searchParams, setSearchParams] =
    React.useState<SearchValues>(initialSearchParams);

  const { lclsfList, mclsfList, sclsfList, lclsfError } = useDocClsfOptions(
    searchParams.docLclsfNo,
    searchParams.docMclsfNo,
  );

  const rows = useAppSelector(selectHoldingInstitutionRows);
  const filteredRows = React.useMemo(
    () =>
      rows.filter((row) => {
        const before = String(row.endYmd ?? "").trim();
        const after = String(row.endYmdAfterChanged ?? "").trim();
        const beforeYears = String(row.hldPrdDfyrs ?? "").trim();
        const beforeMonths = String(row.hldPrdMmCnt ?? "").trim();
        const afterYears = String(row.docClsf?.prvcFileHldPrst?.hldPrdDfyrs ?? "").trim();
        const afterMonths = String(row.docClsf?.prvcFileHldPrst?.hldPrdMmCnt ?? "").trim();

        const periodChanged = beforeYears !== afterYears || beforeMonths !== afterMonths;
        const endDateChanged = !!after && before !== after;

        return periodChanged || endDateChanged;
      }),
    [rows],
  );
  const rowCount = useAppSelector(selectHoldingInstitutionRowCount);
  const isLoading = useAppSelector(selectHoldingInstitutionLoading);
  const listError = useAppSelector(selectHoldingInstitutionError);

  React.useEffect(() => {
    dispatch(fetchHoldingInstitutionList(initialSearchParams));
  }, [dispatch]);

  React.useEffect(() => {
    if (!listError) return;
    notifications.show(listError, {
      severity: "error",
      autoHideDuration: 3000,
    });
  }, [listError, notifications]);

  React.useEffect(() => {
    if (!lclsfError) return;
    notifications.show(lclsfError, {
      severity: "error",
      autoHideDuration: 3000,
    });
  }, [lclsfError, notifications]);

  const [selectedRows, setSelectedRows] = React.useState<HoldingInstitution[]>([]);

  const syncSearchParams = React.useCallback(
    (nextParams: SearchValues) => {
      setSearchParams(nextParams);
      setUrlSearchParams(
        Object.fromEntries(
          Object.entries(nextParams).map(([key, value]) => [key, String(value)]),
        ),
      );
    },
    [setUrlSearchParams],
  );

  const handleSelectionChange = React.useCallback((nextRows: HoldingInstitution[]) => {
    setSelectedRows(nextRows);
  }, []);

  const handleApplySelectedRows = React.useCallback(async () => {
    if (selectedRows.length === 0) {
      notifications.show("선택된 문서가 없습니다.", {
        severity: "error",
        autoHideDuration: 3000,
      });
      return;
    }

    const confirmed = await dialogs.confirm(
      "선택된 파일에 대한 문서분류의 현재 보유기간으로 변경됩니다. 변경하시겠습니까? (※ 정보주체 동의를 받아 수집한 경우, 반드시 변경된 보유기간으로 재동의를 받으셔야 합니다. )",
      {
        title: "보유기간 변경",
        severity: "info",
        okText: "확인",
        cancelText: "취소",
      },
    );

    if (!confirmed) return;

    try {
      await dispatch(
        updateHoldingInstitutionHldprd({
          eldocNos: selectedRows.map((row) => row.eldocNo).filter(Boolean),
        }),
      ).unwrap();

      notifications.show("변경되었습니다", {
        severity: "success",
        autoHideDuration: 3000,
      });
      const nextParams = {
        ...searchParams,
        hldPrdChangedOnly: false,
        pageNum: 1,
      };
      syncSearchParams(nextParams);
      dispatch(fetchHoldingInstitutionList(nextParams));
      setSelectedRows([]);
    } catch (error) {
      notifications.show(getErrorMessage(error), {
        severity: "error",
        autoHideDuration: 3000,
      });
    }
  }, [dialogs, dispatch, notifications, searchParams, selectedRows, syncSearchParams]);

  const handleApplyAllRows = React.useCallback(async () => {
    const confirmed = await dialogs.confirm(
      "전체 파일에 대한 문서분류의 현재 보유기간으로 변경됩니다. 변경하시겠습니까? (※ 정보주체 동의를 받아 수집한 경우, 반드시 변경된 보유기간으로 재동의를 받으셔야 합니다. )",
      {
        title: "보유기간 변경",
        severity: "info",
        okText: "확인",
        cancelText: "취소",
      },
    );

    if (!confirmed) return;

    try {
      await dispatch(
        updateHoldingInstitutionHldprdAll({
          docLclsfNo: searchParams.docLclsfNo,
          docMclsfNo: searchParams.docMclsfNo,
          docSclsfNo: searchParams.docSclsfNo,
          docNo: searchParams.docNo,
          docTtl: searchParams.docTtl,
          infoMnbdAgreYn: searchParams.infoMnbdAgreYn,
          hldPrdDfyrs: searchParams.hldPrdDfyrs,
          hldPrdChangedOnly: searchParams.hldPrdChangedOnly,
          fromClctYmd: searchParams.fromClctYmd,
          toClctYmd: searchParams.toClctYmd,
          fromEndYmd: searchParams.fromEndYmd,
          toEndYmd: searchParams.toEndYmd,
        }),
      ).unwrap();

      notifications.show("변경되었습니다", {
        severity: "success",
        autoHideDuration: 3000,
      });
      const nextParams = {
        ...searchParams,
        hldPrdChangedOnly: false,
        pageNum: 1,
      };
      syncSearchParams(nextParams);
      dispatch(fetchHoldingInstitutionList(nextParams));
      setSelectedRows([]);
    } catch (error) {
      notifications.show(getErrorMessage(error), {
        severity: "error",
        autoHideDuration: 3000,
      });
    }
  }, [dialogs, dispatch, notifications, searchParams, syncSearchParams]);

  const handleSearch = React.useCallback(() => {
    const nextParams = { ...searchParams, pageNum: 1 };
    syncSearchParams(nextParams);
    dispatch(fetchHoldingInstitutionList(nextParams));
  }, [dispatch, searchParams, syncSearchParams]);

  const handleResetSearchValues = React.useCallback(() => {
    const resetParams = { ...INITIAL_SEARCH_PARAMS };
    syncSearchParams(resetParams);
    dispatch(fetchHoldingInstitutionList(resetParams));
  }, [dispatch, syncSearchParams]);

  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      handleSearch();
    },
    [handleSearch],
  );

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
            item={6}
            label="수집일자"
            labelSize={{ xs: 4, sm: 1 }}
            valueSize={{ xs: 8, sm: 5 }}
            value={
              <div className="filter-range">
                <MuiDatePickerFt
                  value={searchParams.fromClctYmd}
                  onChange={(value) =>
                    setSearchParams((prev) => ({ ...prev, fromClctYmd: value }))
                  }
                />
                <span className="filter-range-sep">-</span>{" "}
                <MuiDatePickerFt
                  value={searchParams.toClctYmd}
                  onChange={(value) =>
                    setSearchParams((prev) => ({ ...prev, toClctYmd: value }))
                  }
                />
              </div>
            }
          />
          <GridField
            item={6}
            label="종료일자"
            labelSize={{ xs: 4, sm: 1 }}
            valueSize={{ xs: 8, sm: 5 }}
            value={
              <div className="filter-range">
                <MuiDatePickerFt
                  value={searchParams.fromEndYmd}
                  onChange={(value) =>
                    setSearchParams((prev) => ({ ...prev, fromEndYmd: value }))
                  }
                />
                <span className="filter-range-sep">-</span>{" "}
                <MuiDatePickerFt
                  value={searchParams.toEndYmd}
                  onChange={(value) =>
                    setSearchParams((prev) => ({ ...prev, toEndYmd: value }))
                  }
                />
              </div>
            }
          />
          <GridField
            item={3}
            label="대분류"
            value={
              <MuiSelect
                id="docLclsfNo"
                items={lclsfList}
                value={searchParams.docLclsfNo}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    docLclsfNo: e.target.value,
                    docMclsfNo: "",
                    docSclsfNo: "",
                  }))
                }
              />
            }
          />
          <GridField
            item={3}
            label="중분류"
            value={
              <MuiSelect
                id="docMclsfNo"
                items={mclsfList}
                value={searchParams.docMclsfNo}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    docMclsfNo: e.target.value,
                    docSclsfNo: "",
                  }))
                }
              />
            }
          />
          <GridField
            item={3}
            label="소분류"
            value={
              <MuiSelect
                id="docSclsfNo"
                items={sclsfList}
                value={searchParams.docSclsfNo}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    docSclsfNo: e.target.value,
                  }))
                }
              />
            }
          />
          <GridField
            item={3}
            label="보유기간"
            value={
              <MuiSelect
                id="hldPrdDfyrs"
                items={HOLD_PERIOD_ITEMS}
                value={searchParams.hldPrdDfyrs}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    hldPrdDfyrs: e.target.value,
                  }))
                }
              />
            }
          />
          <GridField
            item={3}
            label="문서번호"
            value={
              <TextField
                name="docNo"
                fullWidth
                size="small"
                placeholder="문서번호"
                value={searchParams.docNo}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    docNo: e.target.value,
                  }))
                }
              />
            }
          />
          <GridField
            item={3}
            label="문서제목"
            value={
              <TextField
                name="docTtl"
                fullWidth
                size="small"
                placeholder="문서제목"
                value={searchParams.docTtl}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    docTtl: e.target.value,
                  }))
                }
              />
            }
          />
          <GridField
            item={3}
            label="정보주체 동의여부"
            value={
              <FormControlLabel
                className="filter-checkbox"
                control={
                  <Checkbox
                    size="small"
                    checked={searchParams.infoMnbdAgreYn === "Y"}
                    onChange={(_, checked) =>
                      setSearchParams((prev) => ({
                        ...prev,
                        infoMnbdAgreYn: checked ? "Y" : "",
                      }))
                    }
                  />
                }
                label="동의"
              />
            }
          />
          <GridField item={3} label="" value={null} blank />
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

      <AgGridContainer<any>
        actionButtons={[
          { label: "선택 반영", onClick: handleApplySelectedRows },
          { label: "일괄 반영", onClick: handleApplyAllRows },
        ]}
        isLoading={isLoading}
        enableRowSelection={true}
        colDefs={columnDefs}
        rowData={filteredRows}
        pageNum={searchParams.pageNum}
        pageSize={searchParams.pageSize}
        count={filteredRows.length}
        onSelectionChange={handleSelectionChange}
        onPageChange={({ pageNum: nextPage, pageSize: nextSize }) => {
          const nextParams = {
            ...searchParams,
            pageNum: nextPage,
            pageSize: nextSize,
          };
          syncSearchParams(nextParams);
          dispatch(fetchHoldingInstitutionList(nextParams));
        }}
      />
    </div>
  );
}
