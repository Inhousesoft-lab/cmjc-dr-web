import type { Components, Theme } from "@mui/material/styles";

const select: Components<Theme> = {
  MuiSelect: {
    variants: [
      {
        props: { size: "small" },
        style: {
          height: "36px",
          minWidth: "80px",
          backgroundColor: "#fff",
        },
      },
    ],
    styleOverrides: {
      root: ({ theme }) => ({
        "&.MuiInputBase-sizeSmall": {
          height: "36px",
          boxSizing: "border-box",
        },
        "& .MuiSelect-select.MuiInputBase-inputSizeSmall": {
          height: "34px",
          minHeight: "34px",
          lineHeight: "1.2",
          display: "flex",
          alignItems: "center",
          boxSizing: "border-box",
          padding: "0 32px 0 14px !important",
        },
        "& > .MuiOutlinedInput-notchedOutline ": {
          borderColor: "#d9dde4",
        },
        "&:hover": {
          "& > .MuiOutlinedInput-notchedOutline ": {
            borderColor: theme.palette.primary.main,
          },
        },
      }),
    },
  },
};

export default select;
