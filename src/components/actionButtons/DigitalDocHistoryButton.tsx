import { useState } from "react";
import {
  Grid,
  Stack,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { ColDef } from "ag-grid-community";
import DialogTrigger from "../dialog/DialogTrigger";
import GridField from "../common/GridField";
import TableWrapper from "../table/TableWrapper";
import AgGridTable from "../grid/AgGridTable";

const authHistoryRows = [
  {
    eldocHstryNo: 1,
    dept: "피해구제팀",
    name: "-",
    action: "추가",
    actor: "홍길동",
    date: "25.10.01.",
  },
  {
    eldocHstryNo: 2,
    dept: "정보화팀",
    name: "홍길동",
    action: "추가",
    actor: "홍길동",
    date: "25.08.10.",
  },
];

const docListDefs = [
  {
    headerName: "번호",
    field: "eldocHstryNo",
    width: 90,
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "행위일자",
    field: "regDt",
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "행위자",
    field: "rgtrId",
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "행위내용",
    field: "actCn",
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "IP",
    field: "acsrIpAddr",
    cellStyle: { textAlign: "center" },
  },
  {
    headerName: "장비",
    field: "eqpmntNm",
    cellStyle: { textAlign: "center" },
  },
];

const docHistoryRows = [
  {
    eldocHstryNo: 1,
    regDt: "2025. 10. 27.",
    rgtrId: "김길동",
    actCn: "문서열람",
    acsrIpAddr: "111.111.111.111",
    eqpmntNm: "PC",
  },
  {
    eldocHstryNo: 2,
    regDt: "2025. 10. 15.",
    rgtrId: "홍길동",
    actCn: "보유기간 변경",
    acsrIpAddr: "111.111.111.111",
    eqpmntNm: "PC",
  },
  {
    eldocHstryNo: 3,
    regDt: "2025. 10. 02.",
    rgtrId: "홍길동",
    actCn: "첨부파일 다운로드 (문서열람)",
    acsrIpAddr: "111.111.111.111",
    eqpmntNm: "PC",
  },
  {
    eldocHstryNo: 4,
    regDt: "2025. 10. 01.",
    rgtrId: "홍길동",
    actCn: "공람 추가",
    acsrIpAddr: "111.111.111.111",
    eqpmntNm: "PC",
  },
  {
    eldocHstryNo: 5,
    regDt: "2025. 09. 30.",
    rgtrId: "홍길동",
    actCn: "문서분류 수정",
    acsrIpAddr: "111.111.111.111",
    eqpmntNm: "PC",
  },
  {
    eldocHstryNo: 6,
    regDt: "2025. 09. 26.",
    rgtrId: "홍길동",
    actCn: "문서 등록",
    acsrIpAddr: "111.111.111.111",
    eqpmntNm: "PC",
  },
];

export default function DigitalDocHistoryButton({
  eldocNo,
  onOpen,
}: {
  eldocNo: string;
  onOpen?: () => void;
}) {
  const [open, setOpen] = useState(false);

  const [docColumnDefs] = useState<ColDef[]>(docListDefs);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <DialogTrigger
      buttonLabel="이력"
      title="이력"
      maxWidth="xl"
      onOpen={handleClickOpen}
      open={open}
      onClose={handleClose}
    >
      <Grid container spacing={3}>
        <Grid size={6}>
          <AgGridTable colDefs={docColumnDefs} rowData={docHistoryRows} />
        </Grid>
        <Grid size={6}>
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
                  <TableCell align="center">부서</TableCell>
                  <TableCell align="center">이름</TableCell>
                  <TableCell align="center">행위내용</TableCell>
                  <TableCell align="center">행위자</TableCell>
                  <TableCell align="center">행위일자</TableCell>
                </TableRow>
              </TableHead>
            }
          >
            {authHistoryRows.map((row, index) => (
              <TableRow key={`${row.dept}-${row.date}-${index}`}>
                <TableCell align="center">{row.dept}</TableCell>
                <TableCell align="center">{row.name}</TableCell>
                <TableCell align="center">{row.action}</TableCell>
                <TableCell align="center">{row.actor}</TableCell>
                <TableCell align="center">{row.date}</TableCell>
              </TableRow>
            ))}
            {Array.from({ length: 2 }).map((_, index) => (
              <TableRow key={`empty-row-${index}`}>
                <TableCell align="center">&nbsp;</TableCell>
                <TableCell align="center">&nbsp;</TableCell>
                <TableCell align="center">&nbsp;</TableCell>
                <TableCell align="center">&nbsp;</TableCell>
                <TableCell align="center">&nbsp;</TableCell>
              </TableRow>
            ))}
          </TableWrapper>
        </Grid>
        <Grid size={12}>
          <Grid container spacing={0} className="table-view-grid">
            <GridField
              item={12}
              label="문서분류"
              value="피해구제 ❯ 접수서류 ❯ 사망 신청"
            />
            <GridField label="문서번호" value="KIDS-0001" />
            <GridField label="기본권한" value="피해구제팀 / 전체" />
            <GridField
              item={12}
              label="문서제목"
              value="피해구제 접수서류 사망신청서"
            />
            <GridField label="수집일자" value="2025-10-01 (5년)" />
            <GridField label="종료일자" value="2030-09-30" />
            <GridField label="개인정보" value="포함" />
            <GridField label="반환여부" value="미반환" />
            <GridField
              item={12}
              label="비고"
              value="피해구제 접수서류 비고입니다."
            />
            <GridField
              item={12}
              label="첨부파일"
              value={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>피해구제 접수서류.pdf</Typography>
                </Stack>
              }
            />
          </Grid>
        </Grid>
      </Grid>
    </DialogTrigger>
  );
}
