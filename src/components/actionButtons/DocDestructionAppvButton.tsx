import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import type { DocDestruction } from "@/types/docDestruction";
import useNotifications from "@/hooks/useNotifications";

type ButtonProps = {
  selectedRows: DocDestruction[];
};

export default function DocDestructionAppvButton(prop: ButtonProps) {
  const { selectedRows } = prop;
  const notifications = useNotifications();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    if (selectedRows.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
      notifications.show("파기 승인 할 문서를 선택하세요.", {
        severity: "info",
        autoHideDuration: 3000,
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      try {
        notifications.show("승인되었습니다.", {
          severity: "success",
          autoHideDuration: 3000,
        });
        handleClose();
      } catch (e) {
        console.error(e);
      }
    },
    [notifications, selectedRows],
  );

  return (
    <React.Fragment>
      <Button variant="contained" size="small" onClick={handleClickOpen}>
        문서파기 승인
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>문서파기 승인</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} id="subscription-form">
            <TextField
              autoFocus
              required
              fullWidth
              variant="outlined"
              margin="dense"
              id="password"
              name="password"
              label="비밀번호"
              type="password"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button size="large" variant="contained" onClick={handleClose}>
            취소
          </Button>
          <Button
            size="large"
            variant="outlined"
            type="submit"
            form="subscription-form"
          >
            문서파기 신청 승인 및 파기
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
