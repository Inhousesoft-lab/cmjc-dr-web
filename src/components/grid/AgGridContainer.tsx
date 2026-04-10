import React, { useEffect, useMemo, useRef, useState } from "react";

import type {
  ColDef,
  GridApi,
  GridReadyEvent,
  RowClassParams,
  RowClickedEvent,
  RowDragEndEvent,
  RowSelectionOptions,
  RowStyle,
  SelectionChangedEvent,
} from "ag-grid-community";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
import GlobalStyles from "@mui/material/GlobalStyles";
import {
  MenuItem,
  Pagination,
  PaginationItem,
  FormControl,
  Select,
  Button,
  Box,
  Stack,
} from "@mui/material";
import { Paging } from "@/features/com/CommonTypes";
import { AgGridReact } from "ag-grid-react";

ModuleRegistry.registerModules([AllCommunityModule]);

const GRID_HEADER_HEIGHT = 32;
const GRID_ROW_HEIGHT = 32;
const GRID_FRAME_HEIGHT = 24;
const DEFAULT_GRID_MIN_HEIGHT = 355;
const DEFAULT_GRID_MAX_HEIGHT = 760;

type AgGridProps<TData> = {
  isLoading?: boolean;
  printOn?: boolean;
  enableRowSelection?: boolean;
  rowSelectionMode?: "single" | "multiple";
  selectionCheckboxes?: boolean;
  selectionHeaderCheckbox?: boolean;
  enableClickSelection?: boolean;
  colDefs: ColDef<TData>[];
  rowData: TData[];
  getRowStyle?: (params: RowClassParams<TData>) => RowStyle | undefined;
  onRowDragEnd?: (event: RowDragEndEvent<TData>) => void;
  rowDragManaged?: boolean;
  animateRows?: boolean;
  suppressMoveWhenRowDragging?: boolean;
  enablePagination?: boolean;
  getRowId?: (params: any) => string;
  actionButtons?: { label: string; onClick: () => void; disabled?: boolean }[];
  isPaging?: boolean;
  pageNum?: number;
  pageSize?: number;
  count?: number;
  height?: number;
  onPageChange?: (paging: Paging) => void;
  onRowClick?: (row: TData) => void;
  onSelectionChange?: (rows: TData[]) => void;
  onGridReady?: (event: GridReadyEvent<TData>) => void;
};

export default function AgGridContainer<TData>(props: AgGridProps<TData>) {
  const {
    isLoading,
    printOn,
    enableRowSelection,
    rowSelectionMode = "multiple",
    selectionCheckboxes = true,
    selectionHeaderCheckbox = true,
    enableClickSelection = false,
    colDefs,
    rowData = [],
    getRowStyle,
    onRowDragEnd,
    rowDragManaged,
    animateRows,
    suppressMoveWhenRowDragging,
    enablePagination = true,
    getRowId,
    actionButtons,
    isPaging = true,
    pageNum = 1,
    pageSize = 10,
    count = 0,
    height,
    onPageChange,
    onRowClick,
    onSelectionChange,
    onGridReady,
  } = props;

  const defaultColDef = useMemo<ColDef<TData>>(
    () => ({
      flex: 1,
      resizable: true,
      sortable: false,
      filter: false,
    }),
    [],
  );

  const rowSelection = useMemo<RowSelectionOptions | "single" | "multiple">(
    () =>
      rowSelectionMode === "single"
        ? {
            mode: "singleRow",
            enableClickSelection: true,
            checkboxes: false,
          }
        : {
            mode: "multiRow",
            checkboxes: selectionCheckboxes,
            headerCheckbox: selectionHeaderCheckbox && selectionCheckboxes,
            enableClickSelection,
          },
    [
      rowSelectionMode,
      selectionCheckboxes,
      selectionHeaderCheckbox,
      enableClickSelection,
    ],
  );

  // Select options
  const options = [
    { label: "10", value: 10 },
    { label: "25", value: 25 },
    { label: "50", value: 50 },
  ];

  const defaultPageSize = 10;
  const gridApiRef = useRef<GridApi<TData> | null>(null);

  const [pageNo, setPageNo] = useState(pageNum);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const showLoadingOverlay = Boolean(isLoading) && isInitialLoad;

  useEffect(() => {
    if (!isLoading && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [isLoading, isInitialLoad]);

  useEffect(() => {
    setPageNo(pageNum);
  }, [pageNum]);

  useEffect(() => {
    setRowsPerPage(pageSize);
  }, [pageSize]);

  const calculatedHeight = useMemo(() => {
    if (typeof height === "number") {
      return height;
    }

    const visibleRowCount = Math.max(
      1,
      Math.min(rowData.length || rowsPerPage, rowsPerPage),
    );
    const contentHeight =
      GRID_HEADER_HEIGHT + visibleRowCount * GRID_ROW_HEIGHT + GRID_FRAME_HEIGHT;

    return Math.min(
      DEFAULT_GRID_MAX_HEIGHT,
      Math.max(DEFAULT_GRID_MIN_HEIGHT, contentHeight),
    );
  }, [height, rowData.length, rowsPerPage]);

  const handleGridReady = (event: GridReadyEvent<TData>) => {
    gridApiRef.current = event.api;
    if (onGridReady) onGridReady(event);
  };

  const handleRowClicked = (event: RowClickedEvent<TData>) => {
    if (!onRowClick) return;
    if (!event.data) return;
    onRowClick(event.data); // 클릭한 row 전체를 상위로 올려줌
  };

  const handleSelectionChanged = (event: SelectionChangedEvent<TData>) => {
    if (!onSelectionChange) return;
    const selectedRows = event.api.getSelectedRows() as TData[];
    onSelectionChange(selectedRows);
  };

  const handlePrintCurrentPage = () => {
    const api = gridApiRef.current;
    if (!api) return;

    const eGridDiv = document.querySelector<HTMLElement>("#myGrid");

    // 현재 스타일 백업
    if (!eGridDiv) return;
    const prevWidth = eGridDiv.style.width;
    const prevHeight = eGridDiv.style.height;
    const prevDomLayout = api.getGridOption("domLayout");

    // 인쇄용 스타일 적용
    eGridDiv.style.width = "";
    eGridDiv.style.height = "";
    api.setGridOption("domLayout", "print");

    setTimeout(() => {
      window.print();

      // 원래 상태로 복원
      api.setGridOption("domLayout", prevDomLayout);
      eGridDiv.style.width = prevWidth;
      eGridDiv.style.height = prevHeight;
    }, 0);
  };

  useEffect(() => {
    if (printOn) {
      handlePrintCurrentPage();
    }
  }, [printOn]);

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPageNo(1); // 1페이지로 리셋
    if (onPageChange) {
      onPageChange({ pageNum: 1, pageSize: newRowsPerPage });
    }
  };

  const handlePageChange = (newPage: number) => {
    setPageNo(newPage);
    if (onPageChange) {
      onPageChange({ pageNum: newPage, pageSize: rowsPerPage });
    }
  };

  return (
    <React.Fragment>
      {/* Aggrid Container만 출력하도록 스타일 추가 */}
      <GlobalStyles
        styles={{
          "@media print": {
            "body *": {
              visibility: "hidden",
            },
            "#myGrid, #myGrid *": {
              visibility: "visible",
            },
            "#myGrid": {
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
            },
          },
        }}
      />

      {/* Page Info */}
      <Box className="board_info">
        <p className="board_count">
          전체
          <span className="count">{count}</span>건
        </p>

        {actionButtons && actionButtons.length > 0 ? (
          <Stack direction="row" spacing={1} alignItems="center">
            {actionButtons.map((btn, idx) => (
              <Button
                key={`${btn.label}-${idx}`}
                variant="contained"
                onClick={btn.onClick}
                disabled={btn.disabled}
              >
                {btn.label}
              </Button>
            ))}
          </Stack>
        ) : null}
      </Box>
      <div id="myGrid" style={{ height: calculatedHeight, width: "100%" }}>
        <AgGridReact<TData>
          theme={themeQuartz}
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          loading={showLoadingOverlay}
          rowHeight={32}
          headerHeight={32}
          rowSelection={enableRowSelection ? rowSelection : undefined}
          pagination={enablePagination}
          paginationPageSize={rowsPerPage}
          getRowStyle={getRowStyle}
          getRowId={getRowId}
          rowDragManaged={rowDragManaged}
          animateRows={animateRows}
          suppressMoveWhenRowDragging={suppressMoveWhenRowDragging}
          suppressPaginationPanel={true} // 기본 하단 페이징 숨김
          onGridReady={handleGridReady}
          onRowClicked={handleRowClicked}
          onRowDragEnd={onRowDragEnd}
          onSelectionChanged={handleSelectionChanged}
        />
      </div>

      {/* Pagination */}
      {isPaging && (
        <div className="paing_container">
          {/* Page Count */}
          <div className="paging-count">
            <label className="paging-count__label">조회건수</label>
            <FormControl className="paging-count__select">
              <Select
                value={rowsPerPage}
                id="rows-per-page"
                size="small"
                displayEmpty
                onChange={(e) =>
                  handleRowsPerPageChange(Number(e.target.value))
                }
              >
                {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Pagination */}
          {count > 0 && (
            <div className="paging_wrapper">
              <Pagination
                variant="outlined"
                shape="rounded"
                showFirstButton
                showLastButton
                count={Math.ceil(count / rowsPerPage)}
                page={pageNo}
                onChange={(_, value) => handlePageChange(value as number)}
                renderItem={(item) => (
                  <PaginationItem
                    {...item}
                    sx={item.page === pageNo ? { pointerEvents: "none" } : undefined}
                  />
                )}
              />
            </div>
          )}
        </div>
      )}
    </React.Fragment>
  );
}
