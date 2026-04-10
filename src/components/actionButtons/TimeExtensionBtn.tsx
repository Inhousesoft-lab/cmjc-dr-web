import React, { useState } from "react";
import { useAppDispatch } from "@/app/hooks";
import { extendSession } from "@/features/auth/AuthSlice";
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
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleOpen = () => {
    setMessage("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOk = async () => {
    setSubmitting(true);
    setMessage("");

    const result = await dispatch(extendSession());

    if (extendSession.fulfilled.match(result)) {
      handleClose();
    } else {
      setMessage("세션 연장에 실패했습니다.");
    }

    setSubmitting(false);
  };

  return (
    <React.Fragment>
      <div className="timer_box">
        <AccessTimeIcon />
        <span className="time_text">12:00</span>
        <Button
          size="small"
          className="btn_extend"
          onClick={handleOpen}
        >
          시간연장
        </Button>
      </div>
      <Dialog open={open} onClose={handleClose} maxWidth="sm">
        <DialogTitle>시간 연장</DialogTitle>

        <Divider sx={{ borderColor: "#303336" }} />

        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body1">시간을 연장하시겠습니까?</Typography>
          {message ? (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {message}
            </Typography>
          ) : null}
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>취소</Button>
          <Button variant="contained" onClick={handleOk} disabled={submitting}>
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
