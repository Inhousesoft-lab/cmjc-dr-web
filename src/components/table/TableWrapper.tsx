import { Table, TableBody } from "@mui/material";
import React from "react";

export interface TableWrapperProp {
  tableAriaLabel?: string;
  colgroup?: React.ReactNode;
  children?: React.ReactNode;
  sx?: any;
}

export default function TableWrapper({
  tableAriaLabel,
  colgroup,
  children,
  sx,
}: TableWrapperProp) {
  return (
    <div className="tbl_wrap">
      <Table aria-label={tableAriaLabel} className="tbl_view" sx={sx}>
        {colgroup && colgroup}
        <TableBody>{children}</TableBody>
      </Table>
    </div>
  );
}
