import type { Components, Theme } from "@mui/material/styles";

const dialog: Components<Theme> = {
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        "&.dialog-title": {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 600,
          cursor: "move",
          userSelect: "none",
        },
        "& .dialog-close-button": {
          position: "absolute",
          right: 8,
          top: 8,
        },
      },
    },
  },
  MuiDialogActions: {
    styleOverrides: {
      root: {
        "&.dialog-actions-top": {
          paddingLeft: 24,
          paddingRight: 24,
        },
        "&.dialog-actions-bottom": {
          padding: 24,
        },
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        "&.dialog-divider": {
          borderColor: "#303336",
        },
      },
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: {
        "& .dialog-empty": {
          paddingTop: 24,
          paddingBottom: 24,
          textAlign: "center",
          color: "text.primary",
        },
      },
    },
  },
};

export default dialog;
