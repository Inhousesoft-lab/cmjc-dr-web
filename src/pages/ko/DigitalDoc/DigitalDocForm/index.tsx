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
import dayjs from "dayjs";
import {
  AttachFile as AttachFileIcon,
  DeleteOutline as DeleteOutlineIcon,
} from "@mui/icons-material";
import { MuiDatePickerFt } from "@/components/elements/MuiDatePickerFt";
import MuiSelect from "@/components/elements/MuiSelect";
import LabelCell from "@/components/table/LabelCell";
import TableWrapper from "@/components/table/TableWrapper";
import { useDocClsfOptions } from "@/hooks/useDocClsfOptions";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  createDigitalDoc,
  type DigitalDocCreatePayload,
} from "@/features/digitalDoc/DigitalDocThunk";
import {
  selectDigitalDocSaveError,
  selectDigitalDocSaving,
} from "@/features/digitalDoc/DigitalDocSelectors";
import { digitalDocFormValidator } from "@/features/digitalDoc/DigitalDocValidator";
import useNotifications from "@/hooks/useNotifications";
import { useNavigate } from "react-router";
import URL from "@/constants/url";
import { resetDigitalDocSaveState } from "@/features/digitalDoc/DigitalDocSlice";

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

const PERMANENT_END_YMD = "9999-12-31";

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function calculateEndYmd(
  clctYmd: string,
  hldPrdDfyrs: string | number,
  _hldPrdMmCnt: string,
) {
  const normalizedClctYmd = String(clctYmd ?? "").trim();
  const normalizedYears = String(hldPrdDfyrs ?? "").trim();

  if (!normalizedClctYmd || !normalizedYears) return "";

  if (normalizedYears === "90" || normalizedYears === "99") {
    return PERMANENT_END_YMD;
  }

  if (normalizedYears === "0") {
    return "";
  }

  const start = dayjs(normalizedClctYmd);
  if (!start.isValid()) return "";

  const totalMonths = Number.parseInt(normalizedYears, 10) * 12;
  if (Number.isNaN(totalMonths)) return "";

  return start.add(totalMonths, "month").format("YYYY-MM-DD");
}

export default function DigitalDocForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const notifications = useNotifications();
  const saveError = useAppSelector(selectDigitalDocSaveError);
  const saving = useAppSelector(selectDigitalDocSaving);

  const [values, setValues] = React.useState<FormValues>(INITIAL_FORM_VALUES);
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [uploadFiles, setUploadFiles] = React.useState<File[]>([]);

  const { lclsfList, mclsfList, sclsfList } = useDocClsfOptions(
    values.docLclsfNo,
    values.docMclsfNo,
  );

  // 저장 시 사용할 최종 분류 메타를 찾는다.

  const isHoldingPeriodLocked = false;

  const calculatedEndYmd = React.useMemo(
    () => calculateEndYmd(values.clctYmd, values.hldPrdDfyrs, values.hldPrdMmCnt),
    [values.clctYmd, values.hldPrdDfyrs, values.hldPrdMmCnt],
  );

  React.useEffect(() => {
    if (!saveError) return;
    notifications.show(saveError, {
      severity: "error",
      autoHideDuration: 3000,
    });
  }, [saveError, notifications]);

  React.useEffect(() => {
    return () => {
      dispatch(resetDigitalDocSaveState());
    };
  }, [dispatch]);

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

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const resolvedEndYmd =
      values.hldPrdDfyrs === "0" ? values.endYmd : calculatedEndYmd;

    const formPayload: FormValues = {
      ...values,
      docClsfNo: values.docSclsfNo || values.docMclsfNo || values.docLclsfNo,
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
      const payload: DigitalDocCreatePayload = {
        ...formPayload,
        uploadFiles,
      };
      await dispatch(createDigitalDoc(payload)).unwrap();
      navigate(URL.DIGITAL_DOC_LIST);
    } catch (error) {
      notifications.show(getErrorMessage(error), {
        severity: "error",
        autoHideDuration: 3000,
      });
    }
  };

  const handleCancel = () => {
    navigate(URL.DIGITAL_DOC_LIST);
  };

  return (
    <form onSubmit={handleSave}>
      <TableWrapper
        aria-label="디지털 문서 상세 정보"
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
                  value={values.hldPrdDfyrs}
                  onChange={(e) => {
                    const selected = e.target.value;
                    handleFieldChange("hldPrdDfyrs", selected);
                    if (selected !== "0") {
                      handleFieldChange("hldPrdMmCnt", "");
                    }
                  }}
                  disabled={isHoldingPeriodLocked}
                  error={!!errors.hldPrdDfyrs}
                >
                  <MenuItem value="1">1년</MenuItem>
                  <MenuItem value="3">3년</MenuItem>
                  <MenuItem value="5">5년</MenuItem>
                  <MenuItem value="10">10년</MenuItem>
                  <MenuItem value="30">30년</MenuItem>
                  <MenuItem value="90">준영구</MenuItem>
                  <MenuItem value="99">영구</MenuItem>
                  <MenuItem value="0">직접입력</MenuItem>
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
                placeholder="월"
                type="text"
                disabled={isHoldingPeriodLocked || values.hldPrdDfyrs !== "0"}
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
                * 보존연한을 직접 입력하신 경우 종료일자를 달력에서 선택하여
                입력해 주세요.
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
          <LabelCell>첨부파일</LabelCell>
          <TableCell colSpan={3}>
            <Stack spacing={1}>
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
          등록
        </Button>
      </Stack>
    </form>
  );
}
