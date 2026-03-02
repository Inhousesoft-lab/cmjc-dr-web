import apiClient from "./ApiClient";

// API 공통 응답
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

export const FileApi = {
  // 파일 목록 조회  ========================================================
  getFileList: async (request: FileListRequest): Promise<FileItem[]> => {
    // API 응답 구조: { data: { list: [...], totalCount: 2, pageNum: 1, pages: 1, pageSize: 2 } }
    // apiClient 인터셉터가 res.data를 반환하므로, responseData는 { list: [...], totalCount: 2, ... } 형태입니다
    const responseData = (await apiClient.post(
      "/api/dr/file/list",
      request
    )) as any;

    // responseData.list가 실제 파일 배열
    if (responseData?.list && Array.isArray(responseData.list)) {
      return responseData.list;
    }

    // fallback: 다른 구조 지원
    if (Array.isArray(responseData)) {
      return responseData;
    }

    return [];
  },

  // 파일 다건 업로드  ========================================================
  uploadFile: async (request: UploadFileRequest) => {
    const formData = new FormData();
    formData.append("savePath", request.savePath);
    formData.append("atchFileGroupId", request.atchFileGroupId);
    formData.append("prvcInclYn", request.prvcInclYn);
    formData.append("isExcel", request.isExcel);
    request.uploadFiles.forEach((file) => {
      formData.append("uploadFiles", file);
    });

    // for (const [key, value] of formData.entries()) {
    //   if (value instanceof File) {
    //     console.log(`${key}:`, value.name, `(${value.size} bytes)`);
    //   } else {
    //     console.log(`${key}:`, value);
    //   }
    // }
    return await apiClient.post("/api/dr/file/uploadFiles", formData);
  },

  // 그룹 파일 데이터 삭제  ========================================================
  groupFilesDelete: async (
    request: FileGroupDeleteRequest
  ): Promise<FileDeleteResponse> => {
    const response = await apiClient.post<FileDeleteResponse>(
      "/api/dr/file/deleteGroupFiles",
      request
    );
    return response.data || (response.data as unknown as FileDeleteResponse);
  },

  selectDelete: async (
    request: FileSelectDeleteRequest
  ): Promise<FileDeleteResponse> => {
    const response = await apiClient.post<FileDeleteResponse>(
      "/api/dr/file/deleteMultiFile",
      request
    );
    return response.data || (response.data as unknown as FileDeleteResponse);
  },

  //파일 단건 데이터 삭제  ========================================================
  fileDelete: async (
    request: FileDeleteRequest
  ): Promise<FileDeleteResponse> => {
    const response = await apiClient.post<FileDeleteResponse>(
      "/api/dr/file/deleteFileOne",
      request
    );
    return response.data || (response.data as unknown as FileDeleteResponse);
  },

  // 파일그룹정보 조회  ========================================================
  getFileGroupData: async (request: FileGroupDataRequest): Promise<string> => {
    try {
      const response = (await apiClient.post(
        "/api/dr/file/groupData",
        request
      )) as any;

      // ⭐ string 반환
      const atchFileGroupId =
        response?.data?.atchFileGroupId || response?.atchFileGroupId || "";

      return String(atchFileGroupId.toString());
    } catch (err) {
      console.error("[getFileGroupData] 에러:", err);
      return ""; // ⭐ 빈 문자열 반환
    }
  },

  // 파일 그룹정보 등록   ========================================================
  insertFileGroup: async (
    request: FileGroupInsertRequest
  ): Promise<FileGroupInsertResponse> => {
    const response = (await apiClient.post(
      "/api/dr/file/groupInsert",
      request
    )) as any;
    return response || (response as unknown as FileDeleteResponse);
  },

  // 파일 다운로드 (사유 입력)  ========================================================
  downloadFileWithReason: async (
    filename: string,
    reason: string
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
      }
    );

    // ✅ 파일 다운로드 처리
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

  // 파일 그룹정보 등록여부   ========================================================
  isFileGroup: async (request: FileGroupData): Promise<string> => {
    const response = (await apiClient.post(
      "/api/dr/file/isGroupData",
      request
    )) as any;
    const atchFileGroupId =
      response?.data?.atchFileGroupId || response?.atchFileGroupId || "";

    return String(atchFileGroupId.toString());
  },
};
