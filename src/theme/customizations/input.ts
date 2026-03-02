import type { Components, Theme } from "@mui/material/styles";

const input: Components<Theme> = {
  MuiInputBase: {
    styleOverrides: {
      root: {
        "&.MuiInputBase-sizeSmall": {
          height: "36px",
          boxSizing: "border-box",
        },
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        "& .Mui-disabled": {
          color: "#999999",
        },
        "&.Mui-disabled": {
          backgroundColor: "#f7f7f7",
        },
        "& .MuiOutlinedInput-input": {
          boxSizing: "border-box",
        },
        "& .MuiOutlinedInput-input.MuiInputBase-inputSizeSmall": {
          height: "34px",
          minHeight: "34px",
          lineHeight: "1.2",
          padding: "0 14px",
          margin: 0,
          backgroundColor: "transparent",
          boxSizing: "border-box",
          "&::placeholder": {
            opacity: "0.6",
          },
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#d9dde4",
        },
        "&.Mui-disabled .MuiOutlinedInput-input": {
          backgroundColor: "transparent",
          WebkitTextFillColor: "#999999",
        },
        "& .MuiOutlinedInput-input[readonly]": {
          backgroundColor: "transparent",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
        },
        "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
          borderColor: "#d9dde4",
        },
      }),
    },
  },
};

export default input;
