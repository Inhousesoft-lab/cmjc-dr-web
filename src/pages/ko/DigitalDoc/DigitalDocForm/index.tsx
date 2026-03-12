import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
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
import UploadFiles from "@/components/file/UploadFiles";
import { selectDocClsfByParent } from "@/features/clsf/DocClsfSelectors";

type FormValues = DigitalDocCreatePayload;
type FieldErrors = Partial<Record<keyof FormValues, string>>;

const INITIAL_FORM_VALUES: FormValues = {
  docLclsfNo: "",
  docMclsfNo: "",
  docSclsfNo: "",
  docClsfNo: "",
  prvcInclYn: "N",
  docNo: "",
  docTtl: "",
  clctYmd: "",
  hldPrdDfyrs: "1",
  hldPrdMmCnt: "",
  endYmd: "",
  addExpln: "",
  eldocYn: "Y",
  atchFileSn: "",
};

export default function DigitalDocForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const notifications = useNotifications();
  const saveError = useAppSelector(selectDigitalDocSaveError);
  const saving = useAppSelector(selectDigitalDocSaving);

  const [values, setValues] = React.useState<FormValues>(INITIAL_FORM_VALUES);
  const [errors, setErrors] = React.useState<FieldErrors>({});

  const { lclsfList, mclsfList, sclsfList } = useDocClsfOptions(
    values.docLclsfNo,
    values.docMclsfNo,
  );
  const lclsfDocs = useAppSelector((state) => selectDocClsfByParent(state));
  const mclsfDocs = useAppSelector((state) =>
    values.docLclsfNo ? selectDocClsfByParent(state, values.docLclsfNo) : [],
  );
  const sclsfDocs = useAppSelector((state) =>
    values.docMclsfNo ? selectDocClsfByParent(state, values.docMclsfNo) : [],
  );

  // 저장 시 사용할 최종 분류 메타를 찾는다.
  const selectedDocClsf = React.useMemo(() => {
    if (values.docSclsfNo) {
      return sclsfDocs.find((item) => item.docClsfNo === values.docSclsfNo);
    }

    if (values.docMclsfNo) {
      return mclsfDocs.find((item) => item.docClsfNo === values.docMclsfNo);
    }

    if (values.docLclsfNo) {
      return lclsfDocs.find((item) => item.docClsfNo === values.docLclsfNo);
    }

    return undefined;
  }, [
    lclsfDocs,
    mclsfDocs,
    sclsfDocs,
    values.docLclsfNo,
    values.docMclsfNo,
    values.docSclsfNo,
  ]);

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

  const handleFieldChange = <K extends keyof FormValues>(
    key: K,
    value: FormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: FormValues = {
      ...values,
      docClsfNo: values.docSclsfNo || values.docMclsfNo || values.docLclsfNo,
      // 개인정보 포함 여부는 선택한 문서분류 값을 그대로 따른다.
      prvcInclYn: selectedDocClsf?.prvcInclYn === "Y" ? "Y" : "N",
    };

    const validated = digitalDocFormValidator(payload);
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
      await dispatch(createDigitalDoc(payload)).unwrap();
      notifications.show("전자문서가 등록되었습니다.", {
        severity: "success",
        autoHideDuration: 3000,
      });
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
          <LabelCell>문서분류</LabelCell>
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
          <LabelCell>문서번호</LabelCell>
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
          <LabelCell>문서제목</LabelCell>
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
          <LabelCell>수집일자</LabelCell>
          <TableCell>
            <MuiDatePickerFt
              name="clctYmd"
              value={values.clctYmd}
              onChange={(value) => handleFieldChange("clctYmd", value)}
              error={!!errors.clctYmd}
              helperText={errors.clctYmd || ""}
            />
          </TableCell>
          <LabelCell>보존연한</LabelCell>
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
                      handleFieldChange("endYmd", "");
                    }
                  }}
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
                disabled={values.hldPrdDfyrs !== "0"}
                error={!!errors.hldPrdMmCnt}
                helperText={errors.hldPrdMmCnt || ""}
              />
              &nbsp;개월
            </Stack>
          </TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>종료일자</LabelCell>
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
          <LabelCell>파일분류</LabelCell>
          <TableCell colSpan={3}>
            <FormControl>
              <RadioGroup
                row
                name="eldocYn"
                value={values.eldocYn}
                onChange={(e) =>
                  handleFieldChange("eldocYn", e.target.value as "Y" | "N")
                }
              >
                <FormControlLabel
                  value="Y"
                  control={<Radio size="small" />}
                  label="문서"
                />
                <FormControlLabel
                  value="N"
                  control={<Radio size="small" />}
                  label="파일"
                />
              </RadioGroup>
            </FormControl>
          </TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>첨부파일</LabelCell>
          <TableCell colSpan={3}>
            <UploadFiles
              setGroupId={(id) => handleFieldChange("atchFileSn", id)}
            />
            {!!errors.atchFileSn && (
              <Typography variant="caption" color="error">
                {errors.atchFileSn}
              </Typography>
            )}
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
