import { Stack, styled } from "@mui/material";

const FileUploadRoot = styled(Stack, {
  shouldForwardProp: (prop) => prop !== "isDragging",
})<{ isDragging: boolean }>(({ theme, isDragging }) => ({
  "& .fileList": {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(0.5),
  },
  "& .fileItem": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(0.5, 1),
    backgroundColor: theme.palette.action.selected,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    width: "100%",
  },
  "& .uploadWrapper": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    minHeight: "80px",
    border: `1px dashed ${
      isDragging ? theme.palette.primary.main : theme.palette.divider
    }`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: isDragging
      ? theme.palette.action.hover
      : theme.palette.background.default,
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  },
  "& .uploadWrapper:hover": {
    borderColor: theme.palette.primary.main,
  },
}));

export default FileUploadRoot;
