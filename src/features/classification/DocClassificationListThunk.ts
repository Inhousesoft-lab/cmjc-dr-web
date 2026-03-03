import { createAsyncThunk } from "@reduxjs/toolkit";
import https from "@/api/axiosInstance";
import { selectDocClassificationListApiPath } from "@/api/docClassification/DocClassificationApiPaths";
import { z } from "zod";
import type {
  DocClassificationSearch,
  DocClassificationVO,
} from "@/types/docClassification";

export interface DocClassificationListPayload {
  rows: DocClassificationVO[];
  rowCount: number;
}

const stringField = z.preprocess((v) => (v == null ? "" : String(v)), z.string());

const docClassificationRowSchema = z.looseObject({
    rowNo: z
      .preprocess((v) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
      }, z.number())
      .optional()
      .default(0),
    docClsfNo: stringField,
    docClsfSeCd: stringField,
    docClsfNm: stringField,
    upDocClsfNo: stringField,
    docLclsfNo: stringField,
    docMclsfNo: stringField,
    docSclsfNo: stringField,
    docLclsfNm: stringField,
    docMclsfNm: stringField,
    docSclsfNm: stringField,
    prvcInclYn: stringField,
    useEn: stringField,
    regDt: stringField,
    rgtrId: stringField,
    mdfcnDt: stringField,
    mdfrId: stringField,
  });

const docClassificationListSchema = z.looseObject({
    list: z.array(docClassificationRowSchema).optional().default([]),
    total: z
      .preprocess((v) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
      }, z.number())
      .optional()
      .default(0),
  });

export const fetchDocClassificationList = createAsyncThunk<
  DocClassificationListPayload,
  DocClassificationSearch | undefined,
  { rejectValue: string }
>("docClassification/list", async (params, { rejectWithValue }) => {
  try {
    const requestParams = {
      ...(params ?? {}),
    };

    const res = await https.get(selectDocClassificationListApiPath(), {
      params: requestParams,
    });

    const parsed = docClassificationListSchema.safeParse(
      (res as any)?.data?.data ?? (res as any)?.data ?? {},
    );

    if (!parsed.success) {
      return rejectWithValue("문서분류 목록 응답 형식이 올바르지 않습니다.");
    }

    return {
      rows: parsed.data.list as DocClassificationVO[],
      rowCount: parsed.data.total,
    };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});
