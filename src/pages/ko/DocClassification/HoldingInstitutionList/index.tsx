import React from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import { listDefs } from "./col-def";
import { useDialogs } from "@/hooks/useDialogs/useDialogs";
import useNotifications from "@/hooks/useNotifications";
import { MuiDatePickerFt } from "@/components/elements/MuiDatePickerFt";
import AgGridContainer from "@/components/grid/AgGridContainer";
import MuiSelect from "@/components/elements/MuiSelect";
import { ColDef } from "ag-grid-community";
import { HoldingInstitution } from "@/types/holdingInstitution";
import GridField from "@/components/common/GridField";

export default function HoldingInstitutionList() {
  const notifications = useNotifications();
  const dialogs = useDialogs();

  const [columnDefs] = React.useState<ColDef[]>(listDefs);

  const [rowData, setRowsData] = React.useState<{
    rows: HoldingInstitution[];
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

  const [selectedRows, setSelectedRows] = React.useState<any[]>([]);

  const handleSelectionChange = React.useCallback((rows: any[]) => {
    setSelectedRows(rows);
  }, []);

  const handleApplySelectedRows = React.useCallback(async () => {
    const confirmed = await dialogs.confirm(
      "선택된 파일에 대한 문서분류의 현재 보유기간으로 변경됩니다. 변경하시겠습니까? (※ 정보주체 동의를 받아 수집한 경우, 반드시 변경된 보유기간으로 재동의를 받으셔야 합니다. )",
      {
        title: "보유기간 변경",
        severity: "info",
        okText: "확인",
        cancelText: "취소",
      },
    );
    if (confirmed) {
      notifications.show("변경되었습니다", {
        severity: "success",
        autoHideDuration: 3000,
      });
    }
  }, [dialogs, selectedRows]);

  const handleApplyAllRows = React.useCallback(async () => {
    const confirmed = await dialogs.confirm(
      "전체 파일에 대한 문서분류의 현재 보유기간으로 변경됩니다. 변경하시겠습니까? (※ 정보주체 동의를 받아 수집한 경우, 반드시 변경된 보유기간으로 재동의를 받으셔야 합니다. )",
      {
        title: "보유기간 변경",
        severity: "info",
        okText: "확인",
        cancelText: "취소",
      },
    );
    if (confirmed) {
      notifications.show("변경되었습니다", {
        severity: "success",
        autoHideDuration: 3000,
      });
    }
  }, [dialogs]);

  return (
    <div>
      <Stack direction="row" className="search-area" mb={2}>
        <Grid container spacing={0} className="table-view-grid">
          {/* 1행 */}
          <GridField
            item={6}
            label="수집일자"
            value={
              <div className="filter-range">
                <MuiDatePickerFt value={""} onChange={() => {}} />
                <span className="filter-range-sep">-</span>{" "}
                <MuiDatePickerFt value={""} onChange={() => {}} />
              </div>
            }
          />
          <GridField
            item={6}
            label="종료일자"
            value={
              <div className="filter-range">
                <MuiDatePickerFt value={""} onChange={() => {}} />
                <span className="filter-range-sep">-</span>{" "}
                <MuiDatePickerFt value={""} onChange={() => {}} />
              </div>
            }
          />
          {/* 2행 */}
          <GridField
            item={3}
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
            item={3}
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
            item={3}
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
          <GridField
            item={3}
            label="보유기간"
            value={
              <MuiSelect
                id="docSclsfNo"
                items={[
                  {
                    name: "전체",
                    code: "",
                  },
                  {
                    name: "1년",
                    code: "01",
                  },
                  {
                    name: "3년",
                    code: "03",
                  },
                  {
                    name: "5년",
                    code: "05",
                  },
                ]}
              />
            }
          />
          {/* 3행 */}
          <GridField
            item={3}
            label="문서번호"
            value={
              <MuiSelect
                id="docNo"
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
          <GridField
            item={6}
            label="문서제목"
            value={
              <TextField
                name="docTtl"
                fullWidth
                size="small"
                placeholder="문서제목"
              />
            }
          />
          <GridField
            item={3}
            label="개인정보 포함"
            value={<Checkbox size="small" />}
          />
        </Grid>
        <Box className="table-view-actions">
          <Button variant="contained">조회</Button>
        </Box>
      </Stack>

      <AgGridContainer<any>
        actionButtons={[
          { label: "선택 반영", onClick: handleApplySelectedRows },
          { label: "일괄 반영", onClick: handleApplyAllRows },
        ]}
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
