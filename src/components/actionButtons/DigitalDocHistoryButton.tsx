import { useEffect, useState } from "react";
import { Grid, Stack, TableCell, TableHead, TableRow } from "@mui/material";
import type { ColDef } from "ag-grid-community";
import DialogTrigger from "../dialog/DialogTrigger";
import TableWrapper from "../table/TableWrapper";
import AgGridTable from "../grid/AgGridTable";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  fetchDigitalDocAuthrtHistoryList,
  fetchDigitalDocDialogDetail,
  fetchDigitalDocHistoryList,
} from "@/features/digitalDoc/DigitalDocThunk";
import {
  selectDigitalDocAuthrtHistoryError,
  selectDigitalDocAuthrtHistoryLoading,
  selectDigitalDocAuthrtHistoryRows,
  selectDigitalDocDialogDetail,
  selectDigitalDocDialogDetailError,
  selectDigitalDocHistoryError,
  selectDigitalDocHistoryLoading,
  selectDigitalDocHistoryRows,
} from "@/features/digitalDoc/DigitalDocSelectors";
import useNotifications from "@/hooks/useNotifications";
import DocDetailTable from "../table/DocDetailTable";
import { formatDateDash } from "@/utils/formater";

const docListDefs = [
  {
    headerName: "번호",
    field: "eldocHstryNo",
    width: 150,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "행위일자",
    field: "regDt",
    width: 120,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) => formatDateDash(params?.value),
  },
  {
    headerName: "행위자",
    field: "rgtrId",
    width: 110,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) =>
      params?.data?.rgtrNm || params?.data?.rgtrId || "-",
  },
  {
    headerName: "행위내용",
    field: "actCn",
    flex: 1,
    minWidth: 180,
    cellStyle: { textAlign: "left" },
  },
  {
    headerName: "IP",
    field: "acsrIpAddr",
    width: 130,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "장비",
    field: "eqpmntNm",
    width: 140,
    cellStyle: { textAlign: "center" },
  },
];

export default function DigitalDocHistoryButton({
  eldocNo,
}: {
  eldocNo: string;
}) {
  const dispatch = useAppDispatch();
  const notifications = useNotifications();

  const [open, setOpen] = useState(false);
  const [docColumnDefs] = useState<ColDef[]>(docListDefs);
  const [selectEdeldocNo, setSelectEdeldocNo] = useState("");

  const docHistoryRows = useAppSelector(selectDigitalDocHistoryRows);
  const docHistoryLoading = useAppSelector(selectDigitalDocHistoryLoading);
  const docHistoryError = useAppSelector(selectDigitalDocHistoryError);
  const authrtHistoryRows = useAppSelector(selectDigitalDocAuthrtHistoryRows);
  const authrtHistoryLoading = useAppSelector(
    selectDigitalDocAuthrtHistoryLoading,
  );
  const authrtHistoryError = useAppSelector(selectDigitalDocAuthrtHistoryError);
  const detail = useAppSelector(selectDigitalDocDialogDetail);
  const detailError = useAppSelector(selectDigitalDocDialogDetailError);

  useEffect(() => {
    if (!open || !eldocNo) return;
    
    dispatch(fetchDigitalDocHistoryList(eldocNo));
    dispatch(fetchDigitalDocAuthrtHistoryList(eldocNo));
  }, [dispatch, eldocNo, open]);

  useEffect(() => {
    if (!open || !selectEdeldocNo) return;
    dispatch(fetchDigitalDocDialogDetail(selectEdeldocNo));
  }, [dispatch, open, selectEdeldocNo]);

  useEffect(() => {
    if (!docHistoryError) return;
    notifications.show(docHistoryError, {
      severity: "error",
      autoHideDuration: 3000,
    });
  }, [docHistoryError, notifications]);

  useEffect(() => {
    if (!authrtHistoryError) return;
    notifications.show(authrtHistoryError, {
      severity: "error",
      autoHideDuration: 3000,
    });
  }, [authrtHistoryError, notifications]);

  useEffect(() => {
    if (!detailError) return;
    notifications.show(detailError, {
      severity: "error",
      autoHideDuration: 3000,
    });
  }, [detailError, notifications]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <DialogTrigger
      buttonLabel="이력"
      triggerButtonClassName="btn_fixed-sm btn_fixed-md"
      title="이력"
      maxWidth="xl"
      onOpen={handleClickOpen}
      open={open}
      onClose={handleClose}
    >
      <Grid container spacing={3}>
        <Grid size={6}>
          <AgGridTable
            height={500}
            colDefs={docColumnDefs}
            rowData={docHistoryRows}
            isLoading={docHistoryLoading}
          />
        </Grid>
        <Grid size={6}>
          <Stack spacing={2}>
            <TableWrapper
              tableAriaLabel="공람 이력"
              tableHead={
                <TableHead>
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{ fontWeight: 700 }}
                    >
                      공람 이력
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center" sx={{ width: 120 }}>부서</TableCell>
                    <TableCell align="center" sx={{ width: 110 }}>이름</TableCell>
                    <TableCell align="center" sx={{ minWidth: 160 }}>행위내용</TableCell>
                    <TableCell align="center" sx={{ width: 110 }}>행위자</TableCell>
                    <TableCell align="center" sx={{ width: 120 }}>행위일자</TableCell>
                  </TableRow>
                </TableHead>
              }
            >
              {authrtHistoryRows.map((row, index) => (
                <TableRow
                  key={`${row.inqAuthrtHstryNo || row.inqAuthrtNo || "row"}-${index}`}
                  onClick={() => {
                    if (!row.eldocNo) return;
                    setSelectEdeldocNo(row.eldocNo);
                  }}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell align="center">
                    {(row as any).deptNm || row.deptId || "-"}
                  </TableCell>
                  <TableCell align="center">
                    {(row as any).indvNm ||
                      (row.indvId === "ALL" ? "전체" : row.indvId) ||
                      "-"}
                  </TableCell>
                  <TableCell align="center">{row.actCn || "-"}</TableCell>
                  <TableCell align="center">
                    {(row as any).rgtrNm || row.rgtrId || "-"}
                  </TableCell>
                  <TableCell align="center">{formatDateDash(row.regDt)}</TableCell>
                </TableRow>
              ))}
              {authrtHistoryRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {authrtHistoryLoading
                      ? "공람 이력 조회 중..."
                      : "공람 이력이 없습니다."}
                  </TableCell>
                </TableRow>
              )}
            </TableWrapper>
            {selectEdeldocNo ? (
              <DocDetailTable eldocNo={selectEdeldocNo} detail={detail} />
            ) : (
              <div>선택된 공람 이력 데이터가 없습니다.</div>
            )}
          </Stack>
        </Grid>
      </Grid>
    </DialogTrigger>
  );
}
