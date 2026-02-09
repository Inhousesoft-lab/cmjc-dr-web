import { Table, TableBody } from "@mui/material";
import React from "react";

export interface TableWrapperProp {
  tableAriaLabel?: string;
  colgroup?: React.ReactNode;
  children?: React.ReactNode;
}

export default function TableWrapper({
  tableAriaLabel,
  colgroup,
  children,
}: TableWrapperProp) {
  return (
    <Table aria-label={tableAriaLabel} className="tbl_view">
      {colgroup && colgroup}
      <TableBody>{children}</TableBody>
    </Table>
  );
}
