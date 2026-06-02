import React from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { getLangFromPathname, langPath } from "@/routes/lang";
import { stripAppBase } from "@/utils/appBase";

type AdminTabKey = "members" | "article";

const ADMIN_TABS: { value: AdminTabKey; label: string; path: string }[] = [
  { value: "members", label: "회원관리", path: "members" },
  { value: "article", label: "항목관리", path: "article/list" },
];

export default function AdminTabs() {
  const location = useLocation();
  const navigate = useNavigate();
  const lang = getLangFromPathname(location.pathname);
  const pathname = stripAppBase(location.pathname);

  const activeTab: AdminTabKey = pathname.includes(`/${lang}/article/list`)
    ? "article"
    : "members";

  const handleChange = (_: React.SyntheticEvent, nextValue: AdminTabKey) => {
    const nextTab = ADMIN_TABS.find((tab) => tab.value === nextValue);
    if (!nextTab) return;
    navigate(langPath(nextTab.path, lang));
  };

  return (
    <Box
      className="admin-tabs"
      sx={{
        mb: 2,
        borderBottom: "1px solid #c9d2dc",
      }}
    >
      <Tabs
        value={activeTab}
        onChange={handleChange}
        aria-label="관리자 메뉴"
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          minHeight: 44,
          "& .MuiTab-root": {
            minHeight: 44,
            minWidth: 132,
            px: 3,
            fontSize: 17,
            fontWeight: 700,
          },
        }}
      >
        {ADMIN_TABS.map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </Tabs>
    </Box>
  );
}
