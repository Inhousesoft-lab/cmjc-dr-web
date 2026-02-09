import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n/i18n";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  MenuOpen as MenuOpenIcon,
} from "@mui/icons-material";
import TimeExtensionBtn from "../actionButtons/TimeExtensionBtn";

interface HeaderProps {
  menuOpen: boolean;
  onToggleNav: (open: boolean) => void;
}

export default function SimpledHeader({ menuOpen, onToggleNav }: HeaderProps) {
  const { t } = useTranslation();

  // 드롭다운 메뉴 열기
  const handleMenuOpen = React.useCallback(() => {
    onToggleNav(!menuOpen);
  }, [menuOpen, onToggleNav]);

  const getMenuIcon = React.useCallback(
    (isExpanded: boolean) => {
      const expandMenuActionText = "Expand";
      const collapseMenuActionText = "Collapse";

      return (
        <IconButton
          size="small"
          aria-label={`${
            isExpanded ? collapseMenuActionText : expandMenuActionText
          } navigation menu`}
          onClick={handleMenuOpen}
        >
          {isExpanded ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>
      );
    },
    [handleMenuOpen],
  );

  return (
    <Box component="header" className="header">
      {/* 상단 바 */}
      <div className="header-topbar">
        <div className="container">
          <div className="top-link">
            <TimeExtensionBtn />
          </div>
        </div>
      </div>
      {/* 로고, 유틸메뉴 */}
      <div className="header_menu">
        <div className="container">
          <h1 className="admin_logo">
            <Link to="/" style={{ textDecoration: "none" }}>
              <img
                src={
                  i18n.language === "ko"
                    ? "/img/logo.png"
                    : "/img/logo_eng02.png"
                }
                alt={`KIDS ${t("kidsName")}`}
              />
            </Link>
          </h1>
          <Box sx={{ ml: 1 }}>{getMenuIcon(menuOpen)}</Box>

          <div className="util-menu">
            <Stack direction="row" spacing={1} alignItems="center">
              <FormControl
                size="small"
                className="study-select"
                sx={{ minWidth: 220, mr: 2 }}
              >
                <Select
                  displayEmpty
                  defaultValue="00"
                  className="study-select__field"
                >
                  <MenuItem value="00">
                    <em>과제 선택</em>
                  </MenuItem>
                  <MenuItem value="01">
                    KIDS-20260126-X49JCV / 책임연구원이 아닌사람이 등록
                  </MenuItem>
                </Select>
              </FormControl>
              <p className="user-info">
                <PersonIcon className="user-icon" />
                <span className="user-name">admin</span>님
              </p>
              <p className="user-role">ROLE_BASIC</p>
              <Button variant="outlined">{t("logout")}</Button>
            </Stack>
          </div>
        </div>
      </div>
    </Box>
  );
}
