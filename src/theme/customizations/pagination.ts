import type { Components, Theme } from "@mui/material/styles";

const pgination: Components<Theme> = {
  MuiPagination: {
    styleOverrides: {
      root: ({ theme }) => ({
        display: "inline-block",
        marginLeft: "50px",
        "& .Mui-selected": {
          backgroundColor: "#057175 !important",
          borderRadius: "4px",
          color: "#fff",
        },
        "& button": {
          color: "#505050",
        },
        [`@media (max-width: ${theme.breakpoints.values.sm}px)`]: {
          marginTop: "10px",
          marginLeft: "-10px",
          marginRight: "-10px",
        },
      }),
    },
  },
};

export default pgination;
