import type { Components, Theme } from "@mui/material/styles";

const button: Components<Theme> = {
  MuiButtonBase: {
    defaultProps: {
      disableRipple: true,
    },
  },
  MuiButton: {
    variants: [
      {
        props: { size: "small" },
        style: {
          minWidth: "auto !important",
          height: "33px",
          fontWeight: "500",
          padding: "5px 13px",
        },
      },
      {
        props: { size: "medium" },
        style: {
          height: "40px",
          fontSize: "15px",
          padding: "9px 18px 7px",
          lineHeight: "1.2",
        },
      },
      {
        props: { size: "large" },
        style: {
          minWidth: "100px !important",
          // height: "52px",
          // padding: "16px 20px",
          // fontSize: "18px",
        },
      },
      {
        props: { variant: "contained", color: "primary" },
        style: {
          minWidth: "95px",
        },
      },
      {
        props: { variant: "outlined" },
        style: ({ theme }) => ({
          backgroundColor: "#fff",
        }),
      },
      {
        props: { variant: "outlined", color: "primary" },
        style: ({ theme }) => ({
          border: "1px solid",
          borderColor: theme.palette.primary.main,
        }),
      },
      {
        props: { variant: "outlined", color: "secondary" },
        style: ({ theme }) => ({
          color: theme.palette.secondary.contrastText,
          border: "1px solid",
          borderColor: theme.palette.secondary.main,
        }),
      },

      {
        props: { variant: "outlined", color: "secondary", size: "large" },
        style: {
          border: "1px solid #adb0bb",
        },
      },
    ],
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        fontFamily: "Pretendard, Malgun Gothic, Dotum, Arial, sans-serif",
        fontWeight: "600",
        textTransform: "none",
        "& .MuiButton-startIcon": {
          position: "relative",
          top: "-1px",
        },
        "&.MuiButton-textPrimary.MuiButton-disableElevation": {
          "& .MuiButton-startIcon": {
            marginLeft: "-16px",
          },
        },
      }),
    },
  },
};

export default button;
