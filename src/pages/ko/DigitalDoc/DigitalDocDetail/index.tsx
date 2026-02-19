import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import DigitalDocViewerButton from "@/components/actionButtons/DigitalDocViewerButton";
import DigitalDocDownButton from "@/components/actionButtons/DigitalDocDownButton";

import { AuthrtTable } from "@/components/table/AuthrtTable";
import GridField from "@/components/grid/GridField";
import TableWrapper from "@/components/table/TableWrapper";
import LabelCell from "@/components/table/LabelCell";

export default function DigitalDocDetail() {
  return (
    <div>
      <div className="btn_wrapper">
        {/* <DigitalDocHistoryButton eldocNo="22" /> */}
        <Button variant="contained" color="primary">
          목록
        </Button>
      </div>

      {/* 상세보기 */}
      <Grid container spacing={0} className="table-view-grid">
        <GridField label="문서분류" value="피해구제 ❯ 접수서류 ❯ 사망 신청" />
        <GridField label="문서번호" value="KIDS-0001" />
        <GridField label="기본권한" value="피해구제팀 / 전체" />
        <GridField label="문서제목" value="피해구제 접수서류 사망신청서" />
        <GridField label="수집일자" value="2025-10-01 (5년)" />
        <GridField label="종료일자" value="2030-09-30" />
        <GridField label="개인정보" value="포함" />
        <GridField label="반환여부" value="미반환" />
        <GridField label="비고" value="피해구제 접수서류 비고입니다." />
        <GridField
          label="첨부파일"
          value={
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>피해구제 접수서류.pdf</Typography>
              <DigitalDocViewerButton />
              <DigitalDocDownButton />
            </Stack>
          }
        />
      </Grid>

      <Grid container spacing={3} gap={2} mt={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          {/* 공람이력 테이블 */}
          <AuthrtTable eldocNo={"111"} tableAriaLabel="문서고 공람 이력" />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          {/* 문서분류/반환여부 테이블 */}
          <div className="tbl_wrap">
            <TableWrapper
              aria-label="문서분류/반환여부 수정"
              colgroup={
                <colgroup>
                  <col style={{ width: "80px" }} />
                  <col />
                </colgroup>
              }
            >
              {/* 문서분류 */}
              <TableRow>
                <LabelCell width={100}>문서분류</LabelCell>
                <TableCell colSpan={3}>
                  <Stack direction="row" spacing={1}>
                    <FormControl size="small" fullWidth>
                      <InputLabel>대분류</InputLabel>
                      <Select
                        id="docLclsfNo"
                        name="docLclsfNo"
                        defaultValue="00"
                      >
                        <MenuItem value="00">전체</MenuItem>
                        <MenuItem value="01">피해구제</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl size="small" fullWidth>
                      <InputLabel>소분류</InputLabel>
                      <Select
                        id="docMclsfNo"
                        name="docMclsfNo"
                        defaultValue="00"
                      >
                        <MenuItem value="00">전체</MenuItem>
                        <MenuItem value="01">피해구제</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl size="small" fullWidth>
                      <InputLabel>소분류</InputLabel>
                      <Select
                        id="docSclsfNo"
                        name="docSclsfNo"
                        label="소분류"
                        defaultValue="00"
                      >
                        <MenuItem value="00">전체</MenuItem>
                        <MenuItem value="01">피해구제</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </TableCell>
              </TableRow>
              <TableRow>
                <LabelCell>반환여부</LabelCell>
                <TableCell>
                  <FormControl component="fieldset">
                    <RadioGroup>
                      <FormControlLabel
                        value="Y"
                        control={<Radio size="small" />}
                        label="반환"
                      />
                      <FormControlLabel
                        value="N"
                        control={<Radio size="small" />}
                        label="미반환"
                      />
                    </RadioGroup>
                  </FormControl>
                </TableCell>
              </TableRow>
            </TableWrapper>
          </div>
          <Box display="flex" justifyContent="flex-end" marginTop={2}>
            <Button variant="contained" color="primary">
              수정
            </Button>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
