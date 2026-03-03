import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Box,
  Typography,
  type SxProps,
  type Theme,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

type ActionsPosition = "top" | "bottom";
interface DialogTriggerProps {
  open?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  buttonLabel?: string;
  isIcon?: boolean;
  triggerIcon?: React.ReactNode;
  hideTrigger?: boolean;
  title?: string;
  children?: React.ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  paperSx?: SxProps<Theme>;
  actions?: React.ReactNode;
  actionsPosition?: ActionsPosition;
  isEmpty?: boolean;
  emptyText?: string;
}

export default function DialogTrigger({
  open = false,
  onClose,
  onOpen,
  buttonLabel,
  isIcon = false,
  triggerIcon,
  hideTrigger = false,
  title,
  children,
  isEmpty = false,
  emptyText = "조회된 데이터가 없습니다.",
  maxWidth = "md",
  paperSx,
  actions,
  actionsPosition = "bottom",
}: DialogTriggerProps) {
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStartRef = React.useRef<{
    x: number;
    y: number;
    originX: number;
    originY: number;
  } | null>(null);

  React.useEffect(() => {
    if (!isDragging) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!dragStartRef.current) {
        return;
      }
      const { x, y, originX, originY } = dragStartRef.current;
      setDragOffset({
        x: originX + (event.clientX - x),
        y: originY + (event.clientY - y),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleDragStart = React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      dragStartRef.current = {
        x: event.clientX,
        y: event.clientY,
        originX: dragOffset.x,
        originY: dragOffset.y,
      };
      setIsDragging(true);
    },
    [dragOffset.x, dragOffset.y],
  );

  return (
    <>
      {!hideTrigger &&
        (isIcon ? (
          <IconButton onClick={onOpen} disableRipple>
            {triggerIcon || <SearchIcon />}
          </IconButton>
        ) : (
          <Button variant="outlined" onClick={onOpen}>
            {buttonLabel}
          </Button>
        ))}

      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={maxWidth}
        fullWidth
        slotProps={{
          paper: {
            sx: {
              transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
              ...(paperSx ?? {}),
            },
          },
        }}
      >
        {title && (
          <DialogTitle className="dialog-title" onMouseDown={handleDragStart}>
            {title}
            <IconButton
              aria-label="닫기"
              className="dialog-close-button"
              onClick={onClose}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
        )}

        <Divider className="dialog-divider" />

        {actions && actionsPosition === "top" && (
          <DialogActions className="dialog-actions-top">
            {actions}
          </DialogActions>
        )}
        <DialogContent>
          {children}

          {isEmpty && (
            <Box className="dialog-empty">
              <Typography variant="body2">{emptyText}</Typography>
            </Box>
          )}
        </DialogContent>

        {actions && actionsPosition === "bottom" && (
          <DialogActions className="dialog-actions-bottom">
            {actions}
          </DialogActions>
        )}
      </Dialog>
    </>
  );
}
