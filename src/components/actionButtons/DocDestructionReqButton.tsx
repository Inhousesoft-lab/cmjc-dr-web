import * as React from "react";
import type {
  DocDestruction,
  DocDestructionUpdate,
} from "@/types/docDestruction";
import useNotifications from "@/hooks/useNotifications";
import { useAppDispatch } from "@/app/hooks";
import { updateDocDestruction } from "@/features/docDestruction/DocDestructionThunk";
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
  onSuccess?: () => void | Promise<void>;
};

export default function DocDestructionReqButton(prop: ButtonProps) {
  const { selectedRows, onSuccess } = prop;
  const dispatch = useAppDispatch();

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
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const password = String(formData.get("password") ?? "").trim();
      const reason = String(formData.get("reason") ?? "").trim();

      const request: DocDestructionUpdate = {
        password,
        rsn: reason,
        reqCd: "REQ",
        docs: selectedRows,
      };
      try {
        await dispatch(updateDocDestruction(request)).unwrap();
        await onSuccess?.();
        notifications.show("문서파기 신청이 완료되었습니다.", {
          severity: "success",
          autoHideDuration: 3000,
        });
        handleClose();
      } catch (e: unknown) {
        const message =
          e instanceof Error
            ? e.message
            : typeof e === "string"
              ? e
              : "문서파기 신청 처리 중 오류가 발생했습니다.";
        notifications.show(message, {
          severity: "error",
          autoHideDuration: 3000,
        });
      }
    },
    [dispatch, notifications, onSuccess, selectedRows],
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
