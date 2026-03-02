import { createTheme, PaletteColorOptions } from "@mui/material/styles";
import palette from "./palette";
import buttonCustomizations from "./customizations/button";
import inputCustomizations from "./customizations/input";
import menuCustomizations from "./customizations/menu";
import paginationCustomizations from "./customizations/pagination";
import selectCustomizations from "./customizations/select";
import tabCustomizations from "./customizations/tab";
import textfieldCustomizations from "./customizations/textfield";
import typographyCustomizations from "./customizations/typography";

declare module "@mui/material/styles" {
  interface Palette {
    dark: Palette["primary"];
    gray: Palette["primary"];
    button: {
      color02: string;
      color04: string;
      accent: string;
    };
    table: {
      focusBg: string;
    };
  }
  interface PaletteOptions {
    dark?: PaletteColorOptions;
    gray?: PaletteColorOptions;
    button?: {
      color02: string;
      color04: string;
      accent: string;
    };
    table?: {
      focusBg: string;
    };
  }
}

declare module "@mui/material/TextField" {
  interface TextFieldPropsSizeOverrides {
    large: true;
  }
}
declare module "@mui/material/InputBase" {
  interface InputBasePropsSizeOverrides {
    large: true;
  }
}
declare module "@mui/material/FormControl" {
  interface FormControlPropsSizeOverrides {
    large: true;
  }
}

const globalTheme = createTheme({
  palette: palette,
});

// 2. 테마 생성
export const muiTheme = createTheme({
  ...globalTheme,
  shape: { borderRadius: 4 },
  components: {
    // ...buttonCustomizations,
    ...inputCustomizations,
    ...menuCustomizations,
    ...paginationCustomizations,
    ...selectCustomizations,
    ...tabCustomizations,
    ...textfieldCustomizations,
  },
});
