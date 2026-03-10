import * as React from "react";
import { Button, Stack } from "@mui/material";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import DialogTrigger from "@/components/dialog/DialogTrigger";
import AgGridTable from "@/components/grid/AgGridTable";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import useNotifications from "@/hooks/useNotifications";
import {
  selectExternalViewError,
  selectExternalViewFileError,
  selectExternalViewFileLoading,
  selectExternalViewLoading,
  selectExternalViewRows,
} from "@/features/ExternalViewSelectors";
import {
  fetchExternalViewFile,
  fetchExternalViewList,
} from "@/features/ExternalViewThunk";
import type { ExternalViewDocument, ExternalViewFilePayload } from "@/types/externalView";

type ExternalViewRow = {
  id: number;
  eldocNo: string;
  category: string;
  title: string;
  date: string;
  term: string;
  type: string;
};

const INITIAL_LIST_PARAMS = {
  pageNum: 1,
  pageSize: 100,
} as const;

const formatCompactDate = (value: string) => {
  if (!value) return "-";
  if (/^\d{8}$/.test(value)) {
    return `${value.slice(2, 4)}.${value.slice(4, 6)}.${value.slice(6, 8)}`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value.slice(2).replace(/-/g, ".");
  }
  return value;
};

const formatRetentionTerm = (row: ExternalViewDocument) => {
  if (row.hldPrdDfyrs && row.hldPrdDfyrs !== "0") {
    return `(${row.hldPrdDfyrs}년)`;
  }
  if (row.hldPrdMmCnt) {
    return `(${row.hldPrdMmCnt}개월)`;
  }
  return "";
};

const buildPreviewUrl = (file: ExternalViewFilePayload) =>
  URL.createObjectURL(new Blob([file.blob], { type: file.contentType }));

export default function ExternalView() {
  const dispatch = useAppDispatch();
  const notifications = useNotifications();
  const [open, setOpen] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const sourceRows = useAppSelector(selectExternalViewRows);
  const isLoading = useAppSelector(selectExternalViewLoading);
  const listError = useAppSelector(selectExternalViewError);
  const fileLoading = useAppSelector(selectExternalViewFileLoading);
  const fileError = useAppSelector(selectExternalViewFileError);

  React.useEffect(() => {
    if (!open || !listError) return;
    notifications.show(listError, {
      severity: "error",
      autoHideDuration: 3000,
    });
  }, [listError, notifications, open]);

  React.useEffect(() => {
    if (!open || !fileError) return;
    notifications.show(fileError, {
      severity: "error",
      autoHideDuration: 3000,
    });
  }, [fileError, notifications, open]);

  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const rows = React.useMemo<ExternalViewRow[]>(
    () =>
      sourceRows.map((row, index) => ({
        id: index + 1,
        eldocNo: row.eldocNo,
        category: [row.docLclsfNm, row.docMclsfNm, row.docSclsfNm]
          .filter(Boolean)
          .join(" > "),
        title: row.docTtl || "-",
        date: formatCompactDate(row.clctYmd),
        term: formatRetentionTerm(row),
        type: row.eldocYn === "Y" ? "문서" : "파일",
      })),
    [sourceRows],
  );

  const handleOpen = React.useCallback(() => {
    setOpen(true);
    dispatch(fetchExternalViewList(INITIAL_LIST_PARAMS));
  }, [dispatch]);

  const handleClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  const handleDownload = React.useCallback(
    async (eldocNo: string) => {
      const file = await dispatch(fetchExternalViewFile(eldocNo)).unwrap();
      const objectUrl = buildPreviewUrl(file);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = file.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    },
    [dispatch],
  );

  const handlePreview = React.useCallback(
    async (eldocNo: string) => {
      const file = await dispatch(fetchExternalViewFile(eldocNo)).unwrap();
      const objectUrl = buildPreviewUrl(file);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(objectUrl);
      window.open(objectUrl, "_blank", "noopener,noreferrer");
    },
    [dispatch, previewUrl],
  );

  const columnDefs = React.useMemo<ColDef<ExternalViewRow>[]>(
    () => [
      {
        headerName: "번호",
        field: "id",
        width: 60,
        cellStyle: { textAlign: "center" },
      },
      {
        headerName: "문서분류",
        field: "category",
        width: 190,
      },
      {
        headerName: "문서제목",
        field: "title",
        flex: 1,
      },
      {
        headerName: "수집일자 (보존연한)",
        field: "date",
        width: 140,
        cellRenderer: (params: ICellRendererParams<ExternalViewRow>) =>
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
        cellRenderer: (params: ICellRendererParams<ExternalViewRow>) => {
          const eldocNo = params.data?.eldocNo ?? "";
          if (params.data?.type === "파일") return null;

          return (
            <Stack direction="row" spacing={1} justifyContent="center">
              <Button
                size="small"
                variant="outlined"
                disabled={!eldocNo || fileLoading}
                onClick={(event) => {
                  event.stopPropagation();
                  handlePreview(eldocNo).catch(() => undefined);
                }}
              >
                열람
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={!eldocNo || fileLoading}
                onClick={(event) => {
                  event.stopPropagation();
                  handleDownload(eldocNo).catch(() => undefined);
                }}
              >
                다운로드
              </Button>
            </Stack>
          );
        },
      },
    ],
    [fileLoading, handleDownload, handlePreview],
  );

  return (
    <DialogTrigger
      buttonLabel="문서열람(외부)"
      title="문서열람(외부)"
      maxWidth="md"
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
    >
      <AgGridTable colDefs={columnDefs} rowData={rows} isLoading={isLoading} />
    </DialogTrigger>
  );
}
