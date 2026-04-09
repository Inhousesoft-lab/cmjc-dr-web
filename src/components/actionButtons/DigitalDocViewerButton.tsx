import * as React from "react";
import { Button, CircularProgress } from "@mui/material";
import DigitalDocViewerDialog from "./DigitalDocViewerDialog";

interface DigitalDocViewerButtonProps {
  fileUrl: string | string[];
  label?: string;
  fileType?: "pdf" | "image";
  disabled?: boolean;
  onLoadingChange?: (loading: boolean) => void;
}

export default function DigitalDocViewerButton({
  fileUrl,
  label = "열람",
  fileType = "pdf",
  disabled = false,
  onLoadingChange,
}: DigitalDocViewerButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [isPreparing, setIsPreparing] = React.useState(false);

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        onClick={() => setOpen(true)}
        disabled={disabled || isPreparing}
        endIcon={isPreparing ? <CircularProgress size={14} color="inherit" /> : undefined}
      >
        {label}
      </Button>

      <DigitalDocViewerDialog
        open={open}
        onClose={() => setOpen(false)}
        fileUrl={fileUrl}
        fileType={fileType}
        onLoadingChange={(loading) => {
          setIsPreparing(loading);
          onLoadingChange?.(loading);
        }}
      />
    </>
  );
}
