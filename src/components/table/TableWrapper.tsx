import { Table, TableBody } from "@mui/material";
import React from "react";

export interface TableWrapperProp {
  tableAriaLabel?: string;
  tableHead?: React.ReactNode;
  colgroup?: React.ReactNode;
  tableClassName?: string;
  children?: React.ReactNode;
  sx?: any;
}

export default function TableWrapper({
  tableAriaLabel,
  tableHead,
  colgroup,
  tableClassName = "tbl_view",
  children,
  sx,
}: TableWrapperProp) {
  return (
    <div className="tbl_wrap">
      <Table aria-label={tableAriaLabel} className={tableClassName} sx={sx}>
        {colgroup && colgroup}
        {tableHead && tableHead}
        <TableBody>{children}</TableBody>
      </Table>
    </div>
  );
}
