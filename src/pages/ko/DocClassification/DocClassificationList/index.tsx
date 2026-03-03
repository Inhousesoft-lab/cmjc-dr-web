import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Checkbox, Grid, Stack, TextField } from "@mui/material";
import { ColDef } from "ag-grid-community";
import AgGridContainer from "@/components/grid/AgGridContainer";
import MuiSelect from "@/components/elements/MuiSelect";
import useNotifications from "@/hooks/useNotifications";
import { useDocClsfOptions } from "@/hooks/useDocClsfOptions";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchDocClassificationList } from "@/features/classification/DocClassificationListThunk";
import {
  selectDocClassificationError,
  selectDocClassificationLoading,
  selectDocClassificationRowCount,
  selectDocClassificationRows,
} from "@/features/classification/DocClassificationListSelectors";
import {
  DocClassificationSearch,
  DocClassificationVO,
} from "@/types/docClassification";
import { listDefs } from "./col-def";
import GridField from "@/components/common/GridField";

const INITIAL_SEARCH_PARAMS: DocClassificationSearch = {
  docLclsfNo: "",
  docMclsfNo: "",
  docSclsfNo: "",
  prvcInclYn: "",
  useEn: "",
  docClsfNm: "",
  pageNum: 1,
  pageSize: 10,
};

export default function DocClassificationList() {
  const navigate = useNavigate();
  const notifications = useNotifications();
  const dispatch = useAppDispatch();

  const [columnDefs] = React.useState<ColDef[]>(listDefs);
  const [searchParams, setSearchParams] =
    React.useState<DocClassificationSearch>(INITIAL_SEARCH_PARAMS);

  const useEnItems = [
    { name: "전체", code: "" },
    { name: "사용", code: "Y" },
    { name: "사용안함", code: "N" },
  ];
  const docLclsfNo = searchParams.docLclsfNo;
  const docMclsfNo = searchParams.docMclsfNo;
  const { lclsfList, mclsfList, sclsfList, lclsfError } = useDocClsfOptions(
    docLclsfNo,
    docMclsfNo,
  );

  const rows = useAppSelector(selectDocClassificationRows);
  const rowCount = useAppSelector(selectDocClassificationRowCount);
  const isLoading = useAppSelector(selectDocClassificationLoading);
  const listError = useAppSelector(selectDocClassificationError);

  React.useEffect(() => {
    dispatch(fetchDocClassificationList(INITIAL_SEARCH_PARAMS));
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
    dispatch(fetchDocClassificationList(nextParams));
  };

  const handleResetSearchValues = useCallback(() => {
    setSearchParams(INITIAL_SEARCH_PARAMS);
  }, []);

  const handleCreateClick = () => {
    navigate(`/docClassification/create`);
  };

  const handleRowClick = (row: DocClassificationVO) => {
    navigate(`/docClassification/${row.docClsfNo}`);
  };

  return (
    <div>
      <form>
        <Stack direction="row" className="search-area" mb={2}>
          <Grid container spacing={0} className="table-view-grid">
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
              label="개인정보 포함"
              value={
                <Checkbox
                  size="small"
                  checked={searchParams.prvcInclYn === "Y"}
                  onChange={(e) =>
                    setSearchParams((prev) => ({
                      ...prev,
                      prvcInclYn: e.target.checked ? "Y" : "",
                    }))
                  }
                />
              }
            />
            <GridField
              item={3}
              label="사용유무"
              value={
                <MuiSelect
                  id="useEn"
                  items={useEnItems}
                  value={searchParams.useEn}
                  onChange={(e) =>
                    setSearchParams((prev) => ({
                      ...prev,
                      useEn: e.target.value,
                    }))
                  }
                />
              }
            />
            <GridField
              item={9}
              label="검색어"
              value={
                <TextField
                  size="small"
                  fullWidth
                  value={searchParams.docClsfNm}
                  onChange={(e) =>
                    setSearchParams((prev) => ({
                      ...prev,
                      docClsfNm: e.target.value,
                    }))
                  }
                />
              }
            />
          </Grid>
          <Box className="table-view-actions">
            <Button variant="contained" onClick={handleSearch}>
              조회
            </Button>
            <Button
              variant="text"
              aria-label="검색조건 초기화"
              onClick={handleResetSearchValues}
              sx={{ minWidth: "auto", p: 0.5 }}
            >
              <span className="ico_reset" aria-hidden="true" />
            </Button>
          </Box>
        </Stack>
      </form>

      <AgGridContainer
        actionButtons={[{ label: "등록", onClick: handleCreateClick }]}
        isPaging={true}
        isLoading={isLoading}
        colDefs={columnDefs}
        rowData={rows}
        count={rowCount}
        onRowClick={handleRowClick}
        onPageChange={({ pageNum: nextPage, pageSize: nextSize }) => {
          const nextParams = {
            ...searchParams,
            pageNum: nextPage,
            pageSize: nextSize,
          };
          setSearchParams(nextParams);
          dispatch(fetchDocClassificationList(nextParams));
        }}
      />
    </div>
  );
}
