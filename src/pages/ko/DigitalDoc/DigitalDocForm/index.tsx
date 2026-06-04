import {
  Box,
  Button,
  CircularProgress,
  FormLabel,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import {
  AttachFile as AttachFileIcon,
  CloudUpload as CloudUploadIcon,
  DeleteOutline as DeleteOutlineIcon,
} from "@mui/icons-material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
  extractDigitalDocFirstPageOcr,
  fetchDigitalDocDetail,
  updateDigitalDoc,
  type DigitalDocCreatePayload,
} from "@/features/digitalDoc/DigitalDocThunk";
import {
  selectDigitalDocDetail,
  selectDigitalDocDetailError,
  selectDigitalDocDetailLoading,
  selectDigitalDocFirstPageOcrError,
  selectDigitalDocFirstPageOcrLoading,
  selectDigitalDocFirstPageOcrResult,
  selectDigitalDocSaveError,
  selectDigitalDocSaving,
} from "@/features/digitalDoc/DigitalDocSelectors";
import { digitalDocFormValidator } from "@/features/digitalDoc/DigitalDocValidator";
import useNotifications from "@/hooks/useNotifications";
import URL from "@/constants/url";
import { resetDigitalDocSaveState } from "@/features/digitalDoc/DigitalDocSlice";
import { getLangFromPathname, langPath } from "@/routes/lang";
import https from "@/api/axiosInstance";
import { selectArticleFormLabelsApiPath } from "@/api/article/ArticleApiPaths";
import type {
  DigitalDocCustomArticle,
  DigitalDocFirstPageOcrResult,
  SearchValues,
} from "@/types/digitalDoc";

type FormValues = Omit<DigitalDocCreatePayload, "uploadFiles">;
type FieldErrors = Partial<Record<keyof FormValues, string>>;
type TableLabelKey =
  | "docClsf"
  | "docNo"
  | "docTtl"
  | "clctYmd"
  | "endYmd"
  | "addExpln";

type ArticleLabelRow = {
  articleId?: string;
  article_id?: string;
  articleNo?: string;
  article_no?: string;
  articleNm?: string;
  article_nm?: string;
  articleSeq?: number;
  article_seq?: number;
  systemYn?: string;
  system_yn?: string;
  useYn?: string;
  use_yn?: string;
};

type TableLabels = Record<TableLabelKey, string>;
type DynamicArticleField = {
  articleId: string;
  label: string;
  value: string;
};

type ArticleFormLabels = {
  tableLabels: TableLabels;
  dynamicFields: DynamicArticleField[];
};

const TABLE_LABEL_KEYS: TableLabelKey[] = [
  "docClsf",
  "docNo",
  "docTtl",
  "clctYmd",
  "endYmd",
  "addExpln",
];

const DEFAULT_TABLE_LABELS: TableLabels = {
  docClsf: "문서분류",
  docNo: "문서번호",
  docTtl: "문서제목",
  clctYmd: "수집일자",
  endYmd: "종료일자",
  addExpln: "비고",
};

const INITIAL_FORM_VALUES: FormValues = {
  docLclsfNo: "",
  docMclsfNo: "",
  docSclsfNo: "",
  docClsfNo: "",
  docNo: "",
  docTtl: "",
  clctYmd: "",
  endYmd: "",
  addExpln: "",
};

const toDatePickerValue = (value: unknown) => {
  const digits = String(value ?? "").replace(/[^0-9]/g, "");
  return digits.length >= 8 ? digits.slice(0, 8) : "";
};

const normalizeLabel = (value: string) =>
  value.replace(/\s/g, "").toLowerCase();

const getArticleLabelName = (row: ArticleLabelRow) =>
  String(row.articleNm ?? row.article_nm ?? "").trim();

const getArticleLabelId = (row: ArticleLabelRow, index: number) =>
  String(
    row.articleId ??
      row.article_id ??
      row.articleNo ??
      row.article_no ??
      `article-${index}`,
  ).trim();

const getArticleLabelSeq = (row: ArticleLabelRow) => {
  const seq = Number(row.articleSeq ?? row.article_seq ?? 0);
  return Number.isFinite(seq) ? seq : 0;
};

const getArticleSystemYn = (row: ArticleLabelRow) =>
  String(row.systemYn ?? row.system_yn ?? "N").trim().toUpperCase() === "Y"
    ? "Y"
    : "N";

const getArticleUseYn = (row: ArticleLabelRow) =>
  String(row.useYn ?? row.use_yn ?? "Y").trim().toUpperCase() === "N"
    ? "N"
    : "Y";

const extractArticleLabelRows = (payload: unknown): ArticleLabelRow[] => {
  if (Array.isArray(payload)) return payload as ArticleLabelRow[];

  if (payload && typeof payload === "object") {
    const data = payload as Record<string, unknown>;
    if (Array.isArray(data.data)) return data.data as ArticleLabelRow[];
    if (Array.isArray(data.list)) return data.list as ArticleLabelRow[];
    if (Array.isArray(data.rows)) return data.rows as ArticleLabelRow[];
  }

  return [];
};

const buildArticleFormLabels = (rows: ArticleLabelRow[]): ArticleFormLabels => {
  const labels = rows
    .filter((row) => getArticleUseYn(row) === "Y")
    .map((row, index) => ({
      articleId: getArticleLabelId(row, index),
      name: getArticleLabelName(row),
      seq: getArticleLabelSeq(row),
      systemYn: getArticleSystemYn(row),
      index,
    }))
    .filter(({ name }) => !!name && normalizeLabel(name) !== "파일업로드")
    .sort(
      (a, b) =>
        (a.systemYn === "Y" ? 0 : 1) - (b.systemYn === "Y" ? 0 : 1) ||
        a.seq - b.seq ||
        a.index - b.index,
    );

  const systemLabels = labels.filter((label) => label.systemYn === "Y");
  const dynamicFields = labels
    .filter((label) => label.systemYn !== "Y")
    .map((label) => ({
      articleId: label.articleId,
      label: label.name,
      value: "",
    }));

  const tableLabels = TABLE_LABEL_KEYS.reduce<TableLabels>(
    (acc, key, index) => ({
      ...acc,
      [key]: systemLabels[index]?.name || DEFAULT_TABLE_LABELS[key],
    }),
    { ...DEFAULT_TABLE_LABELS },
  );

  return {
    tableLabels,
    dynamicFields,
  };
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function isPdfFile(file: File) {
  return (
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf")
  );
}

const normalizeOcrFieldKey = (key: string) =>
  key.replace(/\s/g, "").toLowerCase();

const getOcrFieldValue = (
  fields: DigitalDocFirstPageOcrResult["fields"] | undefined | null,
  keys: string[],
) => {
  const entries = Object.entries(fields ?? {});
  const normalizedKeys = keys.map(normalizeOcrFieldKey);

  for (const [key, value] of entries) {
    if (!normalizedKeys.includes(normalizeOcrFieldKey(key))) continue;

    const text = String(value ?? "").trim();
    if (text) return text;
  }

  return "";
};

const normalizeDateParts = (
  yearValue: string,
  monthValue: string,
  dayValue: string,
) => {
  const year = yearValue.length === 2 ? `20${yearValue}` : yearValue;
  const month = monthValue.padStart(2, "0");
  const day = dayValue.padStart(2, "0");

  if (!/^\d{4}$/.test(year) || !/^\d{2}$/.test(month) || !/^\d{2}$/.test(day)) {
    return "";
  }

  const y = Number(year);
  const m = Number(month);
  const d = Number(day);
  const date = new Date(Date.UTC(y, m - 1, d));

  if (
    date.getUTCFullYear() !== y ||
    date.getUTCMonth() !== m - 1 ||
    date.getUTCDate() !== d
  ) {
    return "";
  }

  return `${year}${month}${day}`;
};

const normalizeOcrDate = (value: string) => {
  const raw = value.trim();
  if (!raw) return "";

  const parts = raw.match(/\d+/g) ?? [];
  if (parts.length >= 3) {
    return normalizeDateParts(parts[0]!, parts[1]!, parts[2]!);
  }

  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.length >= 8) {
    return normalizeDateParts(
      digits.slice(0, 4),
      digits.slice(4, 6),
      digits.slice(6, 8),
    );
  }

  if (digits.length === 6) {
    return normalizeDateParts(
      digits.slice(0, 2),
      digits.slice(2, 4),
      digits.slice(4, 6),
    );
  }

  return "";
};

const getFirstPageOcrFormValues = (
  result: DigitalDocFirstPageOcrResult,
  tableLabels: TableLabels,
): Partial<FormValues> => {
  const docNo = getOcrFieldValue(result.fields, [
    tableLabels.docNo,
    "문서번호",
    "docNo",
    "doc_no",
  ]);
  const docTtl = getOcrFieldValue(result.fields, [
    tableLabels.docTtl,
    "문서제목",
    "문서명",
    "docTtl",
    "docTitle",
    "doc_ttl",
  ]);
  const clctYmd = normalizeOcrDate(
    getOcrFieldValue(result.fields, [
      tableLabels.clctYmd,
      "수집일자",
      "수집일",
      "clctYmd",
      "collectDate",
      "collectionDate",
    ]),
  );
  const endYmd = normalizeOcrDate(
    getOcrFieldValue(result.fields, [
      tableLabels.endYmd,
      "종료일자",
      "종료일",
      "endYmd",
      "endDate",
    ]),
  );
  const addExpln = getOcrFieldValue(result.fields, [
    tableLabels.addExpln,
    "비고",
    "addExpln",
    "remark",
    "remarks",
    "note",
  ]);

  return Object.fromEntries(
    Object.entries({
      docNo,
      docTtl,
      clctYmd,
      endYmd,
      addExpln,
    }).filter(([, value]) => !!value),
  ) as Partial<FormValues>;
};

const getFirstPageOcrDynamicArticleValues = (
  result: DigitalDocFirstPageOcrResult,
  fields: DynamicArticleField[],
) => {
  const values = new Map<string, string>();

  fields.forEach((field) => {
    const value = getOcrFieldValue(result.fields, [field.label, field.articleId]);
    if (value) {
      values.set(field.articleId, value);
    }
  });

  return values;
};

const getUploadFileKey = (file: File) =>
  `${file.name}:${file.size}:${file.lastModified}`;

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
  const firstPageOcrResult = useAppSelector(selectDigitalDocFirstPageOcrResult);
  const firstPageOcrLoading = useAppSelector(selectDigitalDocFirstPageOcrLoading);
  const firstPageOcrError = useAppSelector(selectDigitalDocFirstPageOcrError);

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
  const [tableLabels, setTableLabels] =
    React.useState<TableLabels>(DEFAULT_TABLE_LABELS);
  const [dynamicArticleFields, setDynamicArticleFields] = React.useState<
    DynamicArticleField[]
  >([]);
  const [isFileDragging, setIsFileDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const fileDragDepthRef = React.useRef(0);
  const customArticleHydratedKeyRef = React.useRef("");
  const lastOcrFileKeyRef = React.useRef("");
  const appliedOcrKeyRef = React.useRef("");

  const { lclsfList, mclsfList, sclsfList } = useDocClsfOptions(
    values.docLclsfNo,
    values.docMclsfNo,
  );
  const dynamicArticleLabelKey = React.useMemo(
    () =>
      dynamicArticleFields
        .map((field) => `${field.articleId}:${field.label}`)
        .join("|"),
    [dynamicArticleFields],
  );

  React.useEffect(() => {
    let active = true;

    https
      .get(selectArticleFormLabelsApiPath())
      .then((res) => {
        if (!active) return;
        const payload = (res as any)?.data?.data ?? (res as any)?.data ?? [];
        const labels = buildArticleFormLabels(extractArticleLabelRows(payload));
        setTableLabels(labels.tableLabels);
        setDynamicArticleFields((prev) =>
          labels.dynamicFields.map((field) => ({
            ...field,
            value:
              prev.find((saved) => saved.articleId === field.articleId)
                ?.value ?? "",
          })),
        );
      })
      .catch(() => {
        if (!active) return;
        setTableLabels(DEFAULT_TABLE_LABELS);
        setDynamicArticleFields([]);
      });

    return () => {
      active = false;
    };
  }, []);

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
    if (!firstPageOcrError) return;
    notifications.show(firstPageOcrError, {
      severity: "error",
      autoHideDuration: 3000,
    });
  }, [firstPageOcrError, notifications]);

  React.useEffect(() => {
    if (
      !firstPageOcrResult ||
      !firstPageOcrResult.success ||
      firstPageOcrResult.skipped
    ) {
      return;
    }

    const applyKey = JSON.stringify({
      filename: firstPageOcrResult.filename ?? "",
      fields: firstPageOcrResult.fields ?? {},
      tableLabels,
      dynamicArticleLabelKey,
    });
    if (appliedOcrKeyRef.current === applyKey) {
      return;
    }

    const nextValues = getFirstPageOcrFormValues(firstPageOcrResult, tableLabels);
    const nextDynamicValues = getFirstPageOcrDynamicArticleValues(
      firstPageOcrResult,
      dynamicArticleFields,
    );
    const populatedFields = Object.keys(nextValues) as (keyof FormValues)[];

    if (populatedFields.length === 0 && nextDynamicValues.size === 0) return;
    appliedOcrKeyRef.current = applyKey;

    if (populatedFields.length > 0) {
      setValues((prev) => ({ ...prev, ...nextValues }));
      setErrors((prev) => {
        const next = { ...prev };
        populatedFields.forEach((key) => {
          next[key] = undefined;
        });
        return next;
      });
    }

    if (nextDynamicValues.size > 0) {
      setDynamicArticleFields((prev) =>
        prev.map((field) =>
          nextDynamicValues.has(field.articleId)
            ? { ...field, value: nextDynamicValues.get(field.articleId) ?? "" }
            : field,
        ),
      );
    }
  }, [dynamicArticleFields, dynamicArticleLabelKey, firstPageOcrResult, tableLabels]);

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
      endYmd: toDatePickerValue(detail.endYmd),
      addExpln: detail.addExpln ?? "",
    });
    setUploadFiles([]);
    setErrors({});
    customArticleHydratedKeyRef.current = "";
  }, [detail, eldocNo, isModify]);

  React.useEffect(() => {
    if (
      !isModify ||
      !detail ||
      detail.eldocNo !== eldocNo ||
      dynamicArticleFields.length === 0
    ) {
      return;
    }

    const hydrateKey = `${detail.eldocNo}:${dynamicArticleFields
      .map((field) => field.articleId)
      .join(",")}`;
    if (customArticleHydratedKeyRef.current === hydrateKey) {
      return;
    }

    setDynamicArticleFields((prev) =>
      prev.map((field) => {
        const saved = detail.customArticles?.find(
          (article) => article.articleId === field.articleId,
        );
        return saved ? { ...field, value: saved.articleCn ?? "" } : field;
      }),
    );
    customArticleHydratedKeyRef.current = hydrateKey;
  }, [detail, dynamicArticleFields, eldocNo, isModify]);

  const handleFieldChange = <K extends keyof FormValues>(
    key: K,
    value: FormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleDynamicArticleFieldChange = (
    articleId: string,
    value: string,
  ) => {
    setDynamicArticleFields((prev) =>
      prev.map((field) =>
        field.articleId === articleId ? { ...field, value } : field,
      ),
    );
  };

  const getCustomArticlePayload = (): DigitalDocCustomArticle[] =>
    dynamicArticleFields
      .map((field) => ({
        articleId: field.articleId,
        articleNm: field.label,
        articleCn: field.value.trim(),
      }))
      .filter((field) => field.articleId && field.articleCn);

  const appendUploadFiles = (files: FileList | File[] | null) => {
    const selectedFiles = Array.from(files ?? []).filter(
      (file) => file instanceof File,
    );

    if (selectedFiles.length > 0) {
      const firstPdf = selectedFiles.find(isPdfFile);
      if (firstPdf) {
        const ocrFileKey = getUploadFileKey(firstPdf);
        if (lastOcrFileKeyRef.current !== ocrFileKey) {
          lastOcrFileKeyRef.current = ocrFileKey;
          dispatch(extractDigitalDocFirstPageOcr(firstPdf));
        }
      }
      setUploadFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    appendUploadFiles(e.target.files);
    e.target.value = "";
  };

  const getDroppedFiles = (dataTransfer: DataTransfer) => {
    const itemFiles = Array.from(dataTransfer.items ?? [])
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile())
      .filter((file): file is File => !!file);

    return itemFiles.length > 0
      ? itemFiles
      : Array.from(dataTransfer.files ?? []);
  };

  const handleFileDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    fileDragDepthRef.current += 1;
    event.dataTransfer.dropEffect = saving ? "none" : "copy";

    if (!saving) {
      setIsFileDragging(true);
    }
  };

  const handleFileDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    fileDragDepthRef.current = Math.max(fileDragDepthRef.current - 1, 0);
    if (fileDragDepthRef.current === 0) {
      setIsFileDragging(false);
    }
  };

  const handleFileDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = saving ? "none" : "copy";
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    fileDragDepthRef.current = 0;
    setIsFileDragging(false);

    if (saving) return;

    appendUploadFiles(getDroppedFiles(event.dataTransfer));
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

    const formPayload: FormValues = {
      ...values,
      docClsfNo: values.docSclsfNo || values.docMclsfNo || values.docLclsfNo,
      customArticles: getCustomArticlePayload(),
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
            endYmd: formPayload.endYmd,
            addExpln: formPayload.addExpln,
            customArticles: formPayload.customArticles,
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

  const fileUploadRow = (
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
                allowDelete
                requireDownloadReason
              />
            </Box>
          )}
          <Box
            role="button"
            tabIndex={saving ? -1 : 0}
            aria-label="파일 드래그 앤 드롭 또는 클릭하여 업로드"
            aria-disabled={saving}
            className={[
              "upload-container",
              isFileDragging ? "is-dragging" : "",
              saving ? "is-disabled" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onDragEnter={handleFileDragEnter}
            onDragOver={handleFileDragOver}
            onDragLeave={handleFileDragLeave}
            onDrop={handleFileDrop}
            onClick={() => {
              if (saving) return;
              fileInputRef.current?.click();
            }}
            onKeyDown={(event) => {
              if (event.key !== "Enter" && event.key !== " ") return;
              event.preventDefault();
              if (saving) return;
              fileInputRef.current?.click();
            }}
            sx={(theme) => ({
              minHeight: 164,
              "--upload-border-color": isFileDragging
                ? theme.palette.primary.main
                : theme.palette.grey[300],
              "--upload-background-color": isFileDragging
                ? theme.palette.action.hover
                : theme.palette.background.paper,
              "--upload-hover-border-color": theme.palette.primary.main,
              "--upload-hover-background-color": theme.palette.action.hover,
            })}
          >
            <CloudUploadIcon
              sx={{ fontSize: 64, color: "primary.main", mb: 2 }}
            />
            <Typography variant="h6" gutterBottom>
              {isFileDragging
                ? "여기에 파일을 놓아 업로드"
                : "클릭하거나 파일을 드래그하여 업로드"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              여러 파일을 선택할 수 있습니다
            </Typography>
            {firstPageOcrLoading && (
              <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                <CircularProgress size={16} />
                <Typography variant="caption" color="text.secondary">
                  OCR 추출 중...
                </Typography>
              </Stack>
            )}
            {uploadFiles.length > 0 && (
              <Typography variant="caption" color="text.secondary" mt={0.75}>
                {uploadFiles.length}개 파일
              </Typography>
            )}
            <input
              ref={fileInputRef}
              hidden
              type="file"
              multiple
              onChange={handleFileInputChange}
              disabled={saving}
            />
          </Box>
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
  );

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
        {fileUploadRow}
        <TableRow>
          <LabelCell required>{tableLabels.docClsf}</LabelCell>
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
          <LabelCell required>{tableLabels.docNo}</LabelCell>
          <TableCell colSpan={3}>
            <TextField
              fullWidth
              id="docNo"
              name="docNo"
              value={values.docNo}
              onChange={(e) => handleFieldChange("docNo", e.target.value)}
              placeholder={tableLabels.docNo}
              size="small"
              error={!!errors.docNo}
              helperText={errors.docNo || ""}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <LabelCell required>{tableLabels.docTtl}</LabelCell>
          <TableCell colSpan={3}>
            <TextField
              hiddenLabel
              fullWidth
              id="docTtl"
              name="docTtl"
              value={values.docTtl}
              onChange={(e) => handleFieldChange("docTtl", e.target.value)}
              placeholder={tableLabels.docTtl}
              size="small"
              error={!!errors.docTtl}
              helperText={errors.docTtl || ""}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <LabelCell required>{tableLabels.clctYmd}</LabelCell>
          <TableCell>
            <MuiDatePickerFt
              name="clctYmd"
              value={values.clctYmd}
              onChange={(value) => handleFieldChange("clctYmd", value)}
              error={!!errors.clctYmd}
              helperText={errors.clctYmd || ""}
            />
          </TableCell>
          <LabelCell required>{tableLabels.endYmd}</LabelCell>
          <TableCell>
            <MuiDatePickerFt
              name="endYmd"
              value={values.endYmd}
              onChange={(value) => handleFieldChange("endYmd", value)}
              error={!!errors.endYmd}
              helperText={errors.endYmd || ""}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>{tableLabels.addExpln}</LabelCell>
          <TableCell colSpan={3}>
            <TextField
              fullWidth
              id="addExpln"
              name="addExpln"
              value={values.addExpln}
              onChange={(e) => handleFieldChange("addExpln", e.target.value)}
              placeholder={tableLabels.addExpln}
              multiline
              minRows={3}
              size="small"
            />
          </TableCell>
        </TableRow>
        {dynamicArticleFields.map((field) => (
          <TableRow key={field.articleId}>
            <LabelCell>{field.label}</LabelCell>
            <TableCell colSpan={3}>
              <TextField
                fullWidth
                id={`article-${field.articleId}`}
                name={`article-${field.articleId}`}
                value={field.value}
                onChange={(e) =>
                  handleDynamicArticleFieldChange(
                    field.articleId,
                    e.target.value,
                  )
                }
                placeholder={field.label}
                size="small"
              />
            </TableCell>
          </TableRow>
        ))}
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
