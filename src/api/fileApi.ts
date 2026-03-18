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
  prvcInclYn: string;
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

export const FileApi = {
  getFileList: async (request: FileListRequest): Promise<FileItem[]> => {
    const responseData = (await apiClient.post("/api/dr/file/list", request)) as any;

    if (responseData?.list && Array.isArray(responseData.list)) {
      return responseData.list;
    }

    if (Array.isArray(responseData)) {
      return responseData;
    }

    return [];
  },

  uploadFile: async (request: UploadFileRequest) => {
    const formData = new FormData();
    formData.append("savePath", request.savePath);
    formData.append("atchFileGroupId", request.atchFileGroupId);
    formData.append("prvcInclYn", request.prvcInclYn);
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
    return response.data || (response.data as unknown as FileDeleteResponse);
  },

  selectDelete: async (
    request: FileSelectDeleteRequest,
  ): Promise<FileDeleteResponse> => {
    const response = await apiClient.post<FileDeleteResponse>(
      "/api/dr/file/deleteMultiFile",
      request,
    );
    return response.data || (response.data as unknown as FileDeleteResponse);
  },

  fileDelete: async (
    request: FileDeleteRequest,
  ): Promise<FileDeleteResponse> => {
    const response = await apiClient.post<FileDeleteResponse>(
      "/api/dr/file/deleteFileOne",
      request,
    );
    return response.data || (response.data as unknown as FileDeleteResponse);
  },

  getFileGroupData: async (request: FileGroupDataRequest): Promise<string> => {
    try {
      const response = (await apiClient.post("/api/dr/file/groupData", request)) as any;
      const atchFileGroupId =
        response?.data?.atchFileGroupId || response?.atchFileGroupId || "";
      return String(atchFileGroupId.toString());
    } catch (err) {
      console.error("[getFileGroupData] error:", err);
      return "";
    }
  },

  insertFileGroup: async (
    request: FileGroupInsertRequest,
  ): Promise<FileGroupInsertResponse> => {
    const response = (await apiClient.post("/api/dr/file/groupInsert", request)) as any;
    return response || (response as unknown as FileDeleteResponse);
  },

  downloadFileWithReason: async (filename: string, reason: string): Promise<void> => {
    const response = await apiClient.post("/api/dr/file/download-reason", null, {
      params: {
        filename,
        reason,
      },
      responseType: "blob",
    });

    const blob = new Blob([response as any]);
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
    const response = (await apiClient.post("/api/dr/file/isGroupData", request)) as any;
    const atchFileGroupId =
      response?.data?.atchFileGroupId || response?.atchFileGroupId || "";

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

    console.log("[fileApi] getDownloadStreamUrls", {
      file,
      options,
      path,
      apiUrl,
      fallbackUrl,
      urls,
    });

    return urls.length > 0 ? urls : [path];
  },

  fetchBlobFromUrls: async (urls: string[]): Promise<Blob> => {
    let lastError: unknown = null;

    console.log("[fileApi] fetchBlobFromUrls:start", { urls });

    for (const url of urls) {
      try {
        console.log("[fileApi] fetchBlobFromUrls:trying", { url });
        const response = await https.get(url, {
          responseType: "blob",
        });
        const blob = normalizeBlobResponse(response);

        console.log("[fileApi] fetchBlobFromUrls:blob", {
          url,
          size: blob.size,
          type: blob.type,
        });

        return blob;
      } catch (error) {
        console.error("[fileApi] fetchBlobFromUrls:failed", { url, error });
        lastError = error;
      }
    }

    throw lastError ?? new Error("다운로드에 실패했습니다.");
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
