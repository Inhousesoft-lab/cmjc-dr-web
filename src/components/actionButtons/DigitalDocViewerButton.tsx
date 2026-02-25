import * as React from "react";
import { Button } from "@mui/material";

export default function DigitalDocViewerButton() {
  const handleView = React.useCallback(() => {
    // Vite에서는 public 폴더가 서버 루트(/)에 매핑됩니다.
    // 따라서 public/pdf/피해구제 접수서류.pdf 는 /assets/pdf/피해구제 접수서류.pdf 로 접근합니다.
    const fileUrl = "/public/pdf/피해구제 접수서류.pdf";

    // 새 탭에서 PDF 열람
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <Button
      variant="outlined"
      size="small"
      onClick={handleView}
    >
      열람
    </Button>
  );
}
