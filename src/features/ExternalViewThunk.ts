import { createAsyncThunk } from "@reduxjs/toolkit";
import https from "@/api/axiosInstance";
import {
  downloadExternalViewFileApiPath,
  selectExternalViewDetailApiPath,
  selectExternalViewListApiPath,
} from "@/api/externalView/ExternalViewApiPaths";
import {
  externalViewDocumentListSchema,
  externalViewDocumentRowSchema,
} from "./ExternalViewValidator";
import type {
  ExternalViewDocument,
  ExternalViewFilePayload,
  ExternalViewSearchValues,
} from "@/types/externalView";
import type { RootState } from "@/app/store";

export interface ExternalViewListPayload {
  rows: ExternalViewDocument[];
  rowCount: number;
}

const toListParamsKey = (params: Partial<ExternalViewSearchValues> | undefined) =>
  JSON.stringify(params ?? {});

const decodeFileName = (value: string) => {
  try {
    return decodeURIComponent(value.replace(/\+/g, "%20"));
  } catch {
    return value;
  }
};

const getFileNameFromDisposition = (disposition: string | undefined, fallback: string) => {
  if (!disposition) return fallback;

  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeFileName(utf8Match[1]);
  }

  const plainMatch = disposition.match(/filename="?([^"]+)"?/i);
  if (plainMatch?.[1]) {
    return plainMatch[1];
  }

  return fallback;
};

export const fetchExternalViewList = createAsyncThunk<
  ExternalViewListPayload,
  Partial<ExternalViewSearchValues> | undefined,
  { rejectValue: string }
>(
  "externalView/list",
  async (params, { rejectWithValue }) => {
    try {
      const res = await https.get(selectExternalViewListApiPath(), {
        params: {
          ...(params ?? {}),
        },
      });
      const parsed = externalViewDocumentListSchema.safeParse(
        (res as any)?.data?.data ?? (res as any)?.data ?? {},
      );

      if (!parsed.success) {
        return rejectWithValue("외부 문서열람 목록 응답 형식이 올바르지 않습니다.");
      }

      const rows =
        parsed.data.list.length > 0 ? parsed.data.list : parsed.data.rows;
      const rowCount =
        parsed.data.total ?? parsed.data.totalCount ?? parsed.data.rowCount ?? 0;

      return {
        rows: rows as ExternalViewDocument[],
        rowCount,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState;
      const s = state.externalView;
      const nextKey = toListParamsKey(params);
      if (s.loading && s.currentListParamsKey === nextKey) return false;
      return true;
    },
  },
);

export const fetchExternalViewDetail = createAsyncThunk<
  ExternalViewDocument,
  string,
  { rejectValue: string }
>("externalView/detail", async (eldocNo, { rejectWithValue }) => {
  try {
    const res = await https.get(selectExternalViewDetailApiPath(eldocNo));
    const payload = (res as any)?.data?.data ?? (res as any)?.data ?? {};
    const parsed = externalViewDocumentRowSchema.safeParse(payload);

    if (!parsed.success) {
      return rejectWithValue("외부 문서열람 상세 응답 형식이 올바르지 않습니다.");
    }

    return parsed.data as ExternalViewDocument;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchExternalViewFile = createAsyncThunk<
  ExternalViewFilePayload,
  string,
  { rejectValue: string }
>("externalView/file", async (eldocNo, { rejectWithValue }) => {
  try {
    const res = await https.get(downloadExternalViewFileApiPath(eldocNo), {
      responseType: "blob",
    });

    const headers = (res as any)?.headers ?? {};
    const contentDisposition =
      headers["content-disposition"] ?? headers["Content-Disposition"];
    const contentType =
      headers["content-type"] ?? headers["Content-Type"] ?? "application/octet-stream";
    const fileName = getFileNameFromDisposition(
      contentDisposition,
      `document-${eldocNo}`,
    );

    return {
      blob: (res as any).data as Blob,
      contentType: String(contentType),
      fileName,
    };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});
