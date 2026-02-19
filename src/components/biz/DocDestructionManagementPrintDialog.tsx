import * as React from "react";
import { Box, Button, Typography } from "@mui/material";
import type { DocDestruction, SearchValues } from "@/types/docDestruction";
import AgGridContainer from "../grid/AgGridContainer";
import DESTRUCTION_LIST_DUMMY_DATA from "@/mocks/edoc/edocDestructionListDummyData.json";
import { columnDefs } from "@/pages/ko/DocDestruction/DocDestructionList/col-def-print";
import DialogTrigger from "../dialog/DialogTrigger";
import AgGridTable from "../grid/AgGridTable";

type DisposalRow = {
  no: string;
  fileName: string;
  dataType: string;
  createdDate: string;
  disposeDate: string;
  reason: string;
  handler: string;
  manager: string;
};

const rows: DisposalRow[] = [
  {
    no: "1",
    fileName: "회원정보_2023.xlsx",
    dataType: "회원관리",
    createdDate: "2023-01-01",
    disposeDate: "2025-01-01",
    reason: "보유기간 만료",
    handler: "홍길동",
    manager: "김부장",
  },
  // 나머지 빈 행들 (인쇄용 템플릿)
  {
    no: "",
    fileName: "",
    dataType: "",
    createdDate: "",
    disposeDate: "",
    reason: "",
    handler: "",
    manager: "",
  },
  {
    no: "",
    fileName: "",
    dataType: "",
    createdDate: "",
    disposeDate: "",
    reason: "",
    handler: "",
    manager: "",
  },
  {
    no: "",
    fileName: "",
    dataType: "",
    createdDate: "",
    disposeDate: "",
    reason: "",
    handler: "",
    manager: "",
  },
  {
    no: "",
    fileName: "",
    dataType: "",
    createdDate: "",
    disposeDate: "",
    reason: "",
    handler: "",
    manager: "",
  },
  {
    no: "",
    fileName: "",
    dataType: "",
    createdDate: "",
    disposeDate: "",
    reason: "",
    handler: "",
    manager: "",
  },
];

export default function DocDestructionManagementPrintDialog({
  searchValues,
}: {
  searchValues: SearchValues;
}) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const printAreaRef2 = React.useRef<HTMLDivElement | null>(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [rowData, setRowsData] = React.useState<{
    rows: DocDestruction[];
    rowCount: number;
  }>({
    rows: [],
    rowCount: 0,
  });

  const loadData = React.useCallback(async () => {
    // 데이터 로드 로직 작성
    const data = { ...searchValues, reqCd: "CMPLT", prvcInclYn: "Y" };

    try {
      setIsLoading(true);
      const res = DESTRUCTION_LIST_DUMMY_DATA;
      const mappedRows: DocDestruction[] = res.map(
        (item: any, index: number) => ({
          ...item,
          eldocNo: item.eldocNo || `${index}`,
        }),
      );
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
    if (!printAreaRef2.current) return;

    const printContents = printAreaRef2.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=1024,height=768");

    if (!printWindow) return;
    // 현재 문서의 CSS(스타일/링크)를 복사
    const styles = Array.from(
      document.querySelectorAll('link[rel="stylesheet"], style'),
    )
      .map((node) => node.outerHTML)
      .join("\n");

    printWindow.document.open();
    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>파기관리대장 출력</title>
          ${styles}
          <style>
            /* 인쇄 기본 여백/배경 보정 (필요 시 조정) */
            @page { size: auto; margin: 12mm; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            @media print {
              body {
                zoom: 0.6; /* 0.7~0.95 범위에서 조정 */
              }
            }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <DialogTrigger
      buttonLabel="파기관리대장 출력"
      title="파기관리대장 출력"
      maxWidth="md"
      actionsPosition="top"
      open={open}
      onOpen={handleClickOpen}
      onClose={handleClose}
      actions={
        <>
          <Typography variant="subtitle2">[별지 제 5호 서식]</Typography>
          <Typography variant="h6">개인정보파일 파기 관리대장</Typography>
          <Button variant="contained" onClick={handlePrint}>
            출력
          </Button>
        </>
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
