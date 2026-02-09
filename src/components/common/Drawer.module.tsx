import { Drawer as MuiDrawer, styled, CSSObject, Theme } from "@mui/material";

const DRAWER_WIDTH = 250;
const MINI_DRAWER_WIDTH = 40;

const paperBase = (theme: Theme): CSSObject => ({
  position: "relative",
  // zIndex: theme.zIndex.appBar - 1,
  boxSizing: "border-box",
  backgroundImage: "none",
  borderRight: "none",
  height: "100%", // 부모 높이를 꽉 채움
  overflowY: "auto", // 세로 내용이 길어지면 자동 스크롤
  overflowX: "hidden", // 가로 스크롤 방지
});

const openedMixin = (theme: Theme): CSSObject => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(5)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(5)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  position: "relative",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": { ...paperBase(theme), ...openedMixin(theme) },
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": { ...paperBase(theme), ...closedMixin(theme) },
      },
    },
  ],
}));

export default Drawer;
