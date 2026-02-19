import {
  Button,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router";
import { getLangFromPathname, langPath } from "@/routes/lang";
import { columnDefs } from "./col-def";
import AgGridContainer from "@/components/grid/AgGridContainer";
import DIGITAL_DOC_LIST_MOCK_DATA from "@/mocks/edoc/digitalDocDummyData.json";

export default function DigitalDocList() {
  const navigate = useNavigate();
  const curLang = getLangFromPathname(location.pathname);

  const handleRowClick = (row: { id?: number | string }) => {
    if (row?.id == null) return;
    navigate(langPath(`digitalDoc/${row.id}`, curLang));
  };

  const handleCreateClick = () => {
    navigate(langPath("digitalDoc/create", curLang));
  };

  return (
    <div>
      {/* <!-- 검색조건 --> */}
      <div className="filter">
        <Grid container spacing={2} width="100%">
          <Grid size={{ xs: 12, sm: 3 }}>
            <div className="filter-field">
              <label className="filter-label">대분류</label>
              <div className="field_select">
                <FormControl size="small" fullWidth>
                  <Select id="docLclsfNo" name="docLclsfNo" defaultValue="00">
                    <MenuItem value="00">전체</MenuItem>
                    <MenuItem value="01">피해구제</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <div className="filter-field">
              <label className="filter-label">중분류</label>
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

          <Grid size={{ xs: 12, sm: 6 }}>
            <div className="filter-field">
              <label className="filter-label">검색어</label>
              <TextField fullWidth size="small" placeholder="문서번호" />
            </div>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="문서제목"
              label="문서제목"
            />
          </Grid>
        </Grid>
        <Button variant="contained">검색</Button>
      </div>

      <Divider sx={{ my: 2 }} />
      <div className="btn_wrapper">
        <Button size="small" variant="contained" onClick={handleCreateClick}>
          등록
        </Button>
      </div>

      <AgGridContainer
        enableRowSelection={false}
        colDefs={columnDefs}
        rowData={DIGITAL_DOC_LIST_MOCK_DATA}
        count={DIGITAL_DOC_LIST_MOCK_DATA.length}
        onRowClick={handleRowClick}
      />
    </div>
  );
}
