import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";
import { AccessTime as AccessTimeIcon } from "@mui/icons-material";

export default function TimeExtensionBtn() {
  const [open, setOpen] = useState(false);

  const handleOk = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <div className="timer_box">
        <AccessTimeIcon />
        <span className="time_text">12:00</span>
        <Button
          size="small"
          className="btn_extend"
          onClick={() => setOpen(true)}
        >
          시간연장
        </Button>
      </div>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm">
        <DialogTitle>시간 연장</DialogTitle>

        <Divider sx={{ borderColor: "#303336" }} />

        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body1">시간을 연장하시겠습니까?</Typography>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={() => setOpen(false)}>취소</Button>
          <Button variant="contained" onClick={handleOk}>
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
