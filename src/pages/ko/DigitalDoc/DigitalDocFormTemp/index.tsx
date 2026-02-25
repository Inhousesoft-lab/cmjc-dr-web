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
import FileUploadField from "@/components/common/FileUploadField";

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
      docClsfNo: "", // 문서분류번호
      docNo: "", // 문서번호
      docTtl: "", // 문서제목
      clctYmd: "", // 수집일자
      addExpln: "", // 비고
      eldocYn: "", // 전자문서여부
      atchFileSn: "", // 첨부파일경로
    },
  });

  const eldocYn = useWatch({ control, name: "eldocYn" });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileButtonClick = React.useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleBack = React.useCallback(() => {
    navigate(URL.DIGITAL_DOC_LIST);
  }, [navigate]);

  React.useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleSave = React.useCallback(
    async (data: DigitalDoc) => {
      setIsLoading(true);
      setIsSubmitting(true);
      data.atchFileSn = "0";
      try {
        await https.post(insertEDocTempApiPath(), data);
        notifications.show("생성 완료.", {
          severity: "success",
          autoHideDuration: 3000,
        });
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

  // handleFileChange 핸들러 추가 (주석 해제 및 수정)
  const handleFileChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        // 파일명 설정 (atchFileSn 필드에 저장)
        setValue("atchFileSn", file.name);
        // 필요시 파일 객체도 저장하려면 별도 상태 사용
        notifications.show(`${file.name} 파일이 선택되었습니다.`, {
          severity: "info",
          autoHideDuration: 2000,
        });
      }
      // input 리셋 (중복 파일 선택 허용)
      event.target.value = "";
    },
    [setValue, notifications],
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
                  <RadioGroup row value={field.value} onChange={field.onChange}>
                    <FormControlLabel
                      value="MODC2025122900000005"
                      control={<Radio size="small" />}
                      label="접수서류"
                    />
                    <FormControlLabel
                      value="MODC2025122900000006"
                      control={<Radio size="small" />}
                      label="신청자 제출서류"
                    />
                    <FormControlLabel
                      value="MODC2025122900000007"
                      control={<Radio size="small" />}
                      label="직원 추가 보완자료"
                    />
                    <FormControlLabel
                      value="MODC2025122900000008"
                      control={<Radio size="small" />}
                      label="선택4"
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
          <LabelCell>첨부파일</LabelCell>
          <TableCell colSpan={3}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Controller
                name="eldocYn"
                control={control}
                rules={{ required: "선택해주세요" }}
                render={({ field, fieldState }) => (
                  <FormControl error={!!fieldState.error} size="small">
                    <RadioGroup
                      row
                      value={field.value}
                      onChange={field.onChange}
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
                    <FormHelperText>
                      {fieldState.error?.message || ""}
                    </FormHelperText>
                  </FormControl>
                )}
              />

              <Controller
                name="atchFileSn"
                control={control}
                rules={{
                  required: "파일 선택은 필수입니다.",
                }}
                render={({ field }) => (
                  <FileUploadField
                    name={field.name}
                    value={[]} // File[]
                    onChange={handleFileButtonClick}
                  />
                )}
              />
            </Stack>
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
