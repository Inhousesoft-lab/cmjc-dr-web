import React from "react";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Select,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import useNotifications from "@/hooks/useNotifications";
import { useState, useCallback } from "react";
import { useDialogs } from "@/hooks/useDialogs/useDialogs";
import TableWrapper from "./TableWrapper";
import LabelCell from "./LabelCell";

export interface AuthrtTableProps {
  eldocNo: string;
  tableAriaLabel?: string;
}

export const AuthrtTable: React.FC<AuthrtTableProps> = ({
  eldocNo,
  tableAriaLabel = "공람 테이블",
}) => {
  const theme = useTheme();
  const dialogs = useDialogs();
  const notifications = useNotifications();

  const styleGroup = {
    container: { width: "100%", margin: "auto", borderRadius: "0" },
    label: {
      height: "50px",
      backgroundColor: "white",
      "& .MuiTableCell-body": {
        textAlign: "center",
      },
    },
    content: {
      "& .MuiTableCell-body": {
        textAlign: "center",
      },
    },
  };

  const [deptId, setDeptId] = useState<string>("");
  const [indvId, setIndvId] = useState<string>("");

  const handleDelete = useCallback(async () => {
    const confirmed = await dialogs.confirm(`공람 이력을 삭제 할까요?`, {
      title: "삭제 확인",
      severity: "error",
      okText: "삭제",
      cancelText: "취소",
    });

    if (!confirmed) {
      return;
    }

    notifications.show("삭제되었습니다.", {
      severity: "success",
      autoHideDuration: 3000,
    });
  }, [eldocNo, notifications]);

  const handleSave = useCallback(async () => {
    if (isEmpty(deptId) || isEmpty(indvId)) {
      await dialogs.alert("부서와 이름을 모두 선택해 주세요.", {
        title: "알림",
        okText: "확인",
      });
      return;
    }

    notifications.show("등록 되었습니다.", {
      severity: "success",
      autoHideDuration: 3000,
    });
  }, [deptId, indvId, dialogs]);

  return (
    <div className="tbl_wrap">
      <TableWrapper
        colgroup={
          <colgroup>
            <col style={{ width: "60px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "100px" }} />
          </colgroup>
        }
      >
        <TableRow>
          <LabelCell rowSpan={4}>공람</LabelCell>
          <LabelCell>부서</LabelCell>
          <LabelCell>이름</LabelCell>
          <LabelCell>삭제</LabelCell>
        </TableRow>

        <TableRow>
          <TableCell align="center" sx={styleGroup.content}>
            부서 1
          </TableCell>
          <TableCell align="center" sx={styleGroup.content}>
            부서 1
          </TableCell>
          <TableCell align="center" sx={styleGroup.content}>
            <Button
              variant="contained"
              size="small"
              color="error"
              onClick={handleDelete}
            >
              삭제
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="center" sx={styleGroup.content}>
            부서 2
          </TableCell>
          <TableCell align="center" sx={styleGroup.content}>
            부서 2
          </TableCell>
          <TableCell align="center" sx={styleGroup.content}>
            <Button
              variant="contained"
              size="small"
              color="error"
              onClick={handleDelete}
            >
              삭제
            </Button>
          </TableCell>
        </TableRow>

        {/* 새로운 공람자 추가/등록 행 */}
        <TableRow>
          <TableCell>
            <Select
              size="small"
              fullWidth
              displayEmpty
              value={deptId}
              onChange={(event) => setDeptId(event.target.value as string)}
              aria-label="추가할 부서 선택"
            >
              <MenuItem value="">
                <Typography>부서</Typography>
              </MenuItem>
              <MenuItem value="정보화팀">정보화팀</MenuItem>
              <MenuItem value="경영팀">경영팀</MenuItem>
              <MenuItem value="기획팀">기획팀</MenuItem>
            </Select>
          </TableCell>
          <TableCell>
            <Select
              size="small"
              fullWidth
              displayEmpty
              value={indvId}
              onChange={(event) => setIndvId(event.target.value as string)}
              aria-label="추가할 이름 선택"
            >
              <MenuItem value="">
                <Typography>이름</Typography>
              </MenuItem>
              <MenuItem value="전체">전체</MenuItem>
              <MenuItem value="김길동">김길동</MenuItem>
              <MenuItem value="홍길동">홍길동</MenuItem>
            </Select>
          </TableCell>
          <TableCell align="center">
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={handleSave}
            >
              등록
            </Button>
          </TableCell>
        </TableRow>
      </TableWrapper>
    </div>
  );
};
