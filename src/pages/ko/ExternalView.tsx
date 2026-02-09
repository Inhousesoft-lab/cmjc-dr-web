import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { ColDef } from "ag-grid-community";
import AgGridContainer from "@/components/grid/AgGridContainer";

const rows = [
  {
    id: 1,
    category: "피해구제 > 중분류 > 소분류",
    title: "진료기록",
    date: "25.09.01",
    term: "(반영구)",
    type: "문서",
  },
  {
    id: 2,
    category: "피해구제 > 중분류 > 소분류",
    title: "MRI CD",
    date: "25.09.01",
    term: "(3년)",
    type: "파일",
  },
  {
    id: 3,
    category: "피해구제 > 중분류 > 소분류",
    title: "의사소견서",
    date: "25.09.03",
    term: "(10년)",
    type: "문서",
  },
  {
    id: 4,
    category: "피해구제 > 중분류 > 소분류",
    title: "진료비 상세내역",
    date: "25.09.05",
    term: "(반영구)",
    type: "문서",
  },
];

export default function ExternalView() {
  const [open, setOpen] = useState(false);
  const [columnDefs] = useState<ColDef[]>([
    {
      headerName: "번호",
      field: "id",
      width: 60,
      cellStyle: { textAlign: "center" },
    },
    { headerName: "문서분류", field: "category", width: 190 },
    { headerName: "문서제목", field: "title", flex: 1 },
    {
      headerName: "수집일자 (보존연한)",
      field: "date",
      width: 140,
      cellRenderer: (params: any) =>
        `${params.data?.date ?? ""}\n${params.data?.term ?? ""}`,
    },
    {
      headerName: "종류",
      field: "type",
      width: 80,
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "비고",
      field: "actions",
      width: 160,
      cellRenderer: (params: any) => {
        if (params.data?.type === "파일") return null;
        return (
          <Stack direction="row" spacing={1} justifyContent="center">
            <Button size="small" variant="contained">
              열람
            </Button>
            <Button size="small" variant="outlined">
              다운로드
            </Button>
          </Stack>
        );
      },
    },
  ]);

  return (
    <div className="content_wrap">
      <div className="content">
        <Button variant="contained" onClick={() => setOpen(true)}>
          문서열람(외부)
        </Button>

        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>문서번호 : KIDS-001</DialogTitle>
          <DialogContent>
            <AgGridContainer
              colDefs={columnDefs}
              rowData={rows}
              count={rows.length}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
