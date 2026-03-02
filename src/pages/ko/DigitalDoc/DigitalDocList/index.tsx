import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router";
import { getLangFromPathname, langPath } from "@/routes/lang";
import { listDefs } from "./col-def";
import AgGridContainer from "@/components/grid/AgGridContainer";
import React from "react";
import { ColDef } from "ag-grid-community";
import { DigitalDoc } from "@/types/digitalDoc";
import GridField from "@/components/common/GridField";

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
      <Stack direction="row" className="search-area" mb={2}>
        <Grid container spacing={0} className="table-view-grid">
          {/* 1행 */}
          <GridField
            item={6}
            label="대분류"
            value={
              <FormControl size="small" fullWidth>
                <Select id="docLclsfNo" name="docLclsfNo" defaultValue="00">
                  <MenuItem value="00">전체</MenuItem>
                  <MenuItem value="01">피해구제</MenuItem>
                </Select>
              </FormControl>
            }
          />
          <GridField
            item={6}
            label="중분류"
            value={
              <FormControl size="small" fullWidth>
                <Select id="docMclsfNo" name="docMclsfNo" defaultValue="00">
                  <MenuItem value="00">전체</MenuItem>
                  <MenuItem value="01">피해구제</MenuItem>
                </Select>
              </FormControl>
            }
          />
          <GridField
            item={6}
            label="중분류"
            value={
              <FormControl size="small" fullWidth>
                <Select id="docSclsfNo" name="docSclsfNo" defaultValue="00">
                  <MenuItem value="00">전체</MenuItem>
                  <MenuItem value="01">피해구제</MenuItem>
                </Select>
              </FormControl>
            }
          />
          <GridField
            item={6}
            label="검색어"
            value={<TextField fullWidth size="small" placeholder="문서번호" />}
          />
          <GridField
            item={12}
            label="문서제목"
            value={
              <TextField
                fullWidth
                size="small"
                placeholder="문서제목"
                label="문서제목"
              />
            }
          />
        </Grid>
        <Box className="table-view-actions">
          <Button variant="contained">검색</Button>
        </Box>
      </Stack>

      <AgGridContainer<DigitalDoc>
        actionButtons={[{ label: "등록", onClick: handleCreateClick }]}
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
