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
import { listDefs } from "./col-def";
import AgGridContainer from "@/components/grid/AgGridContainer";
import React from "react";
import { ColDef } from "ag-grid-community";
import { DigitalDoc } from "@/types/digitalDoc";

export default function DigitalDocList() {
  const navigate = useNavigate();
  const curLang = getLangFromPathname(location.pathname);

  const [columnDefs] = React.useState<ColDef<DigitalDoc>[]>(listDefs);

  const [isLoading, setIsLoading] = React.useState(true);
  const [rowData, setRowsData] = React.useState<{
    rows: DigitalDoc[];
    rowCount: number;
  }>({
    rows: [],
    rowCount: 0,
  });

  const handleRowClick = (row: DigitalDoc) => {
    if (!row.eldocNo) return;
    navigate(langPath(`digitalDoc/${row.eldocNo}`, curLang));
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

      <AgGridContainer<DigitalDoc>
        isLoading={isLoading}
        enableRowSelection={false}
        colDefs={columnDefs}
        rowData={rowData.rows}
        count={rowData.rowCount}
        onRowClick={handleRowClick}
      />
    </div>
  );
}
