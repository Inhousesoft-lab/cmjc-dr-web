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
} from "@mui/material";

import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  InsertDriveFile as FileIcon,
} from "@mui/icons-material";
import "./UploadFile.css";
import { FileApi, type FileItem } from "@/api/fileApi";
import MuiCheckbox from "../elements/MuiCheckbox";
import DigitalDocViewerButton from "@/components/actionButtons/DigitalDocViewerButton";

interface FileWithId extends File {
  uid: string;
}

interface FileProps {
  taskSeCd?: string;
  menuSn?: number;
  taskSeTrgtId?: string; // 해당 업무의 pk
  setGroupId?: (id: string) => void;
  readOnly?: boolean;
}

export default function UploadFiles({
  taskSeCd = "dr",
  menuSn = 1,
  taskSeTrgtId,
  setGroupId,
  readOnly = false,
}: FileProps) {
  const [fileList, setFileList] = useState<FileWithId[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [savedFileList, setSavedFileList] = useState<FileItem[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [fileListError, setFileListError] = useState<string | null>(null);

  const [fileGroupId, setFileGroupId] = useState("");

  const [prvcInclYn, setPrvcInclYn] = useState("0");
  const [isExcel, setIsExcel] = useState("0");

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "warning" | "info" = "info",
  ) => {
    setSnackbar({ open: true, message, severity });
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
    if (!files) return;

    // File 객체를 유지하면서 uid 속성만 추가
    const newFiles = Array.from(files).map((file) => {
      const fileWithId = file as FileWithId;
      fileWithId.uid = `${Date.now()}-${Math.random()}`;
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
      console.log("업로드 안함");
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
        prvcInclYn: prvcInclYn, // 개인정보 포함 여부 (1: 포함, 0: 미포함)
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

    getFileGroupData();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {/* 업로드 폼 섹션 */}

      {!readOnly && (
        <Box
          ref={dropZoneRef}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          sx={{
            border: "2px dashed",
            borderColor: isDragging ? "primary.main" : "grey.300",
            borderRadius: 2,
            p: 4,
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: isDragging ? "action.hover" : "background.paper",
            transition: "all 0.3s",
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: "action.hover",
            },
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            클릭하거나 파일을 드래그하여 업로드
          </Typography>
          <Typography variant="body2" color="text.secondary">
            여러 파일을 선택할 수 있습니다
          </Typography>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={handleFileInputChange}
          />
        </Box>
      )}

      {savedFileList.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {!readOnly && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
              <Button
                variant="outlined"
                color="error"
                disabled={!savedFileList.some((f) => f.check)}
                onClick={handleDeleteSelected}
              >
                선택삭제
              </Button>
            </Box>
          )}
          <List dense>
            {savedFileList.map((file) => {
              const downloadUrl = `/api/dr/file/downloadStream?filename=${encodeURIComponent(
                file.srvrFileNm || "",
              )}&originalName=${encodeURIComponent(file.fileNm || "")}`;
              const ext =
                (file.fileExtnNm ??
                  file.fileNm?.split(".").pop() ??
                  "").toLowerCase();
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
                          primaryTypographyProps={{
                            noWrap: true,
                            title: file.fileNm || "",
                          }}
                          secondaryTypographyProps={{ noWrap: true }}
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
                          {isPdf && <DigitalDocViewerButton fileUrl={downloadUrl} />}
                          {!isPdf && isImage && (
                            <DigitalDocViewerButton
                              fileUrl={downloadUrl}
                              fileType="image"
                            />
                          )}
                          <Button
                            component="a"
                            href={downloadUrl}
                            download={file.fileNm || undefined}
                            variant="outlined"
                            size="small"
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

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
