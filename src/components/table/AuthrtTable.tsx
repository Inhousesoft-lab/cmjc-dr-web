import React from "react";
import {
  TableRow,
  TableCell,
  Button,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import useNotifications from "@/hooks/useNotifications";
import { useState, useCallback } from "react";
import { useDialogs } from "@/hooks/useDialogs/useDialogs";
import TableWrapper from "./TableWrapper";
import LabelCell from "./LabelCell";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  createDigitalDocAuthrt,
  deleteDigitalDocAuthrt,
  fetchDigitalDocAuthrtList,
} from "@/features/digitalDoc/DigitalDocThunk";
import {
  selectDigitalDocAuthrtError,
  selectDigitalDocAuthrtLoading,
  selectDigitalDocAuthrtRows,
  selectDigitalDocAuthrtSaving,
} from "@/features/digitalDoc/DigitalDocSelectors";

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

export interface AuthrtTableProps {
  eldocNo: string;
  tableAriaLabel?: string;
}

export const AuthrtTable: React.FC<AuthrtTableProps> = ({
  eldocNo,
  tableAriaLabel = "문서고 공람 이력",
}) => {
  const dispatch = useAppDispatch();
  const dialogs = useDialogs();
  const notifications = useNotifications();
  const rows = useAppSelector(selectDigitalDocAuthrtRows);
  const authrtLoading = useAppSelector(selectDigitalDocAuthrtLoading);
  const authrtSaving = useAppSelector(selectDigitalDocAuthrtSaving);
  const authrtError = useAppSelector(selectDigitalDocAuthrtError);

  const [deptId, setDeptId] = useState<string>("");
  const [indvId, setIndvId] = useState<string>("");

  React.useEffect(() => {
    if (!eldocNo) return;
    dispatch(fetchDigitalDocAuthrtList(eldocNo));
  }, [dispatch, eldocNo]);

  React.useEffect(() => {
    if (!authrtError) return;
    notifications.show(authrtError, {
      severity: "error",
      autoHideDuration: 3000,
    });
  }, [authrtError, notifications]);

  const handleDelete = useCallback(
    async (inqAuthrtNo: string) => {
      if (isEmpty(inqAuthrtNo)) {
        await dialogs.alert("삭제할 공람 정보가 없습니다.", {
          title: "알림",
          okText: "확인",
        });
        return;
      }

      const confirmed = await dialogs.confirm("공람 이력을 삭제 할까요?", {
        title: "삭제 확인",
        severity: "error",
        okText: "삭제",
        cancelText: "취소",
      });

      if (!confirmed) return;

      try {
        await dispatch(deleteDigitalDocAuthrt({ eldocNo, inqAuthrtNo })).unwrap();
        notifications.show("삭제되었습니다.", {
          severity: "success",
          autoHideDuration: 3000,
        });
        dispatch(fetchDigitalDocAuthrtList(eldocNo));
      } catch (error) {
        notifications.show(getErrorMessage(error), {
          severity: "error",
          autoHideDuration: 3000,
        });
      }
    },
    [dialogs, dispatch, eldocNo, notifications],
  );

  const handleSave = useCallback(async () => {
    if (isEmpty(deptId) || isEmpty(indvId)) {
      await dialogs.alert("부서와 이름을 모두 선택해 주세요.", {
        title: "알림",
        okText: "확인",
      });
      return;
    }

    try {
      await dispatch(
        createDigitalDocAuthrt({ eldocNo, deptId, indvId }),
      ).unwrap();
      notifications.show("등록되었습니다.", {
        severity: "success",
        autoHideDuration: 3000,
      });
      setDeptId("");
      setIndvId("");
      dispatch(fetchDigitalDocAuthrtList(eldocNo));
    } catch (error) {
      notifications.show(getErrorMessage(error), {
        severity: "error",
        autoHideDuration: 3000,
      });
    }
  }, [deptId, indvId, dialogs, dispatch, eldocNo, notifications]);

  return (
    <div className="tbl_wrap">
      <TableWrapper
        aria-label={tableAriaLabel}
        colgroup={
          <colgroup>
            <col className="tbl-col-w-15p" />
            <col className="tbl-col-w-30p" />
            <col className="tbl-col-w-30p" />
            <col className="tbl-col-w-15p" />
          </colgroup>
        }
      >
        <TableRow>
          <LabelCell rowSpan={Math.max(rows.length, 1) + 2}>공람</LabelCell>
          <LabelCell>부서</LabelCell>
          <LabelCell>이름</LabelCell>
          <LabelCell>삭제</LabelCell>
        </TableRow>

        {rows.length > 0 ? (
          rows.map((row) => (
            <TableRow key={row.inqAuthrtNo || `${row.deptId}-${row.indvId}`}>
              <TableCell align="center" sx={styleGroup.content}>
                {row.deptId || "-"}
              </TableCell>
              <TableCell align="center" sx={styleGroup.content}>
                {row.indvId || "-"}
              </TableCell>
              <TableCell align="center" sx={styleGroup.content}>
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  onClick={() => handleDelete(row.inqAuthrtNo)}
                  disabled={authrtSaving}
                >
                  삭제
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} align="center" sx={styleGroup.content}>
              {authrtLoading ? "조회 중..." : "공람 데이터가 없습니다."}
            </TableCell>
          </TableRow>
        )}

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
              <MenuItem value="정보팀">정보팀</MenuItem>
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
              <MenuItem value="김길동">김길동</MenuItem>
              <MenuItem value="홍길동">홍길동</MenuItem>
              <MenuItem value="이담당">이담당</MenuItem>
            </Select>
          </TableCell>
          <TableCell align="center">
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={handleSave}
              disabled={authrtSaving}
            >
              등록
            </Button>
          </TableCell>
        </TableRow>
      </TableWrapper>
    </div>
  );
};
