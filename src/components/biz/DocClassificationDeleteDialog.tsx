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
import LabelCell from "@/components/table/LabelCell";
import TableWrapper from "@/components/table/TableWrapper";

interface Props {
  open: boolean;
  loading?: boolean;
  title?: string;
  submitText?: string;
  onClose: () => void;
  onSubmit: (values: { password: string; reason: string }) => Promise<void> | void;
}

export default function DocClassificationDeleteDialog({
  open,
  loading = false,
  title = "문서분류 삭제",
  submitText = "삭제",
  onClose,
  onSubmit,
}: Props) {
  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const password = String(formData.get("password") ?? "").trim();
      const reason = String(formData.get("reason") ?? "").trim();
      await onSubmit({ password, reason });
    },
    [onSubmit],
  );

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} id="doc-classification-delete-form">
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
                  disabled={loading}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <LabelCell required>사유</LabelCell>
              <TableCell>
                <TextField
                  required
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  id="reason"
                  name="reason"
                  multiline
                  minRows={3}
                  disabled={loading}
                />
              </TableCell>
            </TableRow>
          </TableWrapper>
        </form>
      </DialogContent>
      <DialogActions>
        <Button size="large" variant="contained" onClick={onClose} disabled={loading}>
          취소
        </Button>
        <Button
          size="large"
          variant="outlined"
          type="submit"
          form="doc-classification-delete-form"
          disabled={loading}
        >
          {submitText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
