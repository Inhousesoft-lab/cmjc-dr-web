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
  FormControl,
  Select,
  Button,
  Box,
  Stack,
} from "@mui/material";
import { Paging } from "@/features/com/CommonTypes";
import { AgGridReact } from "ag-grid-react";

ModuleRegistry.registerModules([AllCommunityModule]);

type AgGridProps<TData> = {
  isLoading?: boolean;
  isSimpleView?: boolean;
  printOn?: boolean;
  enableRowSelection?: boolean;
  rowSelectionMode?: "single" | "multiple";
  selectionCheckboxes?: boolean;
  selectionHeaderCheckbox?: boolean;
  colDefs: ColDef<TData>[];
  rowData: TData[];
  getRowStyle?: (params: RowClassParams<TData>) => RowStyle | undefined;
  onRowDragEnd?: (event: RowDragEndEvent<TData>) => void;
  rowDragManaged?: boolean;
  animateRows?: boolean;
  suppressMoveWhenRowDragging?: boolean;
  singleClickEdit?: boolean;
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
    isSimpleView,
    printOn,
    enableRowSelection,
    rowSelectionMode = "multiple",
    selectionCheckboxes = true,
    selectionHeaderCheckbox = true,
    colDefs,
    rowData = [],
    getRowStyle,
    onRowDragEnd,
    rowDragManaged,
    getRowId,
    animateRows,
    suppressMoveWhenRowDragging,
    singleClickEdit = false,
    enablePagination = true,
    actionButtons,
    isPaging = true,
    pageNum = 1,
    pageSize = 10,
    count = 0,
    height = 355,
    onPageChange,
    onRowClick,
    onSelectionChange,
    onGridReady,
  } = props;

  const defaultColDef = useMemo<ColDef<TData>>(
    () => ({
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
            enableClickSelection: false,
          },
    [rowSelectionMode, selectionCheckboxes, selectionHeaderCheckbox],
  );

  // Select options
  const options = [
    { label: "10", value: 10 },
    { label: "25", value: 25 },
    { label: "50", value: 50 },
  ];

  const gridApiRef = useRef<GridApi<TData> | null>(null);

  const [pageNo, setPageNo] = useState(pageNum);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);

  useEffect(() => {
    setPageNo(pageNum);
  }, [pageNum]);

  useEffect(() => {
    setRowsPerPage(pageSize);
  }, [pageSize]);

  const handleGridReady = (event: GridReadyEvent<TData>) => {
    gridApiRef.current = event.api;
    event.api.sizeColumnsToFit();
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
        {!isSimpleView && (
          <p className="board_count">
            전체
            <span className="count">{count}</span>건
          </p>
        )}

        {actionButtons && actionButtons.length > 0 ? (
          <Stack direction="row" spacing={1} alignItems="center">
            {actionButtons.map((btn, idx) => (
              <Button
                key={`${btn.label}-${idx}`}
                size="small"
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
      <div id="myGrid" style={{ height, width: "100%" }}>
        <AgGridReact<TData>
          theme={themeQuartz}
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          loading={isLoading}
          rowHeight={32}
          headerHeight={32}
          rowSelection={enableRowSelection ? rowSelection : undefined}
          pagination={enablePagination}
          paginationPageSize={pageSize}
          getRowStyle={getRowStyle}
          getRowId={getRowId}
          rowDragManaged={rowDragManaged}
          animateRows={animateRows}
          suppressMoveWhenRowDragging={suppressMoveWhenRowDragging}
          singleClickEdit={singleClickEdit}
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
              />
            </div>
          )}
        </div>
      )}
    </React.Fragment>
  );
}
