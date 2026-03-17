import React, { useMemo } from "react";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { themeQuartz } from "ag-grid-community";
import type { ColDef, RowClickedEvent } from "ag-grid-community";

export type AgGridTableProps<TData extends object> = {
  rowData: TData[];
  colDefs: ColDef<TData>[];
  onRowClicked?: (event: RowClickedEvent<TData>) => void;
  actionButtons?: { label: string; onClick: () => void }[];
  height?: number;
  rowHeight?: number;
  headerHeight?: number;
  isLoading?: boolean;
};

export default function AgGridTable<TData extends object>({
  rowData,
  colDefs,
  onRowClicked,
  height = 400,
  rowHeight = 28,
  headerHeight = 28,
  isLoading = false,
  actionButtons,
}: AgGridTableProps<TData>) {
  const defaultColDef = useMemo<ColDef<TData>>(
    () => ({
      flex: 1,
      resizable: true,
      sortable: true,
      filter: false,
    }),
    [],
  );

  return (
    <React.Fragment>
      {/* Page Info */}
      {actionButtons && actionButtons.length > 0 ? (
        <div className="btn_wrapper">
          {actionButtons.map((button, index) => (
            <Button
              key={index}
              size="small"
              variant="contained"
              onClick={button.onClick}
            >
              {button.label}
            </Button>
          ))}
        </div>
      ) : null}
      <div id="myGrid" style={{ height, width: "100%" }}>
        <AgGridReact
          theme={themeQuartz}
          rowData={rowData}
          columnDefs={colDefs}
          loading={isLoading}
          rowHeight={rowHeight}
          headerHeight={headerHeight}
          defaultColDef={defaultColDef}
          animateRows
          pagination
          paginationPageSize={10}
          paginationPageSizeSelector={false}
          suppressCellFocus
          onRowClicked={onRowClicked}
        />
      </div>
    </React.Fragment>
  );
}
