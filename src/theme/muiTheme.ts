import { createTheme, PaletteColorOptions } from "@mui/material/styles";
import palette from "./customizations/palette";
import buttonCustomizations from "./customizations/button";

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

// 2. 테마 생성
export const muiTheme = createTheme({
  palette,
  shape: { borderRadius: 4 },
  components: {
    ...buttonCustomizations,
  },
});
