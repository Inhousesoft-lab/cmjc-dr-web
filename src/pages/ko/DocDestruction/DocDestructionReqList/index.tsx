import {
  Button,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

import AgGridContainer from "@/components/grid/AgGridContainer";
import { columnDefs } from "./col-def";

import DocDestructionReqButton from "@/components/actionButtons/DocDestructionReqButton";
import DESTRUCTION_LIST_DUMMY_DATA from "@/mocks/edoc/edocDestructionListDummyData.json";
import { useCallback, useState } from "react";

export default function DocDestructionReqList() {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const handleSelectionChange = useCallback((rows: any[]) => {
    setSelectedRows(rows);
  }, []);

  return (
    <div className="content_wrap">
      <div className="content">
        <div className="filter" style={{ marginBottom: 16 }}>
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
                    <Select
                      id="midCategory"
                      name="midCategory"
                      defaultValue="00"
                    >
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
                <div className="field_select">
                  <FormControl size="small" fullWidth>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <DatePicker
                        format="YYYY-MM-DD"
                        slotProps={{ textField: { size: "small" } }}
                      />
                      <span>-</span>
                      <DatePicker
                        format="YYYY-MM-DD"
                        slotProps={{ textField: { size: "small" } }}
                      />
                    </Stack>
                  </FormControl>
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

        <Divider sx={{ my: 2 }} />
        <div className="btn_wrapper">
          <DocDestructionReqButton selectedRows={selectedRows} />
        </div>

        <AgGridContainer
          enableRowSelection={true}
          colDefs={columnDefs}
          rowData={DESTRUCTION_LIST_DUMMY_DATA}
          count={DESTRUCTION_LIST_DUMMY_DATA.length}
          onSelectionChange={handleSelectionChange}
        />
      </div>
    </div>
  );
}
