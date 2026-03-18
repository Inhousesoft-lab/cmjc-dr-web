import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Stack,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { MuiDatePickerFt } from "@/components/elements/MuiDatePickerFt";

import AgGridContainer from "@/components/grid/AgGridContainer";
import { listDefs } from "./col-def";

import DocDestructionManagementPrintButton from "@/components/biz/DocDestructionManagementPrintDialog";
import React, { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
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
import { printElement } from "@/utils/print";

const buildSearchValues = (): SearchValues => ({
  reqCd: "CMPLT",
  docLclsfNo: "",
  docMclsfNo: "",
  docSclsfNo: "",
  prvcInclYn: "N",
  docNo: "",
  docTtl: "",
  hldPrdChangedOnly: false,
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
  const [prvcInclYn, setPrvcInclYn] = useState(
    restoredState?.prvcInclYn ?? initialSearchValues.prvcInclYn,
  );
  const [fromDstrcAprvYmd, setFromDstrcAprvYmd] = useState(
    restoredState?.fromDstrcAprvYmd ?? initialSearchValues.fromDstrcAprvYmd,
  );
  const [toDstrcAprvYmd, setToDstrcAprvYmd] = useState(
    restoredState?.toDstrcAprvYmd ?? initialSearchValues.toDstrcAprvYmd,
  );
  const [pageNum, setPageNum] = useState(
    restoredState?.pageNum ?? initialSearchValues.pageNum,
  );
  const [pageSize, setPageSize] = useState(
    restoredState?.pageSize ?? initialSearchValues.pageSize,
  );
  const { lclsfList, mclsfList, sclsfList } = useDocClsfOptions(
    docLclsfNo,
    docMclsfNo,
  );

  const [columnDefs] = React.useState<ColDef<DocDestruction>[]>(listDefs);

  const rows = useAppSelector(selectDocDestructionRows);
  const rowCount = useAppSelector(selectDocDestructionRowCount);
  const isLoading = useAppSelector(selectDocDestructionLoading);
  const listError = useAppSelector(selectDocDestructionError);

  const searchValues = useMemo(
    () => ({
      ...initialSearchValues,
      docLclsfNo,
      docMclsfNo,
      docSclsfNo,
      prvcInclYn,
      fromDstrcAprvYmd,
      toDstrcAprvYmd,
      pageNum,
      pageSize,
    }),
    [
      docLclsfNo,
      docMclsfNo,
      docSclsfNo,
      prvcInclYn,
      fromDstrcAprvYmd,
      initialSearchValues,
      pageNum,
      pageSize,
      toDstrcAprvYmd,
    ],
  );

  const loadData = () => {
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
    setPrvcInclYn(initialSearchValues.prvcInclYn);
    setFromDstrcAprvYmd(initialSearchValues.fromDstrcAprvYmd);
    setToDstrcAprvYmd(initialSearchValues.toDstrcAprvYmd);
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

  const handlePrintCurrentList = () => {
    const el = printAreaRef.current;
    if (!el) return;
    printElement(el, {
      title: "파기목록대장 출력",
      popupFeatures: "width=1200,height=800",
      zoom: 0.44,
      pageMarginMm: 10,
      gridColumns: listDefs.map((col) => ({
        headerName: col.headerName,
        field: typeof col.field === "string" ? col.field : undefined,
        format:
          col.field === "dstrcAprvDt" || col.field === "regDate"
            ? "date"
            : undefined,
      })),
      gridRows: rows as unknown as Array<Record<string, unknown>>,
    });
  };

  const handleRowClick = (row: DocDestruction) => {
    if (!row.eldocNo) return;
    navigate(langPath(`docDestruction/${row.eldocNo}`, curLang), {
      state: {
        sourceListPath: "destruction/list",
        listState: searchValues,
      },
    });
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
          {/* 1행 */}
          <GridField
            item={3}
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
            item={3}
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
            item={3}
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
          <GridField
            item={3}
            label="개인정보 포함"
            value={
              <FormControlLabel
                className="doc-clsf-prvc-checkbox"
                control={
                  <Checkbox
                    id="prvcInclYn"
                    size="small"
                    checked={prvcInclYn === "Y"}
                    onChange={(e) => setPrvcInclYn(e.target.checked ? "Y" : "N")}
                  />
                }
                label="포함"
              />
            }
          />
          {/* 2행 */}
          <GridField
            item={12}
            label="파기일자"
            labelSize={{ xs: 4, sm: 2 }}
            valueSize={{ xs: 8, sm: 10 }}
            value={
              <div className="filter-range">
                <MuiDatePickerFt
                  value={fromDstrcAprvYmd}
                  onChange={setFromDstrcAprvYmd}
                />
                <span className="filter-range-sep">-</span>{" "}
                <MuiDatePickerFt
                  value={toDstrcAprvYmd}
                  onChange={setToDstrcAprvYmd}
                />
              </div>
            }
          />
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
        <Button variant="contained" onClick={handlePrintCurrentList}>
          파기목록출력
        </Button>
        <DocDestructionManagementPrintButton searchValues={searchValues} />
      </div>

      <Box ref={printAreaRef} sx={{ width: "100%" }}>
        <AgGridContainer
          isLoading={isLoading}
          colDefs={columnDefs}
          rowData={rows}
          pageNum={pageNum}
          pageSize={pageSize}
          count={rowCount}
          onRowClick={handleRowClick}
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
