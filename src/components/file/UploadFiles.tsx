import { useState, useEffect, useRef } from "react";
import {
  Typography,
  Alert,
  Box,
  Snackbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";

import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  InsertDriveFile as FileIcon,
} from "@mui/icons-material";
import "./UploadFile.css";
import { FileApi, type FileItem } from "@/api/fileApi";
import MuiCheckbox from "../elements/MuiCheckbox";
import DigitalDocViewerDialog from "@/components/actionButtons/DigitalDocViewerDialog";

interface FileWithId extends File {
  uid: string;
}

interface FileProps {
  taskSeCd?: string;
  menuSn?: number;
  taskSeTrgtId?: string; // 해당 업무의 pk
  initialGroupId?: string;
  setGroupId?: (id: string) => void;
  readOnly?: boolean;
  requireDownloadReason?: boolean;
}

interface ViewerState {
  fileUrl: string[];
  fileType: "pdf" | "image";
  fileKey: string;
}

const createFileUid = () => {
  const randomValues = new Uint32Array(1);
  globalThis.crypto.getRandomValues(randomValues);

  return `${Date.now()}-${randomValues[0].toString(16)}`;
};

export default function UploadFiles({
  taskSeCd = "dr",
  menuSn = 1,
  taskSeTrgtId,
  initialGroupId,
  setGroupId,
  readOnly = false,
  requireDownloadReason = false,
}: FileProps) {
  const [fileList, setFileList] = useState<FileWithId[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [savedFileList, setSavedFileList] = useState<FileItem[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [fileListError, setFileListError] = useState<string | null>(null);

  const [fileGroupId, setFileGroupId] = useState("");

  const isExcel = "0";

  // 방법 1: useRef 사용
  const hasFetched = useRef(false);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });
  const [isDragging, setIsDragging] = useState(false);
  const [downloadReasonOpen, setDownloadReasonOpen] = useState(false);
  const [downloadReason, setDownloadReason] = useState("");
  const [downloadReasonError, setDownloadReasonError] = useState("");
  const [pendingDownloadFile, setPendingDownloadFile] =
    useState<FileItem | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(
    null,
  );
  const [isViewing, setIsViewing] = useState(false);
  const [viewingFileId, setViewingFileId] = useState<string | null>(null);
  const [viewerState, setViewerState] = useState<ViewerState | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "warning" | "info" = "info",
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const closeDownloadReasonDialog = () => {
    if (isDownloading) {
      return;
    }
    setDownloadReasonOpen(false);
    setDownloadReason("");
    setDownloadReasonError("");
    setPendingDownloadFile(null);
  };

  const handleViewerLoadingChange = (file: FileItem, loading: boolean) => {
    setIsViewing(loading);
    setViewingFileId(loading ? (file.atchFileId ?? file.fileNm ?? null) : null);
  };

  const handleViewerOpen = (file: FileItem, fileType: "pdf" | "image") => {
    const fileKey = file.atchFileId ?? file.fileNm ?? "viewer-file";

    setViewerState({
      fileUrl: FileApi.getDownloadStreamUrls(file),
      fileType,
      fileKey,
    });
    setIsViewing(true);
    setViewingFileId(fileKey);
  };

  const handleViewerClose = () => {
    setViewerState(null);
    setIsViewing(false);
    setViewingFileId(null);
  };

  const runDownload = async (file: FileItem, reason?: string) => {
    const downloadUrls = FileApi.getDownloadStreamUrls(
      file,
      requireDownloadReason
        ? {
            eldocNo: taskSeTrgtId,
            reason,
          }
        : undefined,
    );

    await FileApi.downloadFromUrls(downloadUrls, file.fileNm || "download");
  };

  const handleDownloadClick = async (file: FileItem) => {
    if (requireDownloadReason) {
      setPendingDownloadFile(file);
      setDownloadReasonOpen(true);
      setDownloadReason("");
      setDownloadReasonError("");
      return;
    }

    try {
      setIsDownloading(true);
      setDownloadingFileId(file.atchFileId ?? null);
      await runDownload(file);
    } catch (error) {
      showSnackbar(
        error instanceof Error ? error.message : "다운로드에 실패했습니다.",
        "error",
      );
    } finally {
      setIsDownloading(false);
      setDownloadingFileId(null);
    }
  };

  const handleReasonDownloadConfirm = async () => {
    const trimmedReason = downloadReason.trim();
    if (!trimmedReason) {
      setDownloadReasonError("다운로드 사유를 입력해 주세요.");
      return;
    }

    if (!pendingDownloadFile) {
      setDownloadReasonError("다운로드할 파일 정보를 찾을 수 없습니다.");
      return;
    }

    let succeeded = false;

    try {
      setIsDownloading(true);
      setDownloadingFileId(pendingDownloadFile.atchFileId ?? null);
      await runDownload(pendingDownloadFile, trimmedReason);
      succeeded = true;
    } catch (error) {
      setDownloadReasonError(
        error instanceof Error ? error.message : "다운로드에 실패했습니다.",
      );
    } finally {
      setIsDownloading(false);
      setDownloadingFileId(null);
    }

    if (succeeded) {
      setDownloadReasonOpen(false);
      setDownloadReason("");
      setDownloadReasonError("");
      setPendingDownloadFile(null);
    }
  };

  // 파일 그룹 데이터 조회 ============================================
  const getFileGroupData = async () => {
    try {
      const result = await FileApi.getFileGroupData({
        taskSeCd: taskSeCd, // dr
        menuSn: menuSn,
        taskSeTrgtId: taskSeTrgtId,
      });

      // ⭐ fileGroupId는 이미 string
      if (result) {
        setGroupId?.(String(result));
        setFileGroupId(result);
      }

      fetchFileList(result);
    } catch (err) {
      setFileListError(
        err instanceof Error
          ? err.message
          : "파일 그룹ID를 조회하는데 실패했습니다.",
      );
      console.error("Error:", err);
    } finally {
      setLoadingFiles(false);
    }
  };

  // 파일 리스트 조회 ================================================================
  const fetchFileList = async (groupId: string) => {
    try {
      setLoadingFiles(true);
      setFileListError(null);
      const files = await FileApi.getFileList({
        taskSeCd: taskSeCd,
        menuSn: menuSn,
        atchFileGroupId: groupId,
        taskSeTrgtId: taskSeTrgtId,
      });

      setSavedFileList(files.map((vo: FileItem) => ({ ...vo, check: false })));
    } catch (err) {
      setFileListError(
        err instanceof Error
          ? err.message
          : "파일 목록을 불러오는데 실패했습니다.",
      );
      console.error("Error fetching file list:", err);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (readOnly) return;
    if (isUploading) return;
    if (!files) return;

    // File 객체를 유지하면서 uid 속성만 추가
    const newFiles = Array.from(files).map((file) => {
      const fileWithId = file as FileWithId;
      fileWithId.uid = createFileUid();
      return fileWithId;
    });

    setFileList((prev) => [...prev, ...newFiles]);
  };

  useEffect(() => {
    handleUpload();
  }, [fileList]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 파일 전체 삭제
  const handleRemoveFile = (uid: string) => {
    setFileList((prev) => prev.filter((file) => file.uid !== uid));
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    if (readOnly) return;
    if (isUploading) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  // 파일업로드 액션 ///////////////////////////////////////////
  const handleUpload = async () => {
    if (readOnly) return;
    if (fileList.length === 0) {
      return;
    }
    setIsUploading(true);

    const groupId = await FileApi.isFileGroup({
      atchFileGroupId: fileGroupId,
    });

    if (!groupId) {
      await handleFileGroupInsert();
    }

    try {
      await FileApi.uploadFile({
        savePath: taskSeCd, //
        atchFileGroupId: fileGroupId ?? "",
        taskSeTrgtId,
        isExcel: isExcel, // 엑셀 파일 여부 (1: 엑셀, 0: 일반)
        uploadFiles: fileList,
      });
      const fileCount = fileList.length;
      const fileNames = fileList.map((f) => f.name).join(", ");
      showSnackbar(
        fileCount === 1
          ? `파일 "${fileNames}" 업로드 완료!`
          : `${fileCount}개의 파일 업로드 완료! (${fileNames})`,
        "success",
      );
      setFileList([]);

      // 파일 목록 새로고침
      fetchFileList(fileGroupId ?? "");
    } catch (err) {
      showSnackbar(
        err instanceof Error
          ? `업로드 실패: ${err.message}`
          : "파일 업로드에 실패했습니다.",
        "error",
      );
      console.error("Error uploading file:", err);
    } finally {
      setIsUploading(false);
    }
  };

  // 개별 파일 삭제 액션
  const fileRemoveOnly = async (atchFileId: string) => {
    if (readOnly) return;
    if (window.confirm("파일을 삭제하시겠습니까?")) {
      try {
        const responses = await FileApi.fileDelete({
          atchFileId: atchFileId,
          atchFileGroupId: fileGroupId ?? "",
        });

        showSnackbar("파일 삭제 완료!", "success");
        fetchFileList(fileGroupId ?? "");
      } catch (err) {
        showSnackbar("파일 삭제 실패!", "error");
        console.error("Error group insert:", err);
      }
    }
  };

  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  // 체크박스 선택
  const handleCheck = (atchFileId: string, checked: boolean) => {
    setSavedFileList((prev: any) => {
      return prev.map((f: FileItem) =>
        f.atchFileId === atchFileId ? { ...f, check: checked } : f,
      );
    });
  };

  // 선택된 파일 삭제 ==============================================
  const handleDeleteSelected = async () => {
    if (readOnly) return;
    const deleteList = savedFileList
      .filter((f) => f.check)
      .map((d) => d.atchFileId)
      .filter((id): id is string => !!id);

    if (deleteList.length === 0) {
      alert("삭제할 파일을 선택하세요.");
      return;
    }
    try {
      const response = await FileApi.selectDelete({
        fileIds: deleteList, // ✅ 배열로 전송
        atchFileGroupId: fileGroupId ?? "",
      });

      showSnackbar(`${deleteList.length}개 파일이 삭제되었습니다.`, "success");

      // 목록 새로고침
      fetchFileList(fileGroupId ?? "");
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };

  // 파일 그룹 삭제 액션 ==============================================
  const allFileRemove = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        const responses = await FileApi.groupFilesDelete({
          taskSeCd: taskSeCd,
          atchFileGroupId: fileGroupId ?? "",
          taskSeTrgtId: taskSeTrgtId,
        });

        showSnackbar("파일 삭제 완료!", "success");
        fetchFileList(fileGroupId ?? "");
      } catch (err) {
        showSnackbar("파일 삭제 실패!", "error");
        console.error("Error group insert:", err);
      }
    }
  };

  // 파일 그룹 등록 ========================================= START
  const handleFileGroupInsert = async () => {
    try {
      const response = await FileApi.insertFileGroup({
        taskSeCd: taskSeCd,
        menuSn: menuSn,
        atchFileGroupId: fileGroupId ?? "",
      });

      showSnackbar("그룹 등록 완료!", "success");
    } catch (err) {
      showSnackbar("그룹 등록 실패!", "error");
      console.error("Error group insert:", err);
    }
  };
  // 파일 그룹 등록 ========================================= END

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "-";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  useEffect(() => {
    // 이미 호출했으면 리턴
    if (hasFetched.current) return;

    hasFetched.current = true;

    const normalizedInitialGroupId = String(initialGroupId ?? "").trim();
    if (normalizedInitialGroupId && normalizedInitialGroupId !== "0") {
      setGroupId?.(normalizedInitialGroupId);
      setFileGroupId(normalizedInitialGroupId);
      void fetchFileList(normalizedInitialGroupId);
      return;
    }

    getFileGroupData();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {/* 업로드 폼 섹션 */}

      {!readOnly && (
        <Box
          ref={dropZoneRef}
          className="upload-container"
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => {
            if (isUploading || loadingFiles) return;
            fileInputRef.current?.click();
          }}
          sx={(theme) => ({
            "--upload-border-color": isDragging
              ? theme.palette.primary.main
              : theme.palette.grey[300],
            "--upload-background-color": isDragging
              ? theme.palette.action.hover
              : theme.palette.background.paper,
            "--upload-hover-border-color": theme.palette.primary.main,
            "--upload-hover-background-color": theme.palette.action.hover,
          })}
        >
          <CloudUploadIcon
            sx={{ fontSize: 64, color: "primary.main", mb: 2 }}
          />
          <Typography variant="h6" gutterBottom>
            클릭하거나 파일을 드래그하여 업로드
          </Typography>
          <Typography variant="body2" color="text.secondary">
            여러 파일을 선택할 수 있습니다
          </Typography>
          {isUploading && (
            <Stack direction="row" spacing={1} alignItems="center" mt={2}>
              <CircularProgress size={18} />
              <Typography variant="body2" color="text.secondary">
                파일 업로드 중...
              </Typography>
            </Stack>
          )}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="file-input"
            aria-label="파일 업로드"
            title="파일 업로드"
            onChange={handleFileInputChange}
            disabled={isUploading || loadingFiles}
          />
        </Box>
      )}

      {(loadingFiles || isDownloading || isViewing) && (
        <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <CircularProgress size={18} />
          <Typography variant="body2" color="text.secondary">
            {loadingFiles
              ? "파일 목록을 불러오는 중입니다..."
              : isViewing && !!viewerState?.fileKey
                ? "파일 열람을 준비하고 있습니다..."
                : "파일 다운로드 중입니다..."}
          </Typography>
        </Box>
      )}

      {savedFileList.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {!readOnly && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
              <Button
                variant="outlined"
                color="error"
                disabled={
                  !savedFileList.some((f) => f.check) ||
                  loadingFiles ||
                  isUploading
                }
                onClick={handleDeleteSelected}
              >
                선택삭제
              </Button>
            </Box>
          )}
          <List dense>
            {savedFileList.map((file) => {
              const fileKey = file.atchFileId ?? file.fileNm ?? "";
              const downloadUrl = FileApi.getDownloadStreamUrls(file)[0] ?? "";
              const ext = (
                file.fileExtnNm ??
                file.fileNm?.split(".").pop() ??
                ""
              ).toLowerCase();
              const isPdf = ext === "pdf";
              const isImage = [
                "png",
                "jpg",
                "jpeg",
                "gif",
                "bmp",
                "webp",
                "svg",
              ].includes(ext);
              return (
                <ListItem
                  key={file.atchFileId}
                  secondaryAction={
                    readOnly ? undefined : (
                      <IconButton
                        edge="end"
                        disabled={
                          loadingFiles ||
                          isUploading ||
                          isDownloading ||
                          isViewing
                        }
                        onClick={() => fileRemoveOnly(file.atchFileId ?? "")}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )
                  }
                >
                  {!readOnly && (
                    <MuiCheckbox
                      id={file.atchFileId ?? ""}
                      checked={file.check}
                      onChange={(e, checked) =>
                        handleCheck(file.atchFileId ?? "", checked)
                      }
                    />
                  )}
                  <ListItemIcon>
                    <FileIcon />
                  </ListItemIcon>
                  {readOnly ? (
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      width="100%"
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <ListItemText
                          primary={file.fileNm}
                          secondary={formatFileSize(file.fileSz)}
                          slotProps={{
                            primary: {
                              noWrap: true,
                              title: file.fileNm || "",
                            },
                            secondary: {
                              noWrap: true,
                            },
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          width: 190,
                          display: "flex",
                          justifyContent: "flex-end",
                          flexShrink: 0,
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                          flexWrap="nowrap"
                        >
                          {isPdf && (
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleViewerOpen(file, "pdf")}
                              disabled={
                                loadingFiles ||
                                isUploading ||
                                isDownloading ||
                                (isViewing && viewingFileId !== fileKey)
                              }
                              endIcon={
                                isViewing && viewingFileId === fileKey ? (
                                  <CircularProgress size={14} color="inherit" />
                                ) : undefined
                              }
                            >
                              열람
                            </Button>
                          )}
                          {!isPdf && isImage && (
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleViewerOpen(file, "image")}
                              disabled={
                                loadingFiles ||
                                isUploading ||
                                isDownloading ||
                                (isViewing && viewingFileId !== fileKey)
                              }
                              endIcon={
                                isViewing && viewingFileId === fileKey ? (
                                  <CircularProgress size={14} color="inherit" />
                                ) : undefined
                              }
                            >
                              열람
                            </Button>
                          )}
                          <Button
                            variant="outlined"
                            size="small"
                            disabled={
                              loadingFiles ||
                              isUploading ||
                              isDownloading ||
                              isViewing
                            }
                            endIcon={
                              isDownloading &&
                              downloadingFileId ===
                                (file.atchFileId ?? null) ? (
                                <CircularProgress size={14} color="inherit" />
                              ) : undefined
                            }
                            onClick={() => {
                              void handleDownloadClick(file);
                            }}
                          >
                            다운로드
                          </Button>
                        </Stack>
                      </Box>
                    </Stack>
                  ) : (
                    <Button
                      component="a"
                      href={downloadUrl}
                      download={file.fileNm || undefined} // 저장 파일명: fileNm 사용
                      variant="text"
                      sx={{ textTransform: "none", p: 0 }}
                    >
                      <ListItemText
                        primary={file.fileNm}
                        secondary={formatFileSize(file.fileSz)}
                      />
                    </Button>
                  )}
                </ListItem>
              );
            })}
          </List>
        </Box>
      )}

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
            helperText={
              downloadReasonError ||
              "다운로드 사유가 필요합니다."
            }
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
              isDownloading ? (
                <CircularProgress size={16} color="inherit" />
              ) : undefined
            }
          >
            다운로드
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {viewerState ? (
        <DigitalDocViewerDialog
          open
          onClose={handleViewerClose}
          fileUrl={viewerState.fileUrl}
          fileType={viewerState.fileType}
          onLoadingChange={(loading) => {
            const activeFile = savedFileList.find(
              (file) =>
                (file.atchFileId ?? file.fileNm ?? "viewer-file") ===
                viewerState.fileKey,
            );

            if (activeFile) {
              handleViewerLoadingChange(activeFile, loading);
              return;
            }

            setIsViewing(loading);
            setViewingFileId(loading ? viewerState.fileKey : null);
          }}
        />
      ) : null}
    </Box>
  );
}
