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
import https from "@/api/axiosInstance";

const styleGroup = {
  content: {
    "& .MuiTableCell-body": {
      textAlign: "center",
    },
  },
};

type InstitutionOption = {
  deptNo: string;
  deptNm: string;
};

type ResearcherOption = {
  mbrId: string;
  mbrNm: string;
};

const ALL_INDIVIDUAL_OPTION: ResearcherOption = {
  mbrId: "ALL",
  mbrNm: "전체",
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
  const [institutions, setInstitutions] = useState<InstitutionOption[]>([]);
  const [researchers, setResearchers] = useState<ResearcherOption[]>([]);

  React.useEffect(() => {
    if (!eldocNo) return;
    dispatch(fetchDigitalDocAuthrtList(eldocNo));
  }, [dispatch, eldocNo]);

  React.useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const res = await https.get("/api/dr/departments", {
          params: { pageNum: 1, pageSize: 1000 },
        });
        const payload = (res as any)?.data?.data ?? (res as any)?.data ?? {};
        setInstitutions((payload.list ?? []) as InstitutionOption[]);
      } catch (error) {
        notifications.show(getErrorMessage(error), {
          severity: "error",
          autoHideDuration: 3000,
        });
      }
    };

    fetchInstitutions();
  }, [notifications]);

  React.useEffect(() => {
    if (!deptId) {
      setResearchers([]);
      setIndvId("");
      return;
    }

    const fetchResearchers = async () => {
      try {
        const res = await https.get("/api/dr/members", {
          params: { deptNo: deptId, pageNum: 1, pageSize: 1000 },
        });
        const payload = (res as any)?.data?.data ?? (res as any)?.data ?? {};
        setResearchers([
          ALL_INDIVIDUAL_OPTION,
          ...((payload.list ?? []) as ResearcherOption[]),
        ]);
      } catch (error) {
        notifications.show(getErrorMessage(error), {
          severity: "error",
          autoHideDuration: 3000,
        });
      }
    };

    fetchResearchers();
  }, [deptId, notifications]);

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
        notifications.show("삭제했습니다.", {
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
      notifications.show("등록했습니다.", {
        severity: "success",
        autoHideDuration: 3000,
      });
      setDeptId("");
      setIndvId("");
      setResearchers([]);
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
                {(row as any).deptNm || row.deptId || "-"}
              </TableCell>
              <TableCell align="center" sx={styleGroup.content}>
                {(row as any).indvNm || (row.indvId === "ALL" ? "전체" : row.indvId) || "-"}
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
              {institutions.map((institution) => (
                <MenuItem key={institution.deptNo} value={institution.deptNo}>
                  {institution.deptNm}
                </MenuItem>
              ))}
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
              disabled={!deptId}
            >
              <MenuItem value="">
                <Typography>이름</Typography>
              </MenuItem>
              {researchers.map((researcher) => (
                <MenuItem key={researcher.mbrId} value={researcher.mbrId}>
                  {researcher.mbrNm}
                </MenuItem>
              ))}
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
