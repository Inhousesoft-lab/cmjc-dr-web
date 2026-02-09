import type { Components, Theme } from "@mui/material/styles";

const table: Components<Theme> = {
  MuiTable: {
    styleOverrides: {
      root: ({ theme }) => ({
        width: "100%",
        tableLayout: "fixed",
        "--table-focus-bg": theme.palette.table.focusBg,
        "&.tbl_view": {
          borderTop: "1px solid #212124",
        },
        "&.tbl_view .MuiTableCell-root": {
          borderBottom: "1px solid #e7e7e7",
        },
        "&.tbl_view .tbl_label": {
          width: 150,
          background: "#f6f8f9",
          fontWeight: 600,
          textAlign: "left",
          wordBreak: "keep-all",
        },
        "&.tbl_view .tbl_label.MuiTableCell-alignCenter": {
          textAlign: "center",
        },
        "&.tbl_view .tbl_label--wide": {
          width: 200,
        },
        "&.tbl_list .MuiTableHead-root": {
          background: "#f2f4f6",
        },
        "&.tbl_list .tbl_head .MuiTableCell-root": {
          background: "#f6f8f9",
          fontWeight: 600,
          textAlign: "left",
          wordBreak: "keep-all",
          borderTop: "1px solid #212124",
        },
        "&.tbl_list .tbl_label": {
          width: 150,
          background: "#f6f8f9",
          fontWeight: 600,
          textAlign: "left",
          wordBreak: "keep-all",
        },
        "&.tbl_list .tbl_label.MuiTableCell-alignCenter": {
          textAlign: "center",
        },
        "&.tbl_list .MuiTableCell-root": {
          borderBottom: "1px solid #e7e7e7",
        },
        "&.tbl_list .MuiTableRow-root.Mui-selected > .MuiTableCell-root": {
          backgroundColor: "var(--table-focus-bg)",
        },
        "&.tbl_list .MuiTableRow-root.is-focused > .MuiTableCell-root": {
          backgroundColor: "var(--table-focus-bg)",
        },
        "&.tbl_list .MuiTableBody-root .MuiTableRow-root:hover > .MuiTableCell-root":
          {
            backgroundColor: "var(--table-focus-bg)",
          },
      }),
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        padding: "6px 10px",
        height: "42px",
        background: "#fff",
      },
    },
  },
};

export default table;
