import * as React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
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
  atchFileSn: string;
};

type FileMap = Record<string, FileItem[]>;

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

const formatFileSize = (bytes?: number) => {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const getFileKind = (file: FileItem) => {
  const ext = (
    file.fileExtnNm ??
    file.fileNm?.split(".").pop() ??
    ""
  ).toLowerCase();

  return {
    isPdf: ext === "pdf",
    isImage: ["png", "jpg", "jpeg", "gif", "bmp", "webp", "svg"].includes(ext),
  };
};

export default function ExternalView() {
  const dispatch = useAppDispatch();
  const notifications = useNotifications();
  const [open, setOpen] = React.useState(false);
  const [filesByDoc, setFilesByDoc] = React.useState<FileMap>({});
  const [loadingFiles, setLoadingFiles] = React.useState<Record<string, boolean>>({});

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
        setLoadingFiles(
          Object.fromEntries(targets.map((row) => [row.eldocNo, true])),
        );
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
              error instanceof Error
                ? error.message
                : "첨부파일 목록을 불러오지 못했습니다.",
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
      setLoadingFiles(
        Object.fromEntries(targets.map((row) => [row.eldocNo, false])),
      );
    };

    loadFiles().catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [notifications, open, sourceRows]);

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
        atchFileSn: row.atchFileSn || "",
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

  const columnDefs = React.useMemo<ColDef<ExternalViewRow>[]>(
    () => [
      {
        headerName: "번호",
        field: "id",
        width: 60,
        minWidth: 60,
        maxWidth: 60,
        flex: 0,
        cellStyle: { textAlign: "center" },
      },
      {
        headerName: "문서분류",
        field: "category",
        cellStyle: { display: "flex", alignItems: "center" },
        width: 190,
      },
      {
        headerName: "문서제목",
        field: "title",
        cellStyle: { display: "flex", alignItems: "center" },
        flex: 1,
      },
      {
        headerName: "수집일자 (보존기간)",
        field: "date",
        width: 140,
        minWidth: 140,
        maxWidth: 140,
        flex: 0,
        cellStyle: {
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        cellRenderer: (params: ICellRendererParams<ExternalViewRow>) =>
          `${params.data?.date ?? ""}\n${params.data?.term ?? ""}`,
      },
      {
        headerName: "종류",
        field: "type",
        width: 68,
        minWidth: 68,
        maxWidth: 68,
        flex: 0,
        cellStyle: {
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      },
      {
        headerName: "비고",
        field: "actions",
        flex: 3,
        autoHeight: true,
        cellRenderer: (params: ICellRendererParams<ExternalViewRow>) => {
          const row = params.data;
          if (!row || row.type === "파일") return null;

          const files = filesByDoc[row.eldocNo] ?? [];
          const isBusy = loadingFiles[row.eldocNo];

          if (isBusy) {
            return (
              <Typography variant="body2" color="text.secondary">
                첨부파일 불러오는 중...
              </Typography>
            );
          }

          if (files.length === 0) {
            return (
              <Typography variant="body2" color="text.secondary">
                첨부파일 없음
              </Typography>
            );
          }

          return (
            <Stack spacing={0.75} sx={{ py: 0.5 }}>
              {files.map((file, index) => {
                const { isPdf, isImage } = getFileKind(file);
                const downloadUrls = FileApi.getDownloadStreamUrls(file);

                return (
                  <Stack
                    key={file.atchFileId ?? `${row.eldocNo}-${index}`}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ minWidth: 0 }}
                  >
                    <Box
                      sx={{
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        noWrap
                        title={file.fileNm || ""}
                        sx={{
                          fontWeight: 500,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {file.fileNm || `첨부파일 ${index + 1}`}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(file.fileSz)}
                      </Typography>
                    </Box>

                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ flexShrink: 0 }}
                    >
                      {isPdf && <DigitalDocViewerButton fileUrl={downloadUrls} />}
                      {!isPdf && isImage && (
                        <DigitalDocViewerButton
                          fileUrl={downloadUrls}
                          fileType="image"
                        />
                      )}
                      {!isPdf && !isImage && (
                        <Button variant="outlined" size="small" disabled>
                          열람
                        </Button>
                      )}
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={async () => {
                          try {
                            await FileApi.downloadFromUrls(
                              downloadUrls,
                              file.fileNm || "download",
                            );
                          } catch (error) {
                            notifications.show(
                              error instanceof Error
                                ? error.message
                                : "다운로드에 실패했습니다.",
                              {
                                severity: "error",
                                autoHideDuration: 3000,
                              },
                            );
                          }
                        }}
                      >
                        다운로드
                      </Button>
                    </Stack>
                  </Stack>
                );
              })}
            </Stack>
          );
        },
      },
    ],
    [filesByDoc, loadingFiles, notifications],
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
