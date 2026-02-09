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
  Stack,
  TextField,
} from "@mui/material";
import { columnDefs } from "./col-def";
import { useDialogs } from "@/hooks/useDialogs/useDialogs";
import useNotifications from "@/hooks/useNotifications";
import { DatePicker } from "@mui/x-date-pickers";
import AgGridContainer from "@/components/grid/AgGridContainer";
import HOLDING_INSTITUTION_LIST_DUMMY_DATA from "@/mocks/edoc/holdingInstitutionDummyData.json";

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
    <div className="content_wrap">
      <div className="content">
        <div className="filter">
          <Grid container spacing={2}>
            {/* 1행 */}
            <Grid size={{ xs: 12, sm: 6 }}>
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
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
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
            </Grid>
            {/* 2행 */}
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
            <Grid size={{ xs: 12, sm: 3 }}>
              <div className="filter-field">
                <label className="filter-label">기간</label>
                <div className="field_select">
                  <FormControl size="small" fullWidth>
                    <Select
                      id="hldPrdDfyrs"
                      name="hldPrdDfyrs"
                      defaultValue="00"
                    >
                      <MenuItem value="00">전체</MenuItem>
                      <MenuItem value="1">1년</MenuItem>
                      <MenuItem value="3">3년</MenuItem>
                      <MenuItem value="5">5년</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
            </Grid>
            {/* 3행 */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <div className="filter-field">
                <label className="filter-label">문서번호</label>
                <div className="field_select">
                  <FormControl size="small" fullWidth>
                    <Select id="docNo" name="docNo" defaultValue="00">
                      <MenuItem value="00">asdfsfa</MenuItem>
                      <MenuItem value="01">asdfsdf</MenuItem>
                    </Select>
                  </FormControl>
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
                  label="문서제목"
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
    </div>
  );
}
