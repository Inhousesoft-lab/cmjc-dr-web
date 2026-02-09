import type { Components, Theme } from "@mui/material/styles";
import type {} from "@mui/x-date-pickers/themeAugmentation";

const datePicker: Components<Theme> = {
  MuiDatePicker: {
    defaultProps: {
      slotProps: {
        textField: {
          variant: "outlined",
          size: "small",
          fullWidth: true,
          sx: {
            maxWidth: 200,
            "& .MuiInputBase-root": {
              minHeight: 30,
            },
            "&& .MuiInputAdornment-root .MuiIconButton-root": {
              padding: "8px !important",
            },
            "&& .MuiInputAdornment-root .MuiButtonBase-root": {
              padding: "8px !important",
            },
            "& .MuiInputAdornment-root .MuiSvgIcon-root": {
              fontSize: 18,
            },
          },
        },
      },
    },
  },
};

export default datePicker;
