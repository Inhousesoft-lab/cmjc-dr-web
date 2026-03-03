import {
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate } from "react-router";
import { getLangFromPathname, langPath } from "@/routes/lang";
import { listDefs } from "./col-def";
import AgGridContainer from "@/components/grid/AgGridContainer";
import React from "react";
import { ColDef } from "ag-grid-community";
import { DigitalDoc, SearchValues } from "@/types/digitalDoc";
import GridField from "@/components/common/GridField";
import MuiSelect from "@/components/elements/MuiSelect";
import useNotifications from "@/hooks/useNotifications";
import { useDocClsfOptions } from "@/hooks/useDocClsfOptions";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchDigitalDocList } from "@/features/digitalDoc/DigitalDocThunk";
import {
  selectDigitalDocError,
  selectDigitalDocLoading,
  selectDigitalDocRowCount,
  selectDigitalDocRows,
} from "@/features/digitalDoc/DigitalDocSelectors";

const INITIAL_SEARCH_PARAMS: SearchValues = {
  docLclsfNo: "",
  docMclsfNo: "",
  docSclsfNo: "",
  docNo: "",
  docTtl: "",
  hldPrdChangedOnly: false,
  pageNum: 1,
  pageSize: 10,
};

export default function DigitalDocList() {
  const navigate = useNavigate();
  const notifications = useNotifications();
  const dispatch = useAppDispatch();
  const curLang = getLangFromPathname(location.pathname);

  const [columnDefs] = React.useState<ColDef<DigitalDoc>[]>(listDefs);
  const [searchParams, setSearchParams] =
    React.useState<SearchValues>(INITIAL_SEARCH_PARAMS);
  const docLclsfNo = searchParams.docLclsfNo;
  const docMclsfNo = searchParams.docMclsfNo;
  const { lclsfList, mclsfList, sclsfList, lclsfError } = useDocClsfOptions(
    docLclsfNo,
    docMclsfNo,
  );

  const rows = useAppSelector(selectDigitalDocRows);
  const rowCount = useAppSelector(selectDigitalDocRowCount);
  const isLoading = useAppSelector(selectDigitalDocLoading);
  const listError = useAppSelector(selectDigitalDocError);

  const handleRowClick = (row: DigitalDoc) => {
    if (!row.eldocNo) return;
    navigate(langPath(`digitalDoc/${row.eldocNo}`, curLang));
  };

  const handleCreateClick = () => {
    navigate(langPath("digitalDoc/create", curLang));
  };

  React.useEffect(() => {
    dispatch(fetchDigitalDocList(INITIAL_SEARCH_PARAMS));
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

  const handleSearch = () => {
    const nextParams = { ...searchParams, pageNum: 1 };
    setSearchParams(nextParams);
    dispatch(fetchDigitalDocList(nextParams));
  };

  const handleResetSearchValues = () => {
    setSearchParams(INITIAL_SEARCH_PARAMS);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div>
      {/* <!-- 검색조건 --> */}
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
            item={4}
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
            item={4}
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
            item={6}
            label="검색어"
            value={
              <TextField
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
        </Grid>
        <Box className="table-view-actions">
          <Stack spacing={1} alignItems="center">
            <Button type="submit" variant="contained" onClick={handleSearch}>
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

      <AgGridContainer<DigitalDoc>
        actionButtons={[{ label: "등록", onClick: handleCreateClick }]}
        isLoading={isLoading}
        enableRowSelection={false}
        colDefs={columnDefs}
        rowData={rows}
        count={rowCount}
        onRowClick={handleRowClick}
      />
    </div>
  );
}
