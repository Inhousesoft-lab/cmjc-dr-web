import * as React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Document, Page, pdfjs } from "react-pdf";
import { FileApi } from "@/api/fileApi";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const PDF_WINDOW_SIZE = 7;
const PDF_WINDOW_OVERSCAN = 2;
const PDF_PAGE_GAP = 16;
const DEFAULT_PAGE_HEIGHT = 1100;

export interface DigitalDocViewerDialogProps {
  open: boolean;
  onClose: () => void;
  fileUrl: string | string[];
  fileType?: "pdf" | "image";
  onLoadingChange?: (loading: boolean) => void;
}

export default function DigitalDocViewerDialog({
  open,
  onClose,
  fileUrl,
  fileType = "pdf",
  onLoadingChange,
}: DigitalDocViewerDialogProps) {
  const fileUrls = React.useMemo(() => {
    const normalized = Array.isArray(fileUrl) ? fileUrl : [fileUrl];
    return normalized.filter(Boolean);
  }, [fileUrl]);
  const fileUrlsKey = React.useMemo(() => fileUrls.join("||"), [fileUrls]);
  const [numPages, setNumPages] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [zoom, setZoom] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);
  const [shieldActive, setShieldActive] = React.useState(false);
  const [watermarkAt, setWatermarkAt] = React.useState(() => new Date());
  const [orientation, setOrientation] = React.useState<"portrait" | "landscape">(
    "portrait",
  );
  const [pageInput, setPageInput] = React.useState("1");
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [resolvedFileUrl, setResolvedFileUrl] = React.useState("");
  const [isPreparing, setIsPreparing] = React.useState(false);
  const [isPdfRendering, setIsPdfRendering] = React.useState(false);
  const [clientIp, setClientIp] = React.useState("-");
  const [basePageViewport, setBasePageViewport] = React.useState<{
    width: number;
    height: number;
  } | null>(null);
  const viewerRef = React.useRef<HTMLDivElement | null>(null);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const pageRefs = React.useRef<Record<number, HTMLDivElement | null>>({});
  const pageHeightOverridesRef = React.useRef<Record<number, number>>({});
  const loadingChangeRef = React.useRef(onLoadingChange);
  const activePdfRenderIdRef = React.useRef(0);
  const objectUrlRef = React.useRef<string | null>(null);
  const viewerSessionIdRef = React.useRef(0);
  const closingSessionIdRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    loadingChangeRef.current = onLoadingChange;
  }, [onLoadingChange]);

  const estimatedRenderedPageHeight = React.useMemo(() => {
    if (!basePageViewport) {
      return DEFAULT_PAGE_HEIGHT * zoom + PDF_PAGE_GAP;
    }

    const baseWidth = containerWidth > 0 ? containerWidth : basePageViewport.width;
    const fittedScale = basePageViewport.width > 0 ? baseWidth / basePageViewport.width : 1;
    return basePageViewport.height * fittedScale * zoom + PDF_PAGE_GAP;
  }, [basePageViewport, containerWidth, zoom]);

  const getEstimatedPageOffset = React.useCallback(
    (pageNumber: number) => {
      let offset = 0;
      for (let page = 1; page < pageNumber; page += 1) {
        offset += pageHeightOverridesRef.current[page] ?? estimatedRenderedPageHeight;
      }
      return offset;
    },
    [estimatedRenderedPageHeight],
  );

  const getEstimatedPageHeight = React.useCallback(
    (pageNumber: number) => {
      return pageHeightOverridesRef.current[pageNumber] ?? estimatedRenderedPageHeight;
    },
    [estimatedRenderedPageHeight],
  );

  const resetViewerState = React.useCallback(() => {
    activePdfRenderIdRef.current += 1;
    pageRefs.current = {};
    pageHeightOverridesRef.current = {};
    setNumPages(0);
    setCurrentPage(1);
    setZoom(1);
    setRotation(0);
    setOrientation("portrait");
    setPageInput("1");
    setLoadError(null);
    setResolvedFileUrl("");
    setContainerWidth(0);
    setBasePageViewport(null);
    setIsPdfRendering(false);
    setClientIp("-");
  }, []);

  const releaseObjectUrl = React.useCallback((targetUrl?: string | null) => {
    const nextTarget = targetUrl ?? objectUrlRef.current;
    if (!nextTarget) return;

    window.URL.revokeObjectURL(nextTarget);
    if (objectUrlRef.current === nextTarget) {
      objectUrlRef.current = null;
    }
  }, []);

  const cleanupViewerResources = React.useCallback(() => {
    loadingChangeRef.current?.(false);
    releaseObjectUrl();
    activePdfRenderIdRef.current += 1;
    pageRefs.current = {};
    pageHeightOverridesRef.current = {};
  }, [releaseObjectUrl]);

  const cleanupViewer = React.useCallback(
    (sessionId?: number | null) => {
      if (sessionId != null && sessionId !== viewerSessionIdRef.current) {
        return;
      }

      cleanupViewerResources();
      setIsPreparing(false);
      setIsPdfRendering(false);
      resetViewerState();
    },
    [cleanupViewerResources, resetViewerState],
  );

  React.useEffect(() => () => cleanupViewerResources(), [cleanupViewerResources]);

  const handleMovePage = () => {
    if (fileType !== "pdf") return;
    const nextPage = Number(pageInput);
    if (!Number.isInteger(nextPage) || nextPage < 1) return;
    if (numPages > 0 && nextPage > numPages) return;

    setCurrentPage(nextPage);

    const scroller = scrollRef.current;
    if (!scroller) return;

    const renderedPage = pageRefs.current[nextPage];
    if (renderedPage) {
      renderedPage.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    scroller.scrollTo({
      top: getEstimatedPageOffset(nextPage),
      behavior: "smooth",
    });
  };

  React.useEffect(() => {
    if (!open) return;
    const target = viewerRef.current;
    if (!target) return;

    const updateWidth = () => setContainerWidth(target.clientWidth);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(target);

    return () => observer.disconnect();
  }, [fileType, open]);

  React.useEffect(() => {
    if (!open) {
      closingSessionIdRef.current = viewerSessionIdRef.current;
      loadingChangeRef.current?.(false);
      setIsPreparing(false);
      return;
    }

    const sessionId = viewerSessionIdRef.current + 1;
    viewerSessionIdRef.current = sessionId;
    closingSessionIdRef.current = null;

    if (fileUrls.length === 0) {
      resetViewerState();
      loadingChangeRef.current?.(false);
      setIsPreparing(false);
      return;
    }

    let cancelled = false;

    const loadFileForViewer = async () => {
      resetViewerState();
      setIsPreparing(true);
      setIsPdfRendering(fileType === "pdf");
      loadingChangeRef.current?.(true);
      releaseObjectUrl();

      try {
        const { blob, clientIp: resolvedClientIp } = await FileApi.fetchBlobWithMetaFromUrls(fileUrls);
        if (cancelled || sessionId !== viewerSessionIdRef.current) return;

        setClientIp(resolvedClientIp || "-");

        const objectUrl = window.URL.createObjectURL(blob);
        if (cancelled || sessionId !== viewerSessionIdRef.current) {
          releaseObjectUrl(objectUrl);
          return;
        }

        objectUrlRef.current = objectUrl;
        setResolvedFileUrl(objectUrl);
      } catch (error) {
        if (cancelled || sessionId !== viewerSessionIdRef.current) return;

        setLoadError(
          error instanceof Error
            ? error.message || "파일을 불러오지 못했습니다."
            : "파일을 불러오지 못했습니다.",
        );
      } finally {
        if (!cancelled && sessionId === viewerSessionIdRef.current) {
          setIsPreparing(false);
          if (fileType !== "pdf") {
            setIsPdfRendering(false);
          }
          loadingChangeRef.current?.(false);
        }
      }
    };

    void loadFileForViewer();

    return () => {
      cancelled = true;
      if (sessionId === viewerSessionIdRef.current) {
        loadingChangeRef.current?.(false);
        setIsPreparing(false);
        setIsPdfRendering(false);
      }
    };
  }, [fileUrls, fileUrlsKey, open, releaseObjectUrl, resetViewerState]);

  React.useEffect(() => {
    if (fileType !== "pdf") return;
    if (!open || numPages <= 0) return;
    const scroller = scrollRef.current;
    if (!scroller) return;

    const updateCurrentPage = () => {
      const nextCurrent = Math.min(
        numPages,
        Math.max(1, Math.floor(scroller.scrollTop / estimatedRenderedPageHeight) + 1),
      );
      setCurrentPage(nextCurrent);
    };

    updateCurrentPage();
    scroller.addEventListener("scroll", updateCurrentPage, { passive: true });
    return () => scroller.removeEventListener("scroll", updateCurrentPage);
  }, [estimatedRenderedPageHeight, fileType, numPages, open]);

  React.useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  React.useEffect(() => {
    if (!open) return;
    const timer = window.setInterval(() => setWatermarkAt(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;

    const activateShield = () => {
      setShieldActive(true);
      window.setTimeout(() => setShieldActive(false), 1200);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "PrintScreen") {
        activateShield();
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        activateShield();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [open]);

  const handleLoadSuccess = React.useCallback(
    async (pdf: {
      numPages: number;
      getPage: (page: number) => Promise<{
        getViewport: (params: { scale: number }) => {
          width: number;
          height: number;
        };
      }>;
    }) => {
      const renderId = activePdfRenderIdRef.current;

      setNumPages(pdf.numPages);
      setLoadError(null);
      setIsPdfRendering(true);

      try {
        const firstPage = await pdf.getPage(1);
        if (renderId !== activePdfRenderIdRef.current) return;

        const viewport = firstPage.getViewport({ scale: 1 });
        setBasePageViewport({
          width: viewport.width,
          height: viewport.height,
        });
        setOrientation(
          viewport.width >= viewport.height ? "landscape" : "portrait",
        );
      } catch (error) {
        if (renderId !== activePdfRenderIdRef.current) return;

        const message = error instanceof Error ? error.message : String(error ?? "");
        if (
          message.includes("Worker was destroyed") ||
          message.includes("worker is being destroyed") ||
          message.includes("Transport destroyed") ||
          message.includes("Loading aborted")
        ) {
          return;
        }

        setOrientation("portrait");
      }
    },
    [],
  );

  const handlePdfLoadError = React.useCallback((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error ?? "");

    if (
      message.includes("Worker was destroyed") ||
      message.includes("worker is being destroyed") ||
      message.includes("Transport destroyed") ||
      message.includes("Loading aborted")
    ) {
      return;
    }

    setLoadError("PDF를 불러오지 못했습니다.");
  }, []);

  const handlePageRenderSuccess = React.useCallback(
    (pageNumber: number) => {
      const pageElement = pageRefs.current[pageNumber];
      if (!pageElement) return;

      const measuredHeight = pageElement.getBoundingClientRect().height + PDF_PAGE_GAP;
      if (measuredHeight <= 0) return;

      pageHeightOverridesRef.current[pageNumber] = measuredHeight;

      if (pageNumber === 1) {
        setIsPdfRendering(false);
      }
    },
    [],
  );

  const watermarkText = React.useMemo(() => {
    const time = watermarkAt.toLocaleString("ko-KR", {
      hour12: false,
    });
    return `IP:${clientIp} | ${time}`;
  }, [clientIp, watermarkAt]);

  const watermarkPattern = React.useMemo(() => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='420' height='220' viewBox='0 0 420 220'><g transform='rotate(-24 210 110)'><text x='28' y='120' fill='rgba(0,0,0,0.16)' font-size='18' font-family='Arial, sans-serif'>${watermarkText}</text></g></svg>`;
    return `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;
  }, [watermarkText]);

  const modalOrientation =
    rotation % 180 === 0
      ? orientation
      : orientation === "landscape"
        ? "portrait"
        : "landscape";

  const virtualWindow = React.useMemo(() => {
    if (numPages <= 0) {
      return {
        startPage: 1,
        endPage: 0,
        topSpacerHeight: 0,
        bottomSpacerHeight: 0,
      };
    }

    const halfWindow = Math.floor(PDF_WINDOW_SIZE / 2);
    const rawStart = Math.max(1, currentPage - halfWindow - PDF_WINDOW_OVERSCAN);
    const rawEnd = Math.min(
      numPages,
      currentPage + halfWindow + PDF_WINDOW_OVERSCAN,
    );

    const topSpacerHeight = getEstimatedPageOffset(rawStart);
    const bottomSpacerHeight = Math.max(
      0,
      getEstimatedPageOffset(numPages + 1) - getEstimatedPageOffset(rawEnd + 1),
    );

    return {
      startPage: rawStart,
      endPage: rawEnd,
      topSpacerHeight,
      bottomSpacerHeight,
    };
  }, [currentPage, getEstimatedPageOffset, numPages]);

  const visiblePageNumbers = React.useMemo(() => {
    if (virtualWindow.endPage < virtualWindow.startPage) {
      return [] as number[];
    }

    return Array.from(
      { length: virtualWindow.endPage - virtualWindow.startPage + 1 },
      (_, index) => virtualWindow.startPage + index,
    );
  }, [virtualWindow.endPage, virtualWindow.startPage]);

  const loadingIndicator = (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <CircularProgress size={18} />
      <Typography variant="body2" color="text.secondary">
        파일 열람을 준비하고 있습니다...
      </Typography>
    </Box>
  );

  const loadingOverlay = (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.72)",
      }}
    >
      {loadingIndicator}
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      container={typeof window !== "undefined" ? document.body : undefined}
      disablePortal={false}
      sx={{ zIndex: (theme) => theme.zIndex.modal + 100 }}
      slotProps={{
        root: {
          sx: { zIndex: (theme) => theme.zIndex.modal + 100 },
        },
        backdrop: {
          sx: { zIndex: (theme) => theme.zIndex.modal + 99 },
        },
        paper: {
          sx: { zIndex: (theme) => theme.zIndex.modal + 101 },
        },
      }}
      TransitionProps={{
        onExited: () => {
          const closingSessionId = closingSessionIdRef.current;
          if (closingSessionId == null || open) {
            return;
          }

          cleanupViewer(closingSessionId);
          if (closingSessionIdRef.current === closingSessionId) {
            closingSessionIdRef.current = null;
          }
        },
      }}
      maxWidth={false}
      fullWidth={false}
      PaperProps={{
        sx: {
          width: modalOrientation === "landscape" ? "92vw" : "56vw",
          maxWidth: modalOrientation === "landscape" ? "1600px" : "920px",
          height: modalOrientation === "landscape" ? "90vh" : "85vh",
          minWidth: modalOrientation === "landscape" ? "960px" : "720px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            zIndex: 2,
            pointerEvents: "none",
            backgroundImage: watermarkPattern,
            backgroundRepeat: "repeat",
          },
        },
      }}
    >
      <DialogContent
        ref={scrollRef}
        onContextMenu={(e) => e.preventDefault()}
        onCopy={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        sx={{
          p: 2,
          overflow: "auto",
          flex: 1,
          minHeight: 0,
          position: "relative",
          userSelect: "none",
        }}
      >
        {shieldActive ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
              background: "#0d0d0d",
              opacity: 0.97,
              pointerEvents: "none",
            }}
          />
        ) : null}
        <div ref={viewerRef}>
          {fileType === "pdf" ? (
            loadError ? (
              <Typography color="error">{loadError}</Typography>
            ) : (
              <Box sx={{ position: "relative", minHeight: 240 }}>
                {(!resolvedFileUrl || isPreparing || isPdfRendering) && loadingOverlay}

                {!!resolvedFileUrl && (
                    <Document
                    key={resolvedFileUrl}
                    file={resolvedFileUrl}
                    onLoadSuccess={handleLoadSuccess}
                    onLoadError={handlePdfLoadError}
                    loading={<></>}
                  >
                    {virtualWindow.topSpacerHeight > 0 ? (
                      <div style={{ height: virtualWindow.topSpacerHeight }} />
                    ) : null}

                    {visiblePageNumbers.map((pageNumber) => (
                      <div
                        key={pageNumber}
                        ref={(el) => {
                          pageRefs.current[pageNumber] = el;
                        }}
                        style={{
                          marginBottom: PDF_PAGE_GAP,
                          position: "relative",
                          minHeight: getEstimatedPageHeight(pageNumber) - PDF_PAGE_GAP,
                        }}
                      >
                        <Page
                          pageNumber={pageNumber}
                          width={containerWidth > 0 ? containerWidth : undefined}
                          scale={zoom}
                          rotate={rotation}
                          renderAnnotationLayer={false}
                          renderTextLayer={false}
                          onRenderSuccess={() => handlePageRenderSuccess(pageNumber)}
                        />
                      </div>
                    ))}

                    {virtualWindow.bottomSpacerHeight > 0 ? (
                      <div style={{ height: virtualWindow.bottomSpacerHeight }} />
                    ) : null}
                  </Document>
                )}
              </Box>
            )
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100%",
              }}
            >
              {loadError ? (
                <Typography color="error">{loadError}</Typography>
              ) : isPreparing || !resolvedFileUrl ? (
                loadingContent
              ) : (
                <img
                  src={resolvedFileUrl}
                  alt="첨부 이미지"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    transformOrigin: "center center",
                  }}
                  onLoad={(e) => {
                    const target = e.currentTarget;
                    setLoadError(null);
                    setOrientation(
                      target.naturalWidth >= target.naturalHeight
                        ? "landscape"
                        : "portrait",
                    );
                  }}
                  onError={() => {
                    setLoadError("파일을 불러오지 못했습니다.");
                  }}
                />
              )}
            </Box>
          )}
        </div>
      </DialogContent>

      <DialogActions sx={{ position: "relative", zIndex: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
          <Tooltip title="왼쪽 회전">
            <IconButton onClick={() => setRotation((prev) => prev - 90)}>
              <RotateLeftIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="오른쪽 회전">
            <IconButton onClick={() => setRotation((prev) => prev + 90)}>
              <RotateRightIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="원래대로">
            <IconButton
              onClick={() => {
                setZoom(1);
                setRotation(0);
              }}
            >
              <RestartAltIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {fileType === "pdf" ? (
          <>
            <Typography variant="body2">
              {currentPage} / {numPages || 1}
            </Typography>
            <TextField
              size="small"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              sx={{ width: 72 }}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            />
            <Button onClick={handleMovePage}>이동</Button>
          </>
        ) : null}

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        <Button onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.1))}>
          축소
        </Button>
        <Typography variant="body2" sx={{ minWidth: 56, textAlign: "center" }}>
          {Math.round(zoom * 100)}%
        </Typography>
        <Button onClick={() => setZoom((prev) => Math.min(3, prev + 0.1))}>
          확대
        </Button>

        <Box sx={{ flex: 1 }} />

        <Button variant="contained" onClick={onClose}>
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
