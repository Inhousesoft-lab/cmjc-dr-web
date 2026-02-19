import React from "react";
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
import { columnDefs } from "./col-def";
import { useDialogs } from "@/hooks/useDialogs/useDialogs";
import useNotifications from "@/hooks/useNotifications";
import { MuiDatePickerFt } from "@/components/elements/MuiDatePickerFt";
import AgGridContainer from "@/components/grid/AgGridContainer";
import HOLDING_INSTITUTION_LIST_DUMMY_DATA from "@/mocks/edoc/holdingInstitutionDummyData.json";
import MuiSelect from "@/components/elements/MuiSelect";

export default function HoldingInstitutionList() {
  const notifications = useNotifications();
  const dialogs = useDialogs();

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
      <div className="filter">
        <Grid container spacing={2}>
          {/* 1행 */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <div className="filter-field">
              <label className="filter-label">수집일자</label>
              <div className="filter-range">
                <MuiDatePickerFt value={""} onChange={() => {}} />
                <span className="filter-range-sep">-</span>{" "}
                <MuiDatePickerFt value={""} onChange={() => {}} />
              </div>
            </div>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <div className="filter-field">
              <label className="filter-label">종료일자</label>
              <div className="filter-range">
                <MuiDatePickerFt value={""} onChange={() => {}} />
                <span className="filter-range-sep">-</span>{" "}
                <MuiDatePickerFt value={""} onChange={() => {}} />
              </div>
            </div>
          </Grid>
          {/* 2행 */}
          <Grid size={{ xs: 12, sm: 3 }}>
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
          <Grid size={{ xs: 12, sm: 3 }}>
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
          <Grid size={{ xs: 12, sm: 3 }}>
            <div className="filter-field">
              <label className="filter-label">소분류</label>
              <div className="field_select">
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
              </div>
            </div>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <div className="filter-field">
              <label className="filter-label">기간</label>
              <div className="field_select">
                <MuiSelect
                  id="smallCategory"
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
              </div>
            </div>
          </Grid>
          {/* 3행 */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <div className="filter-field">
              <label className="filter-label">문서번호</label>
              <div className="field_select">
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
              </div>
            </div>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <div className="filter-field">
              <label className="filter-label">문서제목</label>
              <TextField
                name="docTtl"
                fullWidth
                size="small"
                placeholder="문서제목"
              />
            </div>
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }} alignContent="flex-end">
            <FormControl error={false}>
              <FormControlLabel
                name="holding-check"
                control={<Checkbox size="small" />}
                label="개인정보 포함"
              />
            </FormControl>
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
        <Button variant="contained" onClick={handleApplySelectedRows}>
          선택 반영
        </Button>
        <Button variant="contained" onClick={handleApplyAllRows}>
          일괄 반영
        </Button>
      </div>

      <AgGridContainer<any>
        enableRowSelection={true}
        colDefs={columnDefs}
        count={HOLDING_INSTITUTION_LIST_DUMMY_DATA.length}
        rowData={HOLDING_INSTITUTION_LIST_DUMMY_DATA}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
}
