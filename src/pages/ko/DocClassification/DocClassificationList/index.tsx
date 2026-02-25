import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  TextField,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import { ColDef } from "ag-grid-community";
import AgGridContainer from "@/components/grid/AgGridContainer";
import MuiSelect from "@/components/elements/MuiSelect";
import useNotifications from "@/hooks/useNotifications";
import { useDocClassificationList } from "@/hooks/useDocClassificationList";
import { useDocClsfOptions } from "@/hooks/useDocClsfOptions";
import {
  DocClassificationSearch,
  DocClassificationVO,
} from "@/types/docClassification";
import { listDefs } from "./col-def";

export default function DocClassificationList() {
  const navigate = useNavigate();
  const notifications = useNotifications();

  const [columnDefs] = React.useState<ColDef[]>(listDefs);

  const { control, handleSubmit, setValue } = useForm<DocClassificationSearch>({
    defaultValues: {
      docLclsfNo: "",
      docMclsfNo: "",
      docSclsfNo: "",
      prvcInclYn: "",
      useEn: "",
      docClsfNm: "",
      pageNum: 1,
      pageSize: 10,
    },
  });

  const docLclsfNo = useWatch({ control, name: "docLclsfNo" });
  const docMclsfNo = useWatch({ control, name: "docMclsfNo" });
  const useEnItems = [
    { name: "전체", code: "" },
    { name: "사용", code: "Y" },
    { name: "사용안함", code: "N" },
  ];
  const { lclsfList, mclsfList, sclsfList, lclsfError } = useDocClsfOptions(
    docLclsfNo,
    docMclsfNo,
  );

  const { rows, rowCount, isLoading, listError, loadData } =
    useDocClassificationList();

  React.useEffect(() => {
    if (!listError) return;
    notifications.show(listError, {
      severity: "error",
      autoHideDuration: 3000,
    });
  }, [listError, notifications]);

  React.useEffect(() => {
    if (!lclsfError) return;
    notifications.show(lclsfError, {
      severity: "error",
      autoHideDuration: 3000,
    });
  }, [lclsfError, notifications]);

  const handleSearch = handleSubmit((values) => {
    loadData(values);
  });

  const handleCreateClick = () => {
    navigate(`/docClassification/create`);
  };

  const handleRowClick = (row: DocClassificationVO) => {
    navigate(`/docClassification/${row.docClsfNo}`);
  };

  return (
    <div>
      <div className="filter">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Controller
              name="docLclsfNo"
              control={control}
              render={({ field }) => (
                <MuiSelect
                  id="docLclsfNo"
                  label="대분류"
                  items={lclsfList}
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setValue("docMclsfNo", "");
                    setValue("docSclsfNo", "");
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Controller
              name="docMclsfNo"
              control={control}
              render={({ field }) => (
                <MuiSelect
                  id="docMclsfNo"
                  label="중분류"
                  items={mclsfList}
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setValue("docSclsfNo", "");
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Controller
              name="docSclsfNo"
              control={control}
              render={({ field }) => (
                <MuiSelect
                  id="docSclsfNo"
                  label="소분류"
                  items={sclsfList}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </Grid>
          <Grid
            size={{ xs: 12, sm: 3 }}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <div className="filter-field filter-field--checkbox">
              <FormControlLabel
                className="filter-checkbox"
                name="holding-check"
                control={
                  <Controller
                    name="prvcInclYn"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        size="small"
                        checked={field.value === "Y"}
                        onChange={(e) =>
                          field.onChange(e.target.checked ? "Y" : "")
                        }
                      />
                    )}
                  />
                }
                label="개인정보 포함"
              />
            </div>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Controller
              name="useEn"
              control={control}
              render={({ field }) => (
                <MuiSelect
                  id="useEn"
                  label="사용유무"
                  items={useEnItems}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 9 }}>
            <Controller
              name="docClsfNm"
              control={control}
              render={({ field }) => (
                <div className="filter-field">
                  <label className="filter-label">검색어</label>
                  <TextField
                    size="small"
                    fullWidth
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </div>
              )}
            />
          </Grid>
        </Grid>
        <Button size="small" variant="contained" onClick={handleSearch}>
          조회
        </Button>
      </div>
      <Divider sx={{ marginY: 2 }} />

      <div className="btn_wrapper">
        <Button size="small" variant="contained" onClick={handleCreateClick}>
          등록
        </Button>
      </div>

      <AgGridContainer
        isLoading={isLoading}
        colDefs={columnDefs}
        rowData={rows}
        count={rowCount}
        onRowClick={handleRowClick}
      />
    </div>
  );
}
