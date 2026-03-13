import * as React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import type { SearchValues, DocDestruction } from "@/types/docDestruction";
import { listDefs } from "@/pages/ko/DocDestruction/DocDestructionList/col-def-print";
import DialogTrigger from "../dialog/DialogTrigger";
import AgGridTable from "../grid/AgGridTable";
import { ColDef } from "ag-grid-community";
import { printElement } from "@/utils/print";
import https from "@/api/axiosInstance";
import { selectDocDestructionListApiPath } from "@/api/docDestruction/DocDestructionApiPaths";
import {
  docDestructionListRowSchema,
  docDestructionListSchema,
  type DocDestructionListRowRaw,
} from "@/features/docDestruction/DocDestructionValidator";
import { normalizeDocDestructionRow } from "@/features/docDestruction/DocDestructionThunk";
import { z } from "zod";

const COMPLETED_PRIVACY_DESTRUCTION_STATUS = "04";

type DestructionRowState = {
  rows: DocDestruction[];
  rowCount: number;
};

const normalizePrintRows = (payload: unknown): DocDestruction[] => {
  if (Array.isArray(payload)) {
    const parsedRows = z.array(docDestructionListRowSchema).safeParse(payload);
    if (!parsedRows.success) {
      throw new Error("파기관리대장 출력 응답 형식이 올바르지 않습니다.");
    }

    return parsedRows.data.map((item, index) => normalizeDocDestructionRow(item, index));
  }

  const parsed = docDestructionListSchema.safeParse(payload ?? {});
  if (!parsed.success) {
    throw new Error("파기관리대장 출력 응답 형식이 올바르지 않습니다.");
  }

  const rows = parsed.data.list.length > 0 ? parsed.data.list : parsed.data.rows;
  return rows.map((item: DocDestructionListRowRaw, index: number) =>
    normalizeDocDestructionRow(item, index),
  );
};

const isCompletedPrivacyRow = (row: DocDestruction) => {
  const personalInfoIncluded = String(row.prvcInclYn ?? row.hasPersonalInfo ?? "").trim();
  return personalInfoIncluded === "Y" && row.dstrcPrcsPrstCd === COMPLETED_PRIVACY_DESTRUCTION_STATUS;
};

export default function DocDestructionManagementPrintDialog({
  searchValues,
}: {
  searchValues: SearchValues;
}) {
  const printAreaRef2 = React.useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = React.useState(false);

  const [columnDefs] = React.useState<ColDef<DocDestruction>[]>(listDefs);

  const [rowData, setRowsData] = React.useState<DestructionRowState>({
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
    const requestParams = {
      ...searchValues,
      reqCd: "CMPLT",
      prvcInclYn: "Y",
      dstrcPrcsPrstCd: COMPLETED_PRIVACY_DESTRUCTION_STATUS,
      pageNum: 1,
      pageSize: 9999,
    };

    try {
      setIsLoading(true);
      const res = await https.get(selectDocDestructionListApiPath(), {
        params: requestParams,
      });
      const payload = (res as any)?.data?.data ?? (res as any)?.data ?? {};
      const normalizedRows = normalizePrintRows(payload).filter(isCompletedPrivacyRow);

      setRowsData({
        rows: normalizedRows,
        rowCount: normalizedRows.length,
      });
    } catch (e) {
      console.error(e);
      setRowsData({
        rows: [],
        rowCount: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, [searchValues]);

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
