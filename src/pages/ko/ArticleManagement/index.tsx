import React from "react";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { Navigate, useLocation } from "react-router-dom";
import https from "@/api/axiosInstance";
import {
  createArticleApiPath,
  selectArticleListApiPath,
  updateArticleApiPath,
} from "@/api/article/ArticleApiPaths";
import AdminTabs from "@/components/common/AdminTabs";
import { useAppSelector } from "@/app/hooks";
import { isDrAdminUser } from "@/features/auth/authAccess";
import { getLangFromPathname } from "@/routes/lang";
import useNotifications from "@/hooks/useNotifications";
import type { ArticleRow, ArticleSystemYn, ArticleUseYn } from "@/types/article";
import { getErrorMessage } from "@/utils/globalFunc";

const LIST_KEYS = ["list", "rows", "items", "content"] as const;
const USE_OPTIONS: { value: ArticleUseYn; label: string }[] = [
  { value: "Y", label: "사용" },
  { value: "N", label: "사용안함" },
];

const toStr = (value: unknown) => (value == null ? "" : String(value));

const isRecord = (value: unknown): value is Record<string, any> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

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

const normalizeUseYn = (value: unknown): ArticleUseYn => {
  const normalized = toStr(value).trim().toUpperCase();
  return normalized === "N" ? "N" : "Y";
};

const normalizeSystemYn = (value: unknown): ArticleSystemYn => {
  const normalized = toStr(value).trim().toUpperCase();
  return normalized === "Y" ? "Y" : "N";
};

const isSystemRow = (row: ArticleRow) => row.systemYn === "Y";

const toPositiveNumber = (value: unknown, fallback: number) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback;
};

const compactPayload = (payload: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  );

const buildArticlePayload = (row: ArticleRow) => {
  const articleNo = row.articleNo.trim() || undefined;
  const articleNm = row.articleNm.trim();
  const articleSeq = Number(row.articleSeq);
  const useEn = row.useYn;

  return compactPayload({
    articleNo,
    article_no: articleNo,
    articleNm,
    article_nm: articleNm,
    articleSeq: isSystemRow(row) ? undefined : articleSeq,
    article_seq: isSystemRow(row) ? undefined : articleSeq,
    useEn,
    use_en: useEn,
    useYn: useEn,
    use_yn: useEn,
    systemYn: row.systemYn,
    system_yn: row.systemYn,
  });
};

const normalizeRows = (payload: any): ArticleRow[] =>
  pickArray(payload)
    .map((item, index) => {
      const articleNo = toStr(
        item?.articleNo ??
          item?.article_no ??
          item?.articleId ??
          item?.article_id ??
          item?.artclNo ??
          item?.artcl_no ??
          item?.artclId ??
          item?.artcl_id ??
          item?.itemNo ??
          item?.item_no ??
          item?.id,
      );
      const articleSeq = toPositiveNumber(
        item?.articleSeq ??
          item?.article_seq ??
          item?.sortSeq ??
          item?.sort_seq ??
          item?.sortSn ??
          item?.sort_sn ??
          item?.sortOrdr ??
          item?.sort_ordr ??
          item?.ordr,
        index + 1,
      );
      const systemYn = normalizeSystemYn(
        item?.systemYn ?? item?.system_yn ?? item?.sysYn ?? item?.sys_yn,
      );

      return {
        clientId: articleNo ? `article-${articleNo}` : `article-row-${index}`,
        articleNo,
        articleNm: toStr(
          item?.articleNm ??
            item?.article_nm ??
            item?.artclNm ??
            item?.artcl_nm ??
            item?.articleName ??
            item?.name,
        ),
        articleSeq,
        useYn: normalizeUseYn(item?.useYn ?? item?.use_yn ?? item?.useEn ?? item?.use_en),
        systemYn,
        isNew: false,
        isDirty: false,
      };
    })
    .sort((a, b) => {
      if (isSystemRow(a) !== isSystemRow(b)) {
        return isSystemRow(a) ? -1 : 1;
      }

      return a.articleSeq - b.articleSeq;
    });

const getOrderOptions = (rows: ArticleRow[]) => {
  const maxOrder = Math.max(
    10,
    rows.length + 5,
    ...rows.map((row) => row.articleSeq),
  );
  return Array.from({ length: maxOrder }, (_, index) => index + 1);
};

export default function ArticleManagement() {
  const location = useLocation();
  const notifications = useNotifications();
  const user = useAppSelector((state) => state.auth.user);
  const lang = getLangFromPathname(location.pathname);
  const [rows, setRows] = React.useState<ArticleRow[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const fetchRows = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await https.get(selectArticleListApiPath(), {
        params: {
          pageNum: 1,
          pageSize: 1000,
        },
      });
      setRows(normalizeRows((res as any)?.data ?? {}));
    } catch (error) {
      notifications.show(getErrorMessage(error), {
        severity: "error",
        autoHideDuration: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [notifications]);

  React.useEffect(() => {
    if (!isDrAdminUser(user)) return;
    fetchRows();
  }, [fetchRows, user]);

  if (!isDrAdminUser(user)) {
    return <Navigate to={`/${lang}`} replace />;
  }

  const hasDirtyRows = rows.some((row) => row.isNew || row.isDirty);
  const orderOptions = getOrderOptions(rows);

  const handleAdd = () => {
    const editableRows = rows.filter((row) => !isSystemRow(row));
    const nextArticleSeq =
      editableRows.length === 0
        ? 1
        : Math.max(...editableRows.map((row) => row.articleSeq)) + 1;

    setRows((prev) => [
      ...prev,
      {
        clientId: `new-${Date.now()}`,
        articleNo: "",
        articleNm: "",
        articleSeq: nextArticleSeq,
        useYn: "Y",
        systemYn: "N",
        isNew: true,
        isDirty: true,
      },
    ]);
  };

  const updateRow = <K extends keyof ArticleRow>(
    clientId: string,
    field: K,
    value: ArticleRow[K],
  ) => {
    setRows((prev) =>
      prev.map((row) =>
        row.clientId === clientId
          ? { ...row, [field]: value, isDirty: true }
          : row,
      ),
    );
  };

  const validateRows = () => {
    const changedRows = rows.filter((row) => row.isNew || row.isDirty);

    if (changedRows.length === 0) {
      notifications.show("저장할 변경사항이 없습니다.", {
        severity: "info",
        autoHideDuration: 2500,
      });
      return false;
    }

    const invalidName = rows.some((row) => !row.articleNm.trim());
    if (invalidName) {
      notifications.show("항목명을 입력해 주세요.", {
        severity: "warning",
        autoHideDuration: 2500,
      });
      return false;
    }

    const editableRows = rows.filter((row) => !isSystemRow(row));
    const invalidOrder = editableRows.some(
      (row) =>
        !Number.isFinite(Number(row.articleSeq)) || Number(row.articleSeq) <= 0,
    );
    if (invalidOrder) {
      notifications.show("순서를 선택해 주세요.", {
        severity: "warning",
        autoHideDuration: 2500,
      });
      return false;
    }

    const orderSet = new Set(editableRows.map((row) => Number(row.articleSeq)));
    if (orderSet.size !== editableRows.length) {
      notifications.show("순서는 중복될 수 없습니다.", {
        severity: "warning",
        autoHideDuration: 2500,
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateRows()) return;

    const changedRows = rows.filter((row) => row.isNew || row.isDirty);
    const missingArticleNoRows = changedRows.filter(
      (row) => !row.isNew && !row.articleNo.trim(),
    );

    if (missingArticleNoRows.length > 0) {
      notifications.show("항목 번호가 없어 수정할 수 없습니다.", {
        severity: "error",
        autoHideDuration: 3000,
      });
      return;
    }

    setSaving(true);
    try {
      await Promise.all(
        changedRows.map((row) => {
          const payload = buildArticlePayload(row);

          if (row.articleNo && !row.isNew) {
            return https.put(updateArticleApiPath(row.articleNo), payload);
          }

          return https.post(createArticleApiPath(), payload);
        }),
      );

      notifications.show("저장되었습니다.", {
        severity: "success",
        autoHideDuration: 2500,
      });
      await fetchRows();
    } catch (error) {
      notifications.show(getErrorMessage(error), {
        severity: "error",
        autoHideDuration: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="article-management">
      <AdminTabs />

      <Stack
        direction="row"
        spacing={1}
        justifyContent="flex-end"
        className="article-management__toolbar"
      >
        <Button
          type="button"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          disabled={loading || saving}
        >
          추가
        </Button>
        <Button
          type="button"
          variant="contained"
          color="secondary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={loading || saving || !hasDirtyRows}
        >
          저장
        </Button>
      </Stack>

      <TableContainer component={Paper} className="article-management__table">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width="48%">항목명</TableCell>
              <TableCell width="22%">순서</TableCell>
              <TableCell width="30%">사용여부</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Box className="article-management__loading">
                    <CircularProgress size={28} />
                  </Box>
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="article-management__empty">
                  조회된 항목이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.clientId}
                  className={
                    isSystemRow(row) ? "article-management__row--system" : undefined
                  }
                >
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      value={row.articleNm}
                      placeholder="항목명"
                      disabled={isSystemRow(row)}
                      onChange={(event) =>
                        updateRow(row.clientId, "articleNm", event.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      fullWidth
                      size="small"
                      value={String(row.articleSeq)}
                      disabled={isSystemRow(row)}
                      onChange={(event: SelectChangeEvent) =>
                        updateRow(
                          row.clientId,
                          "articleSeq",
                          Number(event.target.value),
                        )
                      }
                    >
                      {orderOptions.map((option) => (
                        <MenuItem key={option} value={String(option)}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      fullWidth
                      size="small"
                      value={row.useYn}
                      disabled={isSystemRow(row)}
                      onChange={(event: SelectChangeEvent) =>
                        updateRow(
                          row.clientId,
                          "useYn",
                          event.target.value as ArticleUseYn,
                        )
                      }
                    >
                      {USE_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
