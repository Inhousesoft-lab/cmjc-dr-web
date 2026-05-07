import React from "react";
import { Box, Button, Grid, IconButton, Stack, TextField } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { ColDef } from "ag-grid-community";
import { useLocation, useNavigate } from "react-router-dom";
import { listDefs } from "./col-def";
import useNotifications from "@/hooks/useNotifications";
import { MuiDatePickerFt } from "@/components/elements/MuiDatePickerFt";
import AgGridContainer from "@/components/grid/AgGridContainer";
import MuiSelect from "@/components/elements/MuiSelect";
import GridField from "@/components/common/GridField";
import { useDocClsfOptions } from "@/hooks/useDocClsfOptions";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchHoldingInstitutionList } from "@/features/holdingInstitution/HoldingInstitutionThunk";
import {
  selectHoldingInstitutionError,
  selectHoldingInstitutionLoading,
  selectHoldingInstitutionRowCount,
  selectHoldingInstitutionRows,
} from "@/features/holdingInstitution/HoldingInstitutionSelectors";
import type { SearchValues } from "@/types/holdingInstitution";
import { langPath, getLangFromPathname } from "@/routes/lang";
import { isDateRangeInvalid } from "@/utils/globalFunc";

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
  hldPrdDfyrs: "",
  pageNum: 1,
  pageSize: 10,
};

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
  const collectDateRangeErrorMessage = "수집일자 종료일은 시작일보다 빠를 수 없습니다.";
  const endDateRangeErrorMessage = "종료일자 종료일은 시작일보다 빠를 수 없습니다.";
  const dispatch = useAppDispatch();
  const notifications = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const initialSearchParams = React.useMemo(() => {
    const stateParams = (
      location.state as { initialSearchParams?: Partial<SearchValues> } | null
    )?.initialSearchParams;
    const queryParams = new URLSearchParams(location.search);
    const hasRedirectBind = queryParams.get("redirectBind") === "1";

    if (!stateParams && hasRedirectBind) {
      return {
        ...INITIAL_SEARCH_PARAMS,
        docLclsfNo: queryParams.get("docLclsfNo") ?? "",
        docMclsfNo: queryParams.get("docMclsfNo") ?? "",
        docSclsfNo: queryParams.get("docSclsfNo") ?? "",
        pageNum: Number(queryParams.get("pageNum") || "1"),
      };
    }

    return {
      ...INITIAL_SEARCH_PARAMS,
      ...(stateParams ?? {}),
    };
  }, [location.search, location.state]);

  const [columnDefs] = React.useState<ColDef[]>(listDefs);
  const [searchParams, setSearchParams] =
    React.useState<SearchValues>(initialSearchParams);
  const [collectDateRangeError, setCollectDateRangeError] = React.useState("");
  const [endDateRangeError, setEndDateRangeError] = React.useState("");

  const { lclsfList, mclsfList, sclsfList, lclsfError } = useDocClsfOptions(
    searchParams.docLclsfNo,
    searchParams.docMclsfNo,
  );

  const rows = useAppSelector(selectHoldingInstitutionRows);
  const rowCount = useAppSelector(selectHoldingInstitutionRowCount);
  const isLoading = useAppSelector(selectHoldingInstitutionLoading);
  const listError = useAppSelector(selectHoldingInstitutionError);

  React.useEffect(() => {
    setSearchParams(initialSearchParams);
    dispatch(fetchHoldingInstitutionList(initialSearchParams));
  }, [dispatch, initialSearchParams]);

  React.useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("redirectBind") !== "1") return;

    navigate(langPath("/holdingInstitution/list", getLangFromPathname(location.pathname)), {
      replace: true,
      state: location.state,
    });
  }, [location.pathname, location.search, location.state, navigate]);

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

  const syncSearchParams = React.useCallback((nextParams: SearchValues) => {
    setSearchParams(nextParams);
  }, []);

  const handleSearch = React.useCallback(() => {
    if (isDateRangeInvalid(searchParams.fromClctYmd, searchParams.toClctYmd)) {
      setCollectDateRangeError(collectDateRangeErrorMessage);
      return;
    }
    if (isDateRangeInvalid(searchParams.fromEndYmd, searchParams.toEndYmd)) {
      setEndDateRangeError(endDateRangeErrorMessage);
      return;
    }
    const nextParams = { ...searchParams, pageNum: 1 };
    syncSearchParams(nextParams);
    dispatch(fetchHoldingInstitutionList(nextParams));
  }, [
    collectDateRangeErrorMessage,
    dispatch,
    endDateRangeErrorMessage,
    searchParams,
    syncSearchParams,
  ]);

  const handleResetSearchValues = React.useCallback(() => {
    const resetParams = { ...INITIAL_SEARCH_PARAMS };
    setCollectDateRangeError("");
    setEndDateRangeError("");
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

  React.useEffect(() => {
    setCollectDateRangeError(
      isDateRangeInvalid(searchParams.fromClctYmd, searchParams.toClctYmd)
        ? collectDateRangeErrorMessage
        : "",
    );
  }, [collectDateRangeErrorMessage, searchParams.fromClctYmd, searchParams.toClctYmd]);

  React.useEffect(() => {
    setEndDateRangeError(
      isDateRangeInvalid(searchParams.fromEndYmd, searchParams.toEndYmd)
        ? endDateRangeErrorMessage
        : "",
    );
  }, [endDateRangeErrorMessage, searchParams.fromEndYmd, searchParams.toEndYmd]);

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
                  error={Boolean(collectDateRangeError)}
                  helperText={collectDateRangeError}
                />
                <span className="filter-range-sep">-</span>{" "}
                <MuiDatePickerFt
                  value={searchParams.toClctYmd}
                  onChange={(value) =>
                    setSearchParams((prev) => ({ ...prev, toClctYmd: value }))
                  }
                  error={Boolean(collectDateRangeError)}
                  helperText={collectDateRangeError}
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
                  error={Boolean(endDateRangeError)}
                  helperText={endDateRangeError}
                />
                <span className="filter-range-sep">-</span>{" "}
                <MuiDatePickerFt
                  value={searchParams.toEndYmd}
                  onChange={(value) =>
                    setSearchParams((prev) => ({ ...prev, toEndYmd: value }))
                  }
                  error={Boolean(endDateRangeError)}
                  helperText={endDateRangeError}
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
          <GridField item={6} label="" value={null} blank />
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
        isLoading={isLoading}
        enableRowSelection={false}
        colDefs={columnDefs}
        rowData={rows}
        pageNum={searchParams.pageNum}
        pageSize={searchParams.pageSize}
        count={rowCount}
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
