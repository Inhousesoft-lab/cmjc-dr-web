import * as React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { ColDef } from "ag-grid-community";
import { z } from "zod";
import https from "@/api/axiosInstance";
import { selectDocDestructionListApiPath } from "@/api/docDestruction/DocDestructionApiPaths";
import DialogTrigger from "../dialog/DialogTrigger";
import AgGridTable from "../grid/AgGridTable";
import { printElement } from "@/utils/print";
import {
  docDestructionListRowSchema,
  docDestructionListSchema,
  type DocDestructionListRowRaw,
} from "@/features/docDestruction/DocDestructionValidator";
import { normalizeDocDestructionRow } from "@/features/docDestruction/DocDestructionThunk";
import { listDefs } from "@/pages/ko/DocDestruction/DocDestructionList/col-def-print";
import type { SearchValues, DocDestruction } from "@/types/docDestruction";

const COMPLETED_DESTRUCTION_STATUS = "02";

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
  return row.dstrcPrcsPrstCd === COMPLETED_DESTRUCTION_STATUS;
};

const formatPrintDate = (value: unknown) => {
  const text = String(value ?? "").trim();
  if (!text) return "-";

  if (/^\d{14}$/.test(text)) {
    return `${text.slice(0, 4)}-${text.slice(4, 6)}-${text.slice(6, 8)}`;
  }
  if (/^\d{8}$/.test(text)) {
    return `${text.slice(0, 4)}-${text.slice(4, 6)}-${text.slice(6, 8)}`;
  }
  if (/^\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}:\d{2})?$/.test(text)) {
    return text.slice(0, 10);
  }
  return text;
};

const formatPrintDateTime = (value: unknown) => {
  const text = String(value ?? "").trim();
  if (!text) return "-";

  if (/^\d{14}$/.test(text)) {
    return `${text.slice(0, 4)}-${text.slice(4, 6)}-${text.slice(6, 8)} ${text.slice(8, 10)}:${text.slice(10, 12)}:${text.slice(12, 14)}`;
  }
  if (/^\d{8}$/.test(text)) {
    return `${text.slice(0, 4)}-${text.slice(4, 6)}-${text.slice(6, 8)} 00:00:00`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return `${text} 00:00:00`;
  }
  const isoLike = text.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
  if (isoLike) {
    return `${isoLike[1]} ${isoLike[2]}:${isoLike[3]}:${isoLike[4]}`;
  }
  return text;
};

export default function DocDestructionManagementPrintDialog({
  searchValues,
}: {
  searchValues: SearchValues;
}) {
  const printAreaRef = React.useRef<HTMLDivElement | null>(null);
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
      dstrcPrcsPrstCd: COMPLETED_DESTRUCTION_STATUS,
      pageNum: 1,
      pageSize: 9999,
    };

    try {
      setIsLoading(true);
      const res = await https.get(selectDocDestructionListApiPath(), {
        params: requestParams,
      });
      const payload = (res as any)?.data?.data ?? (res as any)?.data ?? {};
      const normalizedRows = normalizePrintRows(payload)
        .filter(isCompletedPrivacyRow)
        .map((row) => ({
          ...row,
          clctYmd: formatPrintDate(row.clctYmd),
          dstrcAprvDt: formatPrintDateTime(row.dstrcAprvDt),
        }));

      setRowsData({
        rows: normalizedRows,
        rowCount: normalizedRows.length,
      });
    } catch (error) {
      console.error(error);
      setRowsData({
        rows: [],
        rowCount: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, [searchValues]);

  React.useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open, loadData]);

  const handlePrint = () => {
    const root = printAreaRef.current;
    if (!root) return;

    const printRows = rowData.rows.map((row) => ({
      ...row,
      docTitle: row.docTitle || "-",
      dataTypeLabel: row.fileNm || "-",
      dstrcAutzrId: row.dstrcAutzrId || "-",
    }));

    printElement(root, {
      title: "파기관리대장 출력",
      subTitle: "[별지 제5호 서식]",
      popupFeatures: "width=1024,height=768",
      zoom: 0.6,
      pageMarginMm: 12,
      gridColumns: listDefs.map((col) => ({
        headerName: col.headerName,
        field: typeof col.field === "string" ? col.field : undefined,
      })),
      gridRows: printRows as Array<Record<string, unknown>>,
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
            <Typography variant="subtitle2">[별지 제5호 서식]</Typography>
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
      <Box ref={printAreaRef} id="print-area" sx={{ width: "100%" }}>
        <AgGridTable isLoading={isLoading} colDefs={columnDefs} rowData={rowData.rows} />
      </Box>
    </DialogTrigger>
  );
}
