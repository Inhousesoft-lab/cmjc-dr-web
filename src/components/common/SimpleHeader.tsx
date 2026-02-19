import * as React from "react";
import { FormControl, MenuItem, Select } from "@mui/material";

export default function SimpleHeader() {
  const [isNotifyOpen, setIsNotifyOpen] = React.useState(false);

  return (
    <div id="header">
      {/* 상단 바(timeout) */}
      {/* <div className="header-topbar">
        <TimeExtensionBtn />
      </div> */}

      <div className="inner">
        <div className="util_group">
          <div className="user_info">
            {/* 유저 이름 */}
            <p className="user_name">
              <span>admin</span>
            </p>

            {/* 케이스: 접속 시간 */}
            {/* <p className="access">2025-10-21 09:03 접속</p> */}

            {/* 케이스: 유저 권한 */}
            <p className="user-role">ROLE_BASIC</p>

            <div
              className="notification"
              onMouseEnter={() => setIsNotifyOpen(true)}
              onMouseLeave={() => setIsNotifyOpen(false)}
            >
              <button className="btn_notify">
                <span className="ico_bell">
                  <span className="blind">알림</span>
                </span>
                <span className="notify_count">3</span>
              </button>
              <div
                className={`notify_box ${isNotifyOpen ? "is-open" : ""}`.trim()}
              >
                <p>새 알림 1</p>
                <p>새 알림 2</p>
                <p>새 알림 3</p>
              </div>
            </div>
            <button type="button" className="btn_logout">
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
