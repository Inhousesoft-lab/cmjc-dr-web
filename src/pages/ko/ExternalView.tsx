import * as React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { CellStyle, ColDef, ICellRendererParams } from "ag-grid-community";
import DialogTrigger from "@/components/dialog/DialogTrigger";
import AgGridTable from "@/components/grid/AgGridTable";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { FileApi, type FileItem } from "@/api/fileApi";
import DigitalDocViewerButton from "@/components/actionButtons/DigitalDocViewerButton";
import useNotifications from "@/hooks/useNotifications";
import {
  selectExternalViewError,
  selectExternalViewLoading,
  selectExternalViewRows,
} from "@/features/ExternalViewSelectors";
import { fetchExternalViewList } from "@/features/ExternalViewThunk";
import type { ExternalViewDocument } from "@/types/externalView";

type ExternalViewRow = {
  id: number;
  eldocNo: string;
  category: string;
  title: string;
  date: string;
  term: string;
  type: string;
  prvcInclYn: string;
  canView: boolean;
  canDownload: boolean;
  downloadReasonRequired: boolean;
  fileKey: string;
  fileName: string;
  fileSize: string;
  file: FileItem | null;
};

type FileMap = Record<string, FileItem[]>;

const INITIAL_LIST_PARAMS = {
  pageNum: 1,
  pageSize: 100,
} as const;

const centeredCellStyle: CellStyle = {
  textAlign: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const alignedCellStyle: CellStyle = {
  display: "flex",
  alignItems: "center",
};

const multilineCenteredCellStyle: CellStyle = {
  ...centeredCellStyle,
  whiteSpace: "pre-line",
  lineHeight: 1.35,
};

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

const formatFileSize = (bytes?: number) => {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const getFileKind = (file: FileItem) => {
  const ext = (file.fileExtnNm ?? file.fileNm?.split(".").pop() ?? "").toLowerCase();

  return {
    isPdf: ext === "pdf",
    isImage: ["png", "jpg", "jpeg", "gif", "bmp", "webp", "svg"].includes(ext),
  };
};

const getExternalViewDownloadUrls = (
  row: Pick<ExternalViewRow, "eldocNo" | "file">,
  reason?: string,
) => {
  if (!row.file) return [];
  return FileApi.getDownloadStreamUrls(row.file, {
    eldocNo: row.eldocNo,
    reason,
  });
};

export default function ExternalView() {
  const dispatch = useAppDispatch();
  const notifications = useNotifications();
  const [open, setOpen] = React.useState(false);
  const [docNoInput, setDocNoInput] = React.useState("");
  const [submittedDocNo, setSubmittedDocNo] = React.useState("");
  const [allowView, setAllowView] = React.useState(true);
  const [allowDownload, setAllowDownload] = React.useState(true);
  const [filesByDoc, setFilesByDoc] = React.useState<FileMap>({});
  const [loadingFiles, setLoadingFiles] = React.useState<Record<string, boolean>>({});
  const [downloadReasonOpen, setDownloadReasonOpen] = React.useState(false);
  const [downloadReason, setDownloadReason] = React.useState("");
  const [downloadReasonError, setDownloadReasonError] = React.useState("");
  const [pendingDownloadRow, setPendingDownloadRow] = React.useState<ExternalViewRow | null>(null);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [downloadingFileKey, setDownloadingFileKey] = React.useState<string | null>(null);

  const sourceRows = useAppSelector(selectExternalViewRows);
  const isLoading = useAppSelector(selectExternalViewLoading);
  const listError = useAppSelector(selectExternalViewError);

  React.useEffect(() => {
    if (!open || !listError) return;
    notifications.show(listError, {
      severity: "error",
      autoHideDuration: 3000,
    });
  }, [listError, notifications, open]);

  React.useEffect(() => {
    if (!open || !submittedDocNo) return;

    dispatch(
      fetchExternalViewList({
        ...INITIAL_LIST_PARAMS,
        docNo: submittedDocNo,
        allowView,
        allowDownload,
      }),
    );
  }, [allowDownload, allowView, dispatch, open, submittedDocNo]);

  React.useEffect(() => {
    if (!open || sourceRows.length === 0) {
      setFilesByDoc({});
      setLoadingFiles({});
      return;
    }

    let cancelled = false;

    const loadFiles = async () => {
      const targets = sourceRows.filter(
        (row) => !!row.eldocNo && !!row.atchFileSn && row.atchFileSn !== "0",
      );

      if (targets.length === 0) {
        if (!cancelled) {
          setFilesByDoc({});
          setLoadingFiles({});
        }
        return;
      }

      if (!cancelled) {
        setLoadingFiles(Object.fromEntries(targets.map((row) => [row.eldocNo, true])));
      }

      const entries = await Promise.all(
        targets.map(async (row) => {
          try {
            const files = await FileApi.getFileList({
              taskSeCd: "dr",
              menuSn: 1,
              atchFileGroupId: row.atchFileSn,
              taskSeTrgtId: row.eldocNo,
            });
            return [row.eldocNo, files] as const;
          } catch (error) {
            notifications.show(
              error instanceof Error ? error.message : "첨부파일 목록을 불러오지 못했습니다.",
              {
                severity: "error",
                autoHideDuration: 3000,
              },
            );
            return [row.eldocNo, []] as const;
          }
        }),
      );

      if (cancelled) return;

      setFilesByDoc((prev) => ({
        ...prev,
        ...Object.fromEntries(entries),
      }));
      setLoadingFiles(Object.fromEntries(targets.map((row) => [row.eldocNo, false])));
    };

    loadFiles().catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [notifications, open, sourceRows]);

  const closeDownloadReasonDialog = React.useCallback(() => {
    if (isDownloading) return;
    setDownloadReasonOpen(false);
    setDownloadReason("");
    setDownloadReasonError("");
    setPendingDownloadRow(null);
  }, [isDownloading]);

  const runDownload = React.useCallback(async (row: ExternalViewRow, reason?: string) => {
    if (!row.file) {
      throw new Error("다운로드할 파일 정보가 없습니다.");
    }

    const downloadUrls = getExternalViewDownloadUrls(row, reason);

    await FileApi.downloadFromUrls(downloadUrls, row.file.fileNm || "download");
  }, []);

  const handleDownloadClick = React.useCallback(
    async (row: ExternalViewRow) => {
      if (!row.file || !row.canDownload) return;

      if (row.downloadReasonRequired) {
        setPendingDownloadRow(row);
        setDownloadReasonOpen(true);
        setDownloadReason("");
        setDownloadReasonError("");
        return;
      }

      try {
        setIsDownloading(true);
        setDownloadingFileKey(row.fileKey);
        await runDownload(row);
      } catch (error) {
        notifications.show(
          error instanceof Error ? error.message : "다운로드에 실패했습니다.",
          {
            severity: "error",
            autoHideDuration: 3000,
          },
        );
      } finally {
        setIsDownloading(false);
        setDownloadingFileKey(null);
      }
    },
    [notifications, runDownload],
  );

  const handleReasonDownloadConfirm = React.useCallback(async () => {
    const trimmedReason = downloadReason.trim();

    if (!trimmedReason) {
      setDownloadReasonError("다운로드 사유를 입력해 주세요.");
      return;
    }

    if (!pendingDownloadRow) {
      setDownloadReasonError("다운로드할 파일 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      setIsDownloading(true);
      setDownloadingFileKey(pendingDownloadRow.fileKey);
      await runDownload(pendingDownloadRow, trimmedReason);
      closeDownloadReasonDialog();
    } catch (error) {
      setDownloadReasonError(
        error instanceof Error ? error.message : "다운로드에 실패했습니다.",
      );
    } finally {
      setIsDownloading(false);
      setDownloadingFileKey(null);
    }
  }, [closeDownloadReasonDialog, downloadReason, pendingDownloadRow, runDownload]);

  const rows = React.useMemo<ExternalViewRow[]>(() => {
    const flattenedRows = sourceRows.flatMap<ExternalViewRow>((row) => {
      const baseRow: Omit<ExternalViewRow, "fileKey" | "fileName" | "fileSize" | "file"> = {
        id: 0,
        eldocNo: row.eldocNo,
        category: [row.docLclsfNm, row.docMclsfNm, row.docSclsfNm].filter(Boolean).join(" > "),
        title: row.docTtl || "-",
        date: formatCompactDate(row.clctYmd),
        term: formatRetentionTerm(row),
        type: row.eldocYn === "Y" ? "문서" : "파일",
        prvcInclYn: row.prvcInclYn || "N",
        canView: row.canView,
        canDownload: row.canDownload,
        downloadReasonRequired: row.downloadReasonRequired,
      };

      if (loadingFiles[row.eldocNo]) {
        return [
          {
            ...baseRow,
            fileKey: `${row.eldocNo}-loading`,
            fileName: "첨부파일 불러오는 중...",
            fileSize: "-",
            file: null,
          },
        ];
      }

      const files = filesByDoc[row.eldocNo] ?? [];

      if (files.length === 0) {
        return [
          {
            ...baseRow,
            fileKey: `${row.eldocNo}-empty`,
            fileName: "첨부파일 없음",
            fileSize: "-",
            file: null,
          },
        ];
      }

      return files.map((file, index) => ({
        ...baseRow,
        fileKey: file.atchFileId ?? `${row.eldocNo}-${index}`,
        fileName: file.fileNm || `첨부파일 ${index + 1}`,
        fileSize: formatFileSize(file.fileSz),
        file,
      }));
    });

    return flattenedRows.map((row, index) => ({
      ...row,
      id: index + 1,
    }));
  }, [filesByDoc, loadingFiles, sourceRows]);

  const handleOpen = React.useCallback(() => {
    const docNo = docNoInput.trim();

    if (!docNo) {
      notifications.show("문서번호를 입력해 주세요.", {
        severity: "warning",
        autoHideDuration: 3000,
      });
      return;
    }

    setOpen(true);
    setSubmittedDocNo(docNo);
  }, [docNoInput, notifications]);

  const handleClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  const columnDefs = React.useMemo<ColDef<ExternalViewRow>[]>(
    () => [
      {
        headerName: "번호",
        field: "id",
        width: 64,
        minWidth: 64,
        maxWidth: 64,
        flex: 0,
        cellStyle: centeredCellStyle,
      },
      {
        headerName: "문서분류",
        field: "category",
        width: 220,
        minWidth: 200,
        cellStyle: alignedCellStyle,
      },
      {
        headerName: "문서제목",
        field: "title",
        cellStyle: alignedCellStyle,
        flex: 1,
        minWidth: 240,
      },
      {
        headerName: "수집일자 / 보유기간",
        field: "date",
        width: 170,
        minWidth: 170,
        maxWidth: 170,
        flex: 0,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        headerClass: "ag-center-header",
        cellStyle: multilineCenteredCellStyle,
        cellRenderer: (params: ICellRendererParams<ExternalViewRow>) => {
          const row = params.data;
          if (!row) return "-";
          return row.term ? `${row.date}\n${row.term}` : row.date;
        },
      },
      {
        headerName: "첨부파일",
        field: "fileName",
        flex: 1,
        minWidth: 260,
        cellStyle: alignedCellStyle,
        cellRenderer: (params: ICellRendererParams<ExternalViewRow>) => {
          const row = params.data;
          if (!row) return null;

          return (
            <Box
              sx={{
                minWidth: 0,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="body2"
                title={row.fileName}
                sx={{
                  fontWeight: 500,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  lineHeight: 1.2,
                }}
              >
                {row.fileName}
              </Typography>
              {row.file ? (
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                  {row.fileSize}
                </Typography>
              ) : null}
            </Box>
          );
        },
      },
      {
        headerName: "비고",
        colId: "actions",
        width: 210,
        minWidth: 210,
        maxWidth: 210,
        flex: 0,
        cellStyle: {
          ...alignedCellStyle,
          justifyContent: "center",
        } satisfies CellStyle,
        cellRenderer: (params: ICellRendererParams<ExternalViewRow>) => {
          const row = params.data;
          if (!row?.file) {
            return (
              <Typography variant="body2" color="text.secondary">
                -
              </Typography>
            );
          }

          const { isPdf, isImage } = getFileKind(row.file);
          const viewerUrls = getExternalViewDownloadUrls(row);
          const canPreview = isPdf || isImage;

          if (!row.canView && !row.canDownload) {
            return <Typography variant="body2" color="text.secondary">-</Typography>;
          }

          return (
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ width: "100%" }}>
              {row.canView && canPreview && isPdf && (
                <DigitalDocViewerButton
                  fileUrl={viewerUrls}
                  disabled={isDownloading}
                />
              )}
              {row.canView && canPreview && isImage && (
                <DigitalDocViewerButton
                  fileUrl={viewerUrls}
                  fileType="image"
                  disabled={isDownloading}
                />
              )}
              {row.canView && !canPreview && (
                <Button variant="outlined" size="small" disabled>
                  열람
                </Button>
              )}
              {row.canDownload && (
                <Button
                  variant="outlined"
                  size="small"
                  disabled={isDownloading}
                  endIcon={
                    isDownloading && downloadingFileKey === row.fileKey ? (
                      <CircularProgress size={14} color="inherit" />
                    ) : undefined
                  }
                  onClick={() => {
                    void handleDownloadClick(row);
                  }}
                >
                  다운로드
                </Button>
              )}
            </Stack>
          );
        },
      },
    ],
    [downloadingFileKey, handleDownloadClick, isDownloading],
  );

  return (
    <>
      <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
        <Button variant="outlined" onClick={handleOpen}>
          문서열람(외부)
        </Button>
        <TextField
          size="small"
          label="문서 번호"
          value={docNoInput}
          onChange={(event) => setDocNoInput(event.target.value)}
          placeholder="문서 번호 입력"
          sx={{ minWidth: 240 }}
        />
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2">옵션</Typography>
          <Button
            variant={allowView ? "contained" : "outlined"}
            size="small"
            onClick={() => setAllowView((prev) => !prev)}
          >
            열람
          </Button>
          <Button
            variant={allowDownload ? "contained" : "outlined"}
            size="small"
            onClick={() => setAllowDownload((prev) => !prev)}
          >
            다운로드
          </Button>
        </Stack>
      </Stack>
      <DialogTrigger
        hideTrigger
        title="문서열람(외부)"
        maxWidth="lg"
        open={open}
        onClose={handleClose}
        paperSx={{ minHeight: 540 }}
      >
        <AgGridTable
          colDefs={columnDefs}
          rowData={rows}
          isLoading={isLoading}
          height={460}
          rowHeight={44}
          headerHeight={36}
        />
        {isDownloading && (
          <Box sx={{ px: 2, pb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={18} />
            <Typography variant="body2" color="text.secondary">
              파일 다운로드 중입니다...
            </Typography>
          </Box>
        )}
      </DialogTrigger>

      <Dialog
        open={downloadReasonOpen}
        onClose={closeDownloadReasonDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>다운로드 사유 입력</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="사유"
            fullWidth
            multiline
            minRows={3}
            value={downloadReason}
            onChange={(e) => {
              setDownloadReason(e.target.value);
              if (downloadReasonError) {
                setDownloadReasonError("");
              }
            }}
            error={!!downloadReasonError}
            helperText={downloadReasonError || "개인정보 포함 문서는 다운로드 사유가 필요합니다."}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDownloadReasonDialog} disabled={isDownloading}>
            취소
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              void handleReasonDownloadConfirm();
            }}
            disabled={isDownloading}
            startIcon={
              isDownloading ? <CircularProgress size={16} color="inherit" /> : undefined
            }
          >
            다운로드
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
