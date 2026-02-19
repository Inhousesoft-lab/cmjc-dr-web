import * as React from "react";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  MenuItem,
  FormHelperText,
  Select,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import type { DocClassDetailFormState } from "@/types/docClassification";
import TableWrapper from "@/components/table/TableWrapper";
import LabelCell from "@/components/table/LabelCell";

/* ------------------------------------------------------------------ */
/* 타입/초기값                                                         */
/* ------------------------------------------------------------------ */
const INITIAL_FORM_VALUES: DocClassDetailFormState["values"] = {
  docClsfNo: "",
  docClsfSeCd: "L",
  docClsfNm: "",
  upDocClsfNo: "",
  docLclsfNo: "",
  docMclsfNo: "",
  docSclsfNo: "",
  docLclsfNm: "",
  docMclsfNm: "",
  docSclsfNm: "",
  prvcInclYn: "N",
  useEn: "Y",
  prvcFileHldPrst: {},
};

type Values = DocClassDetailFormState["values"];

/* ------------------------------------------------------------------ */
/* 개인정보 상세 테이블 (subDetail 전용) – 전부 비제어                  */
/* ------------------------------------------------------------------ */
export default function DocClassificationForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // 초기값/조회값만 들고 있음 (입력 중에는 state 변경 없음)
  const [defaults, setDefaults] = React.useState<Values>(INITIAL_FORM_VALUES);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>(
    {},
  );

  const [docClsfSeCd, setdocClsfSeCd] = React.useState<string>("L");

  return (
    <Stack spacing={2}>
      <div className="tbl_wrap">
        <TableWrapper
          colgroup={
            <colgroup>
              <col style={{ width: "200px" }} />
              <col />
            </colgroup>
          }
        >
          <TableRow>
            <LabelCell>문서분류</LabelCell>
            <TableCell>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  name="docClsfSeCd"
                  value={docClsfSeCd}
                  onChange={(e) => setdocClsfSeCd(e.target.value)}
                >
                  <FormControlLabel
                    value="L"
                    control={<Radio size="small" />}
                    label="대분류"
                  />
                  <FormControlLabel
                    value="M"
                    control={<Radio size="small" />}
                    label="중분류"
                  />
                  <FormControlLabel
                    value="S"
                    control={<Radio size="small" />}
                    label="소분류"
                  />
                </RadioGroup>
              </FormControl>
            </TableCell>
          </TableRow>
          <TableRow>
            <LabelCell>대분류</LabelCell>
            <TableCell>
              <FormControl>
                <Select
                  id="docLlsfNo"
                  size="small"
                  defaultValue={10}
                  displayEmpty
                >
                  <MenuItem value={10}>10개씩</MenuItem>
                  <MenuItem value={20}>20개씩</MenuItem>
                  <MenuItem value={30}>30개씩</MenuItem>
                </Select>
              </FormControl>
            </TableCell>
          </TableRow>
          <TableRow>
            <LabelCell>중분류</LabelCell>
            <TableCell>
              <FormControl>
                <Select
                  id="docMlsfNo"
                  size="small"
                  defaultValue={10}
                  displayEmpty
                >
                  <MenuItem value={10}>10개씩</MenuItem>
                  <MenuItem value={20}>20개씩</MenuItem>
                  <MenuItem value={30}>30개씩</MenuItem>
                </Select>
              </FormControl>
            </TableCell>
          </TableRow>
          <TableRow>
            <LabelCell>소분류</LabelCell>
            <TableCell>
              <Stack direction="row" spacing={1}>
                <TextField
                  size="small"
                  name="docSclsfNm"
                  defaultValue={defaults.docSclsfNm ?? ""}
                  placeholder="소분류"
                  error={!!formErrors.docSclsfNm}
                  helperText={formErrors.docSclsfNm ?? " "}
                  fullWidth
                />
                <FormControl>
                  <FormControlLabel
                    name="MuiCheckbox"
                    control={<Checkbox size="small" />}
                    label="개인정보포함"
                  />
                </FormControl>
              </Stack>
            </TableCell>
          </TableRow>
        </TableWrapper>
      </div>
      <div className="tbl_wrap">
        <TableWrapper
          tableAriaLabel="디지털 문서 상세 정보"
          colgroup={
            <colgroup>
              <col style={{ width: "200px" }} />
              <col />
              <col style={{ width: "200px" }} />
              <col />
            </colgroup>
          }
        >
          <TableRow>
            <LabelCell>부서명</LabelCell>
            <TableCell>
              <TextField
                fullWidth
                size="small"
                placeholder="부서명"
                name="prvcFileHldPrst"
              />
            </TableCell>
            <LabelCell>파일명</LabelCell>
            <TableCell>
              <TextField
                fullWidth
                size="small"
                placeholder="파일명"
                name="prvcFileHldPrst"
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <LabelCell>보유목적</LabelCell>
            <TableCell colSpan={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="보유목적"
                name="hldPrpsExpln"
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <LabelCell>수집근거(법령)</LabelCell>
            <TableCell colSpan={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="수집근거(법령)"
                name="clctSttBssExpln"
                multiline
                rows={5}
                defaultValue={defaults.prvcFileHldPrst?.clctSttBssExpln ?? ""}
                error={!!formErrors.clctSttBssExpln}
                helperText={formErrors.clctSttBssExpln ?? ""}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <LabelCell>사용부서명(내부,외부)</LabelCell>
            <TableCell>
              <TextField
                fullWidth
                size="small"
                placeholder="사용부서"
                name="useDeptNm"
              />
            </TableCell>
            <LabelCell>보유기간</LabelCell>
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
            <LabelCell>개인정보 처리방법</LabelCell>
            <TableCell colSpan={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="개인정보 처리방법"
                name="infoMnbdPrvcMttr"
                multiline
                rows={5}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <LabelCell>정보주체의 개인정보항목</LabelCell>
            <TableCell colSpan={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="정보주체의 개인정보항목"
                name="infoMnbdPrvcMttr"
                multiline
                rows={5}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <LabelCell>법정대리인의 개인정보항목</LabelCell>
            <TableCell colSpan={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="법정대리인의 개인정보항목"
                name="sttyAgtPrvcMttr"
                multiline
                rows={5}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <LabelCell>법정대리인의 개인정보항목</LabelCell>
            <TableCell colSpan={3}>
              <RadioGroup
                row
                name="rrnoClctYn"
                defaultValue={defaults.prvcFileHldPrst?.rrnoClctYn ?? "N"}
              >
                <FormControlLabel
                  value="Y"
                  control={<Radio size="small" />}
                  label="수집"
                />
                <FormControlLabel
                  value="N"
                  control={<Radio size="small" />}
                  label="미수집"
                />
              </RadioGroup>
            </TableCell>
          </TableRow>
          <TableRow>
            <LabelCell>주민등록번호 수집 법령근거</LabelCell>
            <TableCell colSpan={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="주민등록번호 수집 법령근거"
                name="rrnoClctSttBssExpln"
                multiline
                rows={5}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <LabelCell>주민등록번호 수집 법령근거</LabelCell>
            <TableCell colSpan={3}>
              <FormControl error={false}>
                <FormControlLabel
                  name="infoMnbdAgreYn"
                  control={<Checkbox size="small" />}
                  label="동의"
                />
                <FormHelperText error={false}>필수입니다.</FormHelperText>
              </FormControl>
            </TableCell>
          </TableRow>
          <TableRow>
            <LabelCell>정보주체 동의 없이 수집 법령근거</LabelCell>
            <TableCell colSpan={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="정보주체 동의 없이 수집 법령근거"
                name="infoMnbdDsagClctSttBssExpln"
                multiline
                rows={5}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <LabelCell>민감 정보 보유여부</LabelCell>
            <TableCell>
              <RadioGroup
                row
                name="sensInfoHldYn"
                defaultValue={defaults.prvcFileHldPrst?.sensInfoHldYn ?? "N"}
              >
                <FormControlLabel
                  value="Y"
                  control={<Radio size="small" />}
                  label="보유"
                />
                <FormControlLabel
                  value="N"
                  control={<Radio size="small" />}
                  label="미보유"
                />
              </RadioGroup>
            </TableCell>
            <LabelCell>민감 정보 별도 동의여부</LabelCell>
            <TableCell>
              <RadioGroup
                row
                name="sensInfoIndivAgreYn"
                defaultValue={
                  defaults.prvcFileHldPrst?.sensInfoIndivAgreYn ?? "N"
                }
              >
                <FormControlLabel
                  value="Y"
                  control={<Radio size="small" />}
                  label="동의"
                />
                <FormControlLabel
                  value="N"
                  control={<Radio size="small" />}
                  label="미동의"
                />
              </RadioGroup>
            </TableCell>
          </TableRow>
        </TableWrapper>
      </div>
      <Stack direction="row" spacing={1} justifyContent="right">
        <Button size="large" variant="contained">
          취소
        </Button>
        <Button size="large" variant="outlined" disabled={isSubmitting}>
          등록
        </Button>
      </Stack>
    </Stack>
  );
}
