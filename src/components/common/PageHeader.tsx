import React from "react";

interface PageHeaderProps {
  children?: React.ReactNode;
}

export default function PageHeader({ children }: PageHeaderProps) {
  return (
    <div className="content_wrap">
      <div className="location">
        {/* 1. 상단 로케이션/타이틀 바 */}
        <div className="page_path">
          <h2 className="tit">타이틀</h2>
        </div>

        {/* 1-2. Breadcrumbs */}
        <div className="local">
          <span className="home">
            <span className="blind">홈</span>
          </span>
          <span className="route">뎁스1</span>
          <span className="current">뎁스2</span>
        </div>
      </div>

      {/* 2. 하단 컨텐츠 영역 (Outlet이 렌더링되는 곳) */}
      <div className="content">{children}</div>
    </div>
  );
}
