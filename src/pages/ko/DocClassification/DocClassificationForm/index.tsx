import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Stack,
  TableCell,
  TableRow,
  TextField,
  type SelectChangeEvent,
} from "@mui/material";
import type {
  DocClassDetail,
  DocClassDetailFormState,
} from "@/types/docClassification";
import TableWrapper from "@/components/table/TableWrapper";
import LabelCell from "@/components/table/LabelCell";
import { https } from "@shared/utils/https";
import useNotifications from "@/hooks/useNotifications";
import {
  insertDocClassificationApiPath,
  selectDocClassificationDetailApiPath,
  updateDocClassificationApiPath,
} from "@/api/docClassification/DocClassificationApiPaths";
import { useDocClsfOptions } from "@/hooks/useDocClsfOptions";
import URL from "@/constants/url";
import { docClassificationvalidator } from "@/features/classification/DocClassificationValidator";
import MuiSelect from "@/components/elements/MuiSelect";
import PageStatus from "@/components/common/PageStatus";
import { useAppSelector } from "@/app/hooks";

type Values = DocClassDetailFormState["values"];

const INITIAL_FORM_VALUES: Values = {
  docClsfNo: "",
  docClsfSeCd: "L",
  docClsfNm: "",
  upDocClsfNo: "",
  docLclsfNo: "",
  docMclsfNo: "",
  docSclsfNo: "",
  docLclsfNm: "",
  docMclsfNm: "",
  docSclsfNm: "",
  useEn: "Y",
  rgtrId: "",
  mdfrId: "",
};

export default function DocClassificationForm() {
  const { docClsfNo } = useParams();
  const navigate = useNavigate();
  const notifications = useNotifications();
  const currentUser = useAppSelector((state) => state.auth.user);
  const formRef = React.useRef<HTMLFormElement | null>(null);

  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [defaults, setDefaults] = React.useState<Values>(INITIAL_FORM_VALUES);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [formRenderKey, setFormRenderKey] = React.useState(0);
  const [docClsfSeCd, setDocClsfSeCd] = React.useState<string>("L");

  const { lclsfList, mclsfList } = useDocClsfOptions(
    defaults.docLclsfNo ?? "",
    defaults.docMclsfNo ?? "",
  );

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      if (docClsfNo) {
        const res = await https.get(
          selectDocClassificationDetailApiPath(docClsfNo),
        );
        const viewData = (res.data?.data ?? res.data) as Values;
        setDefaults(viewData);
        setDocClsfSeCd(viewData.docClsfSeCd ?? "L");
      } else {
        setDefaults(INITIAL_FORM_VALUES);
        setDocClsfSeCd("L");
      }

      setFormRenderKey((prev) => prev + 1);
    } catch (e) {
      notifications.show(getErrorMessage(e), {
        severity: "error",
        autoHideDuration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [docClsfNo, notifications]);

  React.useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextType = event.target.value;

    setDocClsfSeCd(nextType);
    setFormErrors({});
    setDefaults((prev) => {
      const next = {
        ...prev,
        docClsfSeCd: nextType,
      };

      if (nextType === "L") {
        next.docLclsfNo = "";
        next.docMclsfNo = "";
        next.docSclsfNo = "";
        next.docMclsfNm = "";
        next.docSclsfNm = "";
      }

      if (nextType === "M") {
        next.docMclsfNo = "";
        next.docSclsfNo = "";
        next.docLclsfNm = "";
        next.docSclsfNm = "";
      }

      if (nextType === "S") {
        next.docSclsfNo = "";
        next.docLclsfNm = "";
        next.docMclsfNm = "";
      }

      return next;
    });
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;

    setDefaults((prev) => {
      const next = { ...prev, [name]: value as string };

      if (name === "docLclsfNo") {
        next.docMclsfNo = "";
        next.docSclsfNo = "";
      }

      return next;
    });
  };

  const handleBack = React.useCallback(() => {
    navigate(URL.DOC_CLASSIFICATION_LIST);
  }, [navigate]);

  const buildPayload = React.useCallback((): Values | null => {
    if (!formRef.current) return null;

    const fd = new FormData(formRef.current);
    const hasField = (key: string) =>
      Boolean(formRef.current?.elements.namedItem(key));
    const getText = (key: string, fallback = "") => {
      if (!hasField(key)) return fallback;
      const value = fd.get(key);
      return typeof value === "string" ? value : fallback;
    };

    let docClsfNm = "";
    let upDocClsfNo: string | null = null;

    switch (docClsfSeCd) {
      case "L":
        docClsfNm = getText("docLclsfNm");
        break;
      case "M":
        docClsfNm = getText("docMclsfNm");
        upDocClsfNo = getText("docLclsfNo");
        break;
      default:
        docClsfNm = getText("docSclsfNm");
        upDocClsfNo = getText("docMclsfNo");
        break;
    }

    return {
      ...defaults,
      docClsfNm,
      upDocClsfNo,
      docClsfSeCd: getText("docClsfSeCd", docClsfSeCd),
      docLclsfNo: getText("docLclsfNo", defaults.docLclsfNo ?? ""),
      docMclsfNo: getText("docMclsfNo", defaults.docMclsfNo ?? ""),
      docSclsfNo: getText("docSclsfNo", defaults.docSclsfNo ?? ""),
      docLclsfNm: getText("docLclsfNm", defaults.docLclsfNm ?? ""),
      docMclsfNm: getText("docMclsfNm", defaults.docMclsfNm ?? ""),
      docSclsfNm: getText("docSclsfNm", defaults.docSclsfNm ?? ""),
      useEn: getText("useEn", defaults.useEn ?? "Y"),
      rgtrId: docClsfNo
        ? defaults.rgtrId ?? ""
        : currentUser?.userId || currentUser?.userNm || "",
      mdfrId: currentUser?.userId || defaults.mdfrId || currentUser?.userNm || "",
    };
  }, [currentUser?.userId, currentUser?.userNm, defaults, docClsfNo, docClsfSeCd]);

  const handleSave = React.useCallback(
    async (payload: Values) => {
      if (docClsfNo) {
        await https.post(updateDocClassificationApiPath(), payload as DocClassDetail);
        notifications.show("수정 완료.", {
          severity: "success",
          autoHideDuration: 3000,
        });
        navigate(URL.DOC_CLASSIFICATION_LIST);
        return;
      }

      if (!payload.rgtrId) {
        notifications.show("등록자 정보가 없습니다. 다시 로그인 후 시도해 주세요.", {
          severity: "error",
          autoHideDuration: 3000,
        });
        return;
      }

      await https.post(
        insertDocClassificationApiPath(),
        payload as Omit<DocClassDetail, "docClsfNo">,
      );
      notifications.show("생성 완료.", {
        severity: "success",
        autoHideDuration: 3000,
      });
      navigate(URL.DOC_CLASSIFICATION_LIST);
    },
    [docClsfNo, navigate, notifications],
  );

  const handleSubmit = React.useCallback(
    async (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      const payload = buildPayload();
      if (!payload) return;

      const { issues } = docClassificationvalidator(payload);
      if (issues.length > 0) {
        setFormErrors(
          Object.fromEntries(
            issues.map((issue) => [issue.path?.[0] ?? "", issue.message]),
          ),
        );
        notifications.show(issues[0]?.message || "입력값을 확인해 주세요.", {
          severity: "error",
          autoHideDuration: 3000,
        });
        return;
      }

      setFormErrors({});
      setIsSubmitting(true);
      try {
        await handleSave(payload);
      } catch (err) {
        notifications.show(`처리 실패. 사유: ${(err as Error).message}`, {
          severity: "error",
          autoHideDuration: 3000,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [buildPayload, handleSave, notifications],
  );

  if (isLoading) {
    return <PageStatus isLoading={isLoading} />;
  }

  return (
    <Box
      key={formRenderKey}
      component="form"
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
    >
      <FormGroup>
        <TableWrapper
          sx={{ mb: 2 }}
          colgroup={
            <colgroup>
              <col className="tbl-col-w-20p" />
              <col />
            </colgroup>
          }
        >
          {!defaults.docClsfNo && (
            <TableRow>
              <LabelCell required>문서분류</LabelCell>
              <TableCell>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    name="docClsfSeCd"
                    value={docClsfSeCd}
                    onChange={handleTypeChange}
                  >
                    <FormControlLabel
                      value="L"
                      control={<Radio size="small" />}
                      label="대분류"
                    />
                    <FormControlLabel
                      value="M"
                      control={<Radio size="small" />}
                      label="중분류"
                    />
                    <FormControlLabel
                      value="S"
                      control={<Radio size="small" />}
                      label="소분류"
                    />
                  </RadioGroup>
                </FormControl>
              </TableCell>
            </TableRow>
          )}

          <TableRow>
            <LabelCell required>대분류</LabelCell>
            <TableCell>
              {docClsfSeCd === "L" ? (
                <TextField
                  name="docLclsfNm"
                  defaultValue={defaults.docLclsfNm ?? ""}
                  placeholder="대분류 메타정보"
                  error={!!formErrors.docLclsfNm}
                  helperText={formErrors.docLclsfNm ?? ""}
                  fullWidth
                />
              ) : (
                <MuiSelect
                  id="docLclsfNo"
                  label="대분류"
                  items={lclsfList}
                  value={defaults.docLclsfNo ?? ""}
                  error={!!formErrors.docLclsfNo}
                  helperText={formErrors.docLclsfNo ?? ""}
                  onChange={handleSelectChange}
                />
              )}
            </TableCell>
          </TableRow>

          {docClsfSeCd !== "L" && (
            <TableRow>
              <LabelCell required>중분류</LabelCell>
              <TableCell>
                {docClsfSeCd === "M" ? (
                  <TextField
                    name="docMclsfNm"
                    defaultValue={defaults.docMclsfNm ?? ""}
                    placeholder="중분류 메타정보"
                    error={!!formErrors.docMclsfNm}
                    helperText={formErrors.docMclsfNm ?? ""}
                    fullWidth
                  />
                ) : (
                  <MuiSelect
                    id="docMclsfNo"
                    items={mclsfList}
                    value={defaults.docMclsfNo ?? ""}
                    error={!!formErrors.docMclsfNo}
                    helperText={formErrors.docMclsfNo ?? ""}
                    onChange={handleSelectChange}
                  />
                )}
              </TableCell>
            </TableRow>
          )}

          {docClsfSeCd === "S" && (
            <TableRow>
              <LabelCell required>소분류</LabelCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <TextField
                    size="small"
                    name="docSclsfNm"
                    defaultValue={defaults.docSclsfNm ?? ""}
                    placeholder="소분류"
                    error={!!formErrors.docSclsfNm}
                    helperText={formErrors.docSclsfNm ?? " "}
                    fullWidth
                  />
                </Stack>
              </TableCell>
            </TableRow>
          )}

          {defaults.docClsfNo && (
            <TableRow>
              <LabelCell>사용여부</LabelCell>
              <TableCell>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    name="useEn"
                    value={defaults.useEn ?? "Y"}
                    onChange={(e) =>
                      setDefaults((prev) => ({
                        ...prev,
                        useEn: e.target.value as "Y" | "N",
                      }))
                    }
                  >
                    <FormControlLabel
                      value="Y"
                      control={<Radio size="small" />}
                      label="사용"
                    />
                    <FormControlLabel
                      value="N"
                      control={<Radio size="small" />}
                      label="사용안함"
                    />
                  </RadioGroup>
                </FormControl>
              </TableCell>
            </TableRow>
          )}
        </TableWrapper>
      </FormGroup>

      <div className="btn_wrapper">
        <Button size="large" variant="contained" onClick={handleBack}>
          취소
        </Button>
        <Button
          type="submit"
          size="large"
          variant="outlined"
          disabled={isSubmitting}
        >
          {docClsfNo ? "수정" : "등록"}
        </Button>
      </div>
    </Box>
  );
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "object" && error !== null) {
    const message = (error as { response?: { data?: { message?: string; msg?: string } } }).response?.data;
    if (message?.message) return message.message;
    if (message?.msg) return message.msg;
  }
  return "조회 실패";
}
