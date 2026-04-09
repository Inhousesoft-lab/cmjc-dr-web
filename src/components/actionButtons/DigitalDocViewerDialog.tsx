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
  const viewerRef = React.useRef<HTMLDivElement | null>(null);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const pageRefs = React.useRef<Record<number, HTMLDivElement | null>>({});
  const loadingChangeRef = React.useRef(onLoadingChange);
  const activePdfRenderIdRef = React.useRef(0);
  const objectUrlRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    loadingChangeRef.current = onLoadingChange;
  }, [onLoadingChange]);

  const resetViewerState = React.useCallback(() => {
    activePdfRenderIdRef.current += 1;
    pageRefs.current = {};
    setNumPages(0);
    setCurrentPage(1);
    setZoom(1);
    setRotation(0);
    setOrientation("portrait");
    setPageInput("1");
    setLoadError(null);
    setResolvedFileUrl("");
    setContainerWidth(0);
  }, []);

  const releaseObjectUrl = React.useCallback(() => {
    if (objectUrlRef.current) {
      window.URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    if (!open) {
      loadingChangeRef.current?.(false);
      setIsPreparing(false);
      releaseObjectUrl();
      resetViewerState();
    }
  }, [open, releaseObjectUrl, resetViewerState]);

  const handleMovePage = () => {
    if (fileType !== "pdf") return;
    const nextPage = Number(pageInput);
    if (!Number.isInteger(nextPage) || nextPage < 1) return;
    if (numPages > 0 && nextPage > numPages) return;
    pageRefs.current[nextPage]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
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
    if (!open || fileUrls.length === 0) {
      loadingChangeRef.current?.(false);
      setIsPreparing(false);
      releaseObjectUrl();
      setResolvedFileUrl("");
      return;
    }

    let cancelled = false;

    const loadFileForViewer = async () => {
      activePdfRenderIdRef.current += 1;
      pageRefs.current = {};
      setNumPages(0);
      setCurrentPage(1);
      setZoom(1);
      setRotation(0);
      setOrientation("portrait");
      setPageInput("1");
      setLoadError(null);
      setResolvedFileUrl("");
      setIsPreparing(true);
      loadingChangeRef.current?.(true);
      releaseObjectUrl();

      try {
        const blob = await FileApi.fetchBlobFromUrls(fileUrls);
        if (cancelled) return;

        const objectUrl = window.URL.createObjectURL(blob);
        objectUrlRef.current = objectUrl;
        setResolvedFileUrl(objectUrl);
      } catch (error) {
        if (cancelled) return;
        setLoadError(
          error instanceof Error
            ? error.message || "파일을 불러오지 못했습니다."
            : "파일을 불러오지 못했습니다.",
        );
      } finally {
        if (!cancelled) {
          setIsPreparing(false);
          loadingChangeRef.current?.(false);
        }
      }
    };

    void loadFileForViewer();

    return () => {
      cancelled = true;
      loadingChangeRef.current?.(false);
      setIsPreparing(false);
      releaseObjectUrl();
    };
  }, [fileUrls, fileUrlsKey, open, releaseObjectUrl]);

  React.useEffect(() => {
    if (fileType !== "pdf") return;
    if (!open || numPages <= 0) return;
    const scroller = scrollRef.current;
    if (!scroller) return;

    const updateCurrentPage = () => {
      const scrollerTop = scroller.getBoundingClientRect().top;
      let nextCurrent = numPages;

      for (let page = 1; page <= numPages; page += 1) {
        const el = pageRefs.current[page];
        if (!el) continue;
        const top = el.getBoundingClientRect().top - scrollerTop;
        if (top >= -20) {
          nextCurrent = page;
          break;
        }
      }

      setCurrentPage(nextCurrent);
    };

    updateCurrentPage();
    scroller.addEventListener("scroll", updateCurrentPage, { passive: true });
    return () => scroller.removeEventListener("scroll", updateCurrentPage);
  }, [fileType, numPages, open, zoom]);

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

      try {
        const firstPage = await pdf.getPage(1);
        if (renderId !== activePdfRenderIdRef.current) return;

        const viewport = firstPage.getViewport({ scale: 1 });
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

  const clientIp = "0.0.0.1";

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
  const loadingContent = (
    <Box
      sx={{
        minHeight: 240,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CircularProgress size={18} />
        <Typography variant="body2" color="text.secondary">
          파일 열람을 준비하고 있습니다...
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
            ) : isPreparing || !resolvedFileUrl ? (
              loadingContent
            ) : (
              <Document
                key={resolvedFileUrl}
                file={resolvedFileUrl}
                onLoadSuccess={handleLoadSuccess}
                onLoadError={handlePdfLoadError}
              >
                {Array.from({ length: numPages }, (_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <div
                      key={pageNumber}
                      ref={(el) => {
                        pageRefs.current[pageNumber] = el;
                      }}
                      style={{ marginBottom: 16, position: "relative" }}
                    >
                      <Page
                        pageNumber={pageNumber}
                        width={containerWidth > 0 ? containerWidth : undefined}
                        scale={zoom}
                        rotate={rotation}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                      />
                    </div>
                  );
                })}
              </Document>
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
