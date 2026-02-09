import type { Components, Theme } from "@mui/material/styles";

const grid: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: {
      ".table-view-grid": {
        borderTop: "1px solid #212124",
        margin: 0,
        gap: 0,
        columnGap: 0,
        rowGap: 0,
        "--Grid-rowSpacing": "0px",
        "--Grid-columnSpacing": "0px",
      },
      ".table-view-grid > .MuiGrid-item": {
        padding: 0,
      },
      ".table-view-grid > .MuiGrid-root": {
        padding: 0,
      },
      ".guest-card-view__label-cell": {
        background: "#f6f8f9",
        fontWeight: 600,
        textAlign: "left",
        wordBreak: "keep-all",
        borderBottom: "1px solid #e7e7e7",
        minHeight: "42px",
        display: "flex",
        alignItems: "center",
      },
      ".guest-card-view__value-cell": {
        background: "#fff",
        borderBottom: "1px solid #e7e7e7",
        minHeight: "42px",
        display: "flex",
        alignItems: "center",
      },
      ".guest-card-view__label-cell .MuiTypography-root": {
        margin: 0,
        color: "#212124",
        display: "block",
        padding: "10px 12px",
        whiteSpace: "normal",
        lineHeight: 1.4,
      },
      ".guest-card-view__value-cell .MuiTypography-root": {
        margin: 0,
        display: "block",
        padding: "6px 10px",
      },
    },
  },
};

export default grid;
