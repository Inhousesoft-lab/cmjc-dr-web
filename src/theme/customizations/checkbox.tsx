import { type Components, type Theme } from "@mui/material/styles";
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";

export const checkboxCustomizations: Components<Theme> = {
  MuiCheckbox: {
    defaultProps: {
      disableRipple: true,
      icon: (
        <CheckBoxOutlineBlankRoundedIcon
          sx={{ color: "hsla(210, 0%, 0%, 0.0)" }}
        />
      ),
      checkedIcon: <CheckRoundedIcon sx={{ height: 14, width: 14 }} />,
      indeterminateIcon: <RemoveRoundedIcon sx={{ height: 14, width: 14 }} />,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        margin: 10,
        height: 16,
        width: 16,
        borderRadius: 5,
        border: "1px solid ",
        boxShadow: "0 0 0 1.5px hsla(210, 0%, 0%, 0.04) inset",
        transition: "border-color, background-color, 120ms ease-in",
        "&:hover": {},
        "&.Mui-focusVisible": {
          outlineOffset: "2px",
        },
        "&.Mui-checked": {
          color: "white",
          boxShadow: `none`,
          "&:hover": {},
        },
        ...theme.applyStyles("dark", {
          boxShadow: "0 0 0 1.5px hsl(210, 0%, 0%) inset",
          "&:hover": {},
          "&.Mui-focusVisible": {
            outlineOffset: "2px",
          },
        }),
      }),
    },
  },
};
