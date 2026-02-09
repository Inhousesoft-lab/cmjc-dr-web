import type { Components, Theme } from "@mui/material/styles";

const button: Components<Theme> = {
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: ({ theme }) => ({
        textTransform: "none",
        fontWeight: 600,
        boxShadow: "none",
        "&:hover": { boxShadow: "none" },
        "--btn-contained-lg": theme.palette.button.color02,
        "--btn-outlined-lg-bg": theme.palette.button.color04,
        "--btn-outlined-lg-border": theme.palette.button.accent,
      }),
      sizeSmall: { height: 34 },
      contained: ({ ownerState }) =>
        ownerState.size === "large"
          ? {
              background: "var(--btn-contained-lg)",
              border: "1px solid var(--btn-contained-lg)",
              color: "#fff",
            }
          : undefined,
      // Outlined 버튼의 기본 테두리 색상을 divider 색상과 맞춤
      outlined: ({ ownerState, theme }) =>
        ownerState.size === "large"
          ? {
              backgroundColor: "var(--btn-outlined-lg-bg)",
              color: "var(--btn-outlined-lg-border)",
              border: "1px solid var(--btn-outlined-lg-border)",
            }
          : {
              borderColor: theme.palette.divider,
            },
    },
  },
};

export default button;
