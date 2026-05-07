import {
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import {
  AttachFile as AttachFileIcon,
  DeleteOutline as DeleteOutlineIcon,
} from "@mui/icons-material";
import { useLocation, useNavigate, useParams } from "react-router";
import { MuiDatePickerFt } from "@/components/elements/MuiDatePickerFt";
import MuiSelect from "@/components/elements/MuiSelect";
import PageStatus from "@/components/common/PageStatus";
import UploadFiles from "@/components/file/UploadFiles";
import LabelCell from "@/components/table/LabelCell";
import TableWrapper from "@/components/table/TableWrapper";
import { useDocClsfOptions } from "@/hooks/useDocClsfOptions";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  createDigitalDoc,
  fetchDigitalDocDetail,
  updateDigitalDoc,
  type DigitalDocCreatePayload,
} from "@/features/digitalDoc/DigitalDocThunk";
import {
  selectDigitalDocDetail,
  selectDigitalDocDetailError,
  selectDigitalDocDetailLoading,
  selectDigitalDocSaveError,
  selectDigitalDocSaving,
} from "@/features/digitalDoc/DigitalDocSelectors";
import { digitalDocFormValidator } from "@/features/digitalDoc/DigitalDocValidator";
import useNotifications from "@/hooks/useNotifications";
import URL from "@/constants/url";
import { resetDigitalDocSaveState } from "@/features/digitalDoc/DigitalDocSlice";
import { calculateEndYmdByPeriod } from "@/utils/formater";
import { getLangFromPathname, langPath } from "@/routes/lang";
import type { SearchValues } from "@/types/digitalDoc";

type FormValues = Omit<DigitalDocCreatePayload, "uploadFiles">;
type FieldErrors = Partial<Record<keyof FormValues, string>>;

const INITIAL_FORM_VALUES: FormValues = {
  docLclsfNo: "",
  docMclsfNo: "",
  docSclsfNo: "",
  docClsfNo: "",
  docNo: "",
  docTtl: "",
  clctYmd: "",
  hldPrdDfyrs: "1",
  hldPrdMmCnt: "",
  endYmd: "",
  addExpln: "",
};

const RETENTION_YEAR_OPTIONS = [
  { value: "1", label: "1년" },
  { value: "3", label: "3년" },
  { value: "5", label: "5년" },
  { value: "10", label: "10년" },
  { value: "30", label: "30년" },
  { value: "90", label: "준영구" },
  { value: "99", label: "영구" },
  { value: "0", label: "직접입력" },
];

const toDatePickerValue = (value: unknown) => {
  const digits = String(value ?? "").replace(/[^0-9]/g, "");
  return digits.length >= 8 ? digits.slice(0, 8) : "";
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function DigitalDocForm() {
  const { eldocNo = "" } = useParams<{ eldocNo?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const notifications = useNotifications();

  const saveError = useAppSelector(selectDigitalDocSaveError);
  const saving = useAppSelector(selectDigitalDocSaving);
  const detail = useAppSelector(selectDigitalDocDetail);
  const detailLoading = useAppSelector(selectDigitalDocDetailLoading);
  const detailError = useAppSelector(selectDigitalDocDetailError);

  const isModify = !!eldocNo;
  const curLang = getLangFromPathname(location.pathname);
  const navState = location.state as
    | {
        sourceListPath?: string;
        listState?: SearchValues;
      }
    | null;

  const [values, setValues] = React.useState<FormValues>(INITIAL_FORM_VALUES);
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [uploadFiles, setUploadFiles] = React.useState<File[]>([]);

  const { lclsfList, mclsfList, sclsfList } = useDocClsfOptions(
    values.docLclsfNo,
    values.docMclsfNo,
  );

  const calculatedEndYmd = React.useMemo(
    () =>
      calculateEndYmdByPeriod(
        values.clctYmd,
        values.hldPrdDfyrs,
        values.hldPrdMmCnt,
      ),
    [values.clctYmd, values.hldPrdDfyrs, values.hldPrdMmCnt],
  );

  React.useEffect(() => {
    if (!isModify || !eldocNo) return;
    dispatch(fetchDigitalDocDetail(eldocNo));
  }, [dispatch, eldocNo, isModify]);

  React.useEffect(() => {
    if (!saveError) return;
    notifications.show(saveError, {
      severity: "error",
      autoHideDuration: 3000,
    });
  }, [saveError, notifications]);

  React.useEffect(() => {
    if (!detailError) return;
    notifications.show(detailError, {
      severity: "error",
      autoHideDuration: 3000,
    });
  }, [detailError, notifications]);

  React.useEffect(() => {
    return () => {
      dispatch(resetDigitalDocSaveState());
    };
  }, [dispatch]);

  React.useEffect(() => {
    if (!isModify || !detail || detail.eldocNo !== eldocNo) return;

    setValues({
      docLclsfNo: detail.docLclsfNo ?? "",
      docMclsfNo: detail.docMclsfNo ?? "",
      docSclsfNo: detail.docSclsfNo ?? "",
      docClsfNo: detail.docClsfNo ?? "",
      docNo: detail.docNo ?? "",
      docTtl: detail.docTtl ?? "",
      clctYmd: toDatePickerValue(detail.clctYmd),
      hldPrdDfyrs: String(detail.hldPrdDfyrs ?? "1"),
      hldPrdMmCnt: String(detail.hldPrdMmCnt ?? ""),
      endYmd: toDatePickerValue(detail.endYmd),
      addExpln: detail.addExpln ?? "",
    });
    setUploadFiles([]);
    setErrors({});
  }, [detail, eldocNo, isModify]);

  React.useEffect(() => {
    if (values.hldPrdDfyrs === "0") return;

    setValues((prev) => {
      if (prev.endYmd === calculatedEndYmd) return prev;
      return { ...prev, endYmd: calculatedEndYmd };
    });
  }, [calculatedEndYmd, values.hldPrdDfyrs]);

  const handleFieldChange = <K extends keyof FormValues>(
    key: K,
    value: FormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    if (selectedFiles.length > 0) {
      setUploadFiles((prev) => [...prev, ...selectedFiles]);
    }
    e.target.value = "";
  };

  const handleRemoveUploadFile = (index: number) => {
    setUploadFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index));
  };

  const detailPath = React.useMemo(
    () => URL.DIGITAL_DOC_DETAIL.replace(":eldocNo", eldocNo),
    [eldocNo],
  );

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const resolvedEndYmd =
      values.hldPrdDfyrs === "0" ? values.endYmd : calculatedEndYmd;

    const formPayload: FormValues = {
      ...values,
      docClsfNo: values.docSclsfNo || values.docMclsfNo || values.docLclsfNo,
      hldPrdMmCnt: values.hldPrdDfyrs === "0" ? values.hldPrdMmCnt : "0",
      endYmd: resolvedEndYmd,
    };

    const validated = digitalDocFormValidator(formPayload);
    if (!validated.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of validated.issues) {
        const key = issue.path[0] as keyof FormValues;
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      }
      setErrors(nextErrors);
      notifications.show("입력값을 확인해 주세요.", {
        severity: "error",
        autoHideDuration: 3000,
      });
      return;
    }

    try {
      if (isModify) {
        await dispatch(
          updateDigitalDoc({
            eldocNo,
            docClsfNo: formPayload.docClsfNo,
            docNo: formPayload.docNo,
            docTtl: formPayload.docTtl,
            clctYmd: formPayload.clctYmd,
            hldPrdDfyrs: formPayload.hldPrdDfyrs,
            hldPrdMmCnt: formPayload.hldPrdMmCnt,
            endYmd: formPayload.endYmd,
            addExpln: formPayload.addExpln,
            uploadFiles,
          }),
        ).unwrap();
        navigate(langPath(detailPath, curLang), {
          state: {
            sourceListPath: navState?.sourceListPath ?? URL.DIGITAL_DOC_LIST,
            listState: navState?.listState,
          },
        });
        return;
      }

      const payload: DigitalDocCreatePayload = {
        ...formPayload,
        uploadFiles,
      };
      await dispatch(createDigitalDoc(payload)).unwrap();
      navigate(langPath(URL.DIGITAL_DOC_LIST, curLang));
    } catch (error) {
      notifications.show(getErrorMessage(error), {
        severity: "error",
        autoHideDuration: 3000,
      });
    }
  };

  const handleCancel = () => {
    if (isModify) {
      navigate(langPath(detailPath, curLang), {
        state: {
          sourceListPath: navState?.sourceListPath ?? URL.DIGITAL_DOC_LIST,
          listState: navState?.listState,
        },
      });
      return;
    }

    navigate(langPath(URL.DIGITAL_DOC_LIST, curLang));
  };

  if (isModify && detailLoading && (!detail || detail.eldocNo !== eldocNo)) {
    return <PageStatus isLoading={detailLoading} />;
  }

  return (
    <form onSubmit={handleSave}>
      <TableWrapper
        aria-label="전자문서 상세 정보"
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
          <LabelCell required>문서분류</LabelCell>
          <TableCell colSpan={3}>
            <Stack direction="row" spacing={1}>
              <Stack spacing={0.5} width="100%">
                <FormLabel required>대분류</FormLabel>
                <MuiSelect
                  id="docLclsfNo"
                  items={lclsfList}
                  value={values.docLclsfNo}
                  onChange={(e) => {
                    handleFieldChange("docLclsfNo", e.target.value);
                    handleFieldChange("docMclsfNo", "");
                    handleFieldChange("docSclsfNo", "");
                  }}
                />
                {!!errors.docLclsfNo && (
                  <Typography variant="caption" color="error">
                    {errors.docLclsfNo}
                  </Typography>
                )}
              </Stack>
              <Stack spacing={0.5} width="100%">
                <FormLabel required>중분류</FormLabel>
                <MuiSelect
                  id="docMclsfNo"
                  items={mclsfList}
                  value={values.docMclsfNo}
                  onChange={(e) => {
                    handleFieldChange("docMclsfNo", e.target.value);
                    handleFieldChange("docSclsfNo", "");
                  }}
                />
                {!!errors.docMclsfNo && (
                  <Typography variant="caption" color="error">
                    {errors.docMclsfNo}
                  </Typography>
                )}
              </Stack>
              <Stack spacing={0.5} width="100%">
                <FormLabel required>소분류</FormLabel>
                <MuiSelect
                  id="docSclsfNo"
                  items={sclsfList}
                  value={values.docSclsfNo}
                  onChange={(e) =>
                    handleFieldChange("docSclsfNo", e.target.value)
                  }
                />
                {!!errors.docSclsfNo && (
                  <Typography variant="caption" color="error">
                    {errors.docSclsfNo}
                  </Typography>
                )}
              </Stack>
            </Stack>
          </TableCell>
        </TableRow>
        <TableRow>
          <LabelCell required>문서번호</LabelCell>
          <TableCell colSpan={3}>
            <TextField
              fullWidth
              id="docNo"
              name="docNo"
              value={values.docNo}
              onChange={(e) => handleFieldChange("docNo", e.target.value)}
              placeholder="문서번호"
              size="small"
              error={!!errors.docNo}
              helperText={errors.docNo || ""}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <LabelCell required>문서제목</LabelCell>
          <TableCell colSpan={3}>
            <TextField
              hiddenLabel
              fullWidth
              id="docTtl"
              name="docTtl"
              value={values.docTtl}
              onChange={(e) => handleFieldChange("docTtl", e.target.value)}
              placeholder="문서제목"
              size="small"
              error={!!errors.docTtl}
              helperText={errors.docTtl || ""}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <LabelCell required>수집일자</LabelCell>
          <TableCell>
            <MuiDatePickerFt
              name="clctYmd"
              value={values.clctYmd}
              onChange={(value) => handleFieldChange("clctYmd", value)}
              error={!!errors.clctYmd}
              helperText={errors.clctYmd || ""}
            />
          </TableCell>
          <LabelCell required>보존연한</LabelCell>
          <TableCell>
            <Stack direction="row" spacing={1} alignItems="center">
              <FormControl fullWidth>
                <Select
                  fullWidth
                  size="small"
                  name="hldPrdDfyrs"
                  value={String(values.hldPrdDfyrs)}
                  onChange={(e) => {
                    const selected = String(e.target.value);
                    handleFieldChange("hldPrdDfyrs", selected);
                    if (selected !== "0") {
                      handleFieldChange("hldPrdMmCnt", "0");
                    }
                  }}
                  error={!!errors.hldPrdDfyrs}
                >
                  {RETENTION_YEAR_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                size="small"
                fullWidth
                name="hldPrdMmCnt"
                value={values.hldPrdMmCnt}
                onChange={(e) =>
                  handleFieldChange(
                    "hldPrdMmCnt",
                    e.target.value.replace(/[^0-9]/g, ""),
                  )
                }
                placeholder="개월"
                type="text"
                disabled={values.hldPrdDfyrs !== "0"}
                error={!!errors.hldPrdMmCnt}
                helperText={errors.hldPrdMmCnt || ""}
              />
              <Typography
                component="span"
                variant="body2"
                sx={{ whiteSpace: "nowrap", flexShrink: 0, minWidth: 28 }}
              >
                개월
              </Typography>
            </Stack>
          </TableCell>
        </TableRow>
        <TableRow>
          <LabelCell required={values.hldPrdDfyrs === "0"}>종료일자</LabelCell>
          <TableCell colSpan={3}>
            <Stack direction="row" spacing={1} alignItems="center">
              <MuiDatePickerFt
                name="endYmd"
                value={values.endYmd}
                onChange={(value) => handleFieldChange("endYmd", value)}
                disabled={values.hldPrdDfyrs !== "0"}
                error={!!errors.endYmd}
                helperText={errors.endYmd || ""}
              />
              <Typography variant="body1" color="text.secondary">
                * 보존연한을 직접 입력하신 경우 종료일자를 달력에서 선택해 입력해 주세요.
              </Typography>
            </Stack>
          </TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>비고</LabelCell>
          <TableCell colSpan={3}>
            <TextField
              fullWidth
              id="addExpln"
              name="addExpln"
              value={values.addExpln}
              onChange={(e) => handleFieldChange("addExpln", e.target.value)}
              placeholder="비고"
              multiline
              minRows={3}
              size="small"
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>파일업로드</LabelCell>
          <TableCell colSpan={3}>
            <Stack spacing={1}>
              {isModify && eldocNo && (
                <Box>
                  <Typography variant="subtitle2" mb={0.5}>
                    기존 첨부파일
                  </Typography>
                  <UploadFiles
                    taskSeTrgtId={eldocNo}
                    readOnly
                    requireDownloadReason
                  />
                </Box>
              )}
              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<AttachFileIcon />}
                  disabled={saving}
                >
                  파일 선택
                  <input
                    hidden
                    type="file"
                    multiple
                    onChange={handleFileInputChange}
                  />
                </Button>
                <Typography variant="body2" color="text.secondary">
                  {uploadFiles.length}개 파일
                </Typography>
              </Stack>
              {uploadFiles.length > 0 && (
                <Stack spacing={0.5}>
                  {uploadFiles.map((file, index) => (
                    <Box
                      key={`${file.name}-${file.size}-${index}`}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: 1,
                        py: 0.75,
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <AttachFileIcon fontSize="small" color="action" />
                      <Typography
                        variant="body2"
                        title={file.name}
                        sx={{ flex: 1, minWidth: 0 }}
                        noWrap
                      >
                        {file.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ width: 90, textAlign: "right", flexShrink: 0 }}
                      >
                        {formatFileSize(file.size)}
                      </Typography>
                      <IconButton
                        size="small"
                        aria-label="첨부파일 삭제"
                        onClick={() => handleRemoveUploadFile(index)}
                        disabled={saving}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              )}
            </Stack>
          </TableCell>
        </TableRow>
      </TableWrapper>

      <Stack direction="row" spacing={1} justifyContent="flex-end" mt={2}>
        <Button
          size="large"
          variant="contained"
          type="button"
          onClick={handleCancel}
        >
          취소
        </Button>
        <Button size="large" variant="outlined" type="submit" disabled={saving}>
          {isModify ? "수정" : "등록"}
        </Button>
      </Stack>
    </form>
  );
}
