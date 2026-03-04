import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  Typography,
  TextField,
  Tooltip,
} from "@mui/material";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Document, Page, pdfjs } from "react-pdf";
import workerSrc from "react-pdf/node_modules/pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

interface DigitalDocViewerButtonProps {
  fileUrl: string;
  label?: string;
  fileType?: "pdf" | "image";
}

export default function DigitalDocViewerButton({
  fileUrl,
  label = "열람",
  fileType = "pdf",
}: DigitalDocViewerButtonProps) {
  // const authUser = useAppSelector((state) => state.auth.user);
  const [open, setOpen] = React.useState(false);
  const [numPages, setNumPages] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [zoom, setZoom] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);
  const [shieldActive, setShieldActive] = React.useState(false);
  const [watermarkAt, setWatermarkAt] = React.useState(() => new Date());
  const [orientation, setOrientation] = React.useState<
    "portrait" | "landscape"
  >("portrait");
  const [pageInput, setPageInput] = React.useState("1");
  const [containerWidth, setContainerWidth] = React.useState(0);
  const viewerRef = React.useRef<HTMLDivElement | null>(null);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const pageRefs = React.useRef<Record<number, HTMLDivElement | null>>({});

  const handleOpen = () => {
    setNumPages(0);
    setCurrentPage(1);
    setZoom(1);
    setRotation(0);
    setOrientation("portrait");
    setPageInput("1");
    setOpen(true);
  };

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
  }, [fileType, open, numPages, zoom]);

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
      const loadedPages = pdf.numPages;
      setNumPages(loadedPages);

      try {
        const firstPage = await pdf.getPage(1);
        const viewport = firstPage.getViewport({ scale: 1 });
        setOrientation(
          viewport.width >= viewport.height ? "landscape" : "portrait",
        );
      } catch {
        setOrientation("portrait");
      }
    },
    [],
  );

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

  return (
    <React.Fragment>
      <Button variant="outlined" size="small" onClick={handleOpen}>
        {label}
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
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
              <Document file={fileUrl} onLoadSuccess={handleLoadSuccess}>
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
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "100%",
                }}
              >
                <img
                  src={fileUrl}
                  alt="첨부 이미지"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    transformOrigin: "center center",
                  }}
                  onLoad={(e) => {
                    const target = e.currentTarget;
                    setOrientation(
                      target.naturalWidth >= target.naturalHeight
                        ? "landscape"
                        : "portrait",
                    );
                  }}
                />
              </Box>
            )}
          </div>
        </DialogContent>
        <DialogActions sx={{ position: "relative", zIndex: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
            <Tooltip title="반시계 방향으로 회전" placement="bottom" arrow>
              <IconButton
                onClick={() =>
                  setRotation((prev) => {
                    const next = prev - 90;
                    return next < 0 ? 270 : next;
                  })
                }
              >
                <RotateLeftIcon />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
            <Tooltip title="시계 방향으로 회전" placement="bottom" arrow>
              <IconButton
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
              >
                <RotateRightIcon />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
            <Tooltip title="회전 초기화" placement="bottom" arrow>
              <IconButton onClick={() => setRotation(0)}>
                <RestartAltIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Button
            variant="outlined"
            onClick={() =>
              setZoom((prev) => Math.max(0.5, Number((prev - 0.1).toFixed(1))))
            }
            disabled={zoom <= 0.5}
          >
            축소
          </Button>
          <Typography sx={{ minWidth: 52, textAlign: "center" }}>
            {Math.round(zoom * 100)}%
          </Typography>
          <Button
            variant="outlined"
            onClick={() =>
              setZoom((prev) => Math.min(2.5, Number((prev + 0.1).toFixed(1))))
            }
            disabled={zoom >= 2.5}
          >
            확대
          </Button>
          <Button variant="outlined" onClick={() => setZoom(1)}>
            100%
          </Button>
          {fileType === "pdf" ? (
            <React.Fragment>
              <Typography sx={{ ml: 1 }}>
                {currentPage} / {numPages || "-"} 페이지
              </Typography>
              <TextField
                size="small"
                type="number"
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleMovePage();
                }}
                slotProps={{ htmlInput: { min: 1, max: numPages || undefined } }}
                sx={{ width: 100, ml: 1 }}
              />
              <Button
                variant="outlined"
                onClick={handleMovePage}
                sx={{ mr: "auto" }}
              >
                페이지 이동
              </Button>
            </React.Fragment>
          ) : (
            <Box sx={{ mr: "auto" }} />
          )}
          <Button variant="contained" onClick={() => setOpen(false)}>
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
