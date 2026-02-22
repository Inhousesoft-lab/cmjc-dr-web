import React, { useCallback, useState } from "react";
import {
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { MuiDatePickerFt } from "@/components/elements/MuiDatePickerFt";

import AgGridContainer from "@/components/grid/AgGridContainer";
import { listDefs } from "./col-def";

import DocDestructionAppvButton from "@/components/actionButtons/DocDestructionAppvButton";
import useNotifications from "@/hooks/useNotifications";
import { DocDestruction } from "@/types/docDestruction";
import { ColDef } from "ag-grid-community";

export default function DocDestructionReqList() {
  const notifications = useNotifications();

  const [columnDefs] = React.useState<ColDef<any>[]>(listDefs);

  const [rowData, setRowsData] = React.useState<{
    rows: DocDestruction[];
    rowCount: number;
  }>({
    rows: [],
    rowCount: 0,
  });

  const [isLoading, setIsLoading] = React.useState(true);

  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const handleSelectionChange = useCallback((rows: any[]) => {
    setSelectedRows(rows);
  }, []);

  return (
    <div>
      <div className="filter">
        <Grid container spacing={2}>
          {/* 1행 */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <div className="filter-field">
              <label className="filter-label">대분류</label>
              <div className="field_select">
                <FormControl size="small" fullWidth>
                  <Select
                    id="largeCategory"
                    name="largeCategory"
                    defaultValue="00"
                  >
                    <MenuItem value="00">전체</MenuItem>
                    <MenuItem value="01">피해구제</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <div className="filter-field">
              <label className="filter-label">중분류</label>
              <div className="field_select">
                <FormControl size="small" fullWidth>
                  <Select id="midCategory" name="midCategory" defaultValue="00">
                    <MenuItem value="00">전체</MenuItem>
                    <MenuItem value="01">접수서류</MenuItem>
                    <MenuItem value="02">신청자 제출서류</MenuItem>
                    <MenuItem value="03">직원보완자료</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <div className="filter-field">
              <label className="filter-label">소분류</label>
              <div className="field_select">
                <FormControl size="small" fullWidth>
                  <Select
                    id="smallCategory"
                    name="smallCategory"
                    defaultValue="00"
                  >
                    <MenuItem value="00">전체</MenuItem>
                    <MenuItem value="01">사망 신청</MenuItem>
                    <MenuItem value="02">미성년자 신청</MenuItem>
                    <MenuItem value="03">이전문서</MenuItem>
                    <MenuItem value="04">의무기록</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </Grid>
          {/* 2행 MuiDateRangePicker */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <div className="filter-field">
              <label className="filter-label">기간</label>
              <div className="filter-range">
                <MuiDatePickerFt value={""} onChange={() => {}} />
                <span className="filter-range-sep">-</span>{" "}
                <MuiDatePickerFt value={""} onChange={() => {}} />
              </div>
            </div>
          </Grid>
        </Grid>
        <div className="filter-actions">
          <Button size="small" variant="contained">
            조회
          </Button>
        </div>
      </div>

      <Stack direction="row" spacing={1} justifyContent="right" mt={2}>
        <DocDestructionAppvButton selectedRows={selectedRows} />
      </Stack>

      <AgGridContainer
        isLoading={isLoading}
        enableRowSelection={true}
        colDefs={columnDefs}
        rowData={rowData.rows}
        count={rowData.rowCount}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
}
