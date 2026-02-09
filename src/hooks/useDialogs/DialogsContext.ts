import * as React from "react";
import type { CloseDialog, OpenDialog } from "./useDialogs/DialogActions";

const DialogsContext = React.createContext<{
  open: OpenDialog;
  close: CloseDialog;
} | null>(null);

export default DialogsContext;
