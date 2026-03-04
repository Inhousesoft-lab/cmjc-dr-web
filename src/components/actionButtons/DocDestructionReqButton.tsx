import * as React from "react";
import type {
  DocDestruction,
  DocDestructionUpdate,
} from "@/types/docDestruction";
import useNotifications from "@/hooks/useNotifications";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import TableWrapper from "../table/TableWrapper";
import LabelCell from "../table/LabelCell";

type ButtonProps = {
  selectedRows: DocDestruction[];
};

export default function DocDestructionReqButton(prop: ButtonProps) {
  const { selectedRows } = prop;

  const notifications = useNotifications();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    if (selectedRows.length > 0) {
      setOpen(true);
    } else {
      notifications.show("파기 요청 할 문서를 선택하세요.", {
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
      console.log("문서파기신청 SUBMIT  클릭");
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const password = formData.get("password") as string;
      const reason = formData.get("reason") as string;

      const request: DocDestructionUpdate = {
        password: password,
        rsn: reason,
        reqCd: "REQ",
        docs: selectedRows,
      };
      try {
        notifications.show("update done", {
          severity: "success",
          autoHideDuration: 3000,
        });
        handleClose();
      } catch (e) {
        console.log(e);
      }
    },
    [notifications, selectedRows],
  );

  return (
    <React.Fragment>
      <Button variant="contained" onClick={handleClickOpen}>
        문서파기 신청
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>문서파기 신청</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} id="subscription-form">
            <TableWrapper>
              <TableRow>
                <LabelCell>비밀번호</LabelCell>
                <TableCell>
                  <TextField
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    id="password"
                    name="password"
                    type="password"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <LabelCell>사유</LabelCell>
                <TableCell>
                  <TextField
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    id="reason"
                    name="reason"
                    type="reason"
                  />
                </TableCell>
              </TableRow>
            </TableWrapper>
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
            문서파기 신청
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
