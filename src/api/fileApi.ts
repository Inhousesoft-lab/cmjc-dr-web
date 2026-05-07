import https from "@/api/axiosInstance";
import apiClient, { resolveApiUrl, resolveFallbackApiUrl } from "./ApiClient";

export interface ApiResponse<T> {
  code: string;
  message?: string;
  data: T;
}

export interface FileItem {
  check?: false;
  id?: number;
  atchFileDtlSn?: number;
  atchFileId?: string;
  taskSeTrgtId: string;
  atchFileGroupId: string;
  fileNm?: string;
  srvrFileNm?: string;
  filePath?: string;
  fileSize?: number;
  fileSz?: number;
  uploadDate?: string;
  regDt?: string;
  [key: string]: any;
}

export interface UploadFileRequest {
  savePath: string;
  atchFileGroupId: string;
  taskSeTrgtId?: string;
  eldocNo?: string;
  isExcel: string;
  uploadFiles: File[];
}

export interface FileGroupInsertRequest {
  taskSeCd: string;
  atchFileGroupId: string;
  menuSn: number;
}

export interface FileGroupDataRequest {
  taskSeCd: string;
  menuSn: number;
  taskSeTrgtId?: string;
}

export interface FileGroupInsertResponse {
  taskSeCd: string;
  atchFileGroupId: string;
  taskSeTrgtId: string;
}

export interface FileGroupDeleteRequest {
  atchFileGroupId: string;
  taskSeCd: string;
  taskSeTrgtId?: string;
}

export interface FileDeleteRequest {
  atchFileGroupId: string;
  atchFileId: string;
}

export interface FileSelectDeleteRequest {
  atchFileGroupId: string;
  fileIds: string[];
}

export interface FileDeleteResponse {
  fileGroupId?: string;
  totalCount?: number;
  successCount?: number;
  failCount?: number;
  deletedFileIds?: number[];
}

export interface FileGroupApiResponse {
  atchFileGroupId: string;
  code?: string;
  msg?: string;
}

export interface FileGroupData {
  atchFileGroupId: number | string;
}

export interface FileListRequest {
  taskSeCd: string;
  menuSn: number;
  atchFileGroupId: string;
  taskSeTrgtId?: string;
}

export interface DownloadStreamOptions {
  eldocNo?: string;
  reason?: string;
}

export interface BlobFetchResult {
  blob: Blob;
  clientIp?: string;
}

const buildDownloadStreamPath = (
  file: Pick<FileItem, "srvrFileNm" | "fileNm">,
  options?: DownloadStreamOptions,
) => {
  const params = new URLSearchParams({
    filename: file.srvrFileNm || "",
    originalName: file.fileNm || "",
  });

  if (options?.eldocNo) {
    params.set("eldocNo", options.eldocNo);
  }

  if (options?.reason) {
    params.set("reason", options.reason);
  }

  return `/api/dr/file/downloadStream?${params.toString()}`;
};

const normalizeBlobResponse = (response: any) => {
  if (response instanceof Blob) {
    return response;
  }
  if (response?.data instanceof Blob) {
    return response.data;
  }
  return new Blob([response as any]);
};

const unwrapApiClientPayload = <T = any>(response: any): T => {
  if (response && typeof response === "object" && "data" in response) {
    return response.data as T;
  }

  return response as T;
};

const FILE_URL_PROBE_TIMEOUT_MS = 2000;

const probeDownloadUrl = async (url: string): Promise<string> => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    FILE_URL_PROBE_TIMEOUT_MS,
  );

  try {
    const response = await fetch(url, {
      method: "HEAD",
      credentials: "include",
      signal: controller.signal,
    });

    if (response.ok || response.status === 405 || response.status === 501) {
      return url;
    }

    throw new Error(`HEAD probe failed: ${response.status}`);
  } finally {
    window.clearTimeout(timeoutId);
  }
};

const resolvePreferredDownloadUrl = async (
  urls: string[],
): Promise<string | null> => {
  if (urls.length <= 1) {
    return urls[0] ?? null;
  }

  try {
    const preferredUrl = await Promise.any(
      urls.map((url) => probeDownloadUrl(url)),
    );

    return preferredUrl;
  } catch (error) {
    return null;
  }
};

export const FileApi = {
  getFileList: async (request: FileListRequest): Promise<FileItem[]> => {
    const response = await apiClient.post("/api/dr/file/list", request);
    const responseData = unwrapApiClientPayload<any>(response);

    if (responseData?.list && Array.isArray(responseData.list)) {
      return responseData.list;
    }

    if (Array.isArray(responseData)) {
      return responseData;
    }

    if (responseData?.data?.list && Array.isArray(responseData.data.list)) {
      return responseData.data.list;
    }

    if (Array.isArray(responseData?.data)) {
      return responseData.data;
    }

    return [];
  },

  uploadFile: async (request: UploadFileRequest) => {
    const formData = new FormData();
    formData.append("savePath", request.savePath);
    formData.append("atchFileGroupId", request.atchFileGroupId);
    if (request.taskSeTrgtId) {
      formData.append("taskSeTrgtId", request.taskSeTrgtId);
    }
    if (request.eldocNo) {
      formData.append("eldocNo", request.eldocNo);
    }
    formData.append("isExcel", request.isExcel);
    request.uploadFiles.forEach((file) => {
      formData.append("uploadFiles", file);
    });
    return await apiClient.post("/api/dr/file/uploadFiles", formData);
  },

  groupFilesDelete: async (
    request: FileGroupDeleteRequest,
  ): Promise<FileDeleteResponse> => {
    const response = await apiClient.post<FileDeleteResponse>(
      "/api/dr/file/deleteGroupFiles",
      request,
    );
    return (unwrapApiClientPayload<FileDeleteResponse>(response) ??
      {}) as FileDeleteResponse;
  },

  selectDelete: async (
    request: FileSelectDeleteRequest,
  ): Promise<FileDeleteResponse> => {
    const response = await apiClient.post<FileDeleteResponse>(
      "/api/dr/file/deleteMultiFile",
      request,
    );
    return (unwrapApiClientPayload<FileDeleteResponse>(response) ??
      {}) as FileDeleteResponse;
  },

  fileDelete: async (
    request: FileDeleteRequest,
  ): Promise<FileDeleteResponse> => {
    const response = await apiClient.post<FileDeleteResponse>(
      "/api/dr/file/deleteFileOne",
      request,
    );
    return (unwrapApiClientPayload<FileDeleteResponse>(response) ??
      {}) as FileDeleteResponse;
  },

  getFileGroupData: async (request: FileGroupDataRequest): Promise<string> => {
    try {
      const response = await apiClient.post("/api/dr/file/groupData", request);
      const responseData = unwrapApiClientPayload<any>(response);
      const atchFileGroupId =
        responseData?.atchFileGroupId ||
        responseData?.data?.atchFileGroupId ||
        "";
      return String(atchFileGroupId.toString());
    } catch (err) {
      console.error("[getFileGroupData] error:", err);
      return "";
    }
  },

  insertFileGroup: async (
    request: FileGroupInsertRequest,
  ): Promise<FileGroupInsertResponse> => {
    const response = await apiClient.post("/api/dr/file/groupInsert", request);
    return (unwrapApiClientPayload<FileGroupInsertResponse>(response) ??
      {}) as FileGroupInsertResponse;
  },

  downloadFileWithReason: async (
    filename: string,
    reason: string,
  ): Promise<void> => {
    const response = await apiClient.post(
      "/api/dr/file/download-reason",
      null,
      {
        params: {
          filename,
          reason,
        },
        responseType: "blob",
      },
    );

    const blob = normalizeBlobResponse(response);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },

  isFileGroup: async (request: FileGroupData): Promise<string> => {
    const response = await apiClient.post("/api/dr/file/isGroupData", request);
    const responseData = unwrapApiClientPayload<any>(response);
    const atchFileGroupId =
      responseData?.atchFileGroupId ||
      responseData?.data?.atchFileGroupId ||
      "";

    return String(atchFileGroupId.toString());
  },

  getDownloadStreamUrls: (
    file: Pick<FileItem, "srvrFileNm" | "fileNm">,
    options?: DownloadStreamOptions,
  ) => {
    const path = buildDownloadStreamPath(file, options);
    const apiUrl = resolveApiUrl(path);
    const fallbackUrl = resolveFallbackApiUrl(path);
    const urls = [apiUrl, fallbackUrl].filter(
      (url, index, arr): url is string => !!url && arr.indexOf(url) === index,
    );

    return urls.length > 0 ? urls : [path];
  },

  fetchBlobWithMetaFromUrls: async (
    urls: string[],
  ): Promise<BlobFetchResult> => {
    let lastError: unknown = null;
    const preferredUrl = await resolvePreferredDownloadUrl(urls);
    const orderedUrls = preferredUrl
      ? [preferredUrl, ...urls.filter((url) => url !== preferredUrl)]
      : urls;

    for (const url of orderedUrls) {
      try {
        const response = await https.get(url, {
          responseType: "blob",
        });
        const blob = normalizeBlobResponse(response);
        const clientIpHeader =
          response?.headers?.["x-viewer-client-ip"] ??
          response?.headers?.["X-Viewer-Client-Ip"] ??
          "";

        return {
          blob,
          clientIp: String(clientIpHeader || "").trim() || undefined,
        };
      } catch (error) {
        console.error("[fileApi] fetchBlobWithMetaFromUrls:failed", {
          url,
          error,
        });
        lastError = error;
      }
    }

    throw lastError ?? new Error("다운로드에 실패했습니다.");
  },

  fetchBlobFromUrls: async (urls: string[]): Promise<Blob> => {
    const result = await FileApi.fetchBlobWithMetaFromUrls(urls);
    return result.blob;
  },

  downloadFromUrls: async (urls: string[], filename: string) => {
    const blob = await FileApi.fetchBlobFromUrls(urls);
    const objectUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(objectUrl);
  },
};
