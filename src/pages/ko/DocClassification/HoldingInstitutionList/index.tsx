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
import { listDefs } from "./col-def";
import { useDialogs } from "@/hooks/useDialogs/useDialogs";
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

  const [columnDefs] = React.useState<ColDef[]>(listDefs);
  const [searchParams, setSearchParams] =
    React.useState<SearchValues>(INITIAL_SEARCH_PARAMS);

  const { lclsfList, mclsfList, sclsfList, lclsfError } = useDocClsfOptions(
    searchParams.docLclsfNo,
    searchParams.docMclsfNo,
  );

  const rows = useAppSelector(selectHoldingInstitutionRows);
  const rowCount = useAppSelector(selectHoldingInstitutionRowCount);
  const isLoading = useAppSelector(selectHoldingInstitutionLoading);
  const listError = useAppSelector(selectHoldingInstitutionError);

  React.useEffect(() => {
    dispatch(fetchHoldingInstitutionList(INITIAL_SEARCH_PARAMS));
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

  const [selectedRows, setSelectedRows] = React.useState<any[]>([]);

  const handleSelectionChange = React.useCallback((nextRows: any[]) => {
    setSelectedRows(nextRows);
  }, []);

  const handleApplySelectedRows = React.useCallback(async () => {
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

    notifications.show("변경되었습니다", {
      severity: "success",
      autoHideDuration: 3000,
    });
  }, [dialogs, notifications, selectedRows]);

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

    notifications.show("변경되었습니다", {
      severity: "success",
      autoHideDuration: 3000,
    });
  }, [dialogs, notifications]);

  const handleSearch = React.useCallback(() => {
    const nextParams = { ...searchParams, pageNum: 1 };
    setSearchParams(nextParams);
    dispatch(fetchHoldingInstitutionList(nextParams));
  }, [dispatch, searchParams]);

  const handleResetSearchValues = React.useCallback(() => {
    const resetParams = { ...INITIAL_SEARCH_PARAMS };
    setSearchParams(resetParams);
    dispatch(fetchHoldingInstitutionList(resetParams));
  }, [dispatch]);

  return (
    <div>
      <Stack direction="row" className="search-area" mb={2}>
        <Grid container spacing={0} className="table-view-grid">
          <GridField
            item={6}
            label="수집일자"
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
            item={6}
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
        </Grid>
        <Box className="table-view-actions">
          <Stack spacing={1} alignItems="center">
            <Button variant="contained" onClick={handleSearch}>
              조회
            </Button>
            <IconButton
              aria-label="검색조건 초기화"
              onClick={handleResetSearchValues}
              size="small"
            >
              <RefreshIcon fontSize="small" />
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
        rowData={rows}
        count={rowCount}
        onSelectionChange={handleSelectionChange}
        onPageChange={({ pageNum: nextPage, pageSize: nextSize }) => {
          const nextParams = {
            ...searchParams,
            pageNum: nextPage,
            pageSize: nextSize,
          };
          setSearchParams(nextParams);
          dispatch(fetchHoldingInstitutionList(nextParams));
        }}
      />
    </div>
  );
}
