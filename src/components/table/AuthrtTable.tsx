import React, { useCallback, useState } from "react";
import {
  Button,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import useNotifications from "@/hooks/useNotifications";
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
import https from "@/api/axiosInstance";
import DepartmentTreeDialog from "@/pages/ko/MemberManagement/DepartmentTreeDialog";
import type { DepartmentRow } from "@/types/member";

const styleGroup = {
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

const normalizeDepartment = (item: any): DepartmentRow => ({
  rowNo: Number(item?.rowNo ?? item?.row_no ?? 0),
  deptNo: String(item?.deptNo ?? item?.dept_no ?? ""),
  deptNm: String(item?.deptNm ?? item?.dept_nm ?? ""),
  upDeptNo: String(item?.upDeptNo ?? item?.up_dept_no ?? ""),
  useEn: String(item?.useEn ?? item?.use_en ?? item?.useYn ?? item?.use_yn ?? ""),
  useYn: String(item?.useYn ?? item?.use_yn ?? item?.useEn ?? item?.use_en ?? ""),
});

export const AuthrtTable: React.FC<AuthrtTableProps> = ({
  eldocNo,
  tableAriaLabel = "문서 공람 관리",
}) => {
  const dispatch = useAppDispatch();
  const dialogs = useDialogs();
  const notifications = useNotifications();
  const rows = useAppSelector(selectDigitalDocAuthrtRows);
  const authrtLoading = useAppSelector(selectDigitalDocAuthrtLoading);
  const authrtSaving = useAppSelector(selectDigitalDocAuthrtSaving);
  const authrtError = useAppSelector(selectDigitalDocAuthrtError);

  const [deptId, setDeptId] = useState("");
  const [deptNm, setDeptNm] = useState("");
  const [departments, setDepartments] = useState<DepartmentRow[]>([]);
  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);

  React.useEffect(() => {
    if (!eldocNo) return;
    dispatch(fetchDigitalDocAuthrtList(eldocNo));
  }, [dispatch, eldocNo]);

  React.useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await https.get("/api/dr/departments", {
          params: { pageNum: 1, pageSize: 1000 },
        });
        const payload = (res as any)?.data?.data ?? (res as any)?.data ?? {};
        const list = Array.isArray(payload?.list)
          ? payload.list
          : Array.isArray(payload)
            ? payload
            : [];
        setDepartments(
          list
            .map(normalizeDepartment)
            .filter((item: DepartmentRow) => item.deptNo && item.deptNm),
        );
      } catch (error) {
        notifications.show(getErrorMessage(error), {
          severity: "error",
          autoHideDuration: 3000,
        });
      }
    };

    fetchDepartments();
  }, [notifications]);

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

      const confirmed = await dialogs.confirm("공람 정보를 삭제하시겠습니까?", {
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
    if (isEmpty(deptId)) {
      await dialogs.alert("부서를 선택해 주세요.", {
        title: "알림",
        okText: "확인",
      });
      return;
    }

    try {
      await dispatch(createDigitalDocAuthrt({ eldocNo, deptId })).unwrap();
      notifications.show("등록되었습니다.", {
        severity: "success",
        autoHideDuration: 3000,
      });
      setDeptId("");
      setDeptNm("");
      dispatch(fetchDigitalDocAuthrtList(eldocNo));
    } catch (error) {
      notifications.show(getErrorMessage(error), {
        severity: "error",
        autoHideDuration: 3000,
      });
    }
  }, [deptId, dialogs, dispatch, eldocNo, notifications]);

  const handleDepartmentSelect = useCallback((department: DepartmentRow) => {
    setDeptId(department.deptNo);
    setDeptNm(department.deptNm);
  }, []);

  return (
    <div className="tbl_wrap">
      <TableWrapper
        aria-label={tableAriaLabel}
        colgroup={
          <colgroup>
            <col className="tbl-col-w-15p" />
            <col />
            <col className="tbl-col-w-15p" />
          </colgroup>
        }
      >
        <TableRow>
          <LabelCell rowSpan={Math.max(rows.length, 1) + 2}>공람</LabelCell>
          <LabelCell>부서</LabelCell>
          <LabelCell>삭제</LabelCell>
        </TableRow>

        {rows.length > 0 ? (
          rows.map((row) => (
            <TableRow key={row.inqAuthrtNo || row.deptId}>
              <TableCell align="center" sx={styleGroup.content}>
                {(row as any).deptNm || row.deptId || "-"}
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
            <TableCell colSpan={2} align="center" sx={styleGroup.content}>
              {authrtLoading ? "조회 중..." : "공람 데이터가 없습니다."}
            </TableCell>
          </TableRow>
        )}

        <TableRow>
          <TableCell>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                fullWidth
                size="small"
                placeholder="부서"
                value={deptNm}
                inputProps={{ readOnly: true }}
                onClick={() => setDepartmentDialogOpen(true)}
              />
              <IconButton
                aria-label="부서조회"
                onClick={() => setDepartmentDialogOpen(true)}
                sx={{ flexShrink: 0 }}
              >
                <SearchIcon />
              </IconButton>
            </Stack>
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

      <DepartmentTreeDialog
        open={departmentDialogOpen}
        departments={departments}
        selectedDeptNo={deptId}
        onClose={() => setDepartmentDialogOpen(false)}
        onSelect={handleDepartmentSelect}
      />
    </div>
  );
};
