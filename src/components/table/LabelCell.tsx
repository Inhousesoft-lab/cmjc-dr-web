import { TableCell } from "@mui/material";
import { ReactNode } from "react";
import RequiredMark from "../common/RequiredMark";

type LabelCellProps = {
  children: ReactNode;
  rowSpan?: number;
  required?: boolean;
  wide?: boolean;
  width?: number;
};

const LabelCell = ({
  children,
  rowSpan,
  required,
  wide,
  width,
}: LabelCellProps) => (
  <TableCell
    className={`tbl_label ${wide ? "tbl_label--wide" : ""}`}
    component="th"
    scope="row"
    rowSpan={rowSpan}
    width={`${width}px`}
  >
    {children}
    {required && <RequiredMark />}
  </TableCell>
);

export default LabelCell;
