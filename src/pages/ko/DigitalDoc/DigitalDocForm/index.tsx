import LabelCell from "@/components/table/LabelCell";
import TableWrapper from "@/components/table/TableWrapper";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

export default function DigitalDocForm() {
  return (
    <div>
      <TableWrapper
        aria-label="디지털 문서 상세 정보"
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
          <LabelCell>문서분류</LabelCell>
          <TableCell colSpan={3}>
            <Stack direction="row" spacing={1}>
              <FormControl size="small" fullWidth>
                <FormLabel>대분류</FormLabel>
                <Select id="docLclsfNo" name="docLclsfNo" defaultValue="00">
                  <MenuItem value="00">전체</MenuItem>
                  <MenuItem value="01">피해구제</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" fullWidth>
                <FormLabel>중분류</FormLabel>
                <Select id="docMclsfNo" name="docMclsfNo" defaultValue="00">
                  <MenuItem value="00">전체</MenuItem>
                  <MenuItem value="01">피해구제</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" fullWidth>
                <FormLabel>소분류</FormLabel>
                <Select id="docSclsfNo" name="docSclsfNo" defaultValue="00">
                  <MenuItem value="00">전체</MenuItem>
                  <MenuItem value="01">피해구제</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>문서분류</LabelCell>
          <TableCell colSpan={3}>
            <TextField
              fullWidth
              id="docNo"
              name="docNo"
              placeholder="문서분류"
              size="small"
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>문서제목</LabelCell>
          <TableCell colSpan={3}>
            <TextField
              fullWidth
              id="docTitle"
              name="docTitle"
              placeholder="문서제목"
              size="small"
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>수집일자</LabelCell>
          <TableCell>
            <DatePicker
              format="YYYY-MM-DD"
              slotProps={{ textField: { size: "small" } }}
            />
          </TableCell>
          <LabelCell>보존연한</LabelCell>
          <TableCell>
            <Stack direction="row" spacing={1} alignItems="center">
              <FormControl fullWidth>
                <Select fullWidth size="small" name="hldPrdDfyrs">
                  <MenuItem value="1">1년</MenuItem>
                  <MenuItem value="3">3년</MenuItem>
                  <MenuItem value="5">5년</MenuItem>
                  <MenuItem value="10">10년</MenuItem>
                  <MenuItem value="30">30년</MenuItem>
                  <MenuItem value="90">준영구</MenuItem>
                  <MenuItem value="99">영구</MenuItem>
                  <MenuItem value="0">직접입력</MenuItem>
                </Select>
              </FormControl>
              <TextField
                size="small"
                fullWidth
                name="hldPrdMmCnt"
                placeholder="월"
                type="text"
              />
              &nbsp;개월
            </Stack>
          </TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>종료일자</LabelCell>
          <TableCell colSpan={3}>
            <Stack direction="row" spacing={1} alignItems="center">
              <DatePicker
                format="YYYY-MM-DD"
                slotProps={{ textField: { size: "small" } }}
              />
              <Typography variant="body1" color="text.secondary">
                * 보존연한을 직접 입력하신 경우 종료일자를 달력에서 선택하여
                입력해 주세요.
              </Typography>
            </Stack>
          </TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>비고</LabelCell>
          <TableCell colSpan={3}>
            <TextField
              fullWidth
              id="remark"
              name="remark"
              placeholder="비고"
              multiline
              minRows={3}
              size="small"
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <LabelCell>비고</LabelCell>
          <TableCell colSpan={3}>
            <Stack direction="row" spacing={1} alignItems="center">
              <RadioGroup row name="uploadType">
                <FormControlLabel
                  value="document"
                  control={<Radio size="small" />}
                  label="문서"
                />
                <FormControlLabel
                  value="file"
                  control={<Radio size="small" />}
                  label="파일"
                />
              </RadioGroup>

              <TextField
                id="fileName"
                name="fileName"
                placeholder="전자문서파일.pdf"
                size="small"
                disabled
              />
              <Button variant="contained">파일</Button>
            </Stack>
          </TableCell>
        </TableRow>
      </TableWrapper>

      <Stack direction="row" spacing={1} justifyContent="flex-end" mt={2}>
        <Button size="large" variant="contained">
          취소
        </Button>
        <Button size="large" variant="outlined">
          등록
        </Button>
      </Stack>
    </div>
  );
}
