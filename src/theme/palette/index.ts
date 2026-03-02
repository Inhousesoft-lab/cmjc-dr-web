import { PaletteColorOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    dark: Palette["primary"];
    gray: Palette["primary"];
    button: {
      color02: string;
      color04: string;
      accent: string;
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
  }
}

const palette = {
  primary: { main: "#087C80", contrastText: "#ffffff" }, // 메인 Teal
  secondary: { main: "#464C53", contrastText: "#ffffff" }, // 보조 Gray (깊은색)
  gray: { main: "#D8D8D8", contrastText: "#1E2124" }, // 연한 회색 (취소 등)
  dark: { main: "#303336", contrastText: "#ffffff" }, // 강조 검정
  error: { main: "#BD2C0F" },
  text: { primary: "#1E2124", secondary: "#464C53" },
  divider: "#D8D8D8",
  button: {
    color02: "#58616a",
    color04: "#edf8f8",
    accent: "#2aa9a0",
  },
  table: {
    focusBg: "#edf8f8",
  },
};

export default palette;
