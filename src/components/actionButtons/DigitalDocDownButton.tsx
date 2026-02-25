import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

export default function DigitalDocDownButton() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    console.log("aaaaa");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDownload = React.useCallback(() => {
    // Vite에서는 public 폴더가 서버 루트(/)에 매핑됩니다.
    const fileUrl = "/public/pdf/피해구제 접수서류.pdf";

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "피해구제 접수서류.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return (
    <React.Fragment>
      <Button variant="outlined" size="small" onClick={handleClickOpen}>
        다운로드
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>개인정보 포함 문서입니다.</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            fullWidth
            variant="outlined"
            margin="dense"
            id="reason"
            name="reason"
            label="사유"
            type="reason"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            취소
          </Button>
          <Button
            type="submit"
            form="subscription-form"
            onClick={handleDownload}
          >
            다운로드
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
