import type { Components, Theme } from "@mui/material/styles";

const input: Components<Theme> = {
  MuiInputLabel: {
    styleOverrides: {
      root: {
        "&.MuiInputLabel-sizeSmall": {
          fontSize: 14,
          lineHeight: 1,
        },
      },
      outlined: {
        "&.MuiInputLabel-sizeSmall": {
          transform: "translate(14px, 8px) scale(1)",
        },
        "&.MuiInputLabel-sizeSmall.MuiInputLabel-shrink": {
          transform: "translate(14px, -6px) scale(0.75)",
        },
      },
    },
  },
  MuiInputAdornment: {
    styleOverrides: {
      root: {
        "&.MuiInputAdornment-positionEnd": {
          marginRight: 0,
        },
        "& .MuiIconButton-root": {
          padding: 4,
        },
        "& .MuiButtonBase-root": {
          padding: 4,
        },
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        "&.MuiIconButton-sizeSmall": {
          padding: 4,
        },
        "&.MuiIconButton-edgeEnd": {
          marginRight: -6,
        },
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        "&.MuiInputBase-sizeSmall": {
          minHeight: 30,
          fontSize: 14,
        },
        "&.MuiInputBase-multiline.MuiInputBase-sizeSmall": {
          height: "auto",
          padding: 0,
        },
        "&.MuiInputBase-sizeSmall .MuiInputAdornment-root": {
          marginLeft: 0,
        },
      },
      input: {
        "&.MuiInputBase-inputSizeSmall": {
          padding: "0 8px",
          height: "100%",
          boxSizing: "border-box",
        },
        "&.MuiInputBase-inputSizeSmall.MuiInputBase-inputMultiline": {
          padding: "6px 8px",
          height: "auto",
        },
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        "&.MuiInputBase-sizeSmall": {
          minHeight: 30,
        },
        "&.MuiInputBase-multiline.MuiInputBase-sizeSmall": {
          height: "auto",
          padding: 0,
        },
        "&.MuiInputBase-sizeSmall .MuiIconButton-root": {
          padding: 4,
        },
        "&.MuiInputBase-sizeSmall .MuiSvgIcon-root": {
          fontSize: 18,
        },
      },
      input: {
        "&.MuiInputBase-inputSizeSmall": {
          padding: "0 8px",
        },
        "&.MuiInputBase-inputSizeSmall.MuiInputBase-inputMultiline": {
          padding: "6px 8px",
          height: "auto",
        },
      },
    },
  },
  MuiSelect: {
    styleOverrides: {
      select: {
        "&.MuiInputBase-inputSizeSmall": {
          padding: "0 8px",
          minHeight: "auto",
          height: "100%",
          display: "flex",
          alignItems: "center",
        },
      },
    },
  },
};

export default input;
