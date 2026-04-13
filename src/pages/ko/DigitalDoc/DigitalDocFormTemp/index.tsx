import React from "react";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Stack,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import { MuiDatePickerFt } from "@/components/elements/MuiDatePickerFt";
import URL from "@/constants/url";
import LabelCell from "@/components/table/LabelCell";
import TableWrapper from "@/components/table/TableWrapper";
import { Controller, useForm, useWatch } from "react-hook-form";
import { DigitalDoc } from "@/types/digitalDoc";
import { useNavigate } from "react-router-dom";
import useNotifications from "@/hooks/useNotifications";
import PageStatus from "@/components/common/PageStatus";
import { insertEDocTempApiPath } from "@/api/digitalDoc/DigitalDocApiPaths";
import { https } from "@shared/utils/https";
import UploadFiles from "@/components/file/UploadFiles";

const TEMP_DOC_CLASSIFICATION_BINDING: Record<
  string,
  {
    docLclsfNo: string;
    docMclsfNo: string;
  }
> = {
  CLS_A1849DF2: {
    docLclsfNo: "CLS_0357FF41",
    docMclsfNo: "CLS_A1849DF2",
  },
  CLS_316D8A68: {
    docLclsfNo: "CLS_0357FF41",
    docMclsfNo: "CLS_316D8A68",
  },
  CLS_E1ADF348: {
    docLclsfNo: "CLS_0357FF41",
    docMclsfNo: "CLS_E1ADF348",
  },
  CLS_EA2D1A21: {
    docLclsfNo: "CLS_0357FF41",
    docMclsfNo: "CLS_EA2D1A21",
  },
};

export default function DigitalDocForm() {
  const navigate = useNavigate();
  const notifications = useNotifications();

  const [isLoading, setIsLoading] = React.useState(true);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DigitalDoc>({
    defaultValues: {
      docLclsfNo: "",
      docMclsfNo: "",
      docSclsfNo: "",
      docLclsfNm: "",
      docMclsfNm: "",
      docSclsfNm: "",
      docClsfNo: "", // 문서분류번호
      docNo: "", // 문서번호
      docTtl: "", // 문서제목
      clctYmd: "", // 수집일자
      addExpln: "", // 비고
      eldocYn: "", // 전자문서여부
      atchFileSn: "", // 첨부파일경로
      hldPrdDfyrs: "1",
      hldPrdMmCnt: "",
      endYmd: "",
      prvcInclYn: "Y",
    },
  });

  const eldocNo = useWatch({ control, name: "eldocNo" });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleBack = React.useCallback(() => {
    navigate(URL.DIGITAL_DOC_LIST);
  }, [navigate]);

  React.useEffect(() => {
    setIsLoading(false);
  }, []);

  const bindClassification = React.useCallback(
    (docClsfNo: string) => {
      setValue("docClsfNo", docClsfNo, { shouldValidate: true, shouldDirty: true });
      if (!docClsfNo) {
        setValue("docLclsfNo", "");
        setValue("docMclsfNo", "");
        setValue("docSclsfNo", "");
        setValue("docLclsfNm", "");
        setValue("docMclsfNm", "");
        setValue("docSclsfNm", "");
        setValue("prvcInclYn", "Y");
        return;
      }

      const binding = TEMP_DOC_CLASSIFICATION_BINDING[docClsfNo];
      setValue("docLclsfNo", binding?.docLclsfNo ?? "", { shouldDirty: true });
      setValue("docMclsfNo", binding?.docMclsfNo ?? "", { shouldDirty: true });
      setValue("docSclsfNo", "", { shouldDirty: true });
      setValue("docLclsfNm", "");
      setValue("docMclsfNm", "");
      setValue("docSclsfNm", "");
      setValue("prvcInclYn", "Y");
    },
    [setValue],
  );

  const handleSave = React.useCallback(
    async (data: DigitalDoc) => {
      setIsLoading(true);
      setIsSubmitting(true);
      try {
        const payload: DigitalDoc = {
          ...data,
          docClsfNo: data.docSclsfNo || data.docMclsfNo || data.docLclsfNo || data.docClsfNo,
          prvcInclYn: "Y",
        };

        await https.post(insertEDocTempApiPath(), payload);
        navigate(URL.DIGITAL_DOC_LIST);
      } catch (e) {
        notifications.show(getErrorMessage(e), {
          severity: "error",
          autoHideDuration: 3000,
        });
      } finally {
        setIsLoading(false);
        setIsSubmitting(false);
      }
    },
    [navigate, notifications],
  );

  if (isLoading) {
    return <PageStatus isLoading={isLoading} />;
  }

  return (
    <form onSubmit={handleSubmit(handleSave)}>
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
            <Controller
              name="docClsfNo"
              control={control}
              rules={{ required: "선택해주세요" }}
              render={({ field, fieldState }) => (
                <FormControl error={!!fieldState.error} size="small">
                  <RadioGroup
                    row
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      void bindClassification(e.target.value);
                    }}
                  >
                    <FormControlLabel
                      value="CLS_A1849DF2"
                      control={<Radio size="small" />}
                      label="접수서류"
                    />
                    <FormControlLabel
                      value="CLS_316D8A68"
                      control={<Radio size="small" />}
                      label="신청자 제출서류"
                    />
                    <FormControlLabel
                      value="CLS_E1ADF348"
                      control={<Radio size="small" />}
                      label="직원 추가 보완자료"
                    />
                    <FormControlLabel
                      value="CLS_EA2D1A21"
                      control={<Radio size="small" />}
                      label="보관서류체크리스트"
                    />
                  </RadioGroup>
                  <FormHelperText>
                    {fieldState.error?.message || ""}
                  </FormHelperText>
                </FormControl>
              )}
            />
          </TableCell>
        </TableRow>

        <TableRow>
          <LabelCell>문서제목</LabelCell>
          <TableCell colSpan={3}>
            <Controller
              name="docTtl"
              control={control}
              rules={{ required: "문서제목은 필수입니다." }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  placeholder="문서제목"
                  {...field}
                  error={!!errors.docTtl}
                  helperText={errors.docTtl?.message}
                />
              )}
            />
          </TableCell>
        </TableRow>

        <TableRow>
          <LabelCell>문서번호</LabelCell>
          <TableCell colSpan={3}>
            <Controller
              name="docNo"
              control={control}
              rules={{ required: "문서번호는 필수입니다." }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  placeholder="문서번호"
                  {...field}
                  error={!!errors.docNo}
                  helperText={errors.docNo?.message}
                />
              )}
            />
          </TableCell>
        </TableRow>

        <TableRow>
          <LabelCell>수집일자</LabelCell>
          <TableCell colSpan={3}>
            <Controller
              name="clctYmd"
              control={control}
              rules={{ required: "수집일자는 필수입니다." }}
              render={({ field }) => (
                <MuiDatePickerFt
                  value={field.value}
                  error={!!errors.clctYmd}
                  helperText={errors.clctYmd?.message}
                  onChange={field.onChange}
                />
              )}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>파일분류</LabelCell>
          <TableCell colSpan={3}>
            <Controller
              name="eldocYn"
              control={control}
              rules={{ required: "선택해주세요" }}
              render={({ field, fieldState }) => (
                <FormControl error={!!fieldState.error} size="small">
                  <RadioGroup row value={field.value} onChange={field.onChange}>
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
                  <FormHelperText>
                    {fieldState.error?.message || ""}
                  </FormHelperText>
                </FormControl>
              )}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>첨부파일</LabelCell>
          <TableCell colSpan={3}>
            <Controller
              name="atchFileSn"
              control={control}
              rules={{
                required: "파일 선택은 필수입니다.",
              }}
              render={({ field }) => (
                <UploadFiles
                  taskSeTrgtId={eldocNo}
                  setGroupId={field.onChange}
                />
              )}
            />
          </TableCell>
        </TableRow>
      </TableWrapper>

      <Stack direction="row" spacing={1} justifyContent="flex-end" mt={2}>
        <Button
          size="large"
          variant="contained"
          onClick={handleBack}
          disabled={isSubmitting}
        >
          취소
        </Button>
        <Button
          loading={isSubmitting ? true : false}
          type="submit"
          size="large"
          variant="outlined"
          disabled={isSubmitting}
        >
          등록
        </Button>
      </Stack>
    </form>
  );
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "object" && error !== null) {
    const message = (error as { response?: { data?: { message?: string; msg?: string } } }).response?.data;
    if (message?.message) return message.message;
    if (message?.msg) return message.msg;
  }
  return "생성 실패";
}
