import type { Components, Theme } from "@mui/material/styles";

const menu: Components<Theme> = {
  MuiMenu: {
    styleOverrides: {
      root: ({ theme }) => ({
        "& .MuiPaper-root": {
          borderRadius: "7px",
          "& .MuiTypography-subtitle1": {
            fontSize: "14px",
            fontWeight: "500",
            padding: "15px 20px",
            lineHeight: "1",
            borderBottom: "solid 1px #d3d7e1",
            marginBottom: "0",
          },
          "& .style1": {
            display: "flex",
            alignItems: "flex-start",
            margin: "13px 20px",
            padding: "13px 5px 0 0",
            borderTop: "dotted 1px #cdd2dc",
            "& .MuiAvatar-root": {
              width: "42px",
              height: "42px",
              fontSize: "15px",
              marginRight: "15px",
            },
            "& .MuiIconButton-root": {
              position: "absolute",
              right: "-10px",
              top: "10px",
              padding: "0",
              "& .MuiSvgIcon-root": {
                width: "15px",
                color: "#a2a2a2",
              },
            },
            "& .MuiBox-root": {
              "& > p": {
                whiteSpace: "normal",
                maxWidth: "300px",
                paddingRight: "30px",
                fontSize: "12px",
                color: "#9fa3aa",
                lineHeight: "1.2",
                "&:first-of-type": {
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#686c74",
                  marginBottom: "6px",
                  "& span": {
                    color: "#000",
                    display: "block",
                  },
                },
              },
            },
            "&:first-of-type": {
              borderTop: "0",
              paddingTop: "0px",
              "& .MuiIconButton-root": {
                top: "-10px !important",
              },
            },
            "&:hover": {
              background: "none",
            },
          },
          "& .MuiMenuItem-root": {
            fontSize: "14px",
          },
        },
        //Column Select
        "&.column-select": {
          "& .MuiPaper-root": {
            minWidth: "184px",
            paddingBottom: "10px",
          },
          "& .MuiTypography-root": {
            fontSize: "15px",
          },
          "& ul li": {
            "&:first-of-type": {
              borderBottom: "1px dotted #cdd2dc",
              padding: "12px 14px",
              "& .MuiTypography-root": {
                fontWeight: "600",
              },
              "& .MuiListItemIcon-root": {
                marginRight: "-8px",
              },
            },
          },
          "& .primary": {
            color: theme.palette.primary.main,
            paddingTop: "10px",
            "& .MuiListItemIcon-root": {
              marginRight: "-8px",
            },
          },
          "& .MuiFormControlLabel-root .MuiButtonBase-root": {
            padding: "2px 10px",
          },
        },
      }),
    },
  },
};

export default menu;
