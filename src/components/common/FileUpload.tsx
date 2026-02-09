import React, { useState } from "react";
import { Typography, IconButton, Button, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileUploadRoot from "@/components/common/FileUpload.module";

// --- 컴포넌트 본문 ---
export const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === "dragover") setIsDragging(true);
    else setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const newFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <FileUploadRoot width="100%" spacing={2} isDragging={isDragging}>
      {/* 왼쪽: 파일 리스트 및 드래그 영역 */}
      {files.length > 0 && (
        <div className="fileList">
          {files.map((file, idx) => (
            <div key={idx} className="fileItem">
              <Typography variant="caption">{file.name}</Typography>
              <IconButton size="small" onClick={() => removeFile(idx)}>
                <CloseIcon fontSize="inherit" />
              </IconButton>
            </div>
          ))}
        </div>
      )}
      <Grid alignItems="center">
        <Grid size={7}>
          <label
            htmlFor="fileUpload"
            className="uploadWrapper"
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <Typography variant="caption" color="textSecondary">
              파일을 이 영역으로 드래그 하세요
            </Typography>
          </label>
        </Grid>

        {/* 오른쪽: 실제 클릭 업로드 버튼 */}
        <Grid size={3}>
          <Button
            variant="contained"
            component="label"
            startIcon={<FileUploadIcon />}
            size="small"
            fullWidth
          >
            파일 선택
            <input
              type="file"
              id="fileUpload"
              style={{ display: "none" }}
              multiple
              onChange={(e) =>
                e.target.files &&
                setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
              }
            />
          </Button>
        </Grid>
      </Grid>
    </FileUploadRoot>
  );
};
