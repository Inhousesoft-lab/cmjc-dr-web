import type { Components, Theme } from "@mui/material/styles";

const tab: Components<Theme> = {
  MuiTabs: {
    styleOverrides: {
      root: {
        minHeight: 40,
      },
      indicator: {
        height: 2,
        borderRadius: 2,
        backgroundColor: "var(--color_01)",
      },
      flexContainer: {
        gap: 0,
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        minHeight: 40,
        padding: "8px 16px",
        borderRadius: "4px 4px 0 0",
        textTransform: "none",
        fontSize: "14px",
        fontWeight: 600,
        color: "var(--color-text-3)",
        borderBottom: "1px solid var(--border-2)",
        "&.Mui-selected": {
          color: "var(--color_01)",
          backgroundColor: "var(--btn-bg-3-hover)",
          borderBottomColor: "var(--color_01)",
        },
        "&:hover": {
          backgroundColor: "var(--btn-bg-3-hover)",
        },
      },
    },
  },
};

export default tab;
