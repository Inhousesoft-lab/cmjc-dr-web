import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Grid, Stack, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import type { ColDef, RowClickedEvent } from "ag-grid-community";
import DialogTrigger from "../dialog/DialogTrigger";
import TableWrapper from "../table/TableWrapper";
import AgGridTable from "../grid/AgGridTable";
import DocDetailTable from "../table/DocDetailTable";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  fetchDigitalDocAuthrtHistoryList,
  fetchDigitalDocHistoryList,
} from "@/features/digitalDoc/DigitalDocThunk";
import {
  selectDigitalDocAuthrtHistoryError,
  selectDigitalDocAuthrtHistoryLoading,
  selectDigitalDocAuthrtHistoryRows,
  selectDigitalDocHistoryError,
  selectDigitalDocHistoryLoading,
  selectDigitalDocHistoryRows,
} from "@/features/digitalDoc/DigitalDocSelectors";
import useNotifications from "@/hooks/useNotifications";
import type { DigitalDocHistory } from "@/types/digitalDoc";
import { formatDateDash } from "@/utils/formater";

const docListDefs: ColDef<DigitalDocHistory>[] = [
  {
    headerName: "번호",
    field: "rowNo",
    width: 80,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "이력번호",
    field: "eldocHstryNo",
    hide: true,
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
  const [selectedHistory, setSelectedHistory] = useState<DigitalDocHistory | null>(
    null,
  );

  const docHistoryRows = useAppSelector(selectDigitalDocHistoryRows);
  const docHistoryLoading = useAppSelector(selectDigitalDocHistoryLoading);
  const docHistoryError = useAppSelector(selectDigitalDocHistoryError);
  const authrtHistoryRows = useAppSelector(selectDigitalDocAuthrtHistoryRows);
  const authrtHistoryLoading = useAppSelector(
    selectDigitalDocAuthrtHistoryLoading,
  );
  const authrtHistoryError = useAppSelector(selectDigitalDocAuthrtHistoryError);

  const docColumnDefs = useMemo(() => docListDefs, []);

  useEffect(() => {
    if (!open || !eldocNo) return;

    dispatch(fetchDigitalDocHistoryList(eldocNo));
    dispatch(fetchDigitalDocAuthrtHistoryList(eldocNo));
  }, [dispatch, eldocNo, open]);

  useEffect(() => {
    if (!open) {
      setSelectedHistory(null);
      return;
    }

    if (docHistoryRows.length === 0) {
      setSelectedHistory(null);
      return;
    }

    setSelectedHistory((prev) => {
      if (!prev) return docHistoryRows[0];
      return (
        docHistoryRows.find((row) => row.eldocHstryNo === prev.eldocHstryNo) ??
        docHistoryRows[0]
      );
    });
  }, [docHistoryRows, open]);

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

  const handleRowClicked = (event: RowClickedEvent<DigitalDocHistory>) => {
    setSelectedHistory(event.data ?? null);
  };

  return (
    <DialogTrigger
      buttonLabel="이력"
      triggerButtonClassName="btn_fixed-sm btn_fixed-md"
      title="이력"
      maxWidth="xl"
      paperSx={{
        width: "min(1280px, 94vw)",
        height: "min(820px, 90vh)",
        minHeight: "auto",
        "& .MuiDialogContent-root": {
          px: 2,
          py: 1.5,
          overflow: "hidden",
        },
      }}
      onOpen={() => setOpen(true)}
      open={open}
      onClose={() => setOpen(false)}
    >
      <Stack spacing={2} sx={{ height: "100%", minHeight: 0 }}>
        <Grid container spacing={2} sx={{ minHeight: 0 }}>
          <Grid size={6}>
            <Box sx={{ height: 360, maxHeight: "38vh" }}>
              <AgGridTable
                height={360}
                colDefs={docColumnDefs}
                rowData={docHistoryRows}
                isLoading={docHistoryLoading}
                onRowClicked={handleRowClicked}
              />
            </Box>
          </Grid>
          <Grid size={6}>
            <Box sx={{ height: 360, maxHeight: "38vh", overflow: "auto" }}>
              <Stack spacing={1}>
                <TableWrapper
                  tableAriaLabel="권한 이력"
                  tableHead={
                    <TableHead>
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          align="center"
                          sx={{ fontWeight: 700 }}
                        >
                          권한 이력
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="center" sx={{ width: 120 }}>
                          부서
                        </TableCell>
                        <TableCell align="center" sx={{ minWidth: 160 }}>
                          행위내용
                        </TableCell>
                        <TableCell align="center" sx={{ width: 110 }}>
                          행위자
                        </TableCell>
                        <TableCell align="center" sx={{ width: 120 }}>
                          행위일자
                        </TableCell>
                      </TableRow>
                    </TableHead>
                  }
                >
                  {authrtHistoryRows.map((row, index) => (
                    <TableRow
                      key={`${row.inqAuthrtHstryNo || row.inqAuthrtNo || "row"}-${index}`}
                    >
                      <TableCell align="center">
                        {(row as any).deptNm || row.deptId || "-"}
                      </TableCell>
                      <TableCell align="center">{row.actCn || "-"}</TableCell>
                      <TableCell align="center">
                        {(row as any).rgtrNm || row.rgtrId || "-"}
                      </TableCell>
                      <TableCell align="center">
                        {formatDateDash(row.regDt)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {authrtHistoryRows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        {authrtHistoryLoading
                          ? "권한 이력 조회 중..."
                          : "권한 이력이 없습니다."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableWrapper>
              </Stack>
            </Box>
          </Grid>
        </Grid>

        <Stack spacing={1} sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
          <Typography variant="subtitle1" fontWeight={700}>
            이력 시점 전자문서 데이터
          </Typography>
          {selectedHistory ? (
            <>
              <Alert severity="info" sx={{ py: 0 }}>
                선택 이력: {selectedHistory.rowNo || "-"} / 행위일자{" "}
                {formatDateDash(selectedHistory.regDt)} / 행위내용{" "}
                {selectedHistory.actCn || "-"}
              </Alert>
              <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", pr: 0.5 }}>
                <DocDetailTable
                  eldocNo={eldocNo}
                  detail={selectedHistory}
                  showAttachments
                />
              </Box>
            </>
          ) : (
            <Alert severity="info" sx={{ py: 0 }}>
              조회된 이력 항목을 선택하세요.
            </Alert>
          )}
        </Stack>
      </Stack>
    </DialogTrigger>
  );
}
