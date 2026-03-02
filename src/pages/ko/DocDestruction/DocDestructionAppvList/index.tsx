import React, { useCallback, useState } from "react";
import { Box, Button, Grid, Stack } from "@mui/material";
import { MuiDatePickerFt } from "@/components/elements/MuiDatePickerFt";

import AgGridContainer from "@/components/grid/AgGridContainer";
import { listDefs } from "./col-def";

import DocDestructionAppvButton from "@/components/actionButtons/DocDestructionAppvButton";
import useNotifications from "@/hooks/useNotifications";
import { DocDestruction } from "@/types/docDestruction";
import { ColDef } from "ag-grid-community";
import GridField from "@/components/common/GridField";
import MuiSelect from "@/components/elements/MuiSelect/MuiSelect";

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

  const loadData = async () => {
    setIsLoading(true);
    try {
      // TODO: load data
    } catch (e) {
      notifications.show(getErrorMessage(e), {
        severity: "error",
        autoHideDuration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const handleSelectionChange = useCallback((rows: any[]) => {
    setSelectedRows(rows);
  }, []);

  return (
    <div>
      <Stack direction="row" className="search-area" mb={2}>
        <Grid container spacing={0} className="table-view-grid">
          {/* 1행 */}
          <GridField
            item={4}
            label="대분류"
            value={
              <MuiSelect
                id="docLclsfNo"
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
            }
          />
          <GridField
            item={4}
            label="중분류"
            value={
              <MuiSelect
                id="docMclsfNo"
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
            }
          />
          <GridField
            item={4}
            label="소분류"
            value={
              <MuiSelect
                id="docSclsfNo"
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
            }
          />
          {/* 2행 */}
          <GridField
            item={12}
            label="기간"
            value={
              <div className="filter-range">
                <MuiDatePickerFt value={""} onChange={() => {}} />
                <span className="filter-range-sep">-</span>{" "}
                <MuiDatePickerFt value={""} onChange={() => {}} />
              </div>
            }
          />
        </Grid>
        <Box className="table-view-actions">
          <Button variant="contained">조회</Button>
        </Box>
      </Stack>

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
