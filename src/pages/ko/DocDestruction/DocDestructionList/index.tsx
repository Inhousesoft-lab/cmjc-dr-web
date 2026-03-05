import { Box, Button, Grid, IconButton, Stack } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { MuiDatePickerFt } from "@/components/elements/MuiDatePickerFt";

import AgGridContainer from "@/components/grid/AgGridContainer";
import { listDefs } from "./col-def";

import DocDestructionManagementPrintButton from "@/components/biz/DocDestructionManagementPrintDialog";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import dayjs from "dayjs";
import MuiSelect from "@/components/elements/MuiSelect";
import { useNavigate } from "react-router";
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
import DocDestructionReqButton from "@/components/actionButtons/DocDestructionReqButton";
import DocDestructionAppvButton from "@/components/actionButtons/DocDestructionAppvButton";
import { printElement } from "@/utils/print";

const buildSearchValues = (
  docLclsfNo: string,
  docMclsfNo: string,
  docSclsfNo: string,
): SearchValues => ({
  docLclsfNo,
  docMclsfNo,
  docSclsfNo,
  prvcInclYn: "N",
  docNo: "",
  docTtl: "",
  hldPrdChangedOnly: false,
  docClsfNm: "",
  fromEndYmd: dayjs().add(-7, "day").format("YYYYMMDD"),
  toEndYmd: dayjs()
    .set("year", 9999)
    .set("month", 11)
    .set("date", 31)
    .format("YYYYMMDD"),
  fromDstrcAplyYmd: "",
  toDstrcAplyYmd: "",
  fromDstrcAprvYmd: "",
  toDstrcAprvYmd: "",
  pageNum: 1,
  pageSize: 10,
});

export default function DocDestructionList() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const notifications = useNotifications();
  const curLang = getLangFromPathname(location.pathname);

  const printAreaRef = useRef<HTMLDivElement | null>(null);

  const [docLclsfNo, setDocLclsfNo] = useState("");
  const [docMclsfNo, setDocMclsfNo] = useState("");
  const [docSclsfNo, setDocSclsfNo] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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

  const handleSelectionChange = useCallback((rows: any[]) => {
    setSelectedRows(rows);
  }, []);

  const searchValues = useMemo(
    () => ({
      ...buildSearchValues(docLclsfNo, docMclsfNo, docSclsfNo),
      pageNum,
      pageSize,
    }),
    [docLclsfNo, docMclsfNo, docSclsfNo, pageNum, pageSize],
  );

  const loadData = () => {
    const nextParams = { ...searchValues, pageNum: 1 };
    setPageNum(1);
    dispatch(fetchDocDestructionList(nextParams));
  };

  const handleRefresh = () => {
    setDocLclsfNo("");
    setDocMclsfNo("");
    setDocSclsfNo("");
    setPageNum(1);
    setPageSize(10);
    dispatch(
      fetchDocDestructionList({
        ...buildSearchValues("", "", ""),
        pageNum: 1,
        pageSize: 10,
      }),
    );
  };

  useEffect(() => {
    dispatch(fetchDocDestructionList(buildSearchValues("", "", "")));
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
      })),
      gridRows: rows as unknown as Array<Record<string, unknown>>,
    });
  };

  const handleRowClick = (row: DocDestruction) => {
    if (!row.eldocNo) return;
    navigate(langPath(`docDestruction/${row.eldocNo}`, curLang));
  };

  return (
    <div>
      <Stack direction="row" className="search-area" mb={2}>
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
            label="기간"
            value={
              <div className="filter-range">
                <MuiDatePickerFt value={""} onChange={() => {}} />
                <span className="filter-range-sep">-</span>{" "}
                <MuiDatePickerFt value={""} onChange={() => {}} />
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
          <Button variant="contained" onClick={loadData}>
            조회
          </Button>
          <IconButton
            aria-label="검색 초기화 및 새로고침"
            onClick={handleRefresh}
          >
            <RefreshIcon />
          </IconButton>
        </Box>
      </Stack>
      <div className="btn_wrapper">
        <DocDestructionReqButton selectedRows={selectedRows} />
        <DocDestructionAppvButton selectedRows={selectedRows} />
        <Button variant="contained" onClick={handlePrintCurrentList}>
          파기목록출력
        </Button>
        <DocDestructionManagementPrintButton searchValues={searchValues} />
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
