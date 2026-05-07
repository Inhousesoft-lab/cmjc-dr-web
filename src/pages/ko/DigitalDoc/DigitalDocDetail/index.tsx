import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { ColDef } from "ag-grid-community";
import AgGridTable from "@/components/grid/AgGridTable";
import { AuthrtTable } from "@/components/table/AuthrtTable";
import TableWrapper from "@/components/table/TableWrapper";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  fetchDigitalDocAuthrtHistoryList,
  fetchDigitalDocDetail,
  fetchDigitalDocHistoryList,
} from "@/features/digitalDoc/DigitalDocThunk";
import {
  selectDigitalDocAuthrtHistoryError,
  selectDigitalDocAuthrtHistoryLoading,
  selectDigitalDocAuthrtHistoryRows,
  selectDigitalDocDetail,
  selectDigitalDocDetailError,
  selectDigitalDocDetailLoading,
  selectDigitalDocHistoryError,
  selectDigitalDocHistoryLoading,
  selectDigitalDocHistoryRows,
} from "@/features/digitalDoc/DigitalDocSelectors";
import useNotifications from "@/hooks/useNotifications";
import PageStatus from "@/components/common/PageStatus";
import URL from "@/constants/url";
import { getLangFromPathname, langPath } from "@/routes/lang";
import DocDetailTable from "@/components/table/DocDetailTable";
import type { DigitalDocHistory, SearchValues } from "@/types/digitalDoc";
import { isDrAdminUser } from "@/features/auth/authAccess";
import { formatDateDash } from "@/utils/formater";
import useDraggableDialog from "@/hooks/useDraggableDialog";

const docHistoryColumnDefs: ColDef<DigitalDocHistory>[] = [
  {
    headerName: "번호",
    field: "rowNo",
    width: 80,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "행위일자",
    field: "regDt",
    width: 130,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) => formatDateDash(params?.value),
  },
  {
    headerName: "행위자",
    field: "rgtrId",
    width: 120,
    cellStyle: { textAlign: "center" },
    valueFormatter: (params: any) =>
      params?.data?.rgtrNm || params?.data?.rgtrId || "-",
  },
  {
    headerName: "행위내용",
    field: "actCn",
    flex: 1,
    minWidth: 180,
  },
  {
    headerName: "IP",
    field: "acsrIpAddr",
    width: 140,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "장비",
    field: "eqpmntNm",
    width: 120,
    cellStyle: { textAlign: "center" },
  },
];

export default function DigitalDocDetail() {
  const location = useLocation();
  const { eldocNo = "" } = useParams<{ eldocNo?: string }>();
  const navigate = useNavigate();
  const notifications = useNotifications();
  const dispatch = useAppDispatch();

  const detail = useAppSelector(selectDigitalDocDetail);
  const isLoading = useAppSelector(selectDigitalDocDetailLoading);
  const detailError = useAppSelector(selectDigitalDocDetailError);
  const authUser = useAppSelector((state) => state.auth.user);
  const docHistoryRows = useAppSelector(selectDigitalDocHistoryRows);
  const docHistoryLoading = useAppSelector(selectDigitalDocHistoryLoading);
  const docHistoryError = useAppSelector(selectDigitalDocHistoryError);
  const authrtHistoryRows = useAppSelector(selectDigitalDocAuthrtHistoryRows);
  const authrtHistoryLoading = useAppSelector(
    selectDigitalDocAuthrtHistoryLoading,
  );
  const authrtHistoryError = useAppSelector(selectDigitalDocAuthrtHistoryError);

  const [authrtManageOpen, setAuthrtManageOpen] = React.useState(false);
  const [selectedHistory, setSelectedHistory] =
    React.useState<DigitalDocHistory | null>(null);

  const curLang = getLangFromPathname(location.pathname);
  const isAdmin = React.useMemo(() => isDrAdminUser(authUser), [authUser]);
  const {
    paperSx: authrtPaperSx,
    handleDragStart: handleAuthrtDragStart,
  } = useDraggableDialog();
  const {
    paperSx: historyPaperSx,
    handleDragStart: handleHistoryDragStart,
  } = useDraggableDialog();

  React.useEffect(() => {
    if (!eldocNo) return;
    dispatch(fetchDigitalDocDetail(eldocNo));
  }, [dispatch, eldocNo]);

  React.useEffect(() => {
    if (!detailError) return;
    notifications.show(detailError, {
      severity: "error",
      autoHideDuration: 3000,
    });
  }, [detailError, notifications]);

  React.useEffect(() => {
    if (!isAdmin || !eldocNo) return;
    dispatch(fetchDigitalDocHistoryList(eldocNo));
    dispatch(fetchDigitalDocAuthrtHistoryList(eldocNo));
  }, [dispatch, eldocNo, isAdmin]);

  React.useEffect(() => {
    if (!docHistoryError) return;
    notifications.show(docHistoryError, {
      severity: "error",
      autoHideDuration: 3000,
    });
  }, [docHistoryError, notifications]);

  React.useEffect(() => {
    if (!authrtHistoryError) return;
    notifications.show(authrtHistoryError, {
      severity: "error",
      autoHideDuration: 3000,
    });
  }, [authrtHistoryError, notifications]);

  const handleBack = React.useCallback(() => {
    const detailState = location.state as
      | {
          sourceListPath?: string;
          listState?: SearchValues;
        }
      | null;

    navigate(langPath(detailState?.sourceListPath ?? URL.DIGITAL_DOC_LIST, curLang), {
      state: {
        restoreListState: detailState?.listState,
      },
    });
  }, [curLang, location.state, navigate]);

  const handleModify = React.useCallback(() => {
    if (!eldocNo) return;
    const detailState = location.state as
      | {
          sourceListPath?: string;
          listState?: SearchValues;
        }
      | null;

    navigate(langPath(`digitalDoc/${eldocNo}/modify`, curLang), {
      state: {
        sourceListPath: detailState?.sourceListPath ?? URL.DIGITAL_DOC_LIST,
        listState: detailState?.listState,
      },
    });
  }, [curLang, eldocNo, location.state, navigate]);

  const closeAuthrtManage = React.useCallback(() => {
    setAuthrtManageOpen(false);
    if (eldocNo) {
      dispatch(fetchDigitalDocAuthrtHistoryList(eldocNo));
    }
  }, [dispatch, eldocNo]);

  const handleHistoryRowClick = React.useCallback((event: any) => {
    if (!event.data) return;
    setSelectedHistory(event.data);
  }, []);

  const closeHistoryDetail = React.useCallback(() => {
    setSelectedHistory(null);
  }, []);

  if (isLoading) {
    return <PageStatus isLoading={isLoading} />;
  }

  return (
    <div>
      <div className="btn_wrapper">
        <Button variant="outlined" color="primary" onClick={handleModify}>
          수정
        </Button>
        <Button
          className="btn_fixed-sm"
          variant="contained"
          color="primary"
          onClick={handleBack}
        >
          목록
        </Button>
      </div>

      <DocDetailTable eldocNo={eldocNo} detail={detail} />

      {isAdmin && (
        <Box mt={3}>
          <Typography variant="h6" fontWeight={700} mb={1}>
            ▶ 이력
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <AgGridTable
                height={260}
                colDefs={docHistoryColumnDefs}
                rowData={docHistoryRows}
                isLoading={docHistoryLoading}
                onRowClicked={handleHistoryRowClick}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TableWrapper
                aria-label="공람 이력"
                tableHead={
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ fontWeight: 700 }}>
                        공람 이력
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center">부서</TableCell>
                      <TableCell align="center">행위내용</TableCell>
                      <TableCell align="center">행위자</TableCell>
                      <TableCell align="center">행위일자</TableCell>
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
                    <TableCell align="center">{formatDateDash(row.regDt)}</TableCell>
                  </TableRow>
                ))}
                {authrtHistoryRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      {authrtHistoryLoading ? "공람 이력 조회 중..." : "공람 이력이 없습니다."}
                    </TableCell>
                  </TableRow>
                )}
              </TableWrapper>
              <Box display="flex" justifyContent="flex-end" mt={1}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setAuthrtManageOpen(true)}
                >
                  관리
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Dialog
            open={authrtManageOpen}
            onClose={closeAuthrtManage}
            maxWidth="sm"
            fullWidth
            slotProps={{
              paper: {
                sx: authrtPaperSx,
              },
            }}
          >
            <DialogTitle onMouseDown={handleAuthrtDragStart} sx={{ cursor: "move" }}>
              공람 관리
            </DialogTitle>
            <DialogContent dividers>
              <AuthrtTable eldocNo={eldocNo} tableAriaLabel="공람 관리" />
            </DialogContent>
            <DialogActions>
              <Button onClick={closeAuthrtManage}>닫기</Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={!!selectedHistory}
            onClose={closeHistoryDetail}
            maxWidth="md"
            fullWidth
            slotProps={{
              paper: {
                sx: historyPaperSx,
              },
            }}
          >
            <DialogTitle onMouseDown={handleHistoryDragStart} sx={{ cursor: "move" }}>
              문서 이력 상세
            </DialogTitle>
            <DialogContent dividers>
              <DocDetailTable
                eldocNo={selectedHistory?.eldocNo ?? eldocNo}
                detail={selectedHistory}
                showAttachments={false}
              />
              <TableWrapper
                aria-label="이력 행위 정보"
                colgroup={
                  <colgroup>
                    <col className="tbl-col-w-100" />
                    <col />
                    <col className="tbl-col-w-100" />
                    <col />
                  </colgroup>
                }
              >
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: "grey.100" }}>
                    행위내용
                  </TableCell>
                  <TableCell>{selectedHistory?.actCn || "-"}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: "grey.100" }}>
                    행위일자
                  </TableCell>
                  <TableCell>{formatDateDash(selectedHistory?.regDt)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: "grey.100" }}>
                    행위자
                  </TableCell>
                  <TableCell>
                    {(selectedHistory as any)?.rgtrNm || selectedHistory?.rgtrId || "-"}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: "grey.100" }}>
                    IP
                  </TableCell>
                  <TableCell>{selectedHistory?.acsrIpAddr || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: "grey.100" }}>
                    장비
                  </TableCell>
                  <TableCell colSpan={3}>{selectedHistory?.eqpmntNm || "-"}</TableCell>
                </TableRow>
              </TableWrapper>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeHistoryDetail}>닫기</Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </div>
  );
}
