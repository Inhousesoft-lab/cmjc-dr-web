import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Grid, Stack, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import type { ColDef, RowClickedEvent } from "ag-grid-community";
import DialogTrigger from "../dialog/DialogTrigger";
import TableWrapper from "../table/TableWrapper";
import AgGridTable from "../grid/AgGridTable";
import DocDetailTable from "../table/DocDetailTable";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { FileApi, type FileItem } from "@/api/fileApi";
import {
  fetchDigitalDocAuthrtHistoryList,
  fetchDigitalDocHistoryList,
} from "@/features/digitalDoc/DigitalDocThunk";
import {
  selectDigitalDocAuthrtHistoryError,
  selectDigitalDocAuthrtHistoryLoading,
  selectDigitalDocAuthrtHistoryRows,
  selectDigitalDocHistoryError,
  selectDigitalDocHistoryLoading,
  selectDigitalDocHistoryRows,
} from "@/features/digitalDoc/DigitalDocSelectors";
import useNotifications from "@/hooks/useNotifications";
import type { DigitalDocHistory } from "@/types/digitalDoc";
import { formatDateDash } from "@/utils/formater";

const docListDefs: ColDef<DigitalDocHistory>[] = [
  {
    headerName: "번호",
    field: "rowNo",
    width: 80,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "이력번호",
    field: "eldocHstryNo",
    hide: true,
  },
  {
    headerName: "행위일자",
    field: "regDt",
    width: 120,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) => formatDateDash(params?.value),
  },
  {
    headerName: "행위자",
    field: "rgtrId",
    width: 110,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) =>
      params?.data?.rgtrNm || params?.data?.rgtrId || "-",
  },
  {
    headerName: "행위내용",
    field: "actCn",
    flex: 1,
    minWidth: 180,
    cellStyle: { textAlign: "left" },
  },
  {
    headerName: "IP",
    field: "acsrIpAddr",
    width: 130,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "장비",
    field: "eqpmntNm",
    width: 140,
    cellStyle: { textAlign: "center" },
  },
];

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

export default function DigitalDocHistoryButton({
  eldocNo,
}: {
  eldocNo: string;
}) {
  const dispatch = useAppDispatch();
  const notifications = useNotifications();

  const [open, setOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<DigitalDocHistory | null>(
    null,
  );
  const [historyFiles, setHistoryFiles] = useState<FileItem[]>([]);
  const [historyFilesLoading, setHistoryFilesLoading] = useState(false);

  const docHistoryRows = useAppSelector(selectDigitalDocHistoryRows);
  const docHistoryLoading = useAppSelector(selectDigitalDocHistoryLoading);
  const docHistoryError = useAppSelector(selectDigitalDocHistoryError);
  const authrtHistoryRows = useAppSelector(selectDigitalDocAuthrtHistoryRows);
  const authrtHistoryLoading = useAppSelector(
    selectDigitalDocAuthrtHistoryLoading,
  );
  const authrtHistoryError = useAppSelector(selectDigitalDocAuthrtHistoryError);

  const docColumnDefs = useMemo(() => docListDefs, []);

  useEffect(() => {
    if (!open || !eldocNo) return;

    dispatch(fetchDigitalDocHistoryList(eldocNo));
    dispatch(fetchDigitalDocAuthrtHistoryList(eldocNo));
  }, [dispatch, eldocNo, open]);

  useEffect(() => {
    if (!open) {
      setSelectedHistory(null);
      return;
    }

    if (docHistoryRows.length === 0) {
      setSelectedHistory(null);
      return;
    }

    setSelectedHistory((prev) => {
      if (!prev) return docHistoryRows[0];
      return (
        docHistoryRows.find((row) => row.eldocHstryNo === prev.eldocHstryNo) ??
        docHistoryRows[0]
      );
    });
  }, [docHistoryRows, open]);

  useEffect(() => {
    if (!docHistoryError) return;
    notifications.show(docHistoryError, {
      severity: "error",
      autoHideDuration: 3000,
    });
  }, [docHistoryError, notifications]);

  useEffect(() => {
    if (!authrtHistoryError) return;
    notifications.show(authrtHistoryError, {
      severity: "error",
      autoHideDuration: 3000,
    });
  }, [authrtHistoryError, notifications]);

  useEffect(() => {
    if (!open || !selectedHistory?.eldocNo || !selectedHistory?.atchFileSn) {
      setHistoryFiles([]);
      setHistoryFilesLoading(false);
      return;
    }

    if (selectedHistory.atchFileSn === "0") {
      setHistoryFiles([]);
      setHistoryFilesLoading(false);
      return;
    }

    let cancelled = false;

    const loadFiles = async () => {
      setHistoryFilesLoading(true);
      try {
        const files = await FileApi.getFileList({
          taskSeCd: "dr",
          menuSn: 1,
          atchFileGroupId: selectedHistory.atchFileSn,
          taskSeTrgtId: selectedHistory.eldocNo,
        });

        if (!cancelled) {
          setHistoryFiles(files);
        }
      } catch (error) {
        if (!cancelled) {
          setHistoryFiles([]);
          notifications.show(
            error instanceof Error
              ? error.message
              : "첨부파일 목록을 불러오지 못했습니다.",
            {
              severity: "error",
              autoHideDuration: 3000,
            },
          );
        }
      } finally {
        if (!cancelled) {
          setHistoryFilesLoading(false);
        }
      }
    };

    loadFiles().catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [notifications, open, selectedHistory]);

  const handleRowClicked = (event: RowClickedEvent<DigitalDocHistory>) => {
    setSelectedHistory(event.data ?? null);
  };

  const historyAttachmentsContent = useMemo(() => {
    const contentSx = {
      minHeight: 96,
      width: "100%",
      display: "flex",
      alignItems: historyFiles.length > 0 ? "stretch" : "center",
    } as const;

    if (!selectedHistory?.atchFileSn || selectedHistory.atchFileSn === "0") {
      return <Stack sx={contentSx}>첨부파일 없음</Stack>;
    }

    if (historyFilesLoading) {
      return <Stack sx={contentSx} />;
    }

    if (historyFiles.length === 0) {
      return <Stack sx={contentSx}>첨부파일 없음</Stack>;
    }

    return (
      <Stack spacing={0.75} sx={{ ...contentSx, justifyContent: "center" }}>
        {historyFiles.map((file, index) => {
          return (
            <Stack
              key={file.atchFileId ?? `${selectedHistory.eldocHstryNo}-${index}`}
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="space-between"
              sx={{ minWidth: 0, py: 0.25 }}
            >
              <Stack sx={{ minWidth: 0, flex: 1 }}>
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
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    );
  }, [historyFiles, historyFilesLoading, selectedHistory]);

  return (
    <DialogTrigger
      buttonLabel="이력"
      triggerButtonClassName="btn_fixed-sm btn_fixed-md"
      title="이력"
      maxWidth="xl"
      paperSx={{
        width: "min(1280px, 94vw)",
        height: "min(820px, 90vh)",
        minHeight: "auto",
        "& .MuiDialogContent-root": {
          px: 2,
          py: 1.5,
          overflow: "hidden",
        },
      }}
      onOpen={() => setOpen(true)}
      open={open}
      onClose={() => setOpen(false)}
    >
      <Stack spacing={2} sx={{ height: "100%", minHeight: 0 }}>
        <Grid container spacing={2} sx={{ minHeight: 0 }}>
          <Grid size={6}>
            <Box sx={{ height: 360, maxHeight: "38vh" }}>
              <AgGridTable
                height={360}
                colDefs={docColumnDefs}
                rowData={docHistoryRows}
                isLoading={docHistoryLoading}
                onRowClicked={handleRowClicked}
              />
            </Box>
          </Grid>
          <Grid size={6}>
            <Box sx={{ height: 360, maxHeight: "38vh", overflow: "auto" }}>
              <Stack spacing={1}>
              <TableWrapper
                tableAriaLabel="공람 이력"
                tableHead={
                  <TableHead>
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        align="center"
                        sx={{ fontWeight: 700 }}
                      >
                        공람 이력
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center" sx={{ width: 120 }}>
                        부서
                      </TableCell>
                      <TableCell align="center" sx={{ width: 110 }}>
                        이름
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 160 }}>
                        행위내용
                      </TableCell>
                      <TableCell align="center" sx={{ width: 110 }}>
                        행위자
                      </TableCell>
                      <TableCell align="center" sx={{ width: 120 }}>
                        행위일자
                      </TableCell>
                    </TableRow>
                  </TableHead>
                }
              >
                {authrtHistoryRows.map((row, index) => (
                  <TableRow
                    key={`${row.inqAuthrtHstryNo || row.inqAuthrtNo || "row"}-${index}`}
                  >
                    <TableCell align="center">
                      {(row as any).deptNm || row.deptId || "-"}
                    </TableCell>
                    <TableCell align="center">
                      {(row as any).indvNm ||
                        (row.indvId === "ALL" ? "전체" : row.indvId) ||
                        "-"}
                    </TableCell>
                    <TableCell align="center">{row.actCn || "-"}</TableCell>
                    <TableCell align="center">
                      {(row as any).rgtrNm || row.rgtrId || "-"}
                    </TableCell>
                    <TableCell align="center">
                      {formatDateDash(row.regDt)}
                    </TableCell>
                  </TableRow>
                ))}
                {authrtHistoryRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      {authrtHistoryLoading
                        ? "공람 이력 조회 중..."
                        : "공람 이력이 없습니다."}
                    </TableCell>
                  </TableRow>
                )}
              </TableWrapper>
            </Stack>
            </Box>
          </Grid>
        </Grid>

        <Stack spacing={1} sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
          <Typography variant="subtitle1" fontWeight={700}>
            이력 시점 전자문서 메타데이터
          </Typography>
          {selectedHistory ? (
            <>
              <Alert severity="info" sx={{ py: 0 }}>
                선택 이력: {selectedHistory.rowNo || "-"} / 행위일자{" "}
                {formatDateDash(selectedHistory.regDt)} / 행위내용{" "}
                {selectedHistory.actCn || "-"}
              </Alert>
              <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", pr: 0.5 }}>
                <DocDetailTable
                  eldocNo={eldocNo}
                  detail={selectedHistory}
                  showAttachments
                  attachmentsContent={historyAttachmentsContent}
                />
              </Box>
            </>
          ) : (
            <Alert severity="info" sx={{ py: 0 }}>
              조회할 이력 항목을 선택하세요.
            </Alert>
          )}
        </Stack>
      </Stack>
    </DialogTrigger>
  );
}
