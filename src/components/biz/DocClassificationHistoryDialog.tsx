import * as React from "react";
import { TableCell, TableRow } from "@mui/material";
import type { DocClassHistory } from "@/types/docClassification";
import { selectDocClassificationHistoryApiPath } from "@/api/docClassification/DocClassificationApiPaths";
import https from "@/api/axiosInstance";
import { formatDateDash } from "@/utils/formater";
import TableWrapper from "../table/TableWrapper";
import LabelCell from "../table/LabelCell";
import DialogTrigger from "../dialog/DialogTrigger";

type Props = {
  docClsfNo: string;
};

export default function DocClassificationHistoryDialog({ docClsfNo }: Props) {
  const [open, setOpen] = React.useState(false);

  const [rowData, setRowsData] = React.useState<DocClassHistory[]>([]);

  const loadData = async () => {
    if (!docClsfNo) return;

    try {
      const res = await https.get(
        selectDocClassificationHistoryApiPath(docClsfNo ?? ""),
      );
      const payload = res.data;
      const raw =
        payload?.list ??
        payload?.data?.list ??
        payload?.result?.list ??
        payload?.data ??
        payload?.result ??
        payload;
      setRowsData(Array.isArray(raw) ? (raw as DocClassHistory[]) : []);
    } catch (listDataError) {
      console.error(listDataError);
    }
  };

  React.useEffect(() => {
    if (!open) return;
    loadData();
  }, [open, docClsfNo]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <DialogTrigger
      buttonLabel="이력"
      triggerButtonClassName="btn_fixed-sm"
      title="이력"
      maxWidth="md"
      open={open}
      onOpen={handleClickOpen}
      onClose={handleClose}
    >
      <TableWrapper
        colgroup={
          <colgroup>
            <col />
            <col className="tbl-col-w-14p" />
            <col className="tbl-col-w-14p" />
            <col className="tbl-col-w-14p" />
            <col className="tbl-col-w-15p" />
            <col className="tbl-col-w-10p" />
          </colgroup>
        }
      >
        <TableRow>
          <LabelCell>번호</LabelCell>
          <LabelCell>행위일자</LabelCell>
          <LabelCell>행위자</LabelCell>
          <LabelCell>행위내용</LabelCell>
          <LabelCell>IP</LabelCell>
          <LabelCell>장비</LabelCell>
        </TableRow>
        {rowData?.length > 0 &&
          rowData?.map((row) => (
            <TableRow key={row.docClsfNo}>
              <TableCell>{row.docClsfNo}</TableCell>
              <TableCell>{formatDateDash(row.regDt)}</TableCell>
              <TableCell>{row.rgtrNm || row.rgtrId}</TableCell>
              <TableCell>{row.actCn}</TableCell>
              <TableCell>{row.acsrIpAddr}</TableCell>
              <TableCell>{row.eqpmntNm}</TableCell>
            </TableRow>
          ))}
        {rowData?.length === 0 && (
          <TableRow>
            <TableCell colSpan={6}>조회된 데이터가 없습니다.</TableCell>
          </TableRow>
        )}
      </TableWrapper>
    </DialogTrigger>
  );
}
