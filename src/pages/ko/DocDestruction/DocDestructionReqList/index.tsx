import { useCallback, useState } from "react";
import { Button, Divider, FormControl, Grid, MenuItem } from "@mui/material";
import { MuiDatePickerFt } from "@/components/elements/MuiDatePickerFt";

import AgGridContainer from "@/components/grid/AgGridContainer";
import { columnDefs } from "./col-def";

import DocDestructionReqButton from "@/components/actionButtons/DocDestructionReqButton";
import DESTRUCTION_LIST_DUMMY_DATA from "@/mocks/edoc/edocDestructionListDummyData.json";
import MuiSelect from "@/components/elements/MuiSelect";

export default function DocDestructionReqList() {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const handleSelectionChange = useCallback((rows: any[]) => {
    setSelectedRows(rows);
  }, []);

  return (
    <div>
      <div className="filter" style={{ marginBottom: 16 }}>
        <Grid container spacing={2}>
          {/* 1행 */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <div className="filter-field">
              <label className="filter-label">대분류</label>
              <div className="field_select">
                <MuiSelect
                  id="largeCategory"
                  items={[
                    {
                      name: "전체",
                      code: "",
                    },
                    {
                      name: "피해구제",
                      code: "01",
                    },
                  ]}
                />
              </div>
            </div>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <div className="filter-field">
              <label className="filter-label">중분류</label>
              <div className="field_select">
                <MuiSelect
                  id="midCategory"
                  items={[
                    {
                      name: "전체",
                      code: "",
                    },
                    {
                      name: "접수서류",
                      code: "01",
                    },
                    {
                      name: "신청자 제출서류",
                      code: "02",
                    },
                    {
                      name: "직원보완자료",
                      code: "03",
                    },
                  ]}
                />
              </div>
            </div>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <div className="filter-field">
              <label className="filter-label">소분류</label>
              <div className="field_select">
                <FormControl size="small" fullWidth>
                  <MuiSelect
                    id="smallCategory"
                    items={[
                      {
                        name: "전체",
                        code: "",
                      },
                      {
                        name: "사망 신청",
                        code: "01",
                      },
                      {
                        name: "미성년자 신청",
                        code: "02",
                      },
                      {
                        name: "이전문서",
                        code: "03",
                      },
                      {
                        name: "의무기록",
                        code: "04",
                      },
                    ]}
                  />
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
  );
}
