import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router";
import { getLangFromPathname, langPath } from "@/routes/lang";
import { columnDefs } from "./col-def";
import AgGridContainer from "@/components/grid/AgGridContainer";
import DUMMY_CLASSIFICATION_DATA from "@/mocks/edoc/docClassificationListDummyData.json";

export default function DocClassificationList() {
  const navigate = useNavigate();
  const curLang = getLangFromPathname(location.pathname);

  const handleCreateClick = () => {
    navigate(langPath("docClassificationList/create", curLang));
  };

  const handleRowClick = (row: { docClsfNo?: string }) => {
    if (!row?.docClsfNo) return;
    navigate(langPath(`docClassificationList/${row.docClsfNo}`, curLang));
  };

  return (
    <div>
      {/* <!-- 검색조건 --> */}
      <div className="filter">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 3 }}>
            <div className="filter-field">
              <label className="filter-label">대상</label>
              <div className="field_select">
                <FormControl size="small" fullWidth>
                  <Select id="docMclsfNo" name="docMclsfNo" defaultValue="00">
                    <MenuItem value="00">전체</MenuItem>
                    <MenuItem value="01">피해구제</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <div className="filter-field">
              <label className="filter-label">소분류</label>
              <div className="field_select">
                <FormControl size="small" fullWidth>
                  <Select id="docSclsfNo" name="docSclsfNo" defaultValue="00">
                    <MenuItem value="00">전체</MenuItem>
                    <MenuItem value="01">피해구제</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} alignContent="flex-end">
            <FormControl error={false}>
              <FormControlLabel
                name="holding-check"
                control={<Checkbox size="small" />}
                label="개인정보 포함"
              />
            </FormControl>
          </Grid>
          {/* 2행: 사용유무 / 검색어 / 검색 버튼 */}
          <Grid size={{ xs: 12, sm: 3 }}>
            <div className="filter-field">
              <label className="filter-label">사용유무</label>
              <div className="field_select">
                <FormControl size="small" fullWidth>
                  <Select id="useEn" name="useEn" defaultValue="00">
                    <MenuItem value="00">전체</MenuItem>
                    <MenuItem value="00">사용</MenuItem>
                    <MenuItem value="01">사용안함</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </Grid>
          <Grid size={{ xs: 12, sm: 9 }}>
            <div className="filter-field">
              <label className="filter-label">검색어</label>
              <TextField name="docClsfNm" size="small" fullWidth />
            </div>
          </Grid>
        </Grid>
        <div className="filter-actions">
          <Button size="small" variant="contained">
            조회
          </Button>
        </div>
      </div>

      <Divider sx={{ my: 2 }} />
      <div className="btn_wrapper">
        <Button size="small" variant="contained" onClick={handleCreateClick}>
          등록
        </Button>
      </div>

      {/* <!-- 본문 --> */}
      <AgGridContainer
        colDefs={columnDefs}
        rowData={DUMMY_CLASSIFICATION_DATA}
        count={DUMMY_CLASSIFICATION_DATA.length}
        onRowClick={handleRowClick}
      />
    </div>
  );
}
