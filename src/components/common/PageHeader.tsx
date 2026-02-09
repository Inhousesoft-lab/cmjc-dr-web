import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";

interface PageHeaderProps {
  children?: React.ReactNode;
}

export default function PageHeader({ children }: PageHeaderProps) {
  return (
    <div className="page_header_wrap">
      {/* 1. 상단 로케이션/타이틀 바 */}
      <div className="header_top">
        <Typography variant="h2" className="title">
          Title
        </Typography>

        <Breadcrumbs
          separator={<NavigateNextIcon className="breadcrumbs_icon" />}
          className="breadcrumbs"
        >
          <Link component={NavLink} to="/ko/home" className="home_icon">
            <HomeIcon fontSize="inherit" />
          </Link>
          <Link className="current_text">메뉴</Link>
          <Typography className="route_text">현재 메뉴</Typography>
        </Breadcrumbs>
      </div>

      {/* 2. 하단 컨텐츠 영역 (Outlet이 렌더링되는 곳) */}
      <div className="content_area">{children}</div>
    </div>
  );
}
