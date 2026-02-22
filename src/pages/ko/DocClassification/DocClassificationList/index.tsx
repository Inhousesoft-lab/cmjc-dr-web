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
import { listDefs } from "./col-def";
import AgGridContainer from "@/components/grid/AgGridContainer";
import React from "react";
import { ColDef } from "ag-grid-community";
import useNotifications from "@/hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import { DocClassification } from "@/types/docClassification";

export default function DocClassificationList() {
  const navigate = useNavigate();
  const notifications = useNotifications();

  const [columnDefs] = React.useState<ColDef[]>(listDefs);

  const [isLoading, setIsLoading] = React.useState(true);
  const [rowData, setRowsData] = React.useState<{
    rows: DocClassification[];
    rowCount: number;
  }>({
    rows: [],
    rowCount: 0,
  });

  const handleCreateClick = () => {
    navigate(`/docClassification/create`);
  };

  const handleRowClick = (row: DocClassification) => {
    navigate(`/docClassification/${row.docClsfNo}`);
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
          <Grid
            size={{ xs: 12, sm: 3 }}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <div className="filter-field filter-field--checkbox">
              <FormControlLabel
                className="filter-checkbox"
                name="holding-check"
                control={<Checkbox size="small" />}
                label="개인정보 포함"
              />
            </div>
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
        <Button size="small" variant="contained">
          조회
        </Button>
      </div>
      <Divider sx={{ marginY: 2 }} />

      <div className="btn_wrapper">
        <Button size="small" variant="contained" onClick={handleCreateClick}>
          등록
        </Button>
      </div>

      {/* <!-- 본문 --> */}
      <AgGridContainer
        isLoading={isLoading}
        colDefs={columnDefs}
        rowData={rowData.rows}
        count={rowData.rowCount}
        onRowClick={handleRowClick}
      />
    </div>
  );
}
