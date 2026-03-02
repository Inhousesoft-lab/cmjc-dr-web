import type { Components, Theme } from "@mui/material/styles";

const textField: Components<Theme> = {
  MuiTextField: {
    variants: [
      {
        props: { variant: "filled" },
        style: {
          "&.MuiTextField-root": {
            backgroundColor: "transparent",
            "& .MuiFilledInput-root": {
              backgroundColor: "transparent",
              paddingRight: "0",
            },
          },
          "& .MuiFilledInput-root:before": {
            borderBottomColor: "#979797",
          },
        },
      },
    ],
    styleOverrides: {
      root: ({ theme }) => ({
        background: "transparent",
        borderRadius: "4px",
        "& .MuiInputBase-input": {
          fontSize: "14px",
        },
        "& .MuiFilledInput-root": {
          backgroundColor: "transparent",
        },
        "& .MuiOutlinedInput-root": {
          paddingRight: "0",
          paddingLeft: "0",
        },
        "& .MuiTypography-root": {
          paddingRight: "10px",
          color: "#999999",
          fontSize: "14px",
        },
        "& .MuiOutlinedInput-root.Mui-disabled": {
          backgroundColor: "#f7f7f7",
        },
        "& .MuiIconButton-root": {
          marginRight: "0",
        },
      }),
    },
  },
};

export default textField;
