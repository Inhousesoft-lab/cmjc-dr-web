import * as React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import type { SearchValues } from "@/types/docDestruction";
import { listDefs } from "@/pages/ko/DocDestruction/DocDestructionList/col-def-print";
import DialogTrigger from "../dialog/DialogTrigger";
import AgGridTable from "../grid/AgGridTable";
import { ColDef } from "ag-grid-community";
import { printElement } from "@/utils/print";

type Destruction = {
  no: string;
  fileName: string;
  dataType: string;
  createdDate: string;
  disposeDate: string;
  reason: string;
  handler: string;
  manager: string;
};

export default function DocDestructionManagementPrintDialog({
  searchValues,
}: {
  searchValues: SearchValues;
}) {
  const printAreaRef2 = React.useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = React.useState(false);

  const [columnDefs] = React.useState<ColDef<any>[]>(listDefs);

  const [rowData, setRowsData] = React.useState<{
    rows: Destruction[];
    rowCount: number;
  }>({
    rows: [],
    rowCount: 0,
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const loadData = React.useCallback(async () => {
    // 데이터 로드 로직 작성
    const data = { ...searchValues, reqCd: "CMPLT", prvcInclYn: "Y" };

    try {
      setIsLoading(true);
      const res = rowData.rows;
      const mappedRows: Destruction[] = res.map((item: any, index: number) => ({
        ...item,
        eldocNo: item.eldocNo || `${index}`,
      }));
      setRowsData({
        rows: mappedRows,
        rowCount: mappedRows.length,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (open) loadData();
  }, [open, loadData]);

  const handlePrint = () => {
    const root = printAreaRef2.current;
    if (!root) return;

    printElement(root, {
      title: "파기관리대장 출력",
      subTitle: "[별지 제 5호 서식]",
      popupFeatures: "width=1024,height=768",
      zoom: 0.6,
      pageMarginMm: 12,
      gridColumns: listDefs.map((col) => ({
        headerName: col.headerName,
        field: typeof col.field === "string" ? col.field : undefined,
      })),
      gridRows: rowData.rows as unknown as Array<Record<string, unknown>>,
    });
  };

  return (
    <DialogTrigger
      buttonLabel="개인정보파일 파기관리대장 출력"
      title="파기관리대장 출력"
      maxWidth="md"
      actionsPosition="top"
      open={open}
      onOpen={handleClickOpen}
      onClose={handleClose}
      actions={
        <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
          <Box sx={{ minWidth: 180 }}>
            <Typography variant="subtitle2">[별지 제 5호 서식]</Typography>
          </Box>
          <Box sx={{ flex: 1, textAlign: "center" }}>
            <Typography variant="h6">개인정보파일 파기 관리대장</Typography>
          </Box>
          <Box
            sx={{
              minWidth: 180,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button variant="contained" onClick={handlePrint}>
              출력
            </Button>
          </Box>
        </Stack>
      }
    >
      <Box ref={printAreaRef2} id="print-area" sx={{ width: "100%" }}>
        <AgGridTable
          isLoading={isLoading}
          colDefs={columnDefs}
          rowData={rowData.rows}
        />
      </Box>
    </DialogTrigger>
  );
}
