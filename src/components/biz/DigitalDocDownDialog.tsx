import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableCell,
  TextField,
} from "@mui/material";
import { InfoOutlined as InfoOutlinedIcon } from "@mui/icons-material";
import TableWrapper from "../table/TableWrapper";
import LabelCell from "../table/LabelCell";

interface DigitalDocDownDialogProps {
  atchFileSn?: string;
}

export default function DigitalDocDownDialog({
  atchFileSn = "",
}: DigitalDocDownDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [checking, setChecking] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPassword("");
    setPasswordError("");
    setChecking(false);
  };

  const verifyPasswordMockApi = React.useCallback(async (value: string) => {
    // TODO: 실제 비밀번호 검증 API로 교체
    await new Promise((resolve) => setTimeout(resolve, 300));
    return value === "1234";
  }, []);

  const handleDownload = React.useCallback(async () => {
    if (!password.trim()) {
      setPasswordError("비밀번호를 입력해 주세요.");
      return;
    }

    setChecking(true);
    setPasswordError("");

    const isValid = await verifyPasswordMockApi(password);
    if (!isValid) {
      setChecking(false);
      setPasswordError("비밀번호가 올바르지 않습니다.");
      return;
    }

    // TODO: atchFileSn 기반 다운로드 API 연결
    console.log("download atchFileSn:", atchFileSn);
    setChecking(false);
    handleClose();
  }, [atchFileSn, handleClose, password, verifyPasswordMockApi]);

  return (
    <React.Fragment>
      <Button variant="outlined" size="small" onClick={handleClickOpen}>
        다운로드
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Box className="list-toolbar" my={2}>
            <p className="list-toolbar__notice">
              <span className="list-toolbar__notice-icon" aria-hidden="true">
                <InfoOutlinedIcon fontSize="inherit" />
              </span>
              <span className="list-toolbar__notice-text">
                조회된 내용을{" "}
                <span className="list-toolbar__notice-red">클릭</span> 하면
                전자세금계산서{" "}
                <span className="list-toolbar__notice-red">
                  상세내용을 확인
                </span>
                할 수 있습니다.
              </span>
            </p>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TableWrapper>
            <LabelCell required>사유</LabelCell>
            <TableCell>
              <TextField
                autoFocus
                required
                fullWidth
                variant="outlined"
                margin="dense"
                id="reason"
                name="reason"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
                error={!!passwordError}
                helperText={passwordError}
              />
            </TableCell>
          </TableWrapper>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose} disabled={checking}>
            취소
          </Button>
          <Button
            variant="outlined"
            onClick={handleDownload}
            disabled={checking}
          >
            다운로드
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
