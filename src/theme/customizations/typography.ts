import type { Components, Theme } from "@mui/material/styles";

const typography: Components<Theme> = {
  MuiTypography: {
    variants: [
      {
        props: { variant: "h1" },
        style: {
          fontSize: "24px",
          lineHeight: "1",
          fontWeight: "600",
          marginBottom: "24px",
          "@media (max-width:600px)": {
            marginBottom: "4px",
          },
        },
      },
      {
        props: { variant: "h2" },
        style: {
          fontSize: "21px",
          lineHeight: "1.2",
          fontWeight: "600",
          marginBottom: "24px",
        },
      },
      {
        props: { variant: "h3" },
        style: {
          fontSize: "20px",
          lineHeight: "1.2",
          fontWeight: "600",
          marginBottom: "24px",
          color: "#11171e",
          "& .MuiButtonBase-root": {
            float: "right",
          },
        },
      },
      {
        props: { variant: "h4" },
        style: {
          fontSize: "17px",
          lineHeight: "1.2",
          fontWeight: "600",
          marginBottom: "24px",
          color: "#000",
        },
      },
      {
        props: { variant: "subtitle1" },
        style: {
          fontSize: "16px",
          color: "#111",
          fontWeight: "600",
          lineHeight: "1.2",
          marginBottom: "20px",
        },
      },
      {
        props: { variant: "subtitle2" },
        style: {
          marginBottom: "6px",
        },
      },
      {
        props: { variant: "body1" },
        style: {},
      },
      {
        props: { variant: "body2" },
        style: {
          fontSize: "13px",
          color: "#333333",
          fontWeight: "500",
        },
      },
      {
        props: { variant: "caption" },
        style: {
          fontSize: "14px",
          color: "#2e2e2e",
          lineHeight: "1.14",
          float: "right",
          "@media (max-width:1200px)": {
            float: "none",
            display: "block",
            marginTop: "5px",
          },
        },
      },
      {
        props: { variant: "overline" },
        style: {
          fontSize: "14px",
          color: "#717d96",
          lineHeight: "1.14",
          textTransform: "none",
          letterSpacing: "0",
        },
      },
    ],
    styleOverrides: {
      root: {
        fontFamily: "Pretendard, Malgun Gothic, Dotum, Arial, sans-serif",
        // 기본 줄바꿈 적용
        whiteSpace: "pre-line",
        // Ag grid page info
        "&.page-info": {
          display: "inline-block",
          color: "#686c74",
          fontSize: "14px",
          "& span": {
            fontWeight: "500",
            color: "#111",
            "& li": {
              display: "inline-block",
              padding: "0",
              color: "#111",
              fontWeight: "500",
              fontSize: "14px",
              fontFamily: "Pretendard",
            },
          },
        },
        // Required
        "&.required": {
          "&::after": {
            content: '"*"',
            display: "inline-block",
            color: "#ff0000",
            fontSize: "13px",
            lineHeight: "16px",
            fontWeight: 500,
            verticalAlign: "middle",
            marginLeft: "5px",
          },
        },
        // 간격 조절
        "&.MuiTypography-root + .table-style1": {
          marginTop: "-13px",
          marginBottom: "20px",
        },
        // Request Reset Password
        "&.small-text": {
          fontSize: "14px",
          color: "#2e2e2e",
          lineHeight: "1.43",
        },
        "&.grid-title": { fontSize: "16px", color: "#111" },
      },
    },
  },
};

export default typography;
