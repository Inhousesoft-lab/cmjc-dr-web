import * as React from "react";
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
import type { DocDestruction, DocDestructionUpdate } from "@/types/docDestruction";
import useNotifications from "@/hooks/useNotifications";
import LabelCell from "../table/LabelCell";
import TableWrapper from "../table/TableWrapper";
import { useAppDispatch } from "@/app/hooks";
import { updateDocDestruction } from "@/features/docDestruction/DocDestructionThunk";

type ButtonProps = {
  selectedRows: DocDestruction[];
  onSuccess?: () => void | Promise<void>;
};

export default function DocDestructionAppvButton(prop: ButtonProps) {
  const { selectedRows, onSuccess } = prop;
  const dispatch = useAppDispatch();
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
      const formData = new FormData(event.currentTarget);
      const password = String(formData.get("password") ?? "").trim();

      const aprv01Docs = selectedRows
        .filter((row) => row.dstrcPrcsPrstCd === "01")
        .map((row) => ({ eldocNo: row.eldocNo }));
      const aprv02Docs = selectedRows
        .filter((row) => row.dstrcPrcsPrstCd === "03")
        .map((row) => ({ eldocNo: row.eldocNo }));

      try {
        const requests: DocDestructionUpdate[] = [];

        if (aprv01Docs.length > 0) {
          requests.push({
            password,
            rsn: "",
            reqCd: "APRV01",
            docs: aprv01Docs,
          });
        }
        if (aprv02Docs.length > 0) {
          requests.push({
            password,
            rsn: "",
            reqCd: "APRV02",
            docs: aprv02Docs,
          });
        }

        if (requests.length === 0) {
          notifications.show("승인 가능한 상태의 문서가 없습니다.", {
            severity: "error",
            autoHideDuration: 3000,
          });
          return;
        }

        for (const req of requests) {
          await dispatch(updateDocDestruction(req)).unwrap();
        }

        await onSuccess?.();
        notifications.show("승인되었습니다.", {
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
              : "문서파기 승인 처리 중 오류가 발생했습니다.";
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
        문서파기 승인
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>문서파기 승인</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} id="subscription-form">
            <TableWrapper>
              <TableRow>
                <LabelCell required>비밀번호</LabelCell>
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
            문서파기 신청 승인 및 파기
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
