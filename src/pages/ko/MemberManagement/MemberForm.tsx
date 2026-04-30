import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import https from "@/api/axiosInstance";
import {
  checkMemberIdDuplicateApiPath,
  createMemberApiPath,
  selectDepartmentListApiPath,
  selectMemberApiPath,
  updateMemberApiPath,
} from "@/api/member/MemberApiPaths";
import { useAppSelector } from "@/app/hooks";
import MuiSelect from "@/components/elements/MuiSelect";
import LabelCell from "@/components/table/LabelCell";
import TableWrapper from "@/components/table/TableWrapper";
import { isDrAdminUser } from "@/features/auth/authAccess";
import type { SelectItem } from "@/features/com/CommonTypes";
import useNotifications from "@/hooks/useNotifications";
import { getLangFromPathname, langPath } from "@/routes/lang";
import type { DepartmentRow, MemberFormValues } from "@/types/member";
import { getErrorMessage } from "@/utils/globalFunc";
import DepartmentManageDialog from "./DepartmentManageDialog";
import DepartmentTreeDialog from "./DepartmentTreeDialog";

type FieldErrors = Partial<Record<keyof MemberFormValues, string>>;
type DuplicateState = "idle" | "checking" | "available" | "unavailable";

const INITIAL_FORM_VALUES: MemberFormValues = {
  mbrId: "",
  mbrNm: "",
  deptNo: "",
  deptNm: "",
  jbpsNm: "",
  authrtCd: "",
};

const AUTHORITY_ITEMS: SelectItem[] = [
  { code: "", name: "권한" },
  { code: "ADMIN", name: "관리자" },
  { code: "CANCEL_ADMIN", name: "파기관리자" },
  { code: "USER", name: "일반" },
];

const LIST_KEYS = ["list", "rows", "items", "content"] as const;

const toStr = (value: unknown) => (value == null ? "" : String(value));

const isRecord = (value: unknown): value is Record<string, any> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const pickData = (payload: any) => {
  if (isRecord(payload?.data)) return payload.data;
  if (isRecord(payload?.result?.data)) return payload.result.data;
  return payload;
};

const pickArray = (payload: any): any[] => {
  const roots = [
    payload,
    payload?.data,
    payload?.result,
    payload?.data?.data,
    payload?.result?.data,
  ];

  for (const root of roots) {
    if (Array.isArray(root)) return root;
    if (!isRecord(root)) continue;
    for (const key of LIST_KEYS) {
      if (Array.isArray(root[key])) return root[key];
    }
  }

  return [];
};

const normalizeMember = (payload: any): MemberFormValues => {
  const data = pickData(payload);
  return {
    mbrId: toStr(data?.mbrId ?? data?.mbr_id),
    mbrNm: toStr(data?.mbrNm ?? data?.mbr_nm),
    deptNo: toStr(data?.deptNo ?? data?.dept_no),
    deptNm: toStr(data?.deptNm ?? data?.dept_nm),
    jbpsNm: toStr(data?.jbpsNm ?? data?.jbps_nm),
    authrtCd: toStr(data?.authrtCd ?? data?.authrt_cd),
  };
};

const normalizeDepartments = (payload: any): DepartmentRow[] =>
  pickArray(payload)
    .map((item) => ({
      rowNo: Number(item?.rowNo ?? item?.row_no ?? 0),
      deptNo: toStr(item?.deptNo ?? item?.dept_no),
      deptNm: toStr(item?.deptNm ?? item?.dept_nm),
      upDeptNo: toStr(item?.upDeptNo ?? item?.up_dept_no),
      useEn: toStr(item?.useEn ?? item?.use_en),
      useYn: toStr(item?.useYn ?? item?.use_yn),
    }))
    .filter((item) => item.deptNo && item.deptNm);

export default function MemberForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mbrId: routeMbrId } = useParams();
  const notifications = useNotifications();
  const lang = getLangFromPathname(location.pathname);
  const user = useAppSelector((state) => state.auth.user);
  const decodedMbrId = routeMbrId ? decodeURIComponent(routeMbrId) : "";
  const isEditMode = Boolean(decodedMbrId);

  const [values, setValues] =
    React.useState<MemberFormValues>(INITIAL_FORM_VALUES);
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [departments, setDepartments] = React.useState<DepartmentRow[]>([]);
  const [duplicateStatus, setDuplicateStatus] =
    React.useState<DuplicateState>("idle");
  const [checkedMbrId, setCheckedMbrId] = React.useState("");
  const [departmentDialogOpen, setDepartmentDialogOpen] = React.useState(false);
  const [departmentManageOpen, setDepartmentManageOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const isDuplicatePassed =
    duplicateStatus === "available" && checkedMbrId === values.mbrId.trim();

  const fetchDepartments = React.useCallback(async () => {
    try {
      const res = await https.get(selectDepartmentListApiPath(), {
        params: {
          useEn: "Y",
          pageNum: 1,
          pageSize: 1000,
        },
      });
      const nextDepartments = normalizeDepartments((res as any)?.data ?? {});
      setDepartments(nextDepartments);
      return nextDepartments;
    } catch (error) {
      notifications.show(getErrorMessage(error), {
        severity: "error",
        autoHideDuration: 3000,
      });
      return [];
    }
  }, [notifications]);

  React.useEffect(() => {
    if (!isDrAdminUser(user)) return;
    fetchDepartments();
  }, [fetchDepartments, user]);

  React.useEffect(() => {
    if (!isDrAdminUser(user) || !isEditMode) return;

    let canceled = false;
    const fetchMember = async () => {
      setLoading(true);
      try {
        const res = await https.get(selectMemberApiPath(decodedMbrId));
        if (canceled) return;
        const member = normalizeMember((res as any)?.data ?? {});
        setValues(member);
        setDuplicateStatus("available");
        setCheckedMbrId(member.mbrId);
      } catch (error) {
        if (!canceled) {
          notifications.show(getErrorMessage(error), {
            severity: "error",
            autoHideDuration: 3000,
          });
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    };

    fetchMember();

    return () => {
      canceled = true;
    };
  }, [decodedMbrId, isEditMode, notifications, user]);

  React.useEffect(() => {
    if (!values.deptNo || values.deptNm || departments.length === 0) return;

    const selectedDept = departments.find(
      (dept) => dept.deptNo === values.deptNo,
    );
    if (!selectedDept) return;

    setValues((prev) => ({
      ...prev,
      deptNm: selectedDept.deptNm,
    }));
  }, [departments, values.deptNm, values.deptNo]);

  if (!isDrAdminUser(user)) {
    return <Navigate to={`/${lang}`} replace />;
  }

  const handleFieldChange =
    (name: keyof MemberFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setValues((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: undefined }));

      if (name === "mbrId") {
        setDuplicateStatus("idle");
        setCheckedMbrId("");
      }
    };

  const handleDepartmentSelect = (department: DepartmentRow) => {
    setValues((prev) => ({
      ...prev,
      deptNo: department.deptNo,
      deptNm: department.deptNm,
    }));
    setErrors((prev) => ({ ...prev, deptNo: undefined }));
  };

  const handleDepartmentChanged = async (department: DepartmentRow) => {
    const nextDepartments = await fetchDepartments();
    const latestDepartment =
      nextDepartments.find((item) => item.deptNo === department.deptNo) ??
      department;

    setValues((prev) => {
      if (prev.deptNo !== latestDepartment.deptNo) return prev;
      return {
        ...prev,
        deptNm: latestDepartment.deptNm,
      };
    });
  };

  const validate = () => {
    const nextValues: MemberFormValues = {
      mbrId: values.mbrId.trim(),
      mbrNm: values.mbrNm.trim(),
      deptNo: values.deptNo.trim(),
      deptNm: values.deptNm?.trim() ?? "",
      jbpsNm: values.jbpsNm.trim(),
      authrtCd: values.authrtCd.trim(),
    };

    const nextErrors: FieldErrors = {};
    if (!nextValues.mbrId) nextErrors.mbrId = "아이디를 입력해 주세요.";
    if (!nextValues.mbrNm) nextErrors.mbrNm = "이름을 입력해 주세요.";
    if (!nextValues.deptNo) nextErrors.deptNo = "부서를 선택해 주세요.";
    if (!nextValues.jbpsNm) nextErrors.jbpsNm = "직위를 입력해 주세요.";
    if (!nextValues.authrtCd) nextErrors.authrtCd = "권한을 선택해 주세요.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length > 0 ? null : nextValues;
  };

  const handleDuplicateCheck = async () => {
    const mbrId = values.mbrId.trim();
    if (!mbrId) {
      setErrors((prev) => ({ ...prev, mbrId: "아이디를 입력해 주세요." }));
      notifications.show("아이디를 입력해 주세요.", {
        severity: "warning",
        autoHideDuration: 2500,
      });
      return;
    }

    setDuplicateStatus("checking");
    try {
      const res = await https.get(checkMemberIdDuplicateApiPath(mbrId));
      const data = pickData((res as any)?.data ?? {});
      const available =
        typeof data?.available === "boolean"
          ? data.available
          : !Boolean(data?.duplicated);

      if (available) {
        setDuplicateStatus("available");
        setCheckedMbrId(mbrId);
        setErrors((prev) => ({ ...prev, mbrId: undefined }));
        notifications.show("사용 가능한 아이디입니다.", {
          severity: "success",
          autoHideDuration: 2500,
        });
        return;
      }

      setDuplicateStatus("unavailable");
      setCheckedMbrId("");
      setErrors((prev) => ({
        ...prev,
        mbrId: "이미 사용 중인 아이디입니다.",
      }));
      notifications.show("이미 사용 중인 아이디입니다.", {
        severity: "warning",
        autoHideDuration: 2500,
      });
    } catch (error) {
      setDuplicateStatus("idle");
      setCheckedMbrId("");
      notifications.show(getErrorMessage(error), {
        severity: "error",
        autoHideDuration: 3000,
      });
    }
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isEditMode && !isDuplicatePassed) {
      notifications.show("아이디 중복확인을 먼저 진행해 주세요.", {
        severity: "warning",
        autoHideDuration: 2500,
      });
      return;
    }

    const payload = validate();
    if (!payload) {
      notifications.show("입력값을 확인해 주세요.", {
        severity: "warning",
        autoHideDuration: 2500,
      });
      return;
    }

    const requestPayload = {
      ...payload,
      mbrId: isEditMode ? decodedMbrId : payload.mbrId,
    };

    setSubmitting(true);
    try {
      if (isEditMode) {
        await https.put(updateMemberApiPath(decodedMbrId), requestPayload);
      } else {
        await https.post(createMemberApiPath(), requestPayload);
      }

      notifications.show(
        isEditMode ? "회원 정보가 수정되었습니다." : "회원이 등록되었습니다.",
        {
          severity: "success",
          autoHideDuration: 2500,
        },
      );
      navigate(langPath("members", lang));
    } catch (error) {
      notifications.show(getErrorMessage(error), {
        severity: "error",
        autoHideDuration: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleList = () => {
    navigate(langPath("members", lang));
  };

  return (
    <>
      <form onSubmit={handleSave}>
        <Typography variant="h5" component="h1" fontWeight={700} mb={2}>
          [전자문서고 - 관리자] 회원관리 (등록&수정&조회)
        </Typography>

        <Typography variant="h6" component="h2" fontWeight={700} mb={1}>
          ▶ 회원 {isEditMode ? "수정" : "등록"}
        </Typography>

        <TableWrapper
          tableAriaLabel="회원 등록 정보"
          colgroup={
            <colgroup>
              <col className="tbl-col-w-100" />
              <col />
              <col className="tbl-col-w-100" />
              <col />
            </colgroup>
          }
        >
          <TableRow>
            <LabelCell required>이름</LabelCell>
            <TableCell>
              <TextField
                fullWidth
                size="small"
                placeholder="이름"
                value={values.mbrNm}
                onChange={handleFieldChange("mbrNm")}
                error={!!errors.mbrNm}
                helperText={errors.mbrNm || ""}
                disabled={loading || submitting}
              />
            </TableCell>
            <LabelCell required>아이디</LabelCell>
            <TableCell>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <TextField
                  fullWidth
                  size="small"
                  placeholder="아이디"
                  value={values.mbrId}
                  onChange={handleFieldChange("mbrId")}
                  error={!!errors.mbrId}
                  helperText={
                    errors.mbrId ||
                    (isDuplicatePassed ? "중복확인이 완료되었습니다." : "")
                  }
                  disabled={isEditMode || loading || submitting}
                />
                {!isEditMode && (
                  <Button
                    type="button"
                    variant="contained"
                    color="success"
                    onClick={handleDuplicateCheck}
                    disabled={
                      duplicateStatus === "checking" || loading || submitting
                    }
                    sx={{ flexShrink: 0 }}
                  >
                    중복확인
                  </Button>
                )}
              </Stack>
            </TableCell>
          </TableRow>
          <TableRow>
            <LabelCell required>부서</LabelCell>
            <TableCell>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <TextField
                  fullWidth
                  size="small"
                  placeholder="부서"
                  value={values.deptNm ?? ""}
                  error={!!errors.deptNo}
                  helperText={errors.deptNo || ""}
                  disabled={loading || submitting}
                  InputProps={{ readOnly: true }}
                  onClick={() => setDepartmentDialogOpen(true)}
                />
                <IconButton
                  type="button"
                  aria-label="부서 조회"
                  onClick={() => setDepartmentDialogOpen(true)}
                  disabled={loading || submitting}
                  sx={{ width: 40, height: 40, flexShrink: 0 }}
                >
                  <SearchIcon />
                </IconButton>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => setDepartmentManageOpen(true)}
                  disabled={loading || submitting}
                  sx={{ flexShrink: 0 }}
                >
                  부서관리
                </Button>
              </Stack>
            </TableCell>
            <LabelCell required>직위</LabelCell>
            <TableCell>
              <TextField
                fullWidth
                size="small"
                placeholder="직위"
                value={values.jbpsNm}
                onChange={handleFieldChange("jbpsNm")}
                error={!!errors.jbpsNm}
                helperText={errors.jbpsNm || ""}
                disabled={loading || submitting}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <LabelCell required>권한</LabelCell>
            <TableCell colSpan={3}>
              <MuiSelect
                id="authrtCd"
                items={AUTHORITY_ITEMS}
                value={values.authrtCd}
                onChange={handleFieldChange("authrtCd")}
                error={!!errors.authrtCd}
                helperText={errors.authrtCd || ""}
                isDisabled={loading || submitting}
              />
            </TableCell>
          </TableRow>
        </TableWrapper>

        <Typography mt={2} mb={2}>
          * 초기 비밀번호는 ****** 입니다. 로그인 후 비밀번호를 변경해 주세요.
        </Typography>

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={submitting || loading || (!isEditMode && !isDuplicatePassed)}
          >
            저장
          </Button>
          <Button type="button" variant="contained" onClick={handleList}>
            목록
          </Button>
        </Stack>
      </form>

      <DepartmentTreeDialog
        open={departmentDialogOpen}
        departments={departments}
        selectedDeptNo={values.deptNo}
        onClose={() => setDepartmentDialogOpen(false)}
        onSelect={handleDepartmentSelect}
      />
      <DepartmentManageDialog
        open={departmentManageOpen}
        departments={departments}
        selectedDeptNo={values.deptNo}
        onClose={() => setDepartmentManageOpen(false)}
        onChanged={handleDepartmentChanged}
      />
    </>
  );
}
